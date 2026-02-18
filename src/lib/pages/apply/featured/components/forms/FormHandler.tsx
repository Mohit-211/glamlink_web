"use client";

import {
  EmailField,
  CharacterCountField,
  FileUploadField,
  CheckboxOptionField,
  CheckboxField,
  RadioOptionField,
  MultiCheckboxField,
  TextField,
  TextareaField,
  CheckboxListField,
  RadioListField,
  InputListField
} from "@/lib/pages/apply/shared/components/fields";
import { closingLayout } from "../../config/formLayouts";
import { fields_layout as staticFieldsLayout, TabConfig } from "../../config/fields";

export interface FormHandlerProps {
  formLayout: {
    title: string;
    description: string;
    sections: Array<{
      title: string;
      description?: string;
      fields: string[];
      layout?: 'grid' | 'single';
    }>;
  };
  fieldsConfig: Record<string, any>;
  glamlinkConfig?: TabConfig;
  formData: Record<string, any>;
  handleFieldChange: (fieldKey: string, value: any) => void;
  handleFieldBlur?: (fieldKey: string) => void;
  handleFieldFocus?: (fieldKey: string) => void;
  errors: Record<string, string>;
  isLoading: boolean;
  isSubmitting: boolean;
  conditionalFields?: Record<string, (formData: Record<string, any>) => boolean>;
  customFieldHandlers?: Record<string, (fieldKey: string, config: any, value: any, onChange: (fieldKey: string, value: any) => void, error: string | undefined, disabled: boolean) => React.ReactElement>;
}

export default function FormHandler({
  formLayout,
  fieldsConfig,
  glamlinkConfig,
  formData,
  handleFieldChange,
  handleFieldBlur,
  handleFieldFocus,
  errors,
  isLoading,
  isSubmitting,
  conditionalFields = {},
  customFieldHandlers = {}
}: FormHandlerProps) {
  // Use provided glamlinkConfig or fall back to static config
  const glamlinkFields = glamlinkConfig || staticFieldsLayout.glamlinkIntegration;

  // Combine the original fields config with glamlink integration fields
  const enhancedFieldsConfig = {
    ...fieldsConfig,
    // Add glamlink integration fields from the shared configuration
    ...glamlinkFields
  };

  // Combine original sections with closing layout sections
  const allSections = [...formLayout.sections, ...closingLayout.sections];
  // Render a field based on its configuration and type
  const renderField = (fieldKey: string, config: any) => {
    const value = formData[fieldKey];
    const error = errors[fieldKey];

    // Check if this field should be conditionally rendered
    if (conditionalFields[fieldKey] && !conditionalFields[fieldKey](formData)) {
      return null;
    }

    // Check for custom field handlers
    if (customFieldHandlers[fieldKey]) {
      return customFieldHandlers[fieldKey](fieldKey, config, value, handleFieldChange, error, isLoading || isSubmitting);
    }

    // Determine which field component to use based on field type
    switch (config.type) {
      case 'text':
        return (
          <TextField
            fieldKey={fieldKey}
            config={config}
            value={value}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            onFocus={handleFieldFocus}
            error={error}
            disabled={isLoading || isSubmitting}
          />
        );

      case 'email':
        return (
          <EmailField
            fieldKey={fieldKey}
            config={config}
            value={value}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            onFocus={handleFieldFocus}
            error={error}
            disabled={isLoading || isSubmitting}
          />
        );

      case 'tel':
        return (
          <CharacterCountField
            fieldKey={fieldKey}
            config={config}
            value={value}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            onFocus={handleFieldFocus}
            error={error}
            disabled={isLoading || isSubmitting}
            maxLength={config.validation?.maxLength || 20}
          />
        );

      case 'textarea':
        return (
          <CharacterCountField
            fieldKey={fieldKey}
            config={config}
            value={value}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            onFocus={handleFieldFocus}
            error={error}
            disabled={isLoading || isSubmitting}
            maxLength={config.validation?.maxLength || 500}
            rows={config.rows || 3}
          />
        );

      case 'file-upload':
        return (
          <FileUploadField
            fieldKey={fieldKey}
            config={{
              label: config.label,
              required: config.required,
              description: config.helperText || config.description,
              maxFiles: config.validation?.maxFiles || 5,
              maxSize: (config.validation?.maxSize || 100) * 1024 * 1024,
              accept: config.validation?.accept || 'image/*',
              multiple: (config.validation?.maxFiles || 5) > 1
            }}
            value={value}
            onChange={handleFieldChange}
            error={error}
            disabled={isLoading || isSubmitting}
          />
        );

      case 'checkbox':
        // Use simple CheckboxField for boolean checkboxes, CheckboxOptionField for multi-option checkboxes
        if (config.options && config.options.length > 0) {
          return (
            <CheckboxOptionField
              fieldKey={fieldKey}
              config={config}
              value={value}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              onFocus={handleFieldFocus}
              error={error}
              disabled={isLoading || isSubmitting}
              options={config.options}
            />
          );
        } else {
          return (
            <CheckboxField
              fieldKey={fieldKey}
              config={config}
              value={value}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              onFocus={handleFieldFocus}
              error={error}
              disabled={isLoading || isSubmitting}
            />
          );
        }

      case 'radio':
        return (
          <RadioOptionField
            fieldKey={fieldKey}
            config={config}
            value={value}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            onFocus={handleFieldFocus}
            error={error}
            disabled={isLoading || isSubmitting}
            options={config.options}
          />
        );

      case 'multi-checkbox':
        return (
          <MultiCheckboxField
            fieldKey={fieldKey}
            config={config}
            value={value}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            onFocus={handleFieldFocus}
            error={error}
            disabled={isLoading || isSubmitting}
            minSelections={config.minSelections || 1}
            maxSelections={config.maxSelections || 6}
            columns={config.columns || 2}
            options={config.options}
          />
        );

      case 'bullet-array':
        return (
          <InputListField
            fieldKey={fieldKey}
            config={{
              ...config,
              maxItems: config.maxPoints || 5,
              placeholder: config.placeholder || 'Enter an item'
            }}
            value={value}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            onFocus={handleFieldFocus}
            error={error}
            disabled={isLoading || isSubmitting}
          />
        );

      default:
        return (
          <TextField
            fieldKey={fieldKey}
            config={config}
            value={value}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            onFocus={handleFieldFocus}
            error={error}
            disabled={isLoading || isSubmitting}
          />
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{formLayout.title}</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {formLayout.description}
        </p>
      </div>

      {/* Form Sections */}
      {allSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h4>
          {section.description && (
            <p className="text-gray-600 mb-6">{section.description}</p>
          )}

          <div className={section.layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
            {section.fields.map(fieldKey => {
              const config = enhancedFieldsConfig[fieldKey];
              if (!config) return null;

              return (
                <div key={fieldKey} data-field={fieldKey}>
                  {renderField(fieldKey, config)}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}