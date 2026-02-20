'use client';

import React, { memo } from 'react';
import { useFormContext } from '../../form/FormProvider';
import { BaseField, getInputClassName } from '../BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface PhoneFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * Format phone number as (310)-142-9312
 */
function formatPhoneNumber(value: string): string {
  // Extract only digits
  const digits = value.replace(/\D/g, '');

  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)})-${digits.slice(3)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`;
  // Handle 11-digit numbers (with country code like 1)
  return `(${digits.slice(1, 4)})-${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
}

/**
 * PhoneField - Controlled phone number input component
 *
 * Key features:
 * - No local state - uses form context directly
 * - HTML5 tel input type
 * - Auto-formats as (310)-142-9312
 * - Error passed as prop to enable targeted re-renders
 */
function PhoneFieldComponent({ field, error }: PhoneFieldProps) {
  const { getFieldValue, updateField, validateField } = useFormContext();
  const value = getFieldValue(field.name) ?? '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatPhoneNumber(rawValue);
    updateField(field.name, formatted);
  };

  const handleBlur = () => {
    validateField(field.name);
  };

  return (
    <BaseField field={field} error={error}>
      <input
        type="tel"
        id={field.name}
        name={field.name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={field.placeholder || '(555) 123-4567'}
        disabled={field.disabled}
        required={field.required}
        className={getInputClassName(!!error)}
      />
    </BaseField>
  );
}

export const PhoneField = memo(PhoneFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});
