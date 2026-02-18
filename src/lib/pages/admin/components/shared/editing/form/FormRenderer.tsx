'use client';

import React, { memo, useMemo } from 'react';
import { useFormContext } from './FormProvider';
import { FIELD_REGISTRY, getFieldComponent } from '../fields';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface FormRendererProps {
  fields: FieldConfig[];
  columns?: 1 | 2;
}

/**
 * FormRenderer - Maps field configurations to field components
 *
 * Key features:
 * - Looks up components from registry by field type
 * - Supports 1 or 2 column grid layout
 * - Filters out hidden fields
 * - Supports conditional display based on other field values
 * - Memoized field rendering for performance
 * - Passes error as prop to enable targeted re-renders when validation errors change
 */
function FormRendererComponent({ fields, columns = 2 }: FormRendererProps) {
  const { errors, getFieldValue, formData } = useFormContext();

  // Filter out hidden fields and apply conditional display
  const visibleFields = useMemo(() => {
    return fields.filter(field => {
      // Always hide if hide flag is set
      if (field.hide) return false;

      // Check conditional display
      if (field.conditionalDisplay) {
        const { field: fieldName, operator, value } = field.conditionalDisplay;
        const fieldValue = getFieldValue(fieldName);

        switch (operator) {
          case '===':
            return fieldValue === value;
          case '!==':
            return fieldValue !== value;
          case 'in':
            return Array.isArray(value) && value.includes(fieldValue);
          case 'not-in':
            return Array.isArray(value) && !value.includes(fieldValue);
          default:
            return true;
        }
      }

      // No conditional display - show field
      return true;
    });
  }, [fields, formData]);

  // Grid class based on columns
  // When columns=1, use flex-col to guarantee single column (more reliable than grid-cols-1)
  const gridClass = columns === 1
    ? 'flex flex-col gap-4'
    : 'grid grid-cols-1 md:grid-cols-2 gap-4';

  return (
    <div className={gridClass}>
      {visibleFields.map((field) => (
        <MemoizedFieldRenderer
          key={field.name}
          field={field}
          error={errors[field.name]}
        />
      ))}
    </div>
  );
}

/**
 * MemoizedFieldRenderer - Renders a single field with memoization
 *
 * Memoized by field reference AND error value. This ensures:
 * - Fields don't re-render when unrelated fields change
 * - Fields DO re-render when their validation error changes
 * - Value changes are handled internally via context
 */
const MemoizedFieldRenderer = memo(function FieldRenderer({
  field,
  error,
}: {
  field: FieldConfig;
  error?: string;
}) {
  // Get the component for this field type
  const FieldComponent = getFieldComponent(field.type);

  if (!FieldComponent) {
    // Fallback for unknown field types
    return (
      <div className="p-4 border border-orange-200 bg-orange-50 rounded-md">
        <p className="text-sm text-orange-700">
          Unknown field type: <code>{field.type}</code> for field "{field.name}"
        </p>
      </div>
    );
  }

  return <FieldComponent field={field} error={error} />;
}, (prev, next) => {
  // Re-render if field config OR error changes
  return prev.field === next.field && prev.error === next.error;
});

export const FormRenderer = memo(FormRendererComponent, (prev, next) => {
  // Re-render if fields array reference changes
  return prev.fields === next.fields && prev.columns === next.columns;
});

// Also export as default for convenience
export default FormRenderer;
