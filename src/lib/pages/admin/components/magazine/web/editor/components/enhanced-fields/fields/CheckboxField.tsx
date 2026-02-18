'use client';

import React from 'react';
import type { FieldComponentProps } from '../types';

export default function CheckboxField({ field, value, onChange }: FieldComponentProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={value || false}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
      />
      <span className="text-sm text-gray-700">{field.label}</span>
    </label>
  );
}
