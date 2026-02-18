import { useState, useMemo, useCallback } from 'react';
import { useCombinedPdf } from './useCombinedPdf';
import type { DigitalPage } from '../editor/types';

// =============================================================================
// HOOK INTERFACE
// =============================================================================

interface UsePDFManagerParams {
  issueId: string;
  pages: DigitalPage[];
}

interface UsePDFManagerReturn {
  // Selection state
  selectedPageIds: Set<string>;

  // Derived data
  pagesWithCanvas: DigitalPage[];
  selectedPagesWithCanvas: DigitalPage[];
  allSelected: boolean;

  // Combined PDF state
  isGenerating: boolean;
  progress: string;
  error: string | null;

  // Handlers
  handleSelectionChange: (pageId: string, selected: boolean) => void;
  handleToggleAll: () => void;
  handleGenerateCombinedPdf: () => Promise<void>;
}

// =============================================================================
// HOOK
// =============================================================================

export function usePDFManager({
  issueId,
  pages,
}: UsePDFManagerParams): UsePDFManagerReturn {
  // Selection state
  const [selectedPageIds, setSelectedPageIds] = useState<Set<string>>(new Set());

  // Combined PDF hook
  const { generateCombinedPdf, isGenerating, progress, error } = useCombinedPdf();

  // Pages with canvas (can be included in PDF)
  const pagesWithCanvas = useMemo(
    () => pages.filter((p) => p.hasCanvas && p.canvasDataUrl),
    [pages]
  );

  // Selected pages with canvas
  const selectedPagesWithCanvas = useMemo(
    () => pagesWithCanvas.filter((p) => selectedPageIds.has(p.id)),
    [pagesWithCanvas, selectedPageIds]
  );

  // All pages with canvas selected?
  const allSelected =
    pagesWithCanvas.length > 0 &&
    pagesWithCanvas.every((p) => selectedPageIds.has(p.id));

  // Toggle page selection
  const handleSelectionChange = useCallback((pageId: string, selected: boolean) => {
    setSelectedPageIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(pageId);
      } else {
        next.delete(pageId);
      }
      return next;
    });
  }, []);

  // Select/deselect all pages with canvas
  const handleToggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedPageIds(new Set());
    } else {
      setSelectedPageIds(new Set(pagesWithCanvas.map((p) => p.id)));
    }
  }, [allSelected, pagesWithCanvas]);

  // Generate combined PDF
  const handleGenerateCombinedPdf = useCallback(async () => {
    if (selectedPagesWithCanvas.length === 0) return;

    // Sort by page number before generating
    const sortedPages = [...selectedPagesWithCanvas].sort(
      (a, b) => a.pageNumber - b.pageNumber
    );

    const fileName = `glamlink-edit-${issueId}.pdf`;
    await generateCombinedPdf(sortedPages, fileName);
  }, [selectedPagesWithCanvas, issueId, generateCombinedPdf]);

  return {
    // Selection state
    selectedPageIds,

    // Derived data
    pagesWithCanvas,
    selectedPagesWithCanvas,
    allSelected,

    // Combined PDF state
    isGenerating,
    progress,
    error,

    // Handlers
    handleSelectionChange,
    handleToggleAll,
    handleGenerateCombinedPdf,
  };
}
