'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface SimpleArrayFieldProps {
  fieldName: string;
  label: string;
  value: string[];
  onChange: (fieldName: string, value: string[]) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  maxItems?: number;
}

/**
 * Generic array field component for string arrays
 * Used for business hours, specialties, etc.
 */
export default function SimpleArrayField({
  fieldName,
  label,
  value = [],
  onChange,
  error,
  disabled = false,
  placeholder = 'Add item...',
  helperText,
  maxItems = 10
}: SimpleArrayFieldProps) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim() && value.length < maxItems) {
      onChange(fieldName, [...value, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemove = (index: number) => {
    const newItems = value.filter((_, i) => i !== index);
    onChange(fieldName, newItems);
  };

  const handleUpdate = (index: number, newValue: string) => {
    const newItems = [...value];
    newItems[index] = newValue;
    onChange(fieldName, newItems);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleUseDefaultHours = () => {
    const defaultHours = [
      'Monday: 9:00 AM - 5:00 PM',
      'Tuesday: 9:00 AM - 5:00 PM',
      'Wednesday: 9:00 AM - 5:00 PM',
      'Thursday: 9:00 AM - 5:00 PM',
      'Friday: 9:00 AM - 5:00 PM'
    ];

    // Replace existing hours with defaults (respecting maxItems)
    const newHours = defaultHours.slice(0, Math.min(defaultHours.length, maxItems));
    onChange(fieldName, newHours);
  };

  const showDefaultButton = fieldName === 'businessHours';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {showDefaultButton && (
          <button
            type="button"
            onClick={handleUseDefaultHours}
            disabled={disabled}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-300"
          >
            Use Default Hours
          </button>
        )}
      </div>

      {/* Existing items */}
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleUpdate(index, e.target.value)}
              disabled={disabled}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              disabled={disabled}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add new item */}
      {value.length < maxItems && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newItem.trim() || disabled}
            className="px-4 py-2 bg-glamlink-teal text-white rounded-md hover:bg-glamlink-teal-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      )}

      {/* Helper text and count */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{helperText || `${value.length} of ${maxItems} items`}</span>
        {!helperText && <span>{value.length} of {maxItems}</span>}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
