'use client';

import { NavigationArrows } from './NavigationArrows';
import { PageIndicators } from './PageIndicators';
import { PageInput } from './PageInput';

export interface MagazineNavigationProps {
  currentSpread: number;
  totalSpreads: number;
  onNavigate: (spread: number) => void;
  showPageIndicators?: boolean;
  /** Title of the current page */
  pageTitle?: string;
}

/**
 * Magazine navigation component with prev/next arrows and page number.
 * Displays arrows on left/right with page info in center.
 */
export function MagazineNavigation({
  currentSpread,
  totalSpreads,
  onNavigate,
  showPageIndicators = true,
  pageTitle,
}: MagazineNavigationProps) {
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

  const { leftArrow, rightArrow } = NavigationArrows({
    isFirstPage,
    isLastPage,
    onPrevious: handlePrevious,
    onNext: handleNext,
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation Controls: Arrows + Page Number */}
      <div className="flex items-center justify-center gap-4 md:gap-8">
        {/* Left Arrow */}
        {leftArrow}

        {/* Page Indicators or Page Title/Number */}
        {showPageIndicators ? (
          <PageIndicators
            currentSpread={currentSpread}
            totalSpreads={totalSpreads}
            onNavigate={onNavigate}
          />
        ) : (
          <PageInput
            currentSpread={currentSpread}
            totalSpreads={totalSpreads}
            onNavigate={onNavigate}
            pageTitle={pageTitle}
          />
        )}

        {/* Right Arrow */}
        {rightArrow}
      </div>
    </div>
  );
}

export default MagazineNavigation;
