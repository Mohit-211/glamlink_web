'use client';

import React, { useState, useEffect } from 'react';

export interface PageIndicatorsProps {
  currentSpread: number;
  totalSpreads: number;
  onNavigate: (spread: number) => void;
}

/**
 * Page indicator buttons for magazine navigation.
 * Handles smart pagination for both mobile and desktop.
 */
export function PageIndicators({
  currentSpread,
  totalSpreads,
  onNavigate,
}: PageIndicatorsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderIndicatorButton = (
    index: number,
    isMobileView: boolean = false
  ) => {
    const baseClasses = isMobileView
      ? 'w-8 h-8 text-sm rounded-full transition-all'
      : 'w-8 h-8 md:w-10 md:h-10 text-sm md:text-base rounded-full transition-all';
    const activeClasses = 'bg-glamlink-teal text-white shadow-lg scale-110';
    const inactiveClasses = 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md';

    return (
      <button
        key={index}
        onClick={() => onNavigate(index)}
        className={`${baseClasses} ${
          currentSpread === index ? activeClasses : inactiveClasses
        }`}
        aria-label={`Go to page ${index + 1}`}
      >
        {index + 1}
      </button>
    );
  };

  const renderEllipsis = (key: string, mobileOnly: boolean = false) => (
    <span
      key={key}
      className={`${mobileOnly ? '' : 'hidden md:inline'} px-1 md:px-2 text-gray-400`}
    >
      ...
    </span>
  );

  const indicators: React.ReactElement[] = [];

  // Always show first page
  indicators.push(renderIndicatorButton(0, isMobile && totalSpreads > 5));

  // Mobile logic: limit visible buttons to prevent overflow
  if (isMobile && totalSpreads > 5) {
    // If current is near start (pages 1-3)
    if (currentSpread <= 2) {
      // Show pages 2-3
      for (let i = 1; i <= Math.min(2, totalSpreads - 2); i++) {
        indicators.push(renderIndicatorButton(i, true));
      }
      indicators.push(renderEllipsis('ellipsis1', true));
      // Show last page
      indicators.push(renderIndicatorButton(totalSpreads - 1, true));
    }
    // If current is near end (last 3 pages)
    else if (currentSpread >= totalSpreads - 3) {
      indicators.push(renderEllipsis('ellipsis1', true));
      // Show last 3 pages
      for (let i = totalSpreads - 3; i < totalSpreads; i++) {
        if (i > 0) {
          // Don't duplicate first page
          indicators.push(renderIndicatorButton(i, true));
        }
      }
    }
    // If current is in middle
    else {
      indicators.push(renderEllipsis('ellipsis1', true));
      // Show current-1, current, current+1 (3 buttons)
      for (let i = currentSpread - 1; i <= currentSpread + 1; i++) {
        if (i > 0 && i < totalSpreads) {
          indicators.push(renderIndicatorButton(i, true));
        }
      }
      indicators.push(renderEllipsis('ellipsis2', true));
      // Show last page
      indicators.push(renderIndicatorButton(totalSpreads - 1, true));
    }
  }
  // Desktop logic or mobile with 5 or fewer pages
  else if (totalSpreads <= 10) {
    for (let i = 1; i < totalSpreads; i++) {
      indicators.push(renderIndicatorButton(i));
    }
  } else {
    // For more than 10 pages, use smart pagination

    // If current is near start (pages 1-4)
    if (currentSpread <= 3) {
      // Show pages 2-4
      for (let i = 1; i <= 3; i++) {
        indicators.push(renderIndicatorButton(i));
      }
      indicators.push(renderEllipsis('ellipsis1'));
    }
    // If current is near end (last 4 pages)
    else if (currentSpread >= totalSpreads - 4) {
      indicators.push(renderEllipsis('ellipsis1'));
      // Show last 4 pages
      for (let i = totalSpreads - 4; i < totalSpreads; i++) {
        indicators.push(renderIndicatorButton(i));
      }
    }
    // If current is in middle
    else {
      indicators.push(renderEllipsis('ellipsis1'));
      // Show current and neighbors (3 total)
      for (let i = currentSpread - 1; i <= currentSpread + 1; i++) {
        indicators.push(renderIndicatorButton(i));
      }
      indicators.push(renderEllipsis('ellipsis2'));
      // Show last page
      indicators.push(renderIndicatorButton(totalSpreads - 1));
    }
  }

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {indicators}
    </div>
  );
}

export default PageIndicators;
