"use client";

import { useState } from 'react';
import { BaseFieldProps } from './index';

export default function InputListField({
  fieldKey,
  config,
  value,
  onChange,
  error,
  disabled
}: BaseFieldProps) {
  const items = Array.isArray(value) ? value : [];
  const maxItems = config.maxItems || 5;
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleItemChange = (index: number, newValue: string) => {
    const newItems = [...items];
    newItems[index] = newValue;
    onChange(fieldKey, newItems);
  };

  const addItem = () => {
    if (items.length < maxItems) {
      onChange(fieldKey, [...items, ""]);
      setFocusedIndex(items.length);
    }
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(fieldKey, newItems);
    if (focusedIndex === index) {
      setFocusedIndex(null);
    } else if (focusedIndex !== null && focusedIndex > index) {
      setFocusedIndex(focusedIndex - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index === items.length - 1 && items.length < maxItems) {
        addItem();
      }
    }
  };

  return (
    <div className="transition-all duration-200">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="space-y-2">
          {items.map((item: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-shrink-0 w-6 h-6 bg-glamlink-teal/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-glamlink-teal">{index + 1}</span>
              </div>
              <input
                type="text"
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setFocusedIndex(index)}
                placeholder={config.placeholder || `Enter ${config.label.toLowerCase().slice(0, -1)}`}
                disabled={disabled}
                className={`
                  flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-glamlink-teal focus:ring-glamlink-teal sm:text-sm transition-colors duration-200
                  ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
                `}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={disabled}
                  className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}

          {items.length < maxItems && (
            <button
              type="button"
              onClick={addItem}
              disabled={disabled}
              className="flex items-center space-x-2 text-sm text-glamlink-teal hover:text-glamlink-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add {config.label.toLowerCase().slice(0, -1)}</span>
            </button>
          )}
        </div>

        {config.helperText && (
          <p className="text-sm text-gray-500">{config.helperText}</p>
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