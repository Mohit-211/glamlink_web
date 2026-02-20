'use client';

import { useState, useCallback, useEffect } from 'react';
import { CTAAlertConfig, getDefaultCTAAlertConfig, validateCTAAlertConfig, SavedModalTemplate } from '@/lib/pages/admin/types/ctaAlert';
import { PromoItem } from '@/lib/features/promos/config';

interface UseCTAAlertSectionProps {
  config: CTAAlertConfig | null;
  promos: PromoItem[];
  onUpdate: (config: Partial<CTAAlertConfig>) => Promise<void>;
  isSaving: boolean;
}

export function useCTAAlertSection({ config, promos, onUpdate, isSaving }: UseCTAAlertSectionProps) {
  // Local state for form editing
  const [localConfig, setLocalConfig] = useState<Partial<CTAAlertConfig>>(
    config || getDefaultCTAAlertConfig()
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Template state
  const [savedTemplates, setSavedTemplates] = useState<SavedModalTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState(false);

  // Sync local state when prop changes
  useEffect(() => {
    if (config) {
      setLocalConfig(config);
      setHasChanges(false);
    }
  }, [config]);

  // Fetch saved templates on mount
  const fetchSavedTemplates = useCallback(async () => {
    setIsLoadingTemplates(true);
    try {
      const response = await fetch('/api/content-settings/cta-alert/templates', {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setSavedTemplates(data.data);
      }
    } catch (error) {
      console.error('Error fetching saved templates:', error);
    } finally {
      setIsLoadingTemplates(false);
    }
  }, []);

  // Load templates on mount
  useEffect(() => {
    fetchSavedTemplates();
  }, [fetchSavedTemplates]);

  // Handle template selection - copy values to form fields
  const handleTemplateSelect = useCallback((templateId: string) => {
    setSelectedTemplateId(templateId);

    if (!templateId) {
      // "New Modal (Custom)" selected - clear template selection
      return;
    }

    const template = savedTemplates.find(t => t.id === templateId);
    if (template) {
      setLocalConfig(prev => ({
        ...prev,
        modalTitle: template.modalTitle,
        modalHtmlContent: template.modalHtmlContent,
      }));
      setHasChanges(true);
    }
  }, [savedTemplates]);

  // Clear template selection (for creating new)
  const handleClearTemplateSelection = useCallback(() => {
    setSelectedTemplateId('');
  }, []);

  // Save current modal as template
  const handleSaveAsTemplate = useCallback(async (name: string) => {
    if (!name.trim()) {
      return;
    }

    setIsSavingTemplate(true);
    try {
      const response = await fetch('/api/content-settings/cta-alert/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          modalTitle: localConfig.modalTitle || '',
          modalHtmlContent: localConfig.modalHtmlContent || '',
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh templates list
        await fetchSavedTemplates();
        setShowSaveTemplateModal(false);
        setTemplateName('');
      } else {
        console.error('Failed to save template:', data.error);
      }
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setIsSavingTemplate(false);
    }
  }, [localConfig.modalTitle, localConfig.modalHtmlContent, fetchSavedTemplates]);

  // Delete a template
  const handleDeleteTemplate = useCallback(async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const response = await fetch(`/api/content-settings/cta-alert/templates?id=${templateId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        // Clear selection if deleting the selected template
        if (selectedTemplateId === templateId) {
          setSelectedTemplateId('');
        }
        // Refresh templates list
        await fetchSavedTemplates();
      } else {
        console.error('Failed to delete template:', data.error);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  }, [fetchSavedTemplates, selectedTemplateId]);

  // Update an existing template with current modal content
  const handleUpdateTemplate = useCallback(async () => {
    if (!selectedTemplateId) return;

    const template = savedTemplates.find(t => t.id === selectedTemplateId);
    if (!template) return;

    setIsUpdatingTemplate(true);
    try {
      const response = await fetch('/api/content-settings/cta-alert/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: selectedTemplateId,
          name: template.name,
          modalTitle: localConfig.modalTitle || '',
          modalHtmlContent: localConfig.modalHtmlContent || '',
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchSavedTemplates();
      } else {
        console.error('Failed to update template:', data.error);
      }
    } catch (error) {
      console.error('Error updating template:', error);
    } finally {
      setIsUpdatingTemplate(false);
    }
  }, [selectedTemplateId, savedTemplates, localConfig.modalTitle, localConfig.modalHtmlContent, fetchSavedTemplates]);

  // Get currently selected template
  const selectedTemplate = savedTemplates.find(t => t.id === selectedTemplateId) || null;

  // Update a single field
  const updateField = useCallback((field: keyof CTAAlertConfig, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
    setValidationErrors([]);

    // Clear linked promo when switching to standalone
    if (field === 'sourceType' && value === 'standalone') {
      setLocalConfig(prev => ({
        ...prev,
        sourceType: 'standalone',
        linkedPromoId: undefined,
      }));
    }

    // Clear custom modal when switching to standard
    if (field === 'modalType' && value === 'standard') {
      setLocalConfig(prev => ({
        ...prev,
        modalType: 'standard',
        customModalId: undefined,
      }));
    }
  }, []);

  // Handle promo selection - auto-fill fields from promo
  const handlePromoSelect = useCallback((promoId: string) => {
    const selectedPromo = promos.find(p => p.id === promoId);

    if (selectedPromo) {
      setLocalConfig(prev => ({
        ...prev,
        linkedPromoId: promoId,
        // Auto-fill from promo (user can override)
        message: prev.message || selectedPromo.popupDisplay || selectedPromo.title,
        buttonText: prev.buttonText || selectedPromo.ctaText || 'Learn More',
        startDate: selectedPromo.startDate,
        endDate: selectedPromo.endDate,
        // Use promo's modal type if available
        modalType: selectedPromo.modalType === 'custom' ? 'custom' : 'standard',
        customModalId: selectedPromo.customModalId,
      }));
    } else {
      setLocalConfig(prev => ({
        ...prev,
        linkedPromoId: promoId,
      }));
    }

    setHasChanges(true);
    setValidationErrors([]);
  }, [promos]);

  // Save changes
  const handleSave = useCallback(async () => {
    // Validate before saving
    const validation = validateCTAAlertConfig(localConfig);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      await onUpdate(localConfig);
      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving CTA Alert config:', error);
      setValidationErrors(['Failed to save configuration. Please try again.']);
    }
  }, [localConfig, onUpdate]);

  // Reset to original values
  const handleReset = useCallback(() => {
    if (config) {
      setLocalConfig(config);
    } else {
      setLocalConfig(getDefaultCTAAlertConfig());
    }
    setHasChanges(false);
    setValidationErrors([]);
  }, [config]);

  // Quick toggle for active state
  const handleToggleActive = useCallback(async () => {
    const newActiveState = !localConfig.isActive;
    setLocalConfig(prev => ({
      ...prev,
      isActive: newActiveState,
    }));

    // Auto-save active toggle
    try {
      await onUpdate({
        ...localConfig,
        isActive: newActiveState,
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      // Revert on error
      setLocalConfig(prev => ({
        ...prev,
        isActive: !newActiveState,
      }));
      console.error('Error toggling CTA Alert active state:', error);
    }
  }, [localConfig, onUpdate]);

  // Get active promos for dropdown (only show promos that are visible and not expired)
  const activePromos = promos.filter(promo => {
    const now = new Date();
    const endDate = new Date(promo.endDate);
    return promo.visible !== false && endDate >= now;
  });

  return {
    localConfig,
    hasChanges,
    showSuccess,
    showPreview,
    validationErrors,
    activePromos,
    setShowPreview,
    updateField,
    handlePromoSelect,
    handleSave,
    handleReset,
    handleToggleActive,
    // Template-related
    savedTemplates,
    isLoadingTemplates,
    showSaveTemplateModal,
    setShowSaveTemplateModal,
    templateName,
    setTemplateName,
    isSavingTemplate,
    selectedTemplateId,
    selectedTemplate,
    isUpdatingTemplate,
    handleTemplateSelect,
    handleSaveAsTemplate,
    handleDeleteTemplate,
    handleUpdateTemplate,
    handleClearTemplateSelection,
  };
}
