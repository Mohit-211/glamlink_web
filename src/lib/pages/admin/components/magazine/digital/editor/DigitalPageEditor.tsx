'use client';

/**
 * DigitalPageEditor - Multi-Page Editor Component
 *
 * Supports creating and editing multiple digital pages with:
 * - Page navigation (Previous/Next buttons at bottom)
 * - Add Page button for creating new pages
 * - Save Page button to persist changes to Firestore
 * - Per-page PDF settings
 * - Canvas preview and PDF generation
 */

import React from 'react';
import PageCreator from './page-creator/PageCreator';
import DigitalPageCanvas from './DigitalPageCanvas';
import PdfConfigPanel from './pdf-config/PdfConfigPanel';
import { PageNavigation, MainHeader } from './header';
import { useDigitalPageEditor } from './useDigitalPageEditor';
import type { DigitalPage } from './types';

// =============================================================================
// PROPS INTERFACE
// =============================================================================

interface DigitalPageEditorProps {
  issueId: string;
  pages: DigitalPage[];
  initialPageIndex?: number;
  onBack: () => void;
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function DigitalPageEditor({
  issueId,
  pages,
  initialPageIndex = 0,
  onBack,
  className = '',
}: DigitalPageEditorProps) {
  // Use editor hook for all logic
  const {
    localPages,
    currentPageIndex,
    currentPage,
    showEmptyState,
    pageData,
    pageType,
    pdfSettings,
    showPdfConfig,
    setShowPdfConfig,
    previewScale,
    setPreviewScale,
    hasUnsavedChanges,
    canvasRef,
    canvasDataUrl,
    isGeneratingPreview,
    previewProgress,
    previewError,
    isGeneratingPdf,
    pdfProgress,
    pdfError,
    isSaving,
    goToPrevPage,
    goToNextPage,
    handleBack,
    handleAddPage,
    handleSavePage,
    showUnsavedModal,
    unsavedContext,
    handleConfirmUnsaved,
    handleCancelUnsaved,
    handleDataChange,
    handlePageTypeChange,
    handlePdfSettingsChange,
    handleGeneratePreview,
    handleGenerateExample,
    handleGeneratePdf,
  } = useDigitalPageEditor({
    issueId,
    initialPages: pages,
    initialPageIndex,
    onBack,
  });

  // Prepare current page data for ManageLayoutsModal
  const currentPageData = {
    pageType,
    pdfSettings,
    pageData,
    canvasDataUrl: canvasDataUrl || undefined,
  };

  // Prepare available pages for link object internal page selection
  const availablePages = localPages.map(page => ({
    id: page.id,
    pageNumber: page.pageNumber,
    title: page.title || page.pageData?.title as string | undefined,
    pageType: page.pageType,
  }));

  return (
    <div className={`flex flex-col h-full bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200">
        {/* Row 1 - Page Navigation (centered) */}
        <PageNavigation
          totalPages={localPages.length}
          currentPageIndex={currentPageIndex}
          onPrevious={goToPrevPage}
          onNext={goToNextPage}
        />

        {/* Row 2 - Main header with title and actions */}
        <MainHeader
          onBack={handleBack}
          totalPages={localPages.length}
          currentPageIndex={currentPageIndex}
          hasUnsavedChanges={hasUnsavedChanges}
          previewScale={previewScale}
          onPreviewScaleChange={setPreviewScale}
          showPdfConfig={showPdfConfig}
          onTogglePdfConfig={() => setShowPdfConfig(!showPdfConfig)}
          onAddPage={handleAddPage}
          onSavePage={handleSavePage}
          isSaving={isSaving}
          onGeneratePdf={handleGeneratePdf}
          isGeneratingPdf={isGeneratingPdf}
          pdfProgress={pdfProgress}
          hasCanvas={!!canvasDataUrl}
          pdfError={pdfError}
          previewError={previewError}
          isGeneratingPreview={isGeneratingPreview}
          issueId={issueId}
          currentPageData={currentPageData}
          showUnsavedModal={showUnsavedModal}
          unsavedContext={unsavedContext}
          onConfirmUnsaved={handleConfirmUnsaved}
          onCancelUnsaved={handleCancelUnsaved}
        />
      </div>

      {/* Empty State */}
      {showEmptyState ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pages yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first page.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleAddPage}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create First Page
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Main Content - Single scroll container for all panels */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex min-h-full">
              {/* Left Panel - Editor (content determines scroll height) */}
              <div className="w-2/5 min-w-[400px] max-w-[560px] max-h-[700px] border-r border-gray-200 bg-white p-6">
                <PageCreator
                  initialData={pageData}
                  initialPageType={pageType}
                  onDataChange={handleDataChange}
                  onPageTypeChange={handlePageTypeChange}
                  onPdfSettingsChange={handlePdfSettingsChange}
                  issueId={issueId}
                  pdfSettings={pdfSettings}
                  pageId={currentPage?.id}
                  availablePages={availablePages}
                />
              </div>

              {/* Center Panel - Preview (sticky - stays visible while scrolling) */}
              <div className="flex-1 p-6">
                <div className="sticky top-6 flex justify-center">
                  <DigitalPageCanvas
                    ref={canvasRef}
                    canvasDataUrl={canvasDataUrl}
                    pdfSettings={pdfSettings}
                    scale={previewScale}
                    showBorder={true}
                    isGenerating={isGeneratingPreview}
                    progress={previewProgress}
                    error={previewError}
                    onGenerate={handleGeneratePreview}
                    onGenerateExample={handleGenerateExample}
                    pageType={pageType}
                    objects={pageData.objects}
                  />
                </div>
              </div>

              {/* Right Panel - PDF Config (sticky - stays visible while scrolling) */}
              {showPdfConfig && (
                <div className="w-72 border-l border-gray-200 bg-white p-4">
                  <div className="sticky top-4">
                    <PdfConfigPanel
                      pdfSettings={pdfSettings}
                      onChange={handlePdfSettingsChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
