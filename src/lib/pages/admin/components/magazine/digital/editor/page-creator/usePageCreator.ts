import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  getDigitalPreviewComponent,
  getDefaultDigitalPageData,
} from '@/lib/pages/admin/config/digitalPreviewComponents';
import type { DigitalPageData, DigitalPageType, PagePdfSettings } from '../types';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import type { DigitalLayout } from '@/lib/pages/admin/types/digitalLayouts';

// =============================================================================
// TAB TYPES
// =============================================================================

export type EditorTab = 'form' | 'json' | 'canvas';

// =============================================================================
// HOOK INTERFACE
// =============================================================================

interface UsePageCreatorParams {
  initialData?: Partial<DigitalPageData>;
  initialPageType?: DigitalPageType;
  onDataChange: (data: Partial<DigitalPageData>) => void;
  onPageTypeChange: (pageType: DigitalPageType) => void;
  onPdfSettingsChange?: (settings: PagePdfSettings) => void;
  pageId?: string;  // Actual page.id from parent
}

interface UsePageCreatorReturn {
  // State
  activeTab: EditorTab;
  setActiveTab: (tab: EditorTab) => void;
  selectedPageType: DigitalPageType;
  formKey: string;

  // Computed values
  previewConfig: ReturnType<typeof getDigitalPreviewComponent>;
  fields: FieldConfig[];
  mergedInitialData: Partial<DigitalPageData>;

  // Handlers
  handlePageTypeChange: (newType: DigitalPageType) => void;
  handleFieldChange: (name: string, value: any, data: Partial<DigitalPageData>) => void;
  handleJsonApply: (data: Partial<DigitalPageData>) => void;
  handleLoadLayout: (layout: DigitalLayout) => void;
}

// =============================================================================
// HOOK
// =============================================================================

export function usePageCreator({
  initialData,
  initialPageType = 'image-with-caption',
  onDataChange,
  onPageTypeChange,
  onPdfSettingsChange,
  pageId,
}: UsePageCreatorParams): UsePageCreatorReturn {
  // ===========================================================================
  // STATE
  // ===========================================================================

  const [activeTab, setActiveTab] = useState<EditorTab>('form');
  const [selectedPageType, setSelectedPageType] = useState<DigitalPageType>(initialPageType);

  // ===========================================================================
  // SYNC EFFECTS
  // ===========================================================================

  // Sync internal state when props change (e.g., when navigating between pages)
  useEffect(() => {
    // Always update selectedPageType when initialPageType changes
    setSelectedPageType(initialPageType);
  }, [initialPageType]);

  // Computed formKey based on page ID + type to force FormProvider reset on page navigation
  // This ensures the form always updates when switching pages, even between same-type pages
  // Use pageId from parent (page.id, not pageData.id) to ensure sync with initialData
  const formKey = useMemo(() => {
    return `${pageId || 'new'}-${selectedPageType}`;
  }, [pageId, selectedPageType]);

  // ===========================================================================
  // COMPUTED VALUES
  // ===========================================================================

  // Get fields for the selected page type
  const previewConfig = getDigitalPreviewComponent(selectedPageType);
  const fields = previewConfig?.fields || [];

  // Get initial data, merging with defaults
  const mergedInitialData = useMemo(() => {
    const defaults = getDefaultDigitalPageData(selectedPageType);
    return { ...defaults, ...initialData, type: selectedPageType };
  }, [initialData, selectedPageType]);

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  // Handle page type change
  const handlePageTypeChange = useCallback(
    (newType: DigitalPageType) => {
      setSelectedPageType(newType);
      onPageTypeChange(newType);

      // Reset form with new defaults
      // formKey will auto-update via useMemo when selectedPageType changes
      const newDefaults = getDefaultDigitalPageData(newType);
      onDataChange(newDefaults);
    },
    [onPageTypeChange, onDataChange]
  );

  // Handle field changes from form
  const handleFieldChange = useCallback(
    (name: string, value: any, data: Partial<DigitalPageData>) => {
      onDataChange(data);
    },
    [onDataChange]
  );

  // Handle JSON apply
  const handleJsonApply = useCallback(
    (data: Partial<DigitalPageData>) => {
      onDataChange(data);
      // formKey will auto-update if the data contains a new ID
    },
    [onDataChange]
  );

  // Handle layout selection from saved layouts
  const handleLoadLayout = useCallback(
    (layout: DigitalLayout) => {
      const { pageType, pdfSettings: layoutPdfSettings, pageData } = layout.layoutData;

      // Update page type (triggers field config reload)
      setSelectedPageType(pageType);
      onPageTypeChange(pageType);

      // Update form data
      onDataChange({
        ...pageData,
        type: pageType
      });

      // Update PDF settings if callback provided
      if (onPdfSettingsChange && layoutPdfSettings) {
        onPdfSettingsChange(layoutPdfSettings);
      }
    },
    [onPageTypeChange, onDataChange, onPdfSettingsChange]
  );

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    activeTab,
    setActiveTab,
    selectedPageType,
    formKey,
    previewConfig,
    fields,
    mergedInitialData,
    handlePageTypeChange,
    handleFieldChange,
    handleJsonApply,
    handleLoadLayout,
  };
}
