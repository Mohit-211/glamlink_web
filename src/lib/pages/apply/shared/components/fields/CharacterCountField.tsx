"use client";

import { useState } from 'react';
import { BaseFieldProps } from './index';

interface CharacterCountFieldProps extends BaseFieldProps {
  maxLength?: number;
  showCount?: boolean;
  rows?: number;
}

export default function CharacterCountField({
  fieldKey,
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  disabled,
  maxLength,
  showCount = true
}: CharacterCountFieldProps) {
  const [focused, setFocused] = useState(false);
  const currentLength = value?.length || 0;
  const limit = maxLength || config.maxLength || 500;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      onChange(fieldKey, newValue);
    }
  };

  const getCharacterColor = () => {
    const percentage = (currentLength / limit) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const Component = config.type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="transition-all duration-200">
      <label className="block text-sm font-medium text-gray-700">
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="mt-1 relative">
        <Component
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          placeholder={config.placeholder || `Enter ${config.label.toLowerCase()}`}
          onFocus={(e) => {
            setFocused(true);
            if (onFocus) onFocus(fieldKey);
          }}
          onBlur={(e) => {
            setFocused(false);
            if (onBlur) onBlur(fieldKey);
          }}
          rows={config.rows || 3}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm transition-colors duration-200 ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
          } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''} ${
            showCount && config.type === 'textarea' ? 'pr-16' : ''
          }`}
        />

        {showCount && (
          <div className={`absolute right-2 top-2 text-xs ${getCharacterColor()} transition-colors duration-200`}>
            {currentLength}/{limit}
          </div>
        )}
      </div>

      {config.description && (
        <p className="mt-1 text-sm text-gray-500">{config.description}</p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {showCount && config.type !== 'textarea' && (
        <div className={`mt-1 text-xs text-right ${getCharacterColor()} transition-colors duration-200`}>
          {currentLength}/{limit}
        </div>
      )}
    </div>
  );
}