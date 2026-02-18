'use client';

import React from 'react';
import type { FieldComponentProps } from '../types';

export default function FallbackField({ field, value, onChange }: FieldComponentProps) {
  return (
    <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
      Field type &quot;{field.type}&quot; not yet supported.
      <input
        type="text"
        value={typeof value === 'string' ? value : JSON.stringify(value || '')}
        onChange={(e) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            onChange(e.target.value);
          }
        }}
        placeholder="Enter value..."
        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
      />
    </div>
  );
}
