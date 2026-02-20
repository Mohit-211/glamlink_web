'use client';

import React, { memo } from 'react';
import { useFormContext } from '../../form/FormProvider';
import { BaseField, getInputClassName } from '../BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface TextAreaFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * TextAreaField - Controlled textarea component
 *
 * Key features:
 * - No local state - uses form context directly
 * - Configurable rows
 * - Error passed as prop to enable targeted re-renders
 */
function TextAreaFieldComponent({ field, error }: TextAreaFieldProps) {
  const { getFieldValue, updateField, validateField } = useFormContext();
  const value = getFieldValue(field.name) ?? '';

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField(field.name, e.target.value);
  };

  const handleBlur = () => {
    validateField(field.name);
  };

  return (
    <BaseField field={field} error={error}>
      <textarea
        id={field.name}
        name={field.name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={field.placeholder}
        disabled={field.disabled}
        required={field.required}
        rows={4}
        className={getInputClassName(!!error)}
      />
    </BaseField>
  );
}

export const TextAreaField = memo(TextAreaFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});
