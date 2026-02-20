'use client';

import React, { useState } from 'react';
import type { FieldComponentProps } from '../types';
import TypographySettings from '@/lib/pages/admin/components/shared/editing/fields/typography/TypographySettings';

export default function TextField({
  field,
  value,
  onChange,
  allProps,
  onPropChange,
  hasTypographyField,
}: FieldComponentProps) {
  const [showTypography, setShowTypography] = useState(false);

  // Check if there's a paired typography field
  // hasTypographyField is passed from EnhancedFieldRenderer based on component field definitions
  const typographyFieldName = `${field.name}Typography`;
  const hasTypography = hasTypographyField && Boolean(onPropChange);
  const typographyValue = hasTypography ? allProps?.[typographyFieldName] : undefined;

  return (
    <div>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
      />

      {/* Typography toggle - only show if paired typography field exists */}
      {hasTypography && onPropChange && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowTypography(!showTypography)}
            className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1 focus:outline-none"
          >
            <svg
              className={`h-3 w-3 transition-transform ${showTypography ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Typography Settings
          </button>

          {showTypography && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <TypographySettings
                settings={typographyValue || {}}
                onChange={(val) => onPropChange(typographyFieldName, val)}
                showAlignment={true}
                showColor={true}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
