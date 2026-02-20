import { useCallback, useState } from 'react';
import type { DigitalPage, DigitalPageData, DigitalPageType, PagePdfSettings } from '../types';

// =============================================================================
// HOOK INTERFACE
// =============================================================================

interface UseHeaderParams {
  // Page state
  localPages: DigitalPage[];
  setLocalPages: React.Dispatch<React.SetStateAction<DigitalPage[]>>;
  currentPageIndex: number;
  setCurrentPageIndex: React.Dispatch<React.SetStateAction<number>>;

  // Editor state
  pageData: Partial<DigitalPageData>;
  pageType: DigitalPageType;
  pdfSettings: PagePdfSettings;

  // Canvas state
  canvasDataUrl?: string;
  canvasWidth?: number;
  canvasHeight?: number;

  // Change tracking
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;

  // Issue ID
  issueId: string;

  // Callbacks
  onBack: () => void;

  // Redux hooks
  createPage: (data: any) => Promise<DigitalPage>;
  updatePage: (data: any) => Promise<void>;
}

interface UseHeaderReturn {
  // Navigation handlers
  goToPrevPage: () => void;
  goToNextPage: () => void;
  handleBack: () => void;

  // Page actions
  handleAddPage: () => Promise<void>;
  handleSavePage: () => Promise<void>;

  // Unsaved changes modal
  showUnsavedModal: boolean;
  unsavedContext: 'navigate' | 'back' | 'newPage';
  handleConfirmUnsaved: () => void;
  handleCancelUnsaved: () => void;
}

// =============================================================================
// DEFAULT PDF SETTINGS
// =============================================================================

const DEFAULT_SETTINGS: PagePdfSettings = {
  ratio: 'a4-portrait',
  backgroundColor: '#ffffff',
  margin: 0,
};

// =============================================================================
// HELPER FUNCTION - UPLOAD CANVAS TO STORAGE
// =============================================================================

const uploadCanvasToStorage = async (
  dataUrl: string | undefined,
  pageId: string | undefined,
  pageNumber: number,
  issueId: string
): Promise<string | undefined> => {
  if (!dataUrl) return undefined;

  // If it's already a Firebase URL, return it as-is
  if (dataUrl.includes('firebasestorage.googleapis.com')) {
    return dataUrl;
  }

  // If it's a base64 data URL, upload to Firebase Storage
  if (dataUrl.startsWith('data:image/')) {
    try {
      const response = await fetch('/api/digital-pages/upload-canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          canvasDataUrl: dataUrl,
          issueId,
          pageId,
          pageNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload canvas');
      }

      const result = await response.json();
      if (result.success && result.data?.canvasUrl) {
        return result.data.canvasUrl;
      }
    } catch (err) {
      console.error('Failed to upload canvas to storage:', err);
      throw err;
    }
  }

  return dataUrl;
};

// Helper to get default data for a page type
const getDefaultDigitalPageData = (pageType: DigitalPageType): Partial<DigitalPageData> => {
  // Import is done here to avoid circular dependencies
  // In production, you might want to import from the actual config file
  return {
    type: pageType,
    title: '',
    subtitle: '',
    image: '',
  };
};

// =============================================================================
// HOOK
// =============================================================================

export function useHeader(params: UseHeaderParams): UseHeaderReturn {
  const {
    localPages,
    setLocalPages,
    currentPageIndex,
    setCurrentPageIndex,
    pageData,
    pageType,
    pdfSettings,
    canvasDataUrl,
    canvasWidth,
    canvasHeight,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    issueId,
    onBack,
    createPage,
    updatePage,
  } = params;

  // ===========================================================================
  // MODAL STATE
  // ===========================================================================

  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [unsavedContext, setUnsavedContext] = useState<'navigate' | 'back' | 'newPage'>('navigate');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // ===========================================================================
  // NAVIGATION HANDLERS
  // ===========================================================================

  const goToPrevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      if (hasUnsavedChanges) {
        setUnsavedContext('navigate');
        setPendingAction(() => () => setCurrentPageIndex(prev => prev - 1));
        setShowUnsavedModal(true);
        return;
      }
      setCurrentPageIndex(prev => prev - 1);
    }
  }, [currentPageIndex, hasUnsavedChanges, setCurrentPageIndex]);

  const goToNextPage = useCallback(() => {
    if (currentPageIndex < localPages.length - 1) {
      if (hasUnsavedChanges) {
        setUnsavedContext('navigate');
        setPendingAction(() => () => setCurrentPageIndex(prev => prev + 1));
        setShowUnsavedModal(true);
        return;
      }
      setCurrentPageIndex(prev => prev + 1);
    }
  }, [currentPageIndex, localPages.length, hasUnsavedChanges, setCurrentPageIndex]);

  const handleBack = useCallback(() => {
    if (hasUnsavedChanges) {
      setUnsavedContext('back');
      setPendingAction(() => onBack);
      setShowUnsavedModal(true);
      return;
    }
    onBack();
  }, [hasUnsavedChanges, onBack]);

  // ===========================================================================
  // SAVE CURRENT PAGE TO FIRESTORE
  // ===========================================================================

  const handleSavePage = useCallback(async () => {
    if (currentPageIndex < 0) return;

    const page = localPages[currentPageIndex];
    const title = pageData.title || '';

    try {
      // Upload canvas to Firebase Storage if needed (converts base64 to URL)
      let canvasUrl = canvasDataUrl || page?.canvasDataUrl;
      if (canvasUrl && canvasUrl.startsWith('data:image/')) {
        canvasUrl = await uploadCanvasToStorage(
          canvasUrl,
          page?.id,
          page?.pageNumber || currentPageIndex + 1,
          issueId
        );
      }

      if (page && page.id) {
        // Update existing page
        await updatePage({
          id: page.id,
          issueId,
          pageNumber: page.pageNumber,
          pageType,
          pageData,
          pdfSettings,
          canvasDataUrl: canvasUrl,
          canvasWidth: canvasWidth || page.canvasWidth,
          canvasHeight: canvasHeight || page.canvasHeight,
          hasCanvas: !!canvasUrl || page.hasCanvas,
          title,
        });

        // Update local state
        setLocalPages(prev => prev.map((p, i) =>
          i === currentPageIndex
            ? {
                ...p,
                pageType,
                pageData,
                pdfSettings,
                canvasDataUrl: canvasUrl || p.canvasDataUrl,
                canvasWidth: canvasWidth || p.canvasWidth,
                canvasHeight: canvasHeight || p.canvasHeight,
                hasCanvas: !!canvasUrl || p.hasCanvas,
                title,
                updatedAt: new Date().toISOString(),
              }
            : p
        ));
      } else {
        // Create new page (should only happen for newly added pages)
        const newPage = await createPage({
          issueId,
          pageNumber: currentPageIndex + 1,
          pageType,
          pageData,
          pdfSettings,
          title,
        });

        // Update local state with new page
        setLocalPages(prev => prev.map((p, i) =>
          i === currentPageIndex ? newPage : p
        ));
      }

      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Failed to save page:', err);
    }
  }, [
    currentPageIndex,
    localPages,
    issueId,
    pageType,
    pageData,
    pdfSettings,
    canvasDataUrl,
    canvasWidth,
    canvasHeight,
    createPage,
    updatePage,
    setLocalPages,
    setHasUnsavedChanges,
  ]);

  // ===========================================================================
  // ADD NEW PAGE
  // ===========================================================================

  const handleAddPage = useCallback(async () => {
    // Check for unsaved changes
    if (hasUnsavedChanges) {
      setUnsavedContext('newPage');
      setPendingAction(() => async () => {
        // Execute the add page logic
        const newPageNumber = localPages.length + 1;
        const defaultType: DigitalPageType = 'image-with-caption';

        try {
          const newPage = await createPage({
            issueId,
            pageNumber: newPageNumber,
            pageType: defaultType,
            pageData: getDefaultDigitalPageData(defaultType),
            pdfSettings: DEFAULT_SETTINGS,
            title: '',
          });

          setLocalPages(prev => [...prev, newPage]);
          setCurrentPageIndex(localPages.length);
          setHasUnsavedChanges(false);
        } catch (err) {
          console.error('Failed to create page:', err);
        }
      });
      setShowUnsavedModal(true);
      return;
    }

    const newPageNumber = localPages.length + 1;
    const defaultType: DigitalPageType = 'image-with-caption';

    try {
      // Create new page in Firestore
      const newPage = await createPage({
        issueId,
        pageNumber: newPageNumber,
        pageType: defaultType,
        pageData: getDefaultDigitalPageData(defaultType),
        pdfSettings: DEFAULT_SETTINGS,
        title: '',
      });

      // Add to local state and navigate to it
      setLocalPages(prev => [...prev, newPage]);
      setCurrentPageIndex(localPages.length); // Navigate to new page (it will be at index localPages.length after update)
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Failed to create page:', err);
    }
  }, [hasUnsavedChanges, localPages.length, issueId, createPage, setLocalPages, setCurrentPageIndex, setHasUnsavedChanges]);

  // ===========================================================================
  // MODAL ACTION HANDLERS
  // ===========================================================================

  const handleConfirmUnsaved = useCallback(() => {
    setShowUnsavedModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const handleCancelUnsaved = useCallback(() => {
    setShowUnsavedModal(false);
    setPendingAction(null);
  }, []);

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    goToPrevPage,
    goToNextPage,
    handleBack,
    handleAddPage,
    handleSavePage,
    showUnsavedModal,
    unsavedContext,
    handleConfirmUnsaved,
    handleCancelUnsaved,
  };
}
