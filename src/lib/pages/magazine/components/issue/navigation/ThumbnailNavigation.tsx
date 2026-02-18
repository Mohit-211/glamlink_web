'use client';

import React from 'react';
import type { ThumbnailNavigationProps } from '../../../types';
import { ThumbnailItem } from './ThumbnailItem';

/**
 * ThumbnailNavigation - Responsive grid of thumbnail pages
 *
 * Displays thumbnails for all pages in a grid layout.
 * - Mobile: 2 columns (larger thumbnails for easier tapping)
 * - Tablet (sm): 3 columns
 * - Desktop (md+): 4 columns
 */
export function ThumbnailNavigation({ pages, currentPid, onNavigate }: ThumbnailNavigationProps) {
  return (
    <div className="w-full px-4 md:px-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
      {pages.map((page) => (
        <ThumbnailItem
          key={page.pid}
          page={page}
          isActive={page.pid === currentPid}
          onClick={() => onNavigate(page.pid)}
        />
      ))}
    </div>
  );
}

export default ThumbnailNavigation;
