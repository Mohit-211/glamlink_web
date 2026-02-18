'use client';

import React, { memo, useCallback, ComponentType } from 'react';
import { useFormContext } from '../../form/FormProvider';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface FieldComponentProps {
  field: FieldConfig;
  value: any;
  onChange: (fieldName: string, value: any) => void;
  error?: string;
}

interface WrapperConfig {
  defaultValue: any;  // [], '', null, etc.
  displayName: string;
}

/**
 * Factory function to create form-integrated wrapper components.
 *
 * This eliminates duplicate boilerplate across custom field wrappers by:
 * - Getting value from form context
 * - Creating memoized onChange handler
 * - Wrapping with React.memo for performance
 *
 * @param ImplementationComponent - The actual field implementation component
 * @param config - Configuration for default value and display name
 * @returns A memoized wrapper component integrated with FormContext
 */
export function createCustomFieldWrapper(
  ImplementationComponent: ComponentType<FieldComponentProps>,
  config: WrapperConfig
) {
  function WrapperComponent({ field, error }: { field: FieldConfig; error?: string }) {
    const { getFieldValue, updateField } = useFormContext();
    const value = getFieldValue(field.name) ?? config.defaultValue;

    const handleChange = useCallback((fieldName: string, newValue: any) => {
      updateField(fieldName, newValue);
    }, [updateField]);

    return (
      <ImplementationComponent
        field={field}
        value={value}
        onChange={handleChange}
        error={error}
      />
    );
  }

  WrapperComponent.displayName = config.displayName;

  return memo(WrapperComponent, (prev, next) =>
    prev.field === next.field && prev.error === next.error
  );
}
