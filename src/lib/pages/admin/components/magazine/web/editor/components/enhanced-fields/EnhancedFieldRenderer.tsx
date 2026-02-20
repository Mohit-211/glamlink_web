'use client';

import React from 'react';
import type { EnhancedFieldRendererProps, FieldComponentProps } from './types';
import { getFieldComponent, fieldComponents } from './fieldRegistry';
import FallbackField from './fields/FallbackField';

// Import specialized components that need custom rendering logic
import { HtmlField } from '@/lib/pages/admin/components/shared/editing/fields/html';
import StringArrayField from '../../fields/StringArrayField';
import ObjectArrayField from '../../fields/ObjectArrayField';

// Lazy imports for heavy components
const VideoFieldWrapper = React.lazy(() => import('./wrappers/VideoFieldWrapper'));
const HtmlFieldWrapper = React.lazy(() => import('./wrappers/HtmlFieldWrapper'));

/**
 * EnhancedFieldRenderer - Maps field types to appropriate components
 * Uses object lookup pattern for cleaner code organization
 */
export default function EnhancedFieldRenderer(props: EnhancedFieldRendererProps) {
  const { field, value, onChange, issueId = 'admin', allProps, onPropChange, allFields } = props;

  // Check if a paired typography field exists for this text field
  const typographyFieldName = `${field.name}Typography`;
  const hasTypographyField = allFields?.some(f => f.name === typographyFieldName && f.type === 'typography-group') || false;

  // Handle special cases that need custom logic
  switch (field.type) {
    // Rich text needs special wrapper
    case 'richtext':
    case 'html':
      return (
        <React.Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded" />}>
          <HtmlFieldWrapper
            value={value || ''}
            onChange={onChange}
            placeholder={field.placeholder}
          />
        </React.Suspense>
      );

    // Video needs special wrapper
    case 'video':
      return (
        <React.Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded" />}>
          <VideoFieldWrapper
            value={typeof value === 'string' ? value : value?.url || ''}
            onChange={onChange}
            fieldName={field.name}
            issueId={issueId}
            placeholder={field.placeholder}
            disabled={field.disabled}
          />
        </React.Suspense>
      );

    // Array fields need to determine if string or object array
    case 'array':
      if (field.itemType === 'object' && (field.fields || field.objectFields)) {
        return (
          <ObjectArrayField
            field={field}
            value={value || []}
            onChange={onChange}
            issueId={issueId}
            FieldRenderer={EnhancedFieldRenderer}
          />
        );
      }
      return (
        <StringArrayField
          field={field}
          value={value || []}
          onChange={onChange}
        />
      );

    // Object type needs recursive rendering
    case 'object':
      const objectFields = field.fields || [];
      if (objectFields.length === 0) {
        return (
          <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
            Object field without defined fields
          </div>
        );
      }

      const objectValue = value || {};
      return (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {objectFields.map((subField) => (
            <div key={subField.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {subField.label}
                {subField.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <EnhancedFieldRenderer
                field={subField}
                value={objectValue[subField.name]}
                onChange={(newValue) => onChange({ ...objectValue, [subField.name]: newValue })}
                issueId={issueId}
              />
              {subField.helperText && (
                <p className="mt-1 text-xs text-gray-500">{subField.helperText}</p>
              )}
            </div>
          ))}
        </div>
      );

    // All other types use the registry lookup
    default:
      const FieldComponent = getFieldComponent(field.type);
      return (
        <FieldComponent
          field={field}
          value={value}
          onChange={onChange}
          issueId={issueId}
          allProps={allProps}
          onPropChange={onPropChange}
          hasTypographyField={hasTypographyField}
        />
      );
  }
}
