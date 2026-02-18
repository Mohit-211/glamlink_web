"use client";

import { BaseFieldProps } from './index';

export default function TextField({
  fieldKey,
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  disabled
}: BaseFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(fieldKey, e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Clear error on focus if configured
    if (config.validation?.clearErrorOnFocus && onFocus) {
      onFocus(fieldKey);
    }

    // Validate on blur if configured
    if (config.validation?.validateOnBlur && onBlur) {
      onBlur(fieldKey);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Clear error on focus if configured
    if (config.validation?.clearErrorOnFocus && onFocus) {
      onFocus(fieldKey);
    }
  };

  return (
    <div className="transition-all duration-200">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          <input
            type={config.type || 'text'}
            value={value || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={config.placeholder}
            disabled={disabled}
            maxLength={config.maxLength}
            className={`
              w-full px-3 py-2 pr-16 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors
              border-gray-300 focus:ring-glamlink-teal focus:border-glamlink-teal
              ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            `}
          />

          {config.maxLength && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-xs text-gray-500">
                {(value || '').length} / {config.maxLength}
              </span>
            </div>
          )}
        </div>

        {config.description && (
          <p className="text-sm text-gray-500">{config.description}</p>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}