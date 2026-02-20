"use client";

import { BaseFieldProps } from './index';

interface RadioOptionFieldProps extends BaseFieldProps {
  options: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
  columns?: 1 | 2;
}

export default function RadioOptionField({
  fieldKey,
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  disabled,
  options = [],
  columns = 1
}: RadioOptionFieldProps) {
  const handleRadioChange = (optionValue: string) => {
    onChange(fieldKey, optionValue);
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

  const gridClass = columns === 2 ? 'grid grid-cols-2 gap-4' : 'space-y-3';

  return (
    <div className="transition-all duration-200">
      <label className="block text-sm font-medium text-gray-700">
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {config.description && (
        <p className="mt-1 text-sm text-gray-500">{config.description}</p>
      )}

      <div className={`mt-3 ${gridClass}`}>
        {options.map((option) => (
          <div key={option.id} className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id={`${fieldKey}-${option.id}`}
                type="radio"
                name={fieldKey}
                value={option.id}
                checked={value === option.id}
                onChange={() => handleRadioChange(option.id)}
                onBlur={handleBlur}
                onFocus={handleFocus}
                disabled={disabled}
                className={`h-4 w-4 border-gray-300 text-glamlink-teal focus:ring-glamlink-teal disabled:opacity-50 transition-colors duration-200 ${
                  error ? 'border-red-300 focus:ring-red-500' : ''
                }`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor={`${fieldKey}-${option.id}`}
                className={`font-medium text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${
                  error ? 'text-red-700' : ''
                }`}
              >
                {option.label}
              </label>
              {option.description && (
                <p className="text-gray-500 mt-1">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}