'use client';

/**
 * SectionEditorField
 *
 * A collapsible section editor for managing form section configurations.
 * Renders a list of NestedFieldEditorField components for field management.
 *
 * @example
 * ```tsx
 * <SectionEditorField
 *   section={sectionConfig}
 *   onChange={(section) => updateSection(section.id, section)}
 *   onDelete={() => deleteSection(section.id)}
 *   isExpanded={expandedSectionId === section.id}
 *   onToggleExpand={() => toggleSection(section.id)}
 *   expandedFieldId={expandedFieldId}
 *   onToggleField={(fieldId) => toggleField(fieldId)}
 *   fieldTypeOptions={FORM_FIELD_TYPE_OPTIONS}
 *   layoutOptions={SECTION_LAYOUT_OPTIONS}
 * />
 * ```
 */

import { memo, useCallback, useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Code } from 'lucide-react';
import type { BaseSectionConfig, BaseFieldConfig, BaseOptionConfig } from './useNestedEditor';
import { NestedFieldEditorField, type FieldTypeOption } from './NestedFieldEditorField';

// =============================================================================
// TYPES
// =============================================================================

export interface LayoutOption {
  value: string;
  label: string;
}

export interface SectionEditorFieldProps<
  TSection extends BaseSectionConfig = BaseSectionConfig,
  TField extends BaseFieldConfig = BaseFieldConfig,
  TOption extends BaseOptionConfig = BaseOptionConfig
> {
  /** The section configuration to edit */
  section: TSection;
  /** Callback when section changes */
  onChange: (section: TSection) => void;
  /** Callback when section is deleted */
  onDelete: () => void;
  /** Whether this section is expanded */
  isExpanded: boolean;
  /** Toggle expansion state */
  onToggleExpand: () => void;
  /** Currently expanded field ID (optional - uses internal state if not provided) */
  expandedFieldId?: string | null;
  /** Toggle field expansion (optional - uses internal state if not provided) */
  onToggleField?: (fieldId: string) => void;
  /** Available field type options */
  fieldTypeOptions: FieldTypeOption[];
  /** Available layout options */
  layoutOptions?: LayoutOption[];
  /** Factory function for creating new fields */
  defaultFieldValues: () => TField;
  /** Factory function for creating new options */
  defaultOptionValues?: () => TOption;
  /** Optional callback for JSON editing the section */
  onJsonEdit?: (section: TSection) => void;
  /** Optional callback for JSON editing a field */
  onFieldJsonEdit?: (field: TField) => void;
  /** Show JSON edit buttons */
  showJsonButton?: boolean;
  /** Custom class name */
  className?: string;
}

// =============================================================================
// DEFAULT VALUES
// =============================================================================

const DEFAULT_LAYOUT_OPTIONS: LayoutOption[] = [
  { value: 'single', label: 'Single Column' },
  { value: 'grid', label: 'Two Columns' },
];

// =============================================================================
// COMPONENT
// =============================================================================

function SectionEditorFieldComponent<
  TSection extends BaseSectionConfig = BaseSectionConfig,
  TField extends BaseFieldConfig = BaseFieldConfig,
  TOption extends BaseOptionConfig = BaseOptionConfig
>({
  section,
  onChange,
  onDelete,
  isExpanded,
  onToggleExpand,
  expandedFieldId: externalExpandedFieldId,
  onToggleField: externalOnToggleField,
  fieldTypeOptions,
  layoutOptions = DEFAULT_LAYOUT_OPTIONS,
  defaultFieldValues,
  defaultOptionValues,
  onJsonEdit,
  onFieldJsonEdit,
  showJsonButton = true,
  className = '',
}: SectionEditorFieldProps<TSection, TField, TOption>) {
  // Internal field expansion state (used if external not provided)
  const [internalExpandedFieldId, setInternalExpandedFieldId] = useState<string | null>(null);

  // Use external or internal state
  const expandedFieldId = externalExpandedFieldId ?? internalExpandedFieldId;
  const toggleFieldExpand = useCallback(
    (fieldId: string) => {
      if (externalOnToggleField) {
        externalOnToggleField(fieldId);
      } else {
        setInternalExpandedFieldId((prev) => (prev === fieldId ? null : fieldId));
      }
    },
    [externalOnToggleField]
  );

  // Section update helper
  const updateSection = useCallback(
    (updates: Partial<TSection>) => {
      onChange({ ...section, ...updates } as TSection);
    },
    [section, onChange]
  );

  // Field operations
  const addField = useCallback(() => {
    const newField = defaultFieldValues();
    newField.order = (section.fields?.length || 0) + 1;
    updateSection({ fields: [...(section.fields || []), newField] } as unknown as Partial<TSection>);
    // Expand the new field
    if (externalOnToggleField) {
      externalOnToggleField(newField.id);
    } else {
      setInternalExpandedFieldId(newField.id);
    }
  }, [section.fields, defaultFieldValues, updateSection, externalOnToggleField]);

  const updateField = useCallback(
    (fieldId: string, field: TField) => {
      const newFields = (section.fields || []).map((f) =>
        f.id === fieldId ? field : f
      );
      updateSection({ fields: newFields } as unknown as Partial<TSection>);
    },
    [section.fields, updateSection]
  );

  const deleteField = useCallback(
    (fieldId: string) => {
      const newFields = (section.fields || [])
        .filter((f) => f.id !== fieldId)
        .map((f, i) => ({ ...f, order: i + 1 } as TField));
      updateSection({ fields: newFields } as unknown as Partial<TSection>);
    },
    [section.fields, updateSection]
  );

  return (
    <div className={`border border-gray-300 rounded-lg bg-gray-50 ${className}`}>
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-100"
        onClick={onToggleExpand}
      >
        <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
        <div className="flex-1 min-w-0">
          <span className="font-semibold">{section.title || 'New Section'}</span>
          <span className="text-sm text-gray-500 ml-2">
            ({section.fields?.length || 0} fields)
          </span>
        </div>
        {showJsonButton && onJsonEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onJsonEdit(section);
            }}
            className="p-1 text-gray-400 hover:text-indigo-600"
            title="Edit section as JSON"
          >
            <Code className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 text-red-400 hover:text-red-600"
          title="Delete section"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 py-4 border-t border-gray-200 space-y-4">
          {/* Section Properties */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={section.title || ''}
                onChange={(e) => updateSection({ title: e.target.value } as unknown as Partial<TSection>)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Section title"
              />
            </div>
            {layoutOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Layout
                </label>
                <select
                  value={(section as any).layout || 'single'}
                  onChange={(e) => updateSection({ layout: e.target.value } as unknown as Partial<TSection>)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {layoutOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={section.description || ''}
              onChange={(e) => updateSection({ description: e.target.value } as unknown as Partial<TSection>)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Optional section description..."
            />
          </div>

          {/* Fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Fields
              </label>
              <button
                type="button"
                onClick={addField}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </button>
            </div>
            <div className="space-y-2">
              {(section.fields || []).map((field) => (
                <NestedFieldEditorField<TField, TOption>
                  key={field.id}
                  field={field as TField}
                  onChange={(f) => updateField(field.id, f)}
                  onDelete={() => deleteField(field.id)}
                  isExpanded={expandedFieldId === field.id}
                  onToggleExpand={() => toggleFieldExpand(field.id)}
                  fieldTypeOptions={fieldTypeOptions}
                  defaultOptionValues={defaultOptionValues}
                  onJsonEdit={onFieldJsonEdit}
                  showJsonButton={showJsonButton}
                />
              ))}
              {(!section.fields || section.fields.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No fields yet. Click "Add Field" to create one.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const SectionEditorField = memo(
  SectionEditorFieldComponent
) as typeof SectionEditorFieldComponent;

export default SectionEditorField;
