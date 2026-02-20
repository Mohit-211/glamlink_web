'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface NavigationArrowsProps {
  isFirstPage: boolean;
  isLastPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Left and right arrow buttons for magazine navigation.
 */
export function NavigationArrows({
  isFirstPage,
  isLastPage,
  onPrevious,
  onNext,
}: NavigationArrowsProps) {
  return {
    leftArrow: (
      <button
        onClick={onPrevious}
        disabled={isFirstPage}
        className={`p-2 md:p-3 rounded-full shadow-lg transition-all flex-shrink-0 ${
          isFirstPage
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
            : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-xl hover:scale-110'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    ),
    rightArrow: (
      <button
        onClick={onNext}
        disabled={isLastPage}
        className={`p-2 md:p-3 rounded-full shadow-lg transition-all flex-shrink-0 ${
          isLastPage
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
            : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-xl hover:scale-110'
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    ),
  };
}

export default NavigationArrows;
