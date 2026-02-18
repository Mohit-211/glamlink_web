'use client';

import React, { memo } from 'react';
import { useFormContext } from '../../form/FormProvider';
import { BaseField, getInputClassName } from '../BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface NumberFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * NumberField - Controlled number input component
 *
 * Key features:
 * - No local state - uses form context directly
 * - Supports min/max/step from field config
 * - Error passed as prop to enable targeted re-renders
 */
function NumberFieldComponent({ field, error }: NumberFieldProps) {
  const { getFieldValue, updateField, validateField } = useFormContext();
  const value = getFieldValue(field.name);

  // Convert to string for input, handle undefined/null
  const displayValue = value !== undefined && value !== null ? String(value) : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Store as number if valid, empty string if cleared
    if (newValue === '') {
      updateField(field.name, '');
    } else {
      const numValue = Number(newValue);
      if (!isNaN(numValue)) {
        updateField(field.name, numValue);
      }
    }
  };

  const handleBlur = () => {
    validateField(field.name);
  };

  return (
    <BaseField field={field} error={error}>
      <input
        type="number"
        id={field.name}
        name={field.name}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={field.placeholder}
        disabled={field.disabled}
        required={field.required}
        min={field.min}
        max={field.max}
        step={field.step || 1}
        className={getInputClassName(!!error)}
      />
    </BaseField>
  );
}

export const NumberField = memo(NumberFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});
