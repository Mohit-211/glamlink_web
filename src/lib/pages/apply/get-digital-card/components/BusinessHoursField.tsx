'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface BusinessHoursFieldProps {
  value: string[];
  onChange: (fieldName: string, value: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export default function BusinessHoursField({
  value = [],
  onChange,
  error,
  disabled = false
}: BusinessHoursFieldProps) {
  const [newHour, setNewHour] = useState('');
  const maxItems = 10;

  const handleAdd = () => {
    if (newHour.trim() && value.length < maxItems) {
      onChange('businessHours', [...value, newHour.trim()]);
      setNewHour('');
    }
  };

  const handleRemove = (index: number) => {
    const newHours = value.filter((_, i) => i !== index);
    onChange('businessHours', newHours);
  };

  const handleUpdate = (index: number, newValue: string) => {
    const newHours = [...value];
    newHours[index] = newValue;
    onChange('businessHours', newHours);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Business Hours
      </label>

      {/* Existing hours */}
      <div className="space-y-2">
        {value.map((hour, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={hour}
              onChange={(e) => handleUpdate(index, e.target.value)}
              disabled={disabled}
              placeholder="e.g., Monday: 9:00 AM - 7:00 PM"
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

      {/* Add new hour */}
      {value.length < maxItems && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newHour}
            onChange={(e) => setNewHour(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder="Add hours (e.g., Monday: 9:00 AM - 7:00 PM)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newHour.trim() || disabled}
            className="px-4 py-2 bg-glamlink-teal text-white rounded-md hover:bg-glamlink-teal-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      )}

      {/* Helper text and count */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Operating hours for each day (e.g., Monday: 9:00 AM - 7:00 PM)</span>
        <span>{value.length} of {maxItems}</span>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
