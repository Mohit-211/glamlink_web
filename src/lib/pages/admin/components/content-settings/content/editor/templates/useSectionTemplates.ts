import { useState, useEffect, useCallback, useRef } from 'react';
import { SectionTemplate, ForClientsSectionType } from '../../sections/for-clients/types';

interface UseSectionTemplatesReturn {
  templates: SectionTemplate[];
  selectedTemplateId: string | null;
  isLoadingTemplates: boolean;
  handleTemplateSelect: (templateId: string | null) => void;
  handleSaveTemplate: (name: string, content: any, category?: string) => Promise<void>;
  handleUpdateTemplate: (templateId: string, content: any) => Promise<void>;
  handleDeleteTemplate: (templateId: string) => Promise<void>;
  fetchTemplates: () => Promise<void>;
}

// Valid section types that support templates (defined outside component to be stable)
const VALID_TEMPLATE_TYPES: readonly string[] = ['hero', 'features', 'how-it-works', 'testimonials', 'cta', 'html-content'];

/**
 * Hook for managing section templates
 *
 * Handles CRUD operations for section templates:
 * - Fetches templates from Firestore on mount (if enabled)
 * - Caches templates to avoid repeated fetches
 * - Provides handlers for create/update/delete
 *
 * @param sectionType - Type of section (hero, features, etc.)
 * @param onTemplateSelect - Callback when template is selected (for updating form)
 * @param enabled - Whether to fetch templates (defaults to true)
 * @returns Template data and operation handlers
 */
export function useSectionTemplates(
  sectionType: ForClientsSectionType,
  onTemplateSelect?: (content: any) => void,
  enabled: boolean = true
): UseSectionTemplatesReturn {
  const [templates, setTemplates] = useState<SectionTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  // Use ref to track latest enabled value to prevent stale closure issues
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  // Check if templates should be fetched
  const shouldFetchTemplates = enabled && VALID_TEMPLATE_TYPES.includes(sectionType);

  // Fetch templates - only if enabled and valid type
  const fetchTemplates = useCallback(async () => {
    // Triple-check before making API call
    if (!enabledRef.current || !VALID_TEMPLATE_TYPES.includes(sectionType)) {
      setTemplates([]);
      return;
    }

    setIsLoadingTemplates(true);
    try {
      const response = await fetch(
        `/api/content-settings/for-clients/templates?sectionType=${sectionType}`,
        {
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (data.success) {
        setTemplates(data.data || []);
      } else {
        // Don't log error for disabled hooks
        if (enabledRef.current) {
          console.error('Failed to fetch templates:', data.error);
        }
        setTemplates([]);
      }
    } catch (error) {
      if (enabledRef.current) {
        console.error('Error fetching templates:', error);
      }
      setTemplates([]);
    } finally {
      setIsLoadingTemplates(false);
    }
  }, [sectionType]);

  // Fetch templates on mount - only if enabled and valid type
  useEffect(() => {
    // Early return if templates shouldn't be fetched
    if (!shouldFetchTemplates) {
      setTemplates([]);
      return;
    }

    fetchTemplates();
  }, [shouldFetchTemplates, fetchTemplates]);

  // Handle template selection
  const handleTemplateSelect = useCallback(
    (templateId: string | null) => {
      setSelectedTemplateId(templateId);

      if (templateId && onTemplateSelect) {
        const template = templates.find((t) => t.id === templateId);
        if (template) {
          onTemplateSelect(template.content);
        }
      }
    },
    [templates, onTemplateSelect]
  );

  // Save new template - only if enabled
  const handleSaveTemplate = useCallback(
    async (name: string, content: any, category?: string) => {
      if (!enabledRef.current) return;

      try {
        const response = await fetch('/api/content-settings/for-clients/templates', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            sectionType,
            content,
            category,
          }),
        });

        const data = await response.json();

        if (data.success) {
          await fetchTemplates();
          if (data.data?.id) {
            setSelectedTemplateId(data.data.id);
          }
        } else {
          console.error('Failed to save template:', data.error);
          throw new Error(data.error || 'Failed to save template');
        }
      } catch (error) {
        console.error('Error saving template:', error);
        throw error;
      }
    },
    [sectionType, fetchTemplates]
  );

  // Update existing template - only if enabled
  const handleUpdateTemplate = useCallback(
    async (templateId: string, content: any, category?: string) => {
      if (!enabledRef.current) return;

      try {
        const template = templates.find((t) => t.id === templateId);
        if (!template) {
          throw new Error('Template not found');
        }

        const response = await fetch('/api/content-settings/for-clients/templates', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: templateId,
            name: template.name,
            sectionType: template.sectionType,
            content,
            category: category !== undefined ? category : template.category,
          }),
        });

        const data = await response.json();

        if (data.success) {
          await fetchTemplates();
        } else {
          console.error('Failed to update template:', data.error);
          throw new Error(data.error || 'Failed to update template');
        }
      } catch (error) {
        console.error('Error updating template:', error);
        throw error;
      }
    },
    [templates, fetchTemplates]
  );

  // Delete template - only if enabled
  const handleDeleteTemplate = useCallback(
    async (templateId: string) => {
      if (!enabledRef.current) return;

      if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
        return;
      }

      try {
        const response = await fetch(
          `/api/content-settings/for-clients/templates?id=${templateId}`,
          {
            method: 'DELETE',
            credentials: 'include',
          }
        );

        const data = await response.json();

        if (data.success) {
          if (selectedTemplateId === templateId) {
            setSelectedTemplateId(null);
          }
          await fetchTemplates();
        } else {
          console.error('Failed to delete template:', data.error);
          throw new Error(data.error || 'Failed to delete template');
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        throw error;
      }
    },
    [selectedTemplateId, fetchTemplates]
  );

  return {
    templates,
    selectedTemplateId,
    isLoadingTemplates,
    handleTemplateSelect,
    handleSaveTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    fetchTemplates,
  };
}
