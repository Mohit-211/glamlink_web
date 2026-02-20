'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { FieldDefinition } from '../config/content-discovery';

interface StringArrayFieldProps {
  field: FieldDefinition;
  value: string[];
  onChange: (value: string[]) => void;
}

/**
 * StringArrayField - Simple array of strings for bullets, tags, etc.
 * Used for fields like CallToAction.bullets
 */
export default function StringArrayField({ field, value, onChange }: StringArrayFieldProps) {
  const items = value || [];
  const maxItems = field.maxItems || 10;
  const [newItemValue, setNewItemValue] = useState('');

  const addItem = () => {
    if (newItemValue.trim() && items.length < maxItems) {
      onChange([...items, newItemValue.trim()]);
      setNewItemValue('');
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, newValue: string) => {
    const newItems = [...items];
    newItems[index] = newValue;
    onChange(newItems);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-2">
      {/* Existing items */}
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            placeholder={`${field.label} ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            title="Remove item"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* Add new item */}
      {items.length < maxItems && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemValue}
            onChange={(e) => setNewItemValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            placeholder={field.placeholder || `Add ${field.label.toLowerCase()}...`}
          />
          <button
            type="button"
            onClick={addItem}
            disabled={!newItemValue.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      )}

      {/* Item count */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{items.length} of {maxItems} items</span>
        {items.length >= maxItems && (
          <span className="text-amber-600">Maximum items reached</span>
        )}
      </div>
    </div>
  );
}
