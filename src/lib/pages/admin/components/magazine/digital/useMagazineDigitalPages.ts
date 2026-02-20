import { useState, useCallback, useMemo } from 'react';
import { useDigitalPagesRedux } from './useDigitalPagesRedux';
import type { DigitalPage } from './editor/types';

interface UseMagazineDigitalPagesProps {
  issueId: string;
}

interface UseMagazineDigitalPagesReturn {
  // Data from Redux
  pages: DigitalPage[];
  pagesWithCanvasStatus: (DigitalPage & { canvasStatus: string; canvasName: string })[];
  lastUpdated: number | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;

  // View states
  showPdfManager: boolean;
  showEditor: boolean;
  editingPageIndex: number;
  showBatchUpload: boolean;

  // View state setters
  setShowPdfManager: (show: boolean) => void;
  setShowEditor: (show: boolean) => void;
  setShowBatchUpload: (show: boolean) => void;

  // Operations from Redux
  fetchPages: () => Promise<void>;
  batchUpload: (pages: Partial<DigitalPage>[]) => Promise<void>;

  // Handlers
  handleDeleteWithConfirm: (page: DigitalPage) => Promise<void>;
  handleEdit: (page: DigitalPage) => void;
  handleMoveUp: (page: DigitalPage) => Promise<void>;
  handleMoveDown: (page: DigitalPage) => Promise<void>;
  handleCreatePDFs: () => void;
  handleBackFromEditor: () => void;
  handleEditFromPdfManager: (page: DigitalPage) => void;
}

export function useMagazineDigitalPages({
  issueId
}: UseMagazineDigitalPagesProps): UseMagazineDigitalPagesReturn {
  const {
    pages,
    lastUpdated,
    isLoading,
    error,
    isSaving,
    isDeleting,
    fetchPages,
    deletePage,
    batchUpload,
    reorderPages,
  } = useDigitalPagesRedux(issueId);

  // View states
  const [showPdfManager, setShowPdfManager] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPageIndex, setEditingPageIndex] = useState(0);
  const [showBatchUpload, setShowBatchUpload] = useState(false);

  // Transform pages to compute canvasStatus and canvasName for table display
  const pagesWithCanvasStatus = useMemo(() => {
    return pages.map(page => ({
      ...page,
      // Compute canvasStatus string for badge display
      canvasStatus: (page.canvasDataUrl && typeof page.canvasDataUrl === 'string' && page.canvasDataUrl.length > 0)
        ? 'Generated'
        : 'Not Generated',
      // Extract canvasName from pageData, or use empty string if not set
      canvasName: page.pageData?.canvasName || ''
    }));
  }, [pages]);

  // Handle delete with confirmation
  const handleDeleteWithConfirm = useCallback(async (page: DigitalPage) => {
    if (!confirm(`Are you sure you want to delete Page ${page.pageNumber}? This cannot be undone.`)) {
      return;
    }
    try {
      await deletePage(page.id);
    } catch (err) {
      console.error('Failed to delete page:', err);
    }
  }, [deletePage]);

  // Handle edit - navigate to editor at specific page
  const handleEdit = useCallback((page: DigitalPage) => {
    const index = pages.findIndex(p => p.id === page.id);
    setEditingPageIndex(index >= 0 ? index : 0);
    setShowEditor(true);
  }, [pages]);

  // Handle move up - swap with previous page
  const handleMoveUp = useCallback(async (page: DigitalPage) => {
    const currentIndex = pages.findIndex(p => p.id === page.id);
    if (currentIndex <= 0) return; // Already at top

    // Create new order by swapping with previous
    const newOrder = [...pages];
    [newOrder[currentIndex - 1], newOrder[currentIndex]] =
      [newOrder[currentIndex], newOrder[currentIndex - 1]];

    try {
      await reorderPages(newOrder.map(p => p.id));
    } catch (err) {
      console.error('Failed to reorder pages:', err);
    }
  }, [pages, reorderPages]);

  // Handle move down - swap with next page
  const handleMoveDown = useCallback(async (page: DigitalPage) => {
    const currentIndex = pages.findIndex(p => p.id === page.id);
    if (currentIndex < 0 || currentIndex >= pages.length - 1) return; // Already at bottom

    // Create new order by swapping with next
    const newOrder = [...pages];
    [newOrder[currentIndex], newOrder[currentIndex + 1]] =
      [newOrder[currentIndex + 1], newOrder[currentIndex]];

    try {
      await reorderPages(newOrder.map(p => p.id));
    } catch (err) {
      console.error('Failed to reorder pages:', err);
    }
  }, [pages, reorderPages]);

  // Handle create PDFs - open editor in create mode
  const handleCreatePDFs = useCallback(() => {
    setEditingPageIndex(pages.length > 0 ? pages.length : 0);
    setShowEditor(true);
  }, [pages.length]);

  // Handle back from editor
  const handleBackFromEditor = useCallback(() => {
    setShowEditor(false);
  }, []);

  // Handle edit from PDF Manager - close manager, open editor
  const handleEditFromPdfManager = useCallback((page: DigitalPage) => {
    const index = pages.findIndex(p => p.id === page.id);
    setEditingPageIndex(index >= 0 ? index : 0);
    setShowPdfManager(false);
    setShowEditor(true);
  }, [pages]);

  return {
    // Data
    pages,
    pagesWithCanvasStatus,
    lastUpdated,
    isLoading,
    error,
    isSaving,
    isDeleting,

    // View states
    showPdfManager,
    showEditor,
    editingPageIndex,
    showBatchUpload,

    // View state setters
    setShowPdfManager,
    setShowEditor,
    setShowBatchUpload,

    // Operations
    fetchPages,
    batchUpload,

    // Handlers
    handleDeleteWithConfirm,
    handleEdit,
    handleMoveUp,
    handleMoveDown,
    handleCreatePDFs,
    handleBackFromEditor,
    handleEditFromPdfManager,
  };
}
