import { useState, useEffect, useCallback } from 'react';
import { getSectionFieldConfig } from '../sections';
import { useSectionTemplates } from './templates';
import type { ForClientsSection } from '../sections/for-clients/types';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface UseSectionEditorProps {
  section: ForClientsSection;
  onSave: (section: ForClientsSection) => void;
  onClose: () => void;
}

interface UseSectionEditorReturn {
  // State
  showSaveTemplateModal: boolean;
  isSaving: boolean;
  formDataState: any;
  fieldConfig: FieldConfig[];
  supportsTemplates: boolean;

  // Template state
  templates: any[];
  selectedTemplateId: string | null;
  isLoadingTemplates: boolean;
  currentTemplate: any;

  // State setters
  setShowSaveTemplateModal: (show: boolean) => void;
  setFormDataState: (data: any) => void;

  // Actions
  handleTemplateSelectInternal: (templateId: string | null) => void;
  handleFormSave: () => Promise<void>;
  handleSaveAsTemplate: (name: string, category?: string) => Promise<void>;
  handleUpdateExistingTemplate: () => Promise<void>;
  handleDeleteTemplate: (templateId: string) => Promise<void>;
}

/**
 * Hook for managing section editor modal state and actions
 *
 * Extracts all business logic from SectionEditorModal component
 * for cleaner separation of concerns.
 */
export function useSectionEditor({
  section,
  onSave,
  onClose
}: UseSectionEditorProps): UseSectionEditorReturn {
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formDataState, setFormDataState] = useState(section.content);

  // Get field configuration for this section type
  const fieldConfig = getSectionFieldConfig(section.type);

  // Any section with editable fields supports templates
  const supportsTemplates = fieldConfig.length > 0;

  // Template management hook
  const {
    templates,
    selectedTemplateId,
    isLoadingTemplates,
    handleTemplateSelect,
    handleSaveTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate
  } = useSectionTemplates(
    section.type as any,
    undefined,
    supportsTemplates
  );

  // Reset form data when section changes
  useEffect(() => {
    setFormDataState(section.content);
  }, [section]);

  // Handle template selection
  const handleTemplateSelectInternal = useCallback((templateId: string | null) => {
    handleTemplateSelect(templateId);

    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setFormDataState(template.content as any);
      }
    }
  }, [handleTemplateSelect, templates]);

  // Handle form save
  const handleFormSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const updatedSection: ForClientsSection = {
        ...section,
        content: formDataState
      } as ForClientsSection;
      onSave(updatedSection);
      onClose();
    } catch (error) {
      console.error('Error saving section:', error);
    } finally {
      setIsSaving(false);
    }
  }, [section, formDataState, onSave, onClose]);

  // Handle saving as new template
  const handleSaveAsTemplate = useCallback(async (name: string, category?: string) => {
    await handleSaveTemplate(name, formDataState, category);
    setShowSaveTemplateModal(false);
  }, [handleSaveTemplate, formDataState]);

  // Handle updating existing template
  const handleUpdateExistingTemplate = useCallback(async () => {
    if (!selectedTemplateId) return;

    const template = templates.find(t => t.id === selectedTemplateId);
    if (!template) return;

    await handleUpdateTemplate(selectedTemplateId, formDataState);
  }, [selectedTemplateId, templates, handleUpdateTemplate, formDataState]);

  // Find current template
  const currentTemplate = templates.find(t => t.id === selectedTemplateId);

  return {
    // State
    showSaveTemplateModal,
    isSaving,
    formDataState,
    fieldConfig,
    supportsTemplates,

    // Template state
    templates,
    selectedTemplateId,
    isLoadingTemplates,
    currentTemplate,

    // State setters
    setShowSaveTemplateModal,
    setFormDataState,

    // Actions
    handleTemplateSelectInternal,
    handleFormSave,
    handleSaveAsTemplate,
    handleUpdateExistingTemplate,
    handleDeleteTemplate
  };
}
