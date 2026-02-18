'use client';

import React, { memo } from 'react';
import { useFormContext } from '../../form/FormProvider';
import { BaseField, getInputClassName } from '../BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface EmailFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * EmailField - Controlled email input component
 *
 * Key features:
 * - No local state - uses form context directly
 * - HTML5 email validation
 * - Error passed as prop to enable targeted re-renders
 */
function EmailFieldComponent({ field, error }: EmailFieldProps) {
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
        type="email"
        id={field.name}
        name={field.name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={field.placeholder || 'email@example.com'}
        disabled={field.disabled}
        required={field.required}
        className={getInputClassName(!!error)}
      />
    </BaseField>
  );
}

export const EmailField = memo(EmailFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});
