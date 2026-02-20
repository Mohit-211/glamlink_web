"use client";

import { BaseFieldProps } from './index';

export default function TextareaField({
  fieldKey,
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  disabled
}: BaseFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(fieldKey, e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    // Clear error on focus if configured
    if (config.validation?.clearErrorOnFocus && onFocus) {
      onFocus(fieldKey);
    }

    // Validate on blur if configured
    if (config.validation?.validateOnBlur && onBlur) {
      onBlur(fieldKey);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
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

        <textarea
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={config.placeholder}
          disabled={disabled}
          rows={config.rows || 4}
          maxLength={config.maxLength}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors resize-none
            border-gray-300 focus:ring-glamlink-teal focus:border-glamlink-teal
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          `}
        />

        {config.maxLength && (
          <p className="text-xs text-gray-500 text-right">
            {(value || '').length} / {config.maxLength} characters
          </p>
        )}

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