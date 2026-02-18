'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  GetFeaturedFormConfig,
  FormSectionConfig,
  FormFieldConfig,
  FieldOption
} from '../../types';
import {
  getDefaultSectionValues,
  getDefaultFieldConfigValues,
  getDefaultOptionValues
} from '@/lib/pages/admin/config/fields/getFeatured';

interface UseFormConfigEditorProps {
  initialData?: GetFeaturedFormConfig | null;
}

export function useFormConfigEditor({ initialData }: UseFormConfigEditorProps) {
  const [formData, setFormData] = useState<Partial<GetFeaturedFormConfig>>({});
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);
  const isEditing = !!initialData;

  // Initialize form data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: '',
        title: '',
        description: '',
        icon: 'star',
        bannerColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
        enabled: true,
        order: 1,
        sections: []
      });
    }
  }, [initialData]);

  const updateFormData = useCallback((updates: Partial<GetFeaturedFormConfig>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const addSection = useCallback(() => {
    const newSection = getDefaultSectionValues();
    newSection.order = (formData.sections?.length || 0) + 1;
    updateFormData({ sections: [...(formData.sections || []), newSection] });
    setExpandedSectionId(newSection.id);
  }, [formData.sections, updateFormData]);

  const updateSection = useCallback((sectionId: string, section: FormSectionConfig) => {
    const newSections = (formData.sections || []).map(s => s.id === sectionId ? section : s);
    updateFormData({ sections: newSections });
  }, [formData.sections, updateFormData]);

  const deleteSection = useCallback((sectionId: string) => {
    const newSections = (formData.sections || []).filter(s => s.id !== sectionId);
    updateFormData({ sections: newSections });
  }, [formData.sections, updateFormData]);

  return {
    formData,
    updateFormData,
    setFormData, // For JSON editor mode
    expandedSectionId,
    setExpandedSectionId,
    isEditing,
    addSection,
    updateSection,
    deleteSection
  };
}

// Field editor hook
export function useFieldEditor(
  field: FormFieldConfig,
  onChange: (field: FormFieldConfig) => void
) {
  const updateField = useCallback((updates: Partial<FormFieldConfig>) => {
    onChange({ ...field, ...updates });
  }, [field, onChange]);

  const addOption = useCallback(() => {
    const newOption = getDefaultOptionValues();
    updateField({ options: [...(field.options || []), newOption] });
  }, [field.options, updateField]);

  const updateOption = useCallback((index: number, updates: Partial<FieldOption>) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = { ...newOptions[index], ...updates };
    updateField({ options: newOptions });
  }, [field.options, updateField]);

  const deleteOption = useCallback((index: number) => {
    const newOptions = (field.options || []).filter((_, i) => i !== index);
    updateField({ options: newOptions });
  }, [field.options, updateField]);

  const showOptions = ['select', 'radio', 'checkbox', 'multi-checkbox'].includes(field.type);

  return {
    updateField,
    addOption,
    updateOption,
    deleteOption,
    showOptions
  };
}

// Section editor hook
export function useSectionEditor(
  section: FormSectionConfig,
  onChange: (section: FormSectionConfig) => void
) {
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);

  const updateSection = useCallback((updates: Partial<FormSectionConfig>) => {
    onChange({ ...section, ...updates });
  }, [section, onChange]);

  const addField = useCallback(() => {
    const newField = getDefaultFieldConfigValues();
    newField.order = (section.fields?.length || 0) + 1;
    updateSection({ fields: [...(section.fields || []), newField] });
    setExpandedFieldId(newField.id);
  }, [section.fields, updateSection]);

  const updateField = useCallback((fieldId: string, field: FormFieldConfig) => {
    const newFields = (section.fields || []).map(f => f.id === fieldId ? field : f);
    updateSection({ fields: newFields });
  }, [section.fields, updateSection]);

  const deleteField = useCallback((fieldId: string) => {
    const newFields = (section.fields || []).filter(f => f.id !== fieldId);
    updateSection({ fields: newFields });
  }, [section.fields, updateSection]);

  return {
    expandedFieldId,
    setExpandedFieldId,
    updateSection,
    addField,
    updateField,
    deleteField
  };
}
