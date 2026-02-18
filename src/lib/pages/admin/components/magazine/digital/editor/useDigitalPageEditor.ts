import { useState, useCallback, useRef, useEffect } from 'react';
import { useHeader } from './header';
import { useDigitalPagePdf } from './content-generation';
import { useCanvasPreview } from './content-generation/canvas';
import { getDefaultDigitalPageData } from '@/lib/pages/admin/config/digitalPreviewComponents';
import { getExampleDataForPageType } from '@/lib/pages/admin/config/fields/digital';
import { useDigitalPagesRedux } from '../useDigitalPagesRedux';
import type {
  DigitalPageData,
  DigitalPageType,
  PagePdfSettings,
  DigitalPage,
} from './types';

// =============================================================================
// DEFAULT PDF SETTINGS
// =============================================================================

const DEFAULT_SETTINGS: PagePdfSettings = {
  ratio: 'a4-portrait',
  backgroundColor: '#ffffff',
  margin: 0,
};

// =============================================================================
// HOOK INTERFACE
// =============================================================================

interface UseDigitalPageEditorParams {
  issueId: string;
  initialPages: DigitalPage[];
  initialPageIndex?: number;
  onBack: () => void;
}

interface UseDigitalPageEditorReturn {
  // Page state
  localPages: DigitalPage[];
  currentPageIndex: number;
  currentPage: DigitalPage | null;
  showEmptyState: boolean;

  // Editor state
  pageData: Partial<DigitalPageData>;
  pageType: DigitalPageType;
  pdfSettings: PagePdfSettings;
  showPdfConfig: boolean;
  setShowPdfConfig: (show: boolean) => void;
  previewScale: number;
  setPreviewScale: (scale: number) => void;
  hasUnsavedChanges: boolean;

  // Canvas state
  canvasRef: React.RefObject<HTMLDivElement | null>;
  canvasDataUrl: string | null;
  isGeneratingPreview: boolean;
  previewProgress: string;
  previewError: string | null;

  // PDF state
  isGeneratingPdf: boolean;
  pdfProgress: string;
  pdfError: string | null;

  // CRUD state
  isSaving: boolean;

  // Navigation handlers (from header hook)
  goToPrevPage: () => void;
  goToNextPage: () => void;
  handleBack: () => void;
  handleAddPage: () => Promise<void>;
  handleSavePage: () => Promise<void>;

  // Unsaved changes modal
  showUnsavedModal: boolean;
  unsavedContext: 'navigate' | 'back' | 'newPage';
  handleConfirmUnsaved: () => void;
  handleCancelUnsaved: () => void;

  // Editor handlers
  handleDataChange: (data: Partial<DigitalPageData>) => void;
  handlePageTypeChange: (newType: DigitalPageType) => void;
  handlePdfSettingsChange: (settings: PagePdfSettings) => void;
  handleGeneratePreview: () => Promise<void>;
  handleGenerateExample: () => Promise<void>;
  handleGeneratePdf: () => Promise<void>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useDigitalPageEditor({
  issueId,
  initialPages,
  initialPageIndex = 0,
  onBack,
}: UseDigitalPageEditorParams): UseDigitalPageEditorReturn {
  // ===========================================================================
  // REDUX HOOK
  // ===========================================================================

  const {
    createPage,
    updatePage,
    isSaving,
  } = useDigitalPagesRedux(issueId);

  // ===========================================================================
  // STATE
  // ===========================================================================

  // Multi-page state
  const [localPages, setLocalPages] = useState<DigitalPage[]>(initialPages);
  const [currentPageIndex, setCurrentPageIndex] = useState(
    initialPages.length > 0 ? Math.min(initialPageIndex, initialPages.length - 1) : -1
  );

  // Current page data
  const currentPage = currentPageIndex >= 0 ? localPages[currentPageIndex] : null;

  // Editor state for current page
  const [pageData, setPageData] = useState<Partial<DigitalPageData>>(() => {
    if (currentPage) {
      return currentPage.pageData;
    }
    return getDefaultDigitalPageData('image-with-caption');
  });
  const [pageType, setPageType] = useState<DigitalPageType>(
    currentPage?.pageType || 'image-with-caption'
  );
  const [pdfSettings, setPdfSettings] = useState<PagePdfSettings>(
    currentPage?.pdfSettings || DEFAULT_SETTINGS
  );
  const [showPdfConfig, setShowPdfConfig] = useState(true);
  const [previewScale, setPreviewScale] = useState(0.5);

  // Track if current page has unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);

  // ===========================================================================
  // HOOKS
  // ===========================================================================

  // PDF generation hook
  const {
    generatePdf,
    isGenerating: isGeneratingPdf,
    progress: pdfProgress,
    error: pdfError,
  } = useDigitalPagePdf();

  // Canvas preview hook
  const {
    canvasDataUrl,
    isGenerating: isGeneratingPreview,
    progress: previewProgress,
    error: previewError,
    generatePreview,
    clearPreview,
    setPreviewFromUrl,
    canvasWidth,
    canvasHeight,
  } = useCanvasPreview();

  // Header hook for navigation and page actions
  const {
    goToPrevPage,
    goToNextPage,
    handleBack,
    handleAddPage,
    handleSavePage,
    showUnsavedModal,
    unsavedContext,
    handleConfirmUnsaved,
    handleCancelUnsaved,
  } = useHeader({
    localPages,
    setLocalPages,
    currentPageIndex,
    setCurrentPageIndex,
    pageData,
    pageType,
    pdfSettings,
    canvasDataUrl: canvasDataUrl || undefined,
    canvasWidth,
    canvasHeight,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    issueId,
    onBack,
    createPage,
    updatePage,
  });

  // ===========================================================================
  // EFFECTS
  // ===========================================================================

  // Update editor state when page index changes
  useEffect(() => {
    if (currentPageIndex >= 0 && localPages[currentPageIndex]) {
      const page = localPages[currentPageIndex];
      setPageData(page.pageData);
      setPageType(page.pageType);
      setPdfSettings(page.pdfSettings);
      setHasUnsavedChanges(false);

      // Load saved canvas if available, otherwise clear
      if (page.canvasDataUrl) {
        setPreviewFromUrl(page.canvasDataUrl, page.canvasWidth, page.canvasHeight);
      } else {
        clearPreview();
      }
    }
  }, [currentPageIndex, localPages, setPreviewFromUrl, clearPreview]);

  // NOTE: Removed useEffect that cleared preview on pageType change.
  // This was causing saved canvas to be cleared when loading a page.
  // Instead, clearPreview is called in handlePageTypeChange when user
  // manually changes the page type.

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  // Handle data changes from PageCreator
  const handleDataChange = useCallback((data: Partial<DigitalPageData>) => {
    setPageData(data);
    setHasUnsavedChanges(true);
  }, []);

  // Handle page type changes (user manually changing via dropdown)
  const handlePageTypeChange = useCallback((newType: DigitalPageType) => {
    setPageType(newType);
    setHasUnsavedChanges(true);
    // Clear preview when user manually changes page type
    // (the old preview no longer matches the new page type)
    clearPreview();
  }, [clearPreview]);

  // Handle PDF settings changes
  const handlePdfSettingsChange = useCallback((settings: PagePdfSettings) => {
    setPdfSettings(settings);
    setHasUnsavedChanges(true);
    clearPreview();
  }, [clearPreview]);

  // Handle preview generation
  const handleGeneratePreview = useCallback(async () => {
    await generatePreview(pageData, pageType, pdfSettings, {
      pageNumber: currentPageIndex + 1,
      totalPages: localPages.length
    });
  }, [generatePreview, pageData, pageType, pdfSettings, currentPageIndex, localPages.length]);

  // Handle preview generation from example data
  const handleGenerateExample = useCallback(async () => {
    const exampleData = getExampleDataForPageType(pageType);
    setPageData(exampleData);
    setHasUnsavedChanges(true);
    await generatePreview(exampleData, pageType, pdfSettings);
  }, [generatePreview, pageType, pdfSettings]);

  // Handle PDF generation
  const handleGeneratePdf = useCallback(async () => {
    if (!canvasDataUrl) {
      console.warn('No preview generated - generate preview first');
      return;
    }

    const pageNum = currentPageIndex + 1;
    const fileName = pageData.title
      ? `page-${pageNum}-${pageData.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`
      : `page-${pageNum}.pdf`;

    await generatePdf(canvasDataUrl, fileName, pdfSettings);
  }, [generatePdf, canvasDataUrl, pageData.title, pdfSettings, currentPageIndex]);

  // ===========================================================================
  // COMPUTED VALUES
  // ===========================================================================

  // Show empty state if no pages exist and we're not creating one
  const showEmptyState = localPages.length === 0 && currentPageIndex < 0;

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    // Page state
    localPages,
    currentPageIndex,
    currentPage,
    showEmptyState,

    // Editor state
    pageData,
    pageType,
    pdfSettings,
    showPdfConfig,
    setShowPdfConfig,
    previewScale,
    setPreviewScale,
    hasUnsavedChanges,

    // Canvas state
    canvasRef,
    canvasDataUrl,
    isGeneratingPreview,
    previewProgress,
    previewError,

    // PDF state
    isGeneratingPdf,
    pdfProgress,
    pdfError,

    // CRUD state
    isSaving,

    // Navigation handlers
    goToPrevPage,
    goToNextPage,
    handleBack,
    handleAddPage,
    handleSavePage,

    // Unsaved changes modal
    showUnsavedModal,
    unsavedContext,
    handleConfirmUnsaved,
    handleCancelUnsaved,

    // Editor handlers
    handleDataChange,
    handlePageTypeChange,
    handlePdfSettingsChange,
    handleGeneratePreview,
    handleGenerateExample,
    handleGeneratePdf,
  };
}
