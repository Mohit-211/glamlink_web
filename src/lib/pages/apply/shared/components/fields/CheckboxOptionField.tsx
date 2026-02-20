"use client";

import { BaseFieldProps } from './index';

interface CheckboxOptionFieldProps extends BaseFieldProps {
  options: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
}

export default function CheckboxOptionField({
  fieldKey,
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  disabled,
  options = []
}: CheckboxOptionFieldProps) {
  const isChecked = value === true || value === 'true';

  const handleCheckboxChange = (checked: boolean) => {
    onChange(fieldKey, checked);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (config.validation?.clearErrorOnFocus && onFocus) {
      onFocus(fieldKey);
    }
    if (config.validation?.validateOnBlur && onBlur) {
      onBlur(fieldKey);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (config.validation?.clearErrorOnFocus && onFocus) {
      onFocus(fieldKey);
    }
  };

  return (
    <div className="transition-all duration-200">
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            id={fieldKey}
            type="checkbox"
            checked={isChecked}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            className={`h-4 w-4 rounded border-gray-300 text-glamlink-teal focus:ring-glamlink-teal disabled:opacity-50 transition-colors duration-200 ${
              error ? 'border-red-300 focus:ring-red-500' : ''
            }`}
          />
        </div>
        <div className="ml-3 text-sm">
          <label
            htmlFor={fieldKey}
            className={`font-medium text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${
              error ? 'text-red-700' : ''
            }`}
          >
            {config.label}
            {config.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {config.description && (
            <p className="text-gray-500 mt-1">{config.description}</p>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}