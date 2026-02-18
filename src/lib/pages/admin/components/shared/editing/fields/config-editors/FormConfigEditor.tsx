'use client';

/**
 * FormConfigEditor
 *
 * Top-level component for editing form configurations with sections and fields.
 * Provides a complete form builder interface with JSON editing support at all levels.
 *
 * @example
 * ```tsx
 * <FormConfigEditor
 *   config={formConfig}
 *   onChange={setFormConfig}
 *   isEditing={!!initialData}
 *   fieldTypeOptions={FORM_FIELD_TYPE_OPTIONS}
 *   iconOptions={FORM_ICON_OPTIONS}
 *   defaultSectionValues={getDefaultSectionValues}
 *   defaultFieldValues={getDefaultFieldConfigValues}
 *   defaultOptionValues={getDefaultOptionValues}
 * />
 * ```
 */

import { memo, useCallback, useState } from 'react';
import { Code } from 'lucide-react';
import type {
  BaseFormConfig,
  BaseSectionConfig,
  BaseFieldConfig,
  BaseOptionConfig,
} from '../nested/useNestedEditor';
import { SectionArrayField, type LayoutOption } from '../nested';
import type { FieldTypeOption } from '../nested';

// =============================================================================
// TYPES
// =============================================================================

export interface IconOption {
  value: string;
  label: string;
}

export interface FormConfigEditorProps<
  TConfig extends BaseFormConfig = BaseFormConfig,
  TSection extends BaseSectionConfig = BaseSectionConfig,
  TField extends BaseFieldConfig = BaseFieldConfig,
  TOption extends BaseOptionConfig = BaseOptionConfig
> {
  /** The form configuration to edit */
  config: Partial<TConfig>;
  /** Callback when config changes */
  onChange: (config: Partial<TConfig>) => void;
  /** Whether we're editing an existing config (disables ID field) */
  isEditing?: boolean;
  /** Available field type options */
  fieldTypeOptions: FieldTypeOption[];
  /** Available section layout options */
  layoutOptions?: LayoutOption[];
  /** Available icon options */
  iconOptions?: IconOption[];
  /** Factory function for creating new sections */
  defaultSectionValues: () => TSection;
  /** Factory function for creating new fields */
  defaultFieldValues: () => TField;
  /** Factory function for creating new options */
  defaultOptionValues?: () => TOption;
  /** Show JSON edit buttons at section/field level */
  showNestedJsonButtons?: boolean;
  /** Show JSON edit button at config level */
  showConfigJsonButton?: boolean;
  /** Callback when JSON editor is opened for config */
  onConfigJsonEdit?: (config: Partial<TConfig>) => void;
  /** Callback when JSON editor is opened for a section */
  onSectionJsonEdit?: (section: TSection) => void;
  /** Callback when JSON editor is opened for a field */
  onFieldJsonEdit?: (field: TField) => void;
  /** Currently expanded section ID (controlled) */
  expandedSectionId?: string | null;
  /** Toggle section expansion (controlled) */
  onToggleSectionExpand?: (sectionId: string) => void;
  /** Currently expanded field ID (controlled) */
  expandedFieldId?: string | null;
  /** Toggle field expansion (controlled) */
  onToggleFieldExpand?: (fieldId: string) => void;
  /** Custom class name */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

function FormConfigEditorComponent<
  TConfig extends BaseFormConfig = BaseFormConfig,
  TSection extends BaseSectionConfig = BaseSectionConfig,
  TField extends BaseFieldConfig = BaseFieldConfig,
  TOption extends BaseOptionConfig = BaseOptionConfig
>({
  config,
  onChange,
  isEditing = false,
  fieldTypeOptions,
  layoutOptions,
  iconOptions,
  defaultSectionValues,
  defaultFieldValues,
  defaultOptionValues,
  showNestedJsonButtons = true,
  showConfigJsonButton = true,
  onConfigJsonEdit,
  onSectionJsonEdit,
  onFieldJsonEdit,
  expandedSectionId: externalExpandedSectionId,
  onToggleSectionExpand: externalOnToggleSectionExpand,
  expandedFieldId: externalExpandedFieldId,
  onToggleFieldExpand: externalOnToggleFieldExpand,
  className = '',
}: FormConfigEditorProps<TConfig, TSection, TField, TOption>) {
  // Internal expansion state (used if external not provided)
  const [internalExpandedSectionId, setInternalExpandedSectionId] = useState<string | null>(null);
  const [internalExpandedFieldId, setInternalExpandedFieldId] = useState<string | null>(null);

  // Use external or internal state
  const expandedSectionId = externalExpandedSectionId ?? internalExpandedSectionId;
  const expandedFieldId = externalExpandedFieldId ?? internalExpandedFieldId;

  const toggleSectionExpand = useCallback(
    (sectionId: string) => {
      if (externalOnToggleSectionExpand) {
        externalOnToggleSectionExpand(sectionId);
      } else {
        setInternalExpandedSectionId((prev) => (prev === sectionId ? null : sectionId));
      }
    },
    [externalOnToggleSectionExpand]
  );

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

  // Update config helper
  const updateConfig = useCallback(
    (updates: Partial<TConfig>) => {
      onChange({ ...config, ...updates } as unknown as Partial<TConfig>);
    },
    [config, onChange]
  );

  // Handle sections change
  const handleSectionsChange = useCallback(
    (sections: TSection[]) => {
      updateConfig({ sections } as unknown as Partial<TConfig>);
    },
    [updateConfig]
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          {showConfigJsonButton && onConfigJsonEdit && (
            <button
              type="button"
              onClick={() => onConfigJsonEdit(config as Partial<TConfig>)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600"
              title="Edit config as JSON"
            >
              <Code className="w-4 h-4" />
              Edit JSON
            </button>
          )}
        </div>

        {/* ID & Title */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Form ID
            </label>
            <input
              type="text"
              value={config.id || ''}
              onChange={(e) => updateConfig({ id: e.target.value } as unknown as Partial<TConfig>)}
              disabled={isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              placeholder="e.g., cover"
            />
            <p className="text-xs text-gray-500 mt-1">
              Unique identifier (cannot be changed after creation)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => updateConfig({ title: e.target.value } as unknown as Partial<TConfig>)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Cover Feature"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={config.description || ''}
            onChange={(e) => updateConfig({ description: e.target.value } as unknown as Partial<TConfig>)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Describe what this form is for..."
          />
        </div>

        {/* Icon, Order, Enabled */}
        <div className="grid grid-cols-3 gap-4">
          {iconOptions && iconOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <select
                value={(config as any).icon || (iconOptions[0]?.value || '')}
                onChange={(e) => updateConfig({ icon: e.target.value } as unknown as Partial<TConfig>)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {iconOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <input
              type="number"
              value={config.order || 1}
              onChange={(e) => updateConfig({ order: parseInt(e.target.value) || 1 } as unknown as Partial<TConfig>)}
              min={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.enabled ?? true}
                onChange={(e) => updateConfig({ enabled: e.target.checked } as unknown as Partial<TConfig>)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Enabled</span>
            </label>
          </div>
        </div>

        {/* Banner Color (optional - only show if config has this field) */}
        {'bannerColor' in config && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banner Color
            </label>
            <input
              type="text"
              value={(config as any).bannerColor || ''}
              onChange={(e) => updateConfig({ bannerColor: e.target.value } as unknown as Partial<TConfig>)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., bg-gradient-to-r from-purple-600 to-pink-600"
            />
          </div>
        )}
      </div>

      {/* Sections */}
      <SectionArrayField<TSection, TField, TOption>
        sections={(config.sections || []) as TSection[]}
        onChange={handleSectionsChange}
        expandedSectionId={expandedSectionId}
        onToggleSectionExpand={toggleSectionExpand}
        expandedFieldId={expandedFieldId}
        onToggleFieldExpand={toggleFieldExpand}
        fieldTypeOptions={fieldTypeOptions}
        layoutOptions={layoutOptions}
        defaultSectionValues={defaultSectionValues}
        defaultFieldValues={defaultFieldValues}
        defaultOptionValues={defaultOptionValues}
        onSectionJsonEdit={onSectionJsonEdit}
        onFieldJsonEdit={onFieldJsonEdit}
        showJsonButton={showNestedJsonButtons}
      />
    </div>
  );
}

export const FormConfigEditor = memo(
  FormConfigEditorComponent
) as typeof FormConfigEditorComponent;

export default FormConfigEditor;
