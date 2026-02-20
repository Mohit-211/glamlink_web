import { useState, useEffect, useCallback } from 'react';
import { getSectionRegistryItem } from '@/lib/features/display-cms/sectionRegistry';
import { getDefaultSectionContent } from '@/lib/features/display-cms/utils/getDefaultSectionContent';

interface UsePageContentEditorProps {
  pageType: string;
  initialConfig: any;
  defaultSections: any[];
  onSave: (config: any) => Promise<void>;
}

interface UsePageContentEditorReturn {
  // State
  config: any;
  hasChanges: boolean;
  showSuccess: boolean;
  editingSection: any;
  showSectionPicker: boolean;
  showBatchModal: boolean;
  existingSectionTypes: string[];
  sectionCount: number;

  // State setters
  setEditingSection: (section: any) => void;
  setShowSectionPicker: (show: boolean) => void;
  setShowBatchModal: (show: boolean) => void;

  // Actions
  handleLoadDefaults: () => void;
  updateBanner: (banner: any) => void;
  toggleSSG: () => void;
  addSection: (sectionType: string) => void;
  updateSection: (updatedSection: any) => void;
  deleteSection: (sectionId: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: 'up' | 'down') => void;
  handleSave: () => Promise<void>;
  handleReset: () => void;
  handleBatchUpload: (items: any[]) => Promise<void>;
}

/**
 * Hook for managing page content editor state and actions
 *
 * Extracts all business logic from PageContentEditor component
 * for cleaner separation of concerns.
 */
export function usePageContentEditor({
  pageType,
  initialConfig,
  defaultSections,
  onSave
}: UsePageContentEditorProps): UsePageContentEditorReturn {
  const [config, setConfig] = useState<any>(initialConfig || { sections: [], ssgEnabled: false });
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);

  // Update config when initialConfig changes
  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
      setHasChanges(false);
    }
  }, [initialConfig]);

  // Load defaults
  const handleLoadDefaults = useCallback(() => {
    const newConfig = {
      ...config,
      sections: defaultSections
    };
    setConfig(newConfig);
    setHasChanges(true);
  }, [defaultSections, config]);

  // Update banner
  const updateBanner = useCallback((banner: any) => {
    setConfig((prev: any) => ({ ...prev, banner }));
    setHasChanges(true);
  }, []);

  // Toggle SSG
  const toggleSSG = useCallback(() => {
    setConfig((prev: any) => ({ ...prev, ssgEnabled: !prev.ssgEnabled }));
    setHasChanges(true);
  }, []);

  // Add section
  const addSection = useCallback((sectionType: string) => {
    // Get section info from registry
    const registryItem = getSectionRegistryItem(sectionType);
    if (!registryItem) {
      console.error(`Section type "${sectionType}" not found in registry`);
      return;
    }

    // Get default section with populated content
    const order = (config.sections?.length || 0) + 1;
    const newSection = getDefaultSectionContent(pageType as any, sectionType, order);

    // Ensure the section has the registry label as its name
    newSection.name = registryItem.label;

    setConfig((prev: any) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection]
    }));
    setHasChanges(true);
    setShowSectionPicker(false);
  }, [config.sections?.length, pageType]);

  // Update section
  const updateSection = useCallback((updatedSection: any) => {
    setConfig((prev: any) => ({
      ...prev,
      sections: prev.sections.map((s: any) =>
        s.id === updatedSection.id ? updatedSection : s
      )
    }));
    setHasChanges(true);
    setEditingSection(null);
  }, []);

  // Delete section
  const deleteSection = useCallback((sectionId: string) => {
    setConfig((prev: any) => ({
      ...prev,
      sections: prev.sections.filter((s: any) => s.id !== sectionId)
    }));
    setHasChanges(true);
  }, []);

  // Toggle section visibility
  const toggleSectionVisibility = useCallback((sectionId: string) => {
    setConfig((prev: any) => ({
      ...prev,
      sections: prev.sections.map((s: any) =>
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      )
    }));
    setHasChanges(true);
  }, []);

  // Move section
  const moveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
    setConfig((prev: any) => {
      const sections = [...prev.sections];
      const index = sections.findIndex((s: any) => s.id === sectionId);

      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === sections.length - 1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];

      // Update order values
      sections.forEach((s, i) => {
        s.order = i + 1;
      });

      return { ...prev, sections };
    });
    setHasChanges(true);
  }, []);

  // Save
  const handleSave = useCallback(async () => {
    await onSave(config);
    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [config, onSave]);

  // Reset
  const handleReset = useCallback(() => {
    if (!confirm('Discard all changes?')) return;
    setConfig(initialConfig || { sections: [], ssgEnabled: false });
    setHasChanges(false);
  }, [initialConfig]);

  // Batch upload
  const handleBatchUpload = useCallback(async (items: any[]) => {
    if (items.length > 0) {
      setConfig(items[0]);
      setHasChanges(true);
    }
  }, []);

  const existingSectionTypes = (config.sections || []).map((s: any) => s.type);
  const sectionCount = config.sections?.length || 0;

  return {
    // State
    config,
    hasChanges,
    showSuccess,
    editingSection,
    showSectionPicker,
    showBatchModal,
    existingSectionTypes,
    sectionCount,

    // State setters
    setEditingSection,
    setShowSectionPicker,
    setShowBatchModal,

    // Actions
    handleLoadDefaults,
    updateBanner,
    toggleSSG,
    addSection,
    updateSection,
    deleteSection,
    toggleSectionVisibility,
    moveSection,
    handleSave,
    handleReset,
    handleBatchUpload
  };
}
