import React from 'react';

// =============================================================================
// PROPS INTERFACE
// =============================================================================

interface PageNavigationProps {
  totalPages: number;
  currentPageIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function PageNavigation({
  totalPages,
  currentPageIndex,
  onPrevious,
  onNext,
}: PageNavigationProps) {
  // Only show if there are pages
  if (totalPages === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 px-6 py-2 border-b border-gray-100 bg-gray-50">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentPageIndex <= 0}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
        Page {currentPageIndex + 1} of {totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={currentPageIndex >= totalPages - 1}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
