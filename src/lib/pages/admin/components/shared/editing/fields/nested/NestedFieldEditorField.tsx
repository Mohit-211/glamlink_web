'use client';

/**
 * NestedFieldEditorField
 *
 * A collapsible field editor for managing form field configurations.
 * Supports editing field properties and options (for select/radio/checkbox types).
 *
 * @example
 * ```tsx
 * <NestedFieldEditorField
 *   field={fieldConfig}
 *   onChange={(field) => updateField(section.id, field.id, field)}
 *   onDelete={() => deleteField(section.id, field.id)}
 *   isExpanded={expandedFieldId === field.id}
 *   onToggleExpand={() => toggleField(field.id)}
 *   fieldTypeOptions={FORM_FIELD_TYPE_OPTIONS}
 * />
 * ```
 */

import { memo, useCallback } from 'react';
import { Trash2, ChevronDown, ChevronUp, GripVertical, Code } from 'lucide-react';
import type { BaseFieldConfig, BaseOptionConfig } from './useNestedEditor';

// =============================================================================
// TYPES
// =============================================================================

export interface FieldTypeOption {
  value: string;
  label: string;
}

export interface NestedFieldEditorFieldProps<
  TField extends BaseFieldConfig = BaseFieldConfig,
  TOption extends BaseOptionConfig = BaseOptionConfig
> {
  /** The field configuration to edit */
  field: TField;
  /** Callback when field changes */
  onChange: (field: TField) => void;
  /** Callback when field is deleted */
  onDelete: () => void;
  /** Whether this field is expanded */
  isExpanded: boolean;
  /** Toggle expansion state */
  onToggleExpand: () => void;
  /** Available field type options */
  fieldTypeOptions: FieldTypeOption[];
  /** Types that show options editor (default: select, radio, checkbox, multi-checkbox) */
  optionFieldTypes?: string[];
  /** Factory function for creating new options */
  defaultOptionValues?: () => TOption;
  /** Optional callback for JSON editing */
  onJsonEdit?: (field: TField) => void;
  /** Show JSON edit button */
  showJsonButton?: boolean;
  /** Custom class name */
  className?: string;
}

// =============================================================================
// DEFAULT VALUES
// =============================================================================

const DEFAULT_OPTION_FIELD_TYPES = ['select', 'radio', 'checkbox', 'multi-checkbox'];

// =============================================================================
// COMPONENT
// =============================================================================

function NestedFieldEditorFieldComponent<
  TField extends BaseFieldConfig = BaseFieldConfig,
  TOption extends BaseOptionConfig = BaseOptionConfig
>({
  field,
  onChange,
  onDelete,
  isExpanded,
  onToggleExpand,
  fieldTypeOptions,
  optionFieldTypes = DEFAULT_OPTION_FIELD_TYPES,
  defaultOptionValues,
  onJsonEdit,
  showJsonButton = true,
  className = '',
}: NestedFieldEditorFieldProps<TField, TOption>) {
  // Field update helper
  const updateField = useCallback(
    (updates: Partial<TField>) => {
      onChange({ ...field, ...updates } as TField);
    },
    [field, onChange]
  );

  // Option operations
  const showOptions = optionFieldTypes.includes(field.type);

  const addOption = useCallback(() => {
    if (!defaultOptionValues) return;
    const newOption = defaultOptionValues();
    updateField({ options: [...(field.options || []), newOption] } as unknown as Partial<TField>);
  }, [field.options, defaultOptionValues, updateField]);

  const updateOption = useCallback(
    (index: number, updates: Partial<TOption>) => {
      const newOptions = [...(field.options || [])];
      newOptions[index] = { ...newOptions[index], ...updates } as TOption;
      updateField({ options: newOptions } as unknown as Partial<TField>);
    },
    [field.options, updateField]
  );

  const deleteOption = useCallback(
    (index: number) => {
      const newOptions = (field.options || []).filter((_, i) => i !== index);
      updateField({ options: newOptions } as unknown as Partial<TField>);
    },
    [field.options, updateField]
  );

  return (
    <div className={`border border-gray-200 rounded-lg bg-white ${className}`}>
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50"
        onClick={onToggleExpand}
      >
        <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
        <div className="flex-1 min-w-0">
          <span className="font-medium text-sm">{field.label || 'New Field'}</span>
          <span className="text-xs text-gray-500 ml-2">({field.type})</span>
          {field.required && (
            <span className="text-xs text-red-500 ml-1">*</span>
          )}
        </div>
        {showJsonButton && onJsonEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onJsonEdit(field);
            }}
            className="p-1 text-gray-400 hover:text-indigo-600"
            title="Edit as JSON"
          >
            <Code className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 text-red-400 hover:text-red-600"
          title="Delete field"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 py-3 border-t border-gray-100 space-y-3">
          {/* Field Key & Label */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Field Key
              </label>
              <input
                type="text"
                value={field.name || ''}
                onChange={(e) => updateField({ name: e.target.value } as unknown as Partial<TField>)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., bio"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                type="text"
                value={field.label || ''}
                onChange={(e) => updateField({ label: e.target.value } as unknown as Partial<TField>)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Your Bio"
              />
            </div>
          </div>

          {/* Type & Required */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={field.type}
                onChange={(e) => updateField({ type: e.target.value } as unknown as Partial<TField>)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {fieldTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateField({ required: e.target.checked } as unknown as Partial<TField>)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Required</span>
              </label>
            </div>
          </div>

          {/* Placeholder */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={(field as any).placeholder || ''}
              onChange={(e) => updateField({ placeholder: e.target.value } as unknown as Partial<TField>)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Placeholder text..."
            />
          </div>

          {/* Helper Text */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Helper Text
            </label>
            <input
              type="text"
              value={(field as any).helperText || ''}
              onChange={(e) => updateField({ helperText: e.target.value } as unknown as Partial<TField>)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Helper text for this field..."
            />
          </div>

          {/* Options Editor (for select/radio/checkbox) */}
          {showOptions && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-gray-700">
                  Options
                </label>
                {defaultOptionValues && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    + Add Option
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {(field.options || []).map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option.id}
                      onChange={(e) => updateOption(idx, { id: e.target.value } as Partial<TOption>)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="ID"
                    />
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => updateOption(idx, { label: e.target.value } as Partial<TOption>)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Label"
                    />
                    <button
                      type="button"
                      onClick={() => deleteOption(idx)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {(!field.options || field.options.length === 0) && (
                  <p className="text-xs text-gray-500 text-center py-2">
                    No options. Click "+ Add Option" to add one.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const NestedFieldEditorField = memo(
  NestedFieldEditorFieldComponent
) as typeof NestedFieldEditorFieldComponent;

export default NestedFieldEditorField;
