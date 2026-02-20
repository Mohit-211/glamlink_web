'use client';

import React from 'react';
import { FormProvider } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { MultiLocationField } from '@/lib/pages/admin/components/shared/editing/fields/custom/location/MultiLocationField';
import type { LocationData } from '@/lib/pages/for-professionals/types/professional';
import type { FieldConfig } from '@/lib/pages/admin/types';

interface MultiLocationFieldWrapperProps {
  field: FieldConfig;
  value: LocationData[];
  onChange: (fieldName: string, value: LocationData[]) => void;
  error?: string;
  defaultBusinessName?: string;
  defaultPhone?: string;
  defaultBusinessHours?: string[];
}

/**
 * Wrapper for MultiLocationField that provides FormProvider context
 * This allows MultiLocationField to access default values from the form
 */
export default function MultiLocationFieldWrapper({
  field,
  value,
  onChange,
  error,
  defaultBusinessName,
  defaultPhone,
  defaultBusinessHours
}: MultiLocationFieldWrapperProps) {
  // Create minimal form data with just the fields MultiLocationField needs
  const initialData = React.useMemo(() => ({
    locations: value,
    business_name: defaultBusinessName,
    phone: defaultPhone,
    businessHours: defaultBusinessHours
  }), [value, defaultBusinessName, defaultPhone, defaultBusinessHours]);

  // Enhanced field change handler that injects defaults into new locations
  const handleFieldChange = React.useCallback((name: string, val: any) => {
    if (name === 'locations') {
      // Check if a new location was added (array grew)
      const newLocations = val as LocationData[];
      const oldLocations = value || [];

      if (newLocations.length > oldLocations.length) {
        // A new location was added - inject default values
        const lastLocation = newLocations[newLocations.length - 1];

        // Helper to check if a field is empty (undefined, null, or empty string)
        const isEmpty = (val: any) => val === undefined || val === null || val === '';
        const isEmptyArray = (val: any) => !val || (Array.isArray(val) && val.length === 0);

        // Inject defaults if the fields are empty
        const updatedLocation = {
          ...lastLocation,
          businessName: isEmpty(lastLocation.businessName) && defaultBusinessName
            ? defaultBusinessName
            : lastLocation.businessName,
          phone: isEmpty(lastLocation.phone) && defaultPhone
            ? defaultPhone
            : lastLocation.phone,
          hours: isEmptyArray(lastLocation.hours) && defaultBusinessHours && defaultBusinessHours.length > 0
            ? [...defaultBusinessHours]
            : lastLocation.hours || [],
          // Remove default 0,0 coordinates until properly geocoded
          lat: (lastLocation.lat === 0 && !lastLocation.address) ? undefined : lastLocation.lat,
          lng: (lastLocation.lng === 0 && !lastLocation.address) ? undefined : lastLocation.lng
        };

        const updatedLocations = [
          ...newLocations.slice(0, -1),
          updatedLocation
        ];

        // @ts-expect-error - LocationData type mismatch with undefined fields
        onChange(name, updatedLocations);
      } else {
        // Normal update
        onChange(name, val);
      }
    }
  }, [onChange, value, defaultBusinessName, defaultPhone, defaultBusinessHours]);

  return (
    <FormProvider
      initialData={initialData}
      fields={[field]}
      onFieldChange={handleFieldChange}
    >
      <MultiLocationField
        field={field}
        value={value}
        onChange={handleFieldChange}
        error={error}
      />
    </FormProvider>
  );
}
