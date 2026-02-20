'use client';

/**
 * PdfManager - PDF Canvas Management View
 *
 * Displays all digital pages of an issue with their saved canvases.
 * Allows users to:
 * - View all saved canvases per page
 * - Preview canvas thumbnails
 * - Navigate to edit pages
 * - Select pages for combined PDF generation
 * - Generate combined multi-page PDF
 */

import React from 'react';
import DigitalPageCard from './DigitalPageCard';
import PDFManagerHeader from './PDFManagerHeader';
import { ErrorComponent } from '@/lib/pages/admin/components/shared/common';
import type { DigitalPage } from '../editor/types';
import { usePDFManager } from './usePDFManager';

// =============================================================================
// PROPS INTERFACE
// =============================================================================

interface PdfManagerProps {
  issueId: string;
  issueTitle: string;
  pages: DigitalPage[];
  onBack: () => void;
  onEditPage?: (page: DigitalPage) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function PdfManager({
  issueId,
  issueTitle,
  pages,
  onBack,
  onEditPage,
}: PdfManagerProps) {
  const {
    selectedPageIds,
    pagesWithCanvas,
    selectedPagesWithCanvas,
    allSelected,
    isGenerating,
    progress,
    error,
    handleSelectionChange,
    handleToggleAll,
    handleGenerateCombinedPdf,
  } = usePDFManager({ issueId, pages });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <PDFManagerHeader
          issueTitle={issueTitle}
          onBack={onBack}
          pagesWithCanvasCount={pagesWithCanvas.length}
          selectedCount={selectedPagesWithCanvas.length}
          allSelected={allSelected}
          isGenerating={isGenerating}
          progress={progress}
          onToggleAll={handleToggleAll}
          onGeneratePdf={handleGenerateCombinedPdf}
        />

        {/* Error display */}
        {error && (
          <ErrorComponent message={error} className="mx-6 mt-4" />
        )}

        {/* Digital Page Cards Grid */}
        <div className="p-6">
          {pages.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No digital pages
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No digital pages found for this issue. Create pages using the
                editor.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pages.map((page) => (
                <DigitalPageCard
                  key={page.id}
                  page={page}
                  issueId={issueId}
                  onEdit={onEditPage}
                  isSelected={selectedPageIds.has(page.id)}
                  onSelectionChange={handleSelectionChange}
                  showSelection={pagesWithCanvas.length > 0}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {pages.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {pages.length} page{pages.length !== 1 ? 's' : ''} in this issue
              </p>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  {pages.filter((p) => p.hasCanvas).length} with canvas
                </span>
                <span className="inline-flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                  {pages.filter((p) => !p.hasCanvas).length} pending
                </span>
                {selectedPagesWithCanvas.length > 0 && (
                  <span className="inline-flex items-center text-sm text-indigo-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                    {selectedPagesWithCanvas.length} selected
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
