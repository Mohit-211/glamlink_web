'use client';

import React from 'react';
import { ArrowLeftIcon } from '@/lib/pages/admin/components/shared/common';

// =============================================================================
// PROPS INTERFACE
// =============================================================================

interface PDFManagerHeaderProps {
  issueTitle: string;
  onBack: () => void;
  pagesWithCanvasCount: number;
  selectedCount: number;
  allSelected: boolean;
  isGenerating: boolean;
  progress: string;
  onToggleAll: () => void;
  onGeneratePdf: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function PDFManagerHeader({
  issueTitle,
  onBack,
  pagesWithCanvasCount,
  selectedCount,
  allSelected,
  isGenerating,
  progress,
  onToggleAll,
  onGeneratePdf,
}: PDFManagerHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Pages
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manage PDFs - {issueTitle}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage generated canvases for each digital page
            </p>
          </div>
        </div>

        {/* Combined PDF Actions */}
        {pagesWithCanvasCount > 0 && (
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onToggleAll}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>

            <button
              type="button"
              onClick={onGeneratePdf}
              disabled={isGenerating || selectedCount === 0}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {progress || 'Generating...'}
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Generate Combined PDF
                  {selectedCount > 0 && (
                    <span className="ml-2 bg-indigo-500 px-2 py-0.5 rounded-full text-xs">
                      {selectedCount}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
