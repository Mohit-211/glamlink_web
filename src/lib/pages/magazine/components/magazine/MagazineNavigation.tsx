'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';

interface MagazineNavigationProps {
  currentSpread: number;
  totalSpreads: number;
  onNavigate: (spread: number) => void;
  showPageIndicators?: boolean;
  /** Optional custom content to display in place of page indicators (e.g., thumbnails) */
  customIndicators?: ReactNode;
}

export default function MagazineNavigation({
  currentSpread,
  totalSpreads,
  onNavigate,
  showPageIndicators = true,
  customIndicators
}: MagazineNavigationProps) {
  const isFirstPage = currentSpread === 0;
  const isLastPage = currentSpread === totalSpreads - 1;
  const [pageInput, setPageInput] = useState(String(currentSpread + 1));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setPageInput(String(currentSpread + 1));
  }, [currentSpread]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalSpreads) {
      onNavigate(pageNum - 1);
    } else {
      setPageInput(String(currentSpread + 1));
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageInputSubmit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 md:gap-8 mb-4">
        {/* Left Arrow */}
        <button
          onClick={handlePrevious}
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

        {/* Custom Indicators (e.g., thumbnails) or default page indicators */}
        {customIndicators ? (
          <div className="flex-1 max-w-3xl">
            {customIndicators}
          </div>
        ) : showPageIndicators && (
          <div className="flex items-center gap-1 md:gap-2">
            {(() => {
              const indicators = [];
              
              // Always show first page
              indicators.push(
                <button
                  key={0}
                  onClick={() => onNavigate(0)}
                  className={`w-8 h-8 md:w-10 md:h-10 text-sm md:text-base rounded-full transition-all ${
                    currentSpread === 0
                      ? 'bg-glamlink-teal text-white shadow-lg scale-110'
                      : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md'
                  }`}
                  aria-label="Go to page 1"
                >
                  1
                </button>
              );
              
              // Mobile logic: limit visible buttons to prevent overflow
              if (isMobile && totalSpreads > 5) {
                // If current is near start (pages 1-3)
                if (currentSpread <= 2) {
                  // Show pages 2-3
                  for (let i = 1; i <= Math.min(2, totalSpreads - 2); i++) {
                    indicators.push(
                      <button
                        key={i}
                        onClick={() => onNavigate(i)}
                        className={`w-8 h-8 text-sm rounded-full transition-all ${
                          currentSpread === i
                            ? 'bg-glamlink-teal text-white shadow-lg scale-110'
                            : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md'
                        }`}
                        aria-label={`Go to page ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    );
                  }
                  indicators.push(<span key="ellipsis1" className="px-1 text-gray-400">...</span>);
                  // Show last page
                  indicators.push(
                    <button
                      key={totalSpreads - 1}
                      onClick={() => onNavigate(totalSpreads - 1)}
                      className={`w-8 h-8 text-sm rounded-full transition-all ${
                        currentSpread === totalSpreads - 1
                          ? 'bg-glamlink-teal text-white shadow-lg scale-110'
                          : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md'
                      }`}
                      aria-label={`Go to page ${totalSpreads}`}
                    >
                      {totalSpreads}
                    </button>
                  );
                }
                // If current is near end (last 3 pages)
                else if (currentSpread >= totalSpreads - 3) {
                  indicators.push(<span key="ellipsis1" className="px-1 text-gray-400">...</span>);
                  // Show last 3 pages
                  for (let i = totalSpreads - 3; i < totalSpreads; i++) {
                    if (i > 0) { // Don't duplicate first page
                      indicators.push(
                        <button
                          key={i}
                          onClick={() => onNavigate(i)}
                          className={`w-8 h-8 text-sm rounded-full transition-all ${
                            currentSpread === i
                              ? 'bg-glamlink-teal text-white shadow-lg scale-110'
                              : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md'
                          }`}
                          aria-label={`Go to page ${i + 1}`}
                        >
                          {i + 1}
                        </button>
                      );
                    }
                  }
                }
                // If current is in middle - Show 1, ..., current-1, current, current+1, ..., last
                else {
                  indicators.push(<span key="ellipsis1" className="px-1 text-gray-400">...</span>);
                  // Show current-1, current, current+1 (3 buttons)
                  for (let i = currentSpread - 1; i <= currentSpread + 1; i++) {
                    if (i > 0 && i < totalSpreads) {
                      indicators.push(
                        <button
                          key={i}
                          onClick={() => onNavigate(i)}
                          className={`w-8 h-8 text-sm rounded-full transition-all ${
                            currentSpread === i
                              ? 'bg-glamlink-teal text-white shadow-lg scale-110'
                              : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md'
                          }`}
                          aria-label={`Go to page ${i + 1}`}
                        >
                          {i + 1}
                        </button>
                      );
                    }
                  }
                  indicators.push(<span key="ellipsis2" className="px-1 text-gray-400">...</span>);
                  // Show last page
                  indicators.push(
                    <button
                      key={totalSpreads - 1}
                      onClick={() => onNavigate(totalSpreads - 1)}
                      className={`w-8 h-8 text-sm rounded-full transition-all ${
                        currentSpread === totalSpreads - 1
                          ? 'bg-glamlink-teal text-white shadow-lg scale-110'
                          : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md'
                      }`}
                      aria-label={`Go to page ${totalSpreads}`}
                    >
                      {totalSpreads}
                    </button>
                  );
                }
              }
              // Desktop logic or mobile with 5 or fewer pages
              else if (totalSpreads <= 10) {
                for (let i = 1; i < totalSpreads; i++) {
                  indicators.push(
                    <button
                      key={i}
                      onClick={() => onNavigate(i)}
                      className={`w-8 h-8 md:w-10 md:h-10 text-sm md:text-base rounded-full transition-all ${
                        currentSpread === i
                          ? 'bg-glamlink-teal text-white shadow-lg scale-110'
                          : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md'
                      }`}
                      aria-label={`Go to page ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  );
                }
              } else {
                // For more than 10 pages, use smart pagination
                
                // If current is near start (pages 1-4)
                if (currentSpread <= 3) {
                  // Show pages 2-4
                  for (let i = 1; i <= 3; i++) {
                    indicators.push(
                      <button
                        key={i}
                        onClick={() => onNavigate(i)}
                        className={`w-8 h-8 md:w-10 md:h-10 text-sm md:text-base rounded-full transition-all ${
                          currentSpread === i
                            ? 'bg-glamlink-teal text-white shadow-lg scale-110'
                            : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md'
                        }`}
                        aria-label={`Go to page ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    );
                  }
                  indicators.push(<span key="ellipsis1" className="hidden md:inline px-1 md:px-2 text-gray-400">...</span>);
                }
                // If current is near end (last 4 pages)
                else if (currentSpread >= totalSpreads - 4) {
                  indicators.push(<span key="ellipsis1" className="hidden md:inline px-1 md:px-2 text-gray-400">...</span>);
                  // Show last 4 pages
                  for (let i = totalSpreads - 4; i < totalSpreads; i++) {
                    indicators.push(
                      <button
                        key={i}
                        onClick={() => onNavigate(i)}
                        className={`w-8 h-8 md:w-10 md:h-10 text-sm md:text-base rounded-full transition-all ${
                          currentSpread === i
                            ? 'bg-glamlink-teal text-white shadow-lg scale-110'
                            : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md'
                        }`}
                        aria-label={`Go to page ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    );
                  }
                }
                // If current is in middle
                else {
                  indicators.push(<span key="ellipsis1" className="hidden md:inline px-1 md:px-2 text-gray-400">...</span>);
                  // Show current and neighbors (3 total)
                  for (let i = currentSpread - 1; i <= currentSpread + 1; i++) {
                    indicators.push(
                      <button
                        key={i}
                        onClick={() => onNavigate(i)}
                        className={`w-8 h-8 md:w-10 md:h-10 text-sm md:text-base rounded-full transition-all ${
                          currentSpread === i
                            ? 'bg-glamlink-teal text-white shadow-lg scale-110'
                            : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md'
                        }`}
                        aria-label={`Go to page ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    );
                  }
                  indicators.push(<span key="ellipsis2" className="hidden md:inline px-1 md:px-2 text-gray-400">...</span>);
                  // Show last page
                  indicators.push(
                    <button
                      key={totalSpreads - 1}
                      onClick={() => onNavigate(totalSpreads - 1)}
                      className={`w-8 h-8 md:w-10 md:h-10 text-sm md:text-base rounded-full transition-all ${
                        currentSpread === totalSpreads - 1
                          ? 'bg-glamlink-teal text-white shadow-lg scale-110'
                          : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md'
                      }`}
                      aria-label={`Go to page ${totalSpreads}`}
                    >
                      {totalSpreads}
                    </button>
                  );
                }
              }
              
              return indicators;
            })()}
          </div>
        )}

        {/* Right Arrow */}
        <button
          onClick={handleNext}
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
      </div>

      {/* Page Info */}
      <div className="text-center text-sm text-gray-600">
        {currentSpread === 0 ? (
          <span>Cover Page</span>
        ) : currentSpread === 1 && totalSpreads > 10 ? (
          <span>Editor's Note</span>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>Page</span>
            <input
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputSubmit}
              onKeyDown={handlePageInputKeyDown}
              className="w-12 px-2 py-1 text-center bg-white text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-transparent"
              aria-label="Current page number"
            />
            <span>of {totalSpreads}</span>
          </div>
        )}
      </div>
    </div>
  );
}