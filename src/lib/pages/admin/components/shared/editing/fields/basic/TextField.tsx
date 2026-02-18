'use client';

import React, { memo, useState } from 'react';
import { useFormContext } from '../../form/FormProvider';
import { BaseField, getInputClassName } from '../BaseField';
import TypographySettings from '../typography/TypographySettings';
import type { TypographySettings as TypographySettingsType } from '../typography/TypographySettings';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

// Chevron icons (inline SVG)
const ChevronDown = () => (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUp = () => (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

interface TextFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * TextField - Controlled text input component
 *
 * Key features:
 * - No local state - uses form context directly
 * - Single source of truth for value
 * - No useEffect synchronization needed
 * - Error passed as prop to enable targeted re-renders
 * - Optional typography settings panel
 */
function TextFieldComponent({ field, error }: TextFieldProps) {
  const { getFieldValue, updateField, validateField } = useFormContext();
  const value = getFieldValue(field.name) ?? '';

  // Typography panel state
  const [showTypography, setShowTypography] = useState(false);

  // Get typography settings (stored as separate field: fieldName + 'Typography')
  const typographyFieldName = `${field.name}Typography`;
  const typographySettings = getFieldValue(typographyFieldName) as TypographySettingsType || {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(field.name, e.target.value);
  };

  const handleBlur = () => {
    // Validate on blur instead of every keystroke
    validateField(field.name);
  };

  const handleTypographyChange = (settings: TypographySettingsType) => {
    updateField(typographyFieldName, settings);
  };

  return (
    <BaseField field={field} error={error}>
      <input
        type="text"
        id={field.name}
        name={field.name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={field.placeholder}
        disabled={field.disabled}
        required={field.required}
        className={getInputClassName(!!error)}
      />

      {/* Typography Settings Panel */}
      {field.useTypography && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowTypography(!showTypography)}
            className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1 focus:outline-none"
          >
            {showTypography ? <ChevronUp /> : <ChevronDown />}
            Typography Settings
          </button>

          {showTypography && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <TypographySettings
                settings={typographySettings}
                onChange={handleTypographyChange}
                showAlignment={field.typographyConfig?.showAlignment ?? true}
                showColor={field.typographyConfig?.showColor ?? true}
              />
            </div>
          )}
        </div>
      )}
    </BaseField>
  );
}

// Memo compares field and error - re-renders only when field config or validation error changes
export const TextField = memo(TextFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});
