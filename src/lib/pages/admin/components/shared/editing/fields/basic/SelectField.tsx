'use client';

import React, { memo } from 'react';
import { useFormContext } from '../../form/FormProvider';
import { BaseField, getInputClassName } from '../BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface SelectFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * SelectField - Controlled select dropdown component
 *
 * Key features:
 * - No local state - uses form context directly
 * - Supports options array from field config
 * - Error passed as prop to enable targeted re-renders
 */
function SelectFieldComponent({ field, error }: SelectFieldProps) {
  const { getFieldValue, updateField, validateField } = useFormContext();
  const value = getFieldValue(field.name) ?? '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateField(field.name, e.target.value);
  };

  const handleBlur = () => {
    validateField(field.name);
  };

  return (
    <BaseField field={field} error={error}>
      <select
        id={field.name}
        name={field.name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={field.disabled}
        required={field.required}
        className={getInputClassName(!!error)}
      >
        {/* Placeholder option */}
        <option value="">
          {field.placeholder || `Select ${field.label.toLowerCase()}`}
        </option>

        {/* Options from config */}
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </BaseField>
  );
}

export const SelectField = memo(SelectFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});
