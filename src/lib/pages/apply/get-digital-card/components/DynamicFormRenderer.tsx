'use client';

/**
 * DynamicFormRenderer - Renders form sections and fields dynamically from configuration
 *
 * Takes a form configuration (sections with fields) and renders the appropriate
 * field components based on field type. Uses shared field components.
 */

import React from 'react';
import {
  TextField,
  TextareaField,
  EmailField,
  MultiCheckboxField,
  SelectField,
  CheckboxField,
  InputListField
} from '@/lib/pages/apply/shared/components/fields';
import MultiLocationFieldWrapper from './MultiLocationFieldWrapper';
import BusinessHoursField from './BusinessHoursField';
import SimpleArrayField from './SimpleArrayField';
import type { FormSectionConfig, FormFieldConfig } from '@/lib/pages/admin/components/form-submissions/form-configurations/types';

// =============================================================================
// TYPES
// =============================================================================

export interface DynamicFormRendererProps {
  sections: FormSectionConfig[];
  formData: Record<string, any>;
  errors: Record<string, string>;
  onChange: (fieldKey: string, value: any) => void;
  onBlur?: (fieldKey: string) => void;
  onFocus?: (fieldKey: string) => void;
  disabled?: boolean;
  collapsible?: boolean;
}

interface SectionProps {
  section: FormSectionConfig;
  formData: Record<string, any>;
  errors: Record<string, string>;
  onChange: (fieldKey: string, value: any) => void;
  onBlur?: (fieldKey: string) => void;
  onFocus?: (fieldKey: string) => void;
  disabled?: boolean;
  collapsible?: boolean;
}

// =============================================================================
// FIELD RENDERER
// =============================================================================

function renderField(
  field: FormFieldConfig,
  formData: Record<string, any>,
  errors: Record<string, string>,
  onChange: (fieldKey: string, value: any) => void,
  onBlur?: (fieldKey: string) => void,
  onFocus?: (fieldKey: string) => void,
  disabled?: boolean
): React.ReactNode {
  const fieldKey = field.name;
  const value = formData[fieldKey];
  const error = errors[fieldKey];

  // Convert FormFieldConfig to the format expected by shared components
  const config = {
    type: field.type,
    label: field.label,
    required: field.required,
    placeholder: field.placeholder,
    description: field.helperText,
    maxLength: field.maxLength,
    rows: field.rows,
    options: field.options?.map(opt => ({
      id: opt.id || opt.label,
      label: opt.label,
      description: opt.description
    })),
    validation: field.validation
  };

  const baseProps = {
    fieldKey,
    config,
    value,
    onChange,
    onBlur,
    onFocus,
    error,
    disabled
  };

  switch (field.type) {
    case 'text':
    case 'tel':
      return <TextField key={fieldKey} {...baseProps} />;

    case 'email':
      return <EmailField key={fieldKey} {...baseProps} />;

    case 'textarea':
      return <TextareaField key={fieldKey} {...baseProps} />;

    case 'select':
      return <SelectField key={fieldKey} {...baseProps} />;

    case 'checkbox':
      return <CheckboxField key={fieldKey} {...baseProps} />;

    case 'multi-checkbox':
      // @ts-expect-error - MultiCheckboxField options type mismatch
      return <MultiCheckboxField key={fieldKey} {...baseProps} />;

    case 'multiLocation':
      return (
        // @ts-expect-error - MultiLocationFieldWrapper props mismatch
        <MultiLocationFieldWrapper
          key={fieldKey}
          value={value || []}
          onChange={(locations) => onChange(fieldKey, locations)}
          error={error}
        />
      );

    // @ts-expect-error - businessHours not a standard FormFieldType
    case 'businessHours':
      return (
        <BusinessHoursField
          key={fieldKey}
          value={value || []}
          onChange={(hours) => onChange(fieldKey, hours)}
          // @ts-expect-error - BusinessHoursField config prop type mismatch
          config={config}
        />
      );

    case 'array':
    case 'bullet-array':
      return (
        // @ts-expect-error - SimpleArrayField fieldName prop missing
        <SimpleArrayField
          key={fieldKey}
          label={field.label}
          value={value || []}
          onChange={(items) => onChange(fieldKey, items)}
          placeholder={field.placeholder}
          maxItems={field.maxLength || 10}
          helperText={field.helperText}
          error={error}
        />
      );

    default:
      // Fallback to text field for unknown types
      return <TextField key={fieldKey} {...baseProps} />;
  }
}

// =============================================================================
// SECTION COMPONENT
// =============================================================================

function FormSection({
  section,
  formData,
  errors,
  onChange,
  onBlur,
  onFocus,
  disabled,
  collapsible = false
}: SectionProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // Sort fields by order
  const sortedFields = [...(section.fields || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Section Header */}
      <div
        className={`px-6 py-4 bg-gray-50 border-b border-gray-200 ${collapsible ? 'cursor-pointer hover:bg-gray-100' : ''}`}
        onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            {section.description && (
              <p className="text-sm text-gray-500 mt-1">{section.description}</p>
            )}
          </div>
          {collapsible && (
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Section Fields */}
      {!isCollapsed && (
        <div className="p-6">
          {/* @ts-expect-error - Layout type comparison */}
          <div className={`grid gap-6 ${section.layout === 'two-column' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
            {sortedFields.map(field => (
              <div key={field.name}>
                {renderField(field, formData, errors, onChange, onBlur, onFocus, disabled)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function DynamicFormRenderer({
  sections,
  formData,
  errors,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  collapsible = false
}: DynamicFormRendererProps) {
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-8">
      {sortedSections.map(section => (
        <FormSection
          key={section.id}
          section={section}
          formData={formData}
          errors={errors}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          collapsible={collapsible}
        />
      ))}
    </div>
  );
}
