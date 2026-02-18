"use client";

import { BaseFieldProps } from './index';

/**
 * Formats a phone number string to (XXX)-XXX-XXXX format
 * Only allows digits, max 10 digits
 */
function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  // Limit to 10 digits
  const limitedDigits = digits.slice(0, 10);

  // Format based on length
  if (limitedDigits.length === 0) {
    return '';
  } else if (limitedDigits.length <= 3) {
    return `(${limitedDigits}`;
  } else if (limitedDigits.length <= 6) {
    return `(${limitedDigits.slice(0, 3)})-${limitedDigits.slice(3)}`;
  } else {
    return `(${limitedDigits.slice(0, 3)})-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
  }
}

/**
 * Extracts only digits from formatted phone number
 */
function extractDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10);
}

export default function PhoneField({
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
    const inputValue = e.target.value;
    const formatted = formatPhoneNumber(inputValue);
    onChange(fieldKey, formatted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, and navigation keys
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];

    if (allowedKeys.includes(e.key)) {
      return;
    }

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    // Block non-digit characters
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    // Block if already at 10 digits
    const currentDigits = extractDigits(value || '');
    if (currentDigits.length >= 10) {
      e.preventDefault();
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur(fieldKey);
    }
  };

  const handleFocus = () => {
    if (onFocus) {
      onFocus(fieldKey);
    }
  };

  // Format the displayed value
  const displayValue = value ? formatPhoneNumber(value) : '';
  const digitCount = extractDigits(value || '').length;

  return (
    <div className="transition-all duration-200">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          <input
            type="tel"
            value={displayValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={config.placeholder || '(555)-123-4567'}
            disabled={disabled}
            className={`
              w-full px-3 py-2 pr-16 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors
              border-gray-300 focus:ring-glamlink-teal focus:border-glamlink-teal
              ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            `}
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className={`text-xs ${digitCount === 10 ? 'text-green-500' : 'text-gray-500'}`}>
              {digitCount} / 10
            </span>
          </div>
        </div>

        {config.helperText && (
          <p className="text-sm text-gray-500">{config.helperText}</p>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
