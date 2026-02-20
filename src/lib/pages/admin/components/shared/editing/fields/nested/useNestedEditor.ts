'use client';

/**
 * useNestedEditor Hook
 *
 * Generic hook for managing nested form configurations with sections and fields.
 * Works with any config type that follows the BaseFormConfig pattern.
 *
 * @example
 * ```tsx
 * const editor = useNestedEditor({
 *   config: formConfig,
 *   onChange: setFormConfig,
 *   defaultSectionValues: getDefaultSectionValues,
 *   defaultFieldValues: getDefaultFieldConfigValues,
 *   defaultOptionValues: getDefaultOptionValues,
 * });
 * ```
 */

import { useState, useCallback, useEffect } from 'react';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Base section configuration that all form types should extend
 */
export interface BaseSectionConfig {
  id: string;
  title: string;
  description?: string;
  order: number;
  fields: BaseFieldConfig[];
  [key: string]: any;
}

/**
 * Base field configuration that all form types should extend
 */
export interface BaseFieldConfig {
  id: string;
  name: string;
  type: string;
  label: string;
  required: boolean;
  order: number;
  options?: BaseOptionConfig[];
  [key: string]: any;
}

/**
 * Base option configuration for select/radio/checkbox fields
 */
export interface BaseOptionConfig {
  id: string;
  label: string;
  description?: string;
  [key: string]: any;
}

/**
 * Base form configuration that all form types should extend
 */
export interface BaseFormConfig {
  id: string;
  title: string;
  description?: string;
  enabled?: boolean;
  order?: number;
  sections: BaseSectionConfig[];
  [key: string]: any;
}

/**
 * Hook configuration
 */
export interface UseNestedEditorConfig<
  TConfig extends BaseFormConfig = BaseFormConfig,
  TSection extends BaseSectionConfig = BaseSectionConfig,
  TField extends BaseFieldConfig = BaseFieldConfig,
  TOption extends BaseOptionConfig = BaseOptionConfig
> {
  /** Initial config data (null for create mode) */
  initialConfig?: TConfig | null;
  /** Callback when config changes */
  onChange?: (config: Partial<TConfig>) => void;
  /** Factory function for creating default section values */
  defaultSectionValues: () => TSection;
  /** Factory function for creating default field values */
  defaultFieldValues: () => TField;
  /** Factory function for creating default option values */
  defaultOptionValues: () => TOption;
  /** Default config values for create mode */
  defaultConfigValues?: () => Partial<TConfig>;
}

/**
 * Return type for the hook
 */
export interface UseNestedEditorReturn<
  TConfig extends BaseFormConfig = BaseFormConfig,
  TSection extends BaseSectionConfig = BaseSectionConfig,
  TField extends BaseFieldConfig = BaseFieldConfig,
  TOption extends BaseOptionConfig = BaseOptionConfig
> {
  // Config data
  config: Partial<TConfig>;
  isEditing: boolean;

  // Config operations
  updateConfig: (updates: Partial<TConfig>) => void;
  setConfig: (config: Partial<TConfig>) => void;

  // Section operations
  addSection: () => TSection;
  updateSection: (sectionId: string, updates: Partial<TSection>) => void;
  replaceSection: (sectionId: string, section: TSection) => void;
  deleteSection: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: 'up' | 'down') => void;
  reorderSections: (sectionIds: string[]) => void;
  getSection: (sectionId: string) => TSection | undefined;

  // Field operations
  addField: (sectionId: string) => TField;
  updateField: (sectionId: string, fieldId: string, updates: Partial<TField>) => void;
  replaceField: (sectionId: string, fieldId: string, field: TField) => void;
  deleteField: (sectionId: string, fieldId: string) => void;
  moveField: (sectionId: string, fieldId: string, direction: 'up' | 'down') => void;
  reorderFields: (sectionId: string, fieldIds: string[]) => void;
  getField: (sectionId: string, fieldId: string) => TField | undefined;

  // Option operations
  addOption: (sectionId: string, fieldId: string) => TOption;
  updateOption: (
    sectionId: string,
    fieldId: string,
    optionIndex: number,
    updates: Partial<TOption>
  ) => void;
  deleteOption: (sectionId: string, fieldId: string, optionIndex: number) => void;
  reorderOptions: (sectionId: string, fieldId: string, optionIndices: number[]) => void;

  // JSON operations
  getSectionJson: (sectionId: string) => string;
  getFieldJson: (sectionId: string, fieldId: string) => string;
  getConfigJson: () => string;
  applySectionJson: (sectionId: string, json: string) => boolean;
  applyFieldJson: (sectionId: string, fieldId: string, json: string) => boolean;
  applyConfigJson: (json: string) => boolean;

  // Validation
  validateConfig: () => string[];
  hasChanges: boolean;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

export function useNestedEditor<
  TConfig extends BaseFormConfig = BaseFormConfig,
  TSection extends BaseSectionConfig = BaseSectionConfig,
  TField extends BaseFieldConfig = BaseFieldConfig,
  TOption extends BaseOptionConfig = BaseOptionConfig
>({
  initialConfig,
  onChange,
  defaultSectionValues,
  defaultFieldValues,
  defaultOptionValues,
  defaultConfigValues,
}: UseNestedEditorConfig<TConfig, TSection, TField, TOption>): UseNestedEditorReturn<
  TConfig,
  TSection,
  TField,
  TOption
> {
  const isEditing = !!initialConfig;

  // Config state
  const [config, setConfigState] = useState<Partial<TConfig>>(() => {
    if (initialConfig) {
      return initialConfig;
    }
    return defaultConfigValues ? defaultConfigValues() : ({ sections: [] } as unknown as Partial<TConfig>);
  });

  const [initialConfigSnapshot] = useState(() => JSON.stringify(initialConfig || {}));

  // Reset when initialConfig changes
  useEffect(() => {
    if (initialConfig) {
      setConfigState(initialConfig);
    } else if (defaultConfigValues) {
      setConfigState(defaultConfigValues());
    } else {
      setConfigState({ sections: [] } as unknown as Partial<TConfig>);
    }
  }, [initialConfig, defaultConfigValues]);

  // Notify parent of changes
  const notifyChange = useCallback(
    (newConfig: Partial<TConfig>) => {
      if (onChange) {
        onChange(newConfig);
      }
    },
    [onChange]
  );

  // ==========================================================================
  // CONFIG OPERATIONS
  // ==========================================================================

  const updateConfig = useCallback(
    (updates: Partial<TConfig>) => {
      setConfigState((prev) => {
        const next = { ...prev, ...updates };
        notifyChange(next);
        return next;
      });
    },
    [notifyChange]
  );

  const setConfig = useCallback(
    (newConfig: Partial<TConfig>) => {
      setConfigState(newConfig);
      notifyChange(newConfig);
    },
    [notifyChange]
  );

  // ==========================================================================
  // SECTION OPERATIONS
  // ==========================================================================

  const getSections = (): TSection[] => (config.sections || []) as TSection[];

  const addSection = useCallback((): TSection => {
    const newSection = defaultSectionValues();
    newSection.order = getSections().length + 1;
    const newSections = [...getSections(), newSection];
    updateConfig({ sections: newSections } as unknown as Partial<TConfig>);
    return newSection;
  }, [config.sections, defaultSectionValues, updateConfig]);

  const updateSection = useCallback(
    (sectionId: string, updates: Partial<TSection>) => {
      const newSections = getSections().map((s) =>
        s.id === sectionId ? ({ ...s, ...updates } as TSection) : s
      );
      updateConfig({ sections: newSections } as unknown as Partial<TConfig>);
    },
    [config.sections, updateConfig]
  );

  const replaceSection = useCallback(
    (sectionId: string, section: TSection) => {
      const newSections = getSections().map((s) => (s.id === sectionId ? section : s));
      updateConfig({ sections: newSections } as unknown as Partial<TConfig>);
    },
    [config.sections, updateConfig]
  );

  const deleteSection = useCallback(
    (sectionId: string) => {
      const newSections = getSections()
        .filter((s) => s.id !== sectionId)
        .map((s, i) => ({ ...s, order: i + 1 } as TSection));
      updateConfig({ sections: newSections } as unknown as Partial<TConfig>);
    },
    [config.sections, updateConfig]
  );

  const moveSection = useCallback(
    (sectionId: string, direction: 'up' | 'down') => {
      const sections = getSections();
      const index = sections.findIndex((s) => s.id === sectionId);
      if (index === -1) return;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= sections.length) return;

      const newSections = [...sections];
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
      // Update order values
      const reordered = newSections.map((s, i) => ({ ...s, order: i + 1 } as TSection));
      updateConfig({ sections: reordered } as unknown as Partial<TConfig>);
    },
    [config.sections, updateConfig]
  );

  const reorderSections = useCallback(
    (sectionIds: string[]) => {
      const sections = getSections();
      const reordered = sectionIds
        .map((id) => sections.find((s) => s.id === id))
        .filter((s): s is TSection => s !== undefined)
        .map((s, i) => ({ ...s, order: i + 1 } as TSection));
      updateConfig({ sections: reordered } as unknown as Partial<TConfig>);
    },
    [config.sections, updateConfig]
  );

  const getSection = useCallback(
    (sectionId: string): TSection | undefined => {
      return getSections().find((s) => s.id === sectionId);
    },
    [config.sections]
  );

  // ==========================================================================
  // FIELD OPERATIONS
  // ==========================================================================

  const getFields = (sectionId: string): TField[] => {
    const section = getSection(sectionId);
    return (section?.fields || []) as TField[];
  };

  const addField = useCallback(
    (sectionId: string): TField => {
      const newField = defaultFieldValues();
      newField.order = getFields(sectionId).length + 1;

      const newSections = getSections().map((s) =>
        s.id === sectionId
          ? ({ ...s, fields: [...(s.fields || []), newField] } as TSection)
          : s
      );
      updateConfig({ sections: newSections } as unknown as Partial<TConfig>);
      return newField;
    },
    [config.sections, defaultFieldValues, updateConfig]
  );

  const updateField = useCallback(
    (sectionId: string, fieldId: string, updates: Partial<TField>) => {
      const newSections = getSections().map((s) =>
        s.id === sectionId
          ? ({
              ...s,
              fields: (s.fields || []).map((f) =>
                f.id === fieldId ? ({ ...f, ...updates } as TField) : f
              ),
            } as TSection)
          : s
      );
      updateConfig({ sections: newSections } as unknown as Partial<TConfig>);
    },
    [config.sections, updateConfig]
  );

  const replaceField = useCallback(
    (sectionId: string, fieldId: string, field: TField) => {
      const newSections = getSections().map((s) =>
        s.id === sectionId
          ? ({
              ...s,
              fields: (s.fields || []).map((f) => (f.id === fieldId ? field : f)),
            } as TSection)
          : s
      );
      updateConfig({ sections: newSections } as unknown as Partial<TConfig>);
    },
    [config.sections, updateConfig]
  );

  const deleteField = useCallback(
    (sectionId: string, fieldId: string) => {
      const newSections = getSections().map((s) =>
        s.id === sectionId
          ? ({
              ...s,
              fields: (s.fields || [])
                .filter((f) => f.id !== fieldId)
                .map((f, i) => ({ ...f, order: i + 1 } as TField)),
            } as TSection)
          : s
      );
      updateConfig({ sections: newSections } as unknown as Partial<TConfig>);
    },
    [config.sections, updateConfig]
  );

  const moveField = useCallback(
    (sectionId: string, fieldId: string, direction: 'up' | 'down') => {
      const section = getSection(sectionId);
      if (!section) return;

      const fields = [...(section.fields || [])] as TField[];
      const index = fields.findIndex((f) => f.id === fieldId);
      if (index === -1) return;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= fields.length) return;

      [fields[index], fields[newIndex]] = [fields[newIndex], fields[index]];
      const reordered = fields.map((f, i) => ({ ...f, order: i + 1 } as TField));

      updateSection(sectionId, { fields: reordered } as unknown as Partial<TSection>);
    },
    [config.sections, updateSection]
  );

  const reorderFields = useCallback(
    (sectionId: string, fieldIds: string[]) => {
      const section = getSection(sectionId);
      if (!section) return;

      const fields = section.fields || [];
      const reordered = fieldIds
        .map((id) => fields.find((f) => f.id === id))
        .filter((f): f is TField => f !== undefined)
        .map((f, i) => ({ ...f, order: i + 1 } as TField));

      updateSection(sectionId, { fields: reordered } as unknown as Partial<TSection>);
    },
    [config.sections, updateSection]
  );

  const getField = useCallback(
    (sectionId: string, fieldId: string): TField | undefined => {
      const section = getSection(sectionId);
      return (section?.fields || []).find((f) => f.id === fieldId) as TField | undefined;
    },
    [config.sections]
  );

  // ==========================================================================
  // OPTION OPERATIONS
  // ==========================================================================

  const addOption = useCallback(
    (sectionId: string, fieldId: string): TOption => {
      const newOption = defaultOptionValues();
      updateField(sectionId, fieldId, {
        options: [
          ...(getField(sectionId, fieldId)?.options || []),
          newOption,
        ],
      } as unknown as Partial<TField>);
      return newOption;
    },
    [config.sections, defaultOptionValues, updateField, getField]
  );

  const updateOption = useCallback(
    (
      sectionId: string,
      fieldId: string,
      optionIndex: number,
      updates: Partial<TOption>
    ) => {
      const field = getField(sectionId, fieldId);
      if (!field?.options) return;

      const newOptions = [...field.options];
      newOptions[optionIndex] = { ...newOptions[optionIndex], ...updates } as TOption;
      updateField(sectionId, fieldId, { options: newOptions } as unknown as Partial<TField>);
    },
    [config.sections, updateField, getField]
  );

  const deleteOption = useCallback(
    (sectionId: string, fieldId: string, optionIndex: number) => {
      const field = getField(sectionId, fieldId);
      if (!field?.options) return;

      const newOptions = field.options.filter((_, i) => i !== optionIndex);
      updateField(sectionId, fieldId, { options: newOptions } as unknown as Partial<TField>);
    },
    [config.sections, updateField, getField]
  );

  const reorderOptions = useCallback(
    (sectionId: string, fieldId: string, optionIndices: number[]) => {
      const field = getField(sectionId, fieldId);
      if (!field?.options) return;

      const reordered = optionIndices
        .map((i) => field.options![i])
        .filter((o): o is TOption => o !== undefined);
      updateField(sectionId, fieldId, { options: reordered } as unknown as Partial<TField>);
    },
    [config.sections, updateField, getField]
  );

  // ==========================================================================
  // JSON OPERATIONS
  // ==========================================================================

  const getSectionJson = useCallback(
    (sectionId: string): string => {
      const section = getSection(sectionId);
      return section ? JSON.stringify(section, null, 2) : '{}';
    },
    [config.sections]
  );

  const getFieldJson = useCallback(
    (sectionId: string, fieldId: string): string => {
      const field = getField(sectionId, fieldId);
      return field ? JSON.stringify(field, null, 2) : '{}';
    },
    [config.sections]
  );

  const getConfigJson = useCallback((): string => {
    return JSON.stringify(config, null, 2);
  }, [config]);

  const applySectionJson = useCallback(
    (sectionId: string, json: string): boolean => {
      try {
        const parsed = JSON.parse(json) as TSection;
        if (!parsed.id || !parsed.title) {
          return false;
        }
        replaceSection(sectionId, parsed);
        return true;
      } catch {
        return false;
      }
    },
    [replaceSection]
  );

  const applyFieldJson = useCallback(
    (sectionId: string, fieldId: string, json: string): boolean => {
      try {
        const parsed = JSON.parse(json) as TField;
        if (!parsed.id || !parsed.name || !parsed.type) {
          return false;
        }
        replaceField(sectionId, fieldId, parsed);
        return true;
      } catch {
        return false;
      }
    },
    [replaceField]
  );

  const applyConfigJson = useCallback(
    (json: string): boolean => {
      try {
        const parsed = JSON.parse(json) as TConfig;
        if (!parsed.id || !parsed.title) {
          return false;
        }
        setConfig(parsed);
        return true;
      } catch {
        return false;
      }
    },
    [setConfig]
  );

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  const validateConfig = useCallback((): string[] => {
    const errors: string[] = [];

    if (!config.id) errors.push('Form ID is required');
    if (!config.title) errors.push('Form title is required');

    const sections = getSections();
    if (sections.length === 0) {
      errors.push('At least one section is required');
    }

    sections.forEach((section, sIndex) => {
      if (!section.title) {
        errors.push(`Section ${sIndex + 1}: Title is required`);
      }
      if (!section.fields || section.fields.length === 0) {
        errors.push(`Section "${section.title || sIndex + 1}": At least one field is required`);
      }
      section.fields?.forEach((field, fIndex) => {
        if (!field.name) {
          errors.push(`Section "${section.title}": Field ${fIndex + 1} needs a field key`);
        }
        if (!field.label) {
          errors.push(`Section "${section.title}": Field ${fIndex + 1} needs a label`);
        }
      });
    });

    return errors;
  }, [config]);

  const hasChanges = JSON.stringify(config) !== initialConfigSnapshot;

  // ==========================================================================
  // RETURN
  // ==========================================================================

  return {
    config,
    isEditing,
    updateConfig,
    setConfig,
    addSection,
    updateSection,
    replaceSection,
    deleteSection,
    moveSection,
    reorderSections,
    getSection,
    addField,
    updateField,
    replaceField,
    deleteField,
    moveField,
    reorderFields,
    getField,
    addOption,
    updateOption,
    deleteOption,
    reorderOptions,
    getSectionJson,
    getFieldJson,
    getConfigJson,
    applySectionJson,
    applyFieldJson,
    applyConfigJson,
    validateConfig,
    hasChanges,
  };
}

export default useNestedEditor;
