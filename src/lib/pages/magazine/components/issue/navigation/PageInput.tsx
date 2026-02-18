'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PageInputProps {
  currentSpread: number;
  totalSpreads: number;
  onNavigate: (spread: number) => void;
  /** Title of the current page */
  pageTitle?: string;
}

/**
 * Page title and number display with mobile navigation arrows.
 * Shows title on top, page number below.
 * On mobile, includes prev/next arrows for navigation.
 */
export function PageInput({
  currentSpread,
  totalSpreads,
  onNavigate,
  pageTitle,
}: PageInputProps) {
  // Get display title based on page type or provided title
  const displayTitle = pageTitle || `Page ${currentSpread + 1}`;

  const isFirstPage = currentSpread === 0;
  const isLastPage = currentSpread === totalSpreads - 1;

  const handlePrevious = () => {
    if (!isFirstPage) {
      onNavigate(currentSpread - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      onNavigate(currentSpread + 1);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Previous Arrow - mobile only */}
      <button
        onClick={handlePrevious}
        disabled={isFirstPage}
        className={`md:hidden p-2 rounded-full transition-all ${
          isFirstPage
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Page Info */}
      <div className="flex flex-col items-center">
        {/* Page Title */}
        <span className="text-base font-medium text-gray-900">{displayTitle}</span>
        {/* Page Number */}
        <span className="text-sm text-gray-500">
          {currentSpread + 1} of {totalSpreads}
        </span>
      </div>

      {/* Next Arrow - mobile only */}
      <button
        onClick={handleNext}
        disabled={isLastPage}
        className={`md:hidden p-2 rounded-full transition-all ${
          isLastPage
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

export default PageInput;
