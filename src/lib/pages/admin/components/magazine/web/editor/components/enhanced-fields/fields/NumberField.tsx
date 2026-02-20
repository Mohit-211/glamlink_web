'use client';

import React from 'react';
import type { FieldComponentProps } from '../types';

export default function NumberField({ field, value, onChange }: FieldComponentProps) {
  return (
    <input
      type="number"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
      placeholder={field.placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
    />
  );
}
