'use client';

import React from 'react';
import type { FieldComponentProps } from '../types';

export default function TextareaField({ field, value, onChange }: FieldComponentProps) {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      rows={(field as any).rows || 3}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-y"
    />
  );
}
