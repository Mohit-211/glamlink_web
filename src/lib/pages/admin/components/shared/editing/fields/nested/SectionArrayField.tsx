'use client';

/**
 * SectionArrayField
 *
 * A field component for managing an array of form sections.
 * Renders a list of SectionEditorField components with add/reorder capabilities.
 *
 * @example
 * ```tsx
 * <SectionArrayField
 *   sections={config.sections}
 *   onChange={(sections) => updateConfig({ sections })}
 *   expandedSectionId={expandedSectionId}
 *   onToggleSectionExpand={toggleSection}
 *   fieldTypeOptions={FORM_FIELD_TYPE_OPTIONS}
 *   layoutOptions={SECTION_LAYOUT_OPTIONS}
 *   defaultSectionValues={getDefaultSectionValues}
 *   defaultFieldValues={getDefaultFieldConfigValues}
 *   defaultOptionValues={getDefaultOptionValues}
 * />
 * ```
 */

import { memo, useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import type { BaseSectionConfig, BaseFieldConfig, BaseOptionConfig } from './useNestedEditor';
import { SectionEditorField, type LayoutOption } from './SectionEditorField';
import type { FieldTypeOption } from './NestedFieldEditorField';

// =============================================================================
// TYPES
// =============================================================================

export interface SectionArrayFieldProps<
  TSection extends BaseSectionConfig = BaseSectionConfig,
  TField extends BaseFieldConfig = BaseFieldConfig,
  TOption extends BaseOptionConfig = BaseOptionConfig
> {
  /** Array of sections to render */
  sections: TSection[];
  /** Callback when sections array changes */
  onChange: (sections: TSection[]) => void;
  /** Currently expanded section ID (optional - uses internal state if not provided) */
  expandedSectionId?: string | null;
  /** Toggle section expansion (optional - uses internal state if not provided) */
  onToggleSectionExpand?: (sectionId: string) => void;
  /** Currently expanded field ID (optional) */
  expandedFieldId?: string | null;
  /** Toggle field expansion (optional) */
  onToggleFieldExpand?: (fieldId: string) => void;
  /** Available field type options */
  fieldTypeOptions: FieldTypeOption[];
  /** Available layout options */
  layoutOptions?: LayoutOption[];
  /** Factory function for creating new sections */
  defaultSectionValues: () => TSection;
  /** Factory function for creating new fields */
  defaultFieldValues: () => TField;
  /** Factory function for creating new options */
  defaultOptionValues?: () => TOption;
  /** Optional callback for JSON editing a section */
  onSectionJsonEdit?: (section: TSection) => void;
  /** Optional callback for JSON editing a field */
  onFieldJsonEdit?: (field: TField) => void;
  /** Show JSON edit buttons */
  showJsonButton?: boolean;
  /** Label for the add button */
  addButtonLabel?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Custom class name */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

function SectionArrayFieldComponent<
  TSection extends BaseSectionConfig = BaseSectionConfig,
  TField extends BaseFieldConfig = BaseFieldConfig,
  TOption extends BaseOptionConfig = BaseOptionConfig
>({
  sections,
  onChange,
  expandedSectionId: externalExpandedSectionId,
  onToggleSectionExpand: externalOnToggleSectionExpand,
  expandedFieldId,
  onToggleFieldExpand,
  fieldTypeOptions,
  layoutOptions,
  defaultSectionValues,
  defaultFieldValues,
  defaultOptionValues,
  onSectionJsonEdit,
  onFieldJsonEdit,
  showJsonButton = true,
  addButtonLabel = 'Add Section',
  emptyMessage = 'No sections yet. Click "Add Section" to create one.',
  className = '',
}: SectionArrayFieldProps<TSection, TField, TOption>) {
  // Internal section expansion state (used if external not provided)
  const [internalExpandedSectionId, setInternalExpandedSectionId] = useState<string | null>(null);

  // Use external or internal state
  const expandedSectionId = externalExpandedSectionId ?? internalExpandedSectionId;
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

  // Section operations
  const addSection = useCallback(() => {
    const newSection = defaultSectionValues();
    newSection.order = sections.length + 1;
    onChange([...sections, newSection]);
    // Expand the new section
    if (externalOnToggleSectionExpand) {
      externalOnToggleSectionExpand(newSection.id);
    } else {
      setInternalExpandedSectionId(newSection.id);
    }
  }, [sections, defaultSectionValues, onChange, externalOnToggleSectionExpand]);

  const updateSection = useCallback(
    (sectionId: string, section: TSection) => {
      const newSections = sections.map((s) => (s.id === sectionId ? section : s));
      onChange(newSections);
    },
    [sections, onChange]
  );

  const deleteSection = useCallback(
    (sectionId: string) => {
      const newSections = sections
        .filter((s) => s.id !== sectionId)
        .map((s, i) => ({ ...s, order: i + 1 } as TSection));
      onChange(newSections);
    },
    [sections, onChange]
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Form Sections</h3>
        <button
          type="button"
          onClick={addSection}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {addButtonLabel}
        </button>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section) => (
          <SectionEditorField<TSection, TField, TOption>
            key={section.id}
            section={section}
            onChange={(s) => updateSection(section.id, s)}
            onDelete={() => deleteSection(section.id)}
            isExpanded={expandedSectionId === section.id}
            onToggleExpand={() => toggleSectionExpand(section.id)}
            expandedFieldId={expandedFieldId}
            onToggleField={onToggleFieldExpand}
            fieldTypeOptions={fieldTypeOptions}
            layoutOptions={layoutOptions}
            defaultFieldValues={defaultFieldValues}
            defaultOptionValues={defaultOptionValues}
            onJsonEdit={onSectionJsonEdit}
            onFieldJsonEdit={onFieldJsonEdit}
            showJsonButton={showJsonButton}
          />
        ))}
        {sections.length === 0 && (
          <p className="text-center text-gray-500 py-8">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}

export const SectionArrayField = memo(
  SectionArrayFieldComponent
) as typeof SectionArrayFieldComponent;

export default SectionArrayField;
