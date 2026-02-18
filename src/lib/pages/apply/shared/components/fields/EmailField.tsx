"use client";

import { BaseFieldProps } from './index';

export default function EmailField({
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
      <label className="block text-sm font-medium text-gray-700">
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type="email"
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disabled}
        placeholder={config.placeholder || `Enter your ${config.label.toLowerCase()}`}
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm transition-colors duration-200 ${
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300'
        } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
      />

      {config.description && (
        <p className="mt-1 text-sm text-gray-500">{config.description}</p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}