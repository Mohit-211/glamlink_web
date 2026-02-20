'use client';

import React, { memo } from 'react';
import { useFormContext } from '../../form/FormProvider';
import { BaseField, getInputClassName } from '../BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface DateFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * DateField - Controlled date input component
 *
 * Key features:
 * - No local state - uses form context directly
 * - Stores date as YYYY-MM-DD string
 * - Error passed as prop to enable targeted re-renders
 */
function DateFieldComponent({ field, error }: DateFieldProps) {
  const { getFieldValue, updateField, validateField } = useFormContext();
  const value = getFieldValue(field.name) ?? '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(field.name, e.target.value);
  };

  const handleBlur = () => {
    validateField(field.name);
  };

  return (
    <BaseField field={field} error={error}>
      <input
        type="date"
        id={field.name}
        name={field.name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={field.disabled}
        required={field.required}
        className={getInputClassName(!!error)}
      />
    </BaseField>
  );
}

export const DateField = memo(DateFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});
