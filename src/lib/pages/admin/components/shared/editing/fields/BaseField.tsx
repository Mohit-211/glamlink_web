'use client';

import React from 'react';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface BaseFieldProps {
  field: FieldConfig;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * BaseField - Wrapper component for all form fields
 *
 * Provides consistent:
 * - Label rendering with required indicator
 * - Error message display
 * - Helper text
 * - Styling
 */
export function BaseField({ field, error, children, className = '' }: BaseFieldProps) {
  // Determine if this field should span full width
  const isFullWidth =
    field.layout === 'full' ||
    field.layout === 'double' ||
    field.type === 'textarea' ||
    field.type === 'array' ||
    field.type === 'image-array' ||
    field.type === 'gallery' ||
    field.type === 'locationInput';

  return (
    <div className={`${isFullWidth ? 'md:col-span-2' : ''} ${className}`}>
      {/* Label */}
      {field.label && (
        <label
          htmlFor={field.name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Field content */}
      {children}

      {/* Helper text */}
      {field.helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{field.helperText}</p>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

// Shared input className for consistency
// Uses px-3 py-2 for padding and glamlink-teal for focus
export const inputClassName = `
  w-full px-3 py-2 border border-gray-300 rounded-md
  focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-glamlink-teal
  disabled:bg-gray-100 disabled:cursor-not-allowed
`.trim().replace(/\s+/g, ' ');

export const inputErrorClassName = `
  w-full px-3 py-2 border border-red-300 rounded-md
  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
  text-red-900 placeholder-red-300
  disabled:bg-gray-100 disabled:cursor-not-allowed
`.trim().replace(/\s+/g, ' ');

// Helper to get input className based on error state
export function getInputClassName(hasError: boolean): string {
  return hasError ? inputErrorClassName : inputClassName;
}
