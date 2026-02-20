"use client";

import { useState } from "react";
import { FieldConfig } from "@/lib/pages/apply/featured/config/fields";
import { GetFeaturedFormData } from "@/lib/pages/apply/shared/types";
import FileUploadField from "../fields/FileUploadField";
import CheckboxGroup from "./CheckboxGroup";
import InputListField from "../fields/InputListField";
import RadioGroup from "./RadioGroup";

interface FieldRendererProps {
  fieldKey: string;
  config: FieldConfig;
  value: any;
  onChange: (fieldKey: string, value: any) => void;
  error?: string;
  disabled?: boolean;
}

export default function FieldRenderer({
  fieldKey,
  config,
  value,
  onChange,
  error,
  disabled = false
}: FieldRendererProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFieldChange = (newValue: any) => {
    onChange(fieldKey, newValue);
  };

  const renderField = () => {
    const commonProps = {
      disabled,
      error
    };

    switch (config.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={config.type}
              value={value || ''}
              onChange={(e) => handleFieldChange(e.target.value)}
              placeholder={config.placeholder}
              disabled={disabled}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors
                ${error
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-glamlink-teal focus:border-glamlink-teal'
                }
                ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
              `}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {config.helperText && (
              <p className="text-sm text-gray-500">{config.helperText}</p>
            )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value || ''}
              onChange={(e) => handleFieldChange(e.target.value)}
              placeholder={config.placeholder}
              rows={config.rows || 4}
              maxLength={config.maxLength}
              disabled={disabled}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors resize-none
                ${error
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-glamlink-teal focus:border-glamlink-teal'
                }
                ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
              `}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {config.maxLength && (
              <p className="text-xs text-gray-500 text-right">
                {value ? value.length : 0} / {config.maxLength} characters
              </p>
            )}
            {config.helperText && (
              <p className="text-sm text-gray-500">{config.helperText}</p>
            )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        );

      case 'file-upload':
        return (
          <FileUploadField
            fieldKey={fieldKey}
            config={{
              ...config,
              maxFiles: config.validation?.maxFiles || 5,
              maxSize: (config.validation?.maxSize || 10) * 1024 * 1024, // Convert MB to bytes
              accept: config.validation?.accept || 'image/*'
            }}
            value={value || []}
            onChange={handleFieldChange}
            error={error}
            disabled={disabled}
          />
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            <CheckboxGroup
              label={config.label}
              options={config.options || []}
              selectedValues={value || []}
              onChange={(values) => handleFieldChange(values)}
              required={config.required}
              helperText={config.helperText}
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            <RadioGroup
              label={config.label}
              name={fieldKey}
              options={config.options || []}
              value={value || ''}
              onChange={(selectedValue) => handleFieldChange(selectedValue)}
              required={config.required}
              helperText={config.helperText}
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
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
            error={error}
            disabled={disabled}
          />
        );

      default:
        console.warn(`Unknown field type: ${config.type}`);
        return (
          <div className="text-red-600">
            Unknown field type: {config.type}
          </div>
        );
    }
  };

  return (
    <div className={`transition-all duration-200 ${isFocused ? 'scale-[1.01]' : ''}`}>
      {renderField()}
    </div>
  );
}