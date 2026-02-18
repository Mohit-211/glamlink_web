'use client';

/**
 * FieldArrayField
 *
 * A field component for managing an array of form fields (without section wrapper).
 * Useful when you need to manage fields directly without the section abstraction.
 *
 * @example
 * ```tsx
 * <FieldArrayField
 *   fields={section.fields}
 *   onChange={(fields) => updateSection({ fields })}
 *   expandedFieldId={expandedFieldId}
 *   onToggleFieldExpand={toggleField}
 *   fieldTypeOptions={FORM_FIELD_TYPE_OPTIONS}
 *   defaultFieldValues={getDefaultFieldConfigValues}
 *   defaultOptionValues={getDefaultOptionValues}
 * />
 * ```
 */

import { memo, useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import type { BaseFieldConfig, BaseOptionConfig } from './useNestedEditor';
import { NestedFieldEditorField, type FieldTypeOption } from './NestedFieldEditorField';

// =============================================================================
// TYPES
// =============================================================================

export interface FieldArrayFieldProps<
  TField extends BaseFieldConfig = BaseFieldConfig,
  TOption extends BaseOptionConfig = BaseOptionConfig
> {
  /** Array of fields to render */
  fields: TField[];
  /** Callback when fields array changes */
  onChange: (fields: TField[]) => void;
  /** Currently expanded field ID (optional - uses internal state if not provided) */
  expandedFieldId?: string | null;
  /** Toggle field expansion (optional - uses internal state if not provided) */
  onToggleFieldExpand?: (fieldId: string) => void;
  /** Available field type options */
  fieldTypeOptions: FieldTypeOption[];
  /** Factory function for creating new fields */
  defaultFieldValues: () => TField;
  /** Factory function for creating new options */
  defaultOptionValues?: () => TOption;
  /** Optional callback for JSON editing a field */
  onFieldJsonEdit?: (field: TField) => void;
  /** Show JSON edit buttons */
  showJsonButton?: boolean;
  /** Label for the add button */
  addButtonLabel?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Show header with add button */
  showHeader?: boolean;
  /** Header label */
  headerLabel?: string;
  /** Custom class name */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

function FieldArrayFieldComponent<
  TField extends BaseFieldConfig = BaseFieldConfig,
  TOption extends BaseOptionConfig = BaseOptionConfig
>({
  fields,
  onChange,
  expandedFieldId: externalExpandedFieldId,
  onToggleFieldExpand: externalOnToggleFieldExpand,
  fieldTypeOptions,
  defaultFieldValues,
  defaultOptionValues,
  onFieldJsonEdit,
  showJsonButton = true,
  addButtonLabel = 'Add Field',
  emptyMessage = 'No fields yet. Click "Add Field" to create one.',
  showHeader = true,
  headerLabel = 'Fields',
  className = '',
}: FieldArrayFieldProps<TField, TOption>) {
  // Internal field expansion state (used if external not provided)
  const [internalExpandedFieldId, setInternalExpandedFieldId] = useState<string | null>(null);

  // Use external or internal state
  const expandedFieldId = externalExpandedFieldId ?? internalExpandedFieldId;
  const toggleFieldExpand = useCallback(
    (fieldId: string) => {
      if (externalOnToggleFieldExpand) {
        externalOnToggleFieldExpand(fieldId);
      } else {
        setInternalExpandedFieldId((prev) => (prev === fieldId ? null : fieldId));
      }
    },
    [externalOnToggleFieldExpand]
  );

  // Field operations
  const addField = useCallback(() => {
    const newField = defaultFieldValues();
    newField.order = fields.length + 1;
    onChange([...fields, newField]);
    // Expand the new field
    if (externalOnToggleFieldExpand) {
      externalOnToggleFieldExpand(newField.id);
    } else {
      setInternalExpandedFieldId(newField.id);
    }
  }, [fields, defaultFieldValues, onChange, externalOnToggleFieldExpand]);

  const updateField = useCallback(
    (fieldId: string, field: TField) => {
      const newFields = fields.map((f) => (f.id === fieldId ? field : f));
      onChange(newFields);
    },
    [fields, onChange]
  );

  const deleteField = useCallback(
    (fieldId: string) => {
      const newFields = fields
        .filter((f) => f.id !== fieldId)
        .map((f, i) => ({ ...f, order: i + 1 } as TField));
      onChange(newFields);
    },
    [fields, onChange]
  );

  return (
    <div className={className}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">{headerLabel}</label>
          <button
            type="button"
            onClick={addField}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="w-4 h-4" />
            {addButtonLabel}
          </button>
        </div>
      )}

      {/* Fields List */}
      <div className="space-y-2">
        {fields.map((field) => (
          <NestedFieldEditorField<TField, TOption>
            key={field.id}
            field={field}
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
        {fields.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}

export const FieldArrayField = memo(
  FieldArrayFieldComponent
) as typeof FieldArrayFieldComponent;

export default FieldArrayField;
