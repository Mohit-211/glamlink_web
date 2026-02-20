'use client';

import React, { memo } from 'react';
import { useFormContext } from '../../form/FormProvider';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface CheckboxFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * CheckboxField - Controlled checkbox component
 *
 * Key features:
 * - No local state - uses form context directly
 * - Supports checkboxLabel for inline label
 * - Error passed as prop to enable targeted re-renders
 */
function CheckboxFieldComponent({ field, error }: CheckboxFieldProps) {
  const { getFieldValue, updateField } = useFormContext();
  const value = getFieldValue(field.name) ?? false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(field.name, e.target.checked);
  };

  // Checkbox label comes from checkboxLabel or falls back to label
  const checkboxLabel = (field as any).checkboxLabel || field.label;

  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={field.name}
          name={field.name}
          checked={value}
          onChange={handleChange}
          disabled={field.disabled}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
        />
      </div>
      <div className="ml-3">
        <label
          htmlFor={field.name}
          className="text-sm font-medium text-gray-700"
        >
          {checkboxLabel}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.helperText && (
          <p className="text-xs text-gray-500 mt-0.5">{field.helperText}</p>
        )}
        {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
      </div>
    </div>
  );
}

export const CheckboxField = memo(CheckboxFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});
