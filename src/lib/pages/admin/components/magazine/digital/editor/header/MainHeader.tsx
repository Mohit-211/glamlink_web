'use client';

import React, { useState } from 'react';
import ManageLayoutsModal from './ManageLayoutsModal';
import UnsavedChangesModal from '../UnsavedChangesModal';
import type { CurrentPageData } from '@/lib/pages/admin/types/digitalLayouts';

// =============================================================================
// PROPS INTERFACE
// =============================================================================

interface MainHeaderProps {
  onBack: () => void;
  totalPages: number;
  currentPageIndex: number;
  hasUnsavedChanges: boolean;
  previewScale: number;
  onPreviewScaleChange: (scale: number) => void;
  showPdfConfig: boolean;
  onTogglePdfConfig: () => void;
  onAddPage: () => Promise<void>;
  onSavePage: () => Promise<void>;
  isSaving: boolean;
  onGeneratePdf: () => Promise<void>;
  isGeneratingPdf: boolean;
  pdfProgress?: string;
  hasCanvas: boolean;
  pdfError?: string | null;
  previewError?: string | null;
  isGeneratingPreview: boolean;
  issueId?: string;
  currentPageData?: CurrentPageData;
  showUnsavedModal: boolean;
  unsavedContext: 'navigate' | 'back' | 'newPage';
  onConfirmUnsaved: () => void;
  onCancelUnsaved: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function MainHeader({
  onBack,
  totalPages,
  currentPageIndex,
  hasUnsavedChanges,
  previewScale,
  onPreviewScaleChange,
  showPdfConfig,
  onTogglePdfConfig,
  onAddPage,
  onSavePage,
  isSaving,
  onGeneratePdf,
  isGeneratingPdf,
  pdfProgress,
  hasCanvas,
  pdfError,
  previewError,
  isGeneratingPreview,
  issueId,
  currentPageData,
  showUnsavedModal,
  unsavedContext,
  onConfirmUnsaved,
  onCancelUnsaved,
}: MainHeaderProps) {
  const [showManageLayouts, setShowManageLayouts] = useState(false);
  return (
    <>
      {/* Main header with title and actions */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Digital Page Editor
            </h1>
            {totalPages > 0 && (
              <p className="text-sm text-gray-500">
                Page {currentPageIndex + 1} of {totalPages}
                {hasUnsavedChanges && <span className="text-orange-500 ml-2">*Unsaved</span>}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview scale */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Preview:</span>
            <select
              value={previewScale}
              onChange={(e) => onPreviewScaleChange(parseFloat(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value={0.25}>25%</option>
              <option value={0.5}>50%</option>
              <option value={0.75}>75%</option>
              <option value={1}>100%</option>
            </select>
          </div>

          {/* PDF Config toggle */}
          <button
            type="button"
            onClick={onTogglePdfConfig}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              showPdfConfig
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            PDF Settings
          </button>

          {/* Manage Layouts */}
          {issueId && (
            <button
              type="button"
              onClick={() => setShowManageLayouts(true)}
              className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-1.5 ${
                showManageLayouts
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Manage Layouts
            </button>
          )}

          {/* Add Page */}
          <button
            type="button"
            onClick={onAddPage}
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Page
          </button>

          {/* Save Page */}
          {currentPageIndex >= 0 && (
            <button
              type="button"
              onClick={onSavePage}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Page
                </>
              )}
            </button>
          )}

          {/* Generate PDF */}
          <button
            type="button"
            onClick={onGeneratePdf}
            disabled={isGeneratingPdf || !hasCanvas}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            title={!hasCanvas ? 'Generate a preview first' : 'Generate PDF'}
          >
            {isGeneratingPdf ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {pdfProgress || 'Generating...'}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Generate PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error display */}
      {pdfError && (
        <div className="mx-6 mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{pdfError}</p>
        </div>
      )}

      {/* Preview not generated hint */}
      {!hasCanvas && !isGeneratingPreview && !previewError && totalPages > 0 && (
        <div className="mx-6 mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            Click &quot;Generate Preview&quot; or &quot;Generate Example&quot; in the preview panel to see what your PDF will look like.
          </p>
        </div>
      )}

      {/* Manage Layouts Modal */}
      {issueId && (
        <ManageLayoutsModal
          isOpen={showManageLayouts}
          onClose={() => setShowManageLayouts(false)}
          issueId={issueId}
          currentPageData={currentPageData}
        />
      )}

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onConfirm={onConfirmUnsaved}
        onCancel={onCancelUnsaved}
        context={unsavedContext}
      />
    </>
  );
}
