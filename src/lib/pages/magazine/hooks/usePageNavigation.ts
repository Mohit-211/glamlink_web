/**
 * usePageNavigation - Handle URL param navigation for magazine pages
 *
 * Manages the ?pid=X URL parameter for single-page magazine navigation.
 * Integrates with browser history for back/forward navigation.
 */

'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { PageNavigationState } from '../types';

/**
 * Hook for managing magazine page navigation via URL params
 *
 * @param totalPages - Total number of pages in the magazine
 * @returns Navigation state and functions
 */
export function usePageNavigation(totalPages: number): PageNavigationState {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current page ID from URL params (default to 0 for cover)
  const currentPid = useMemo(() => {
    const pidParam = searchParams.get('pid');
    if (pidParam === null) return 0;
    const parsed = parseInt(pidParam, 10);
    // Validate pid is within bounds
    if (isNaN(parsed) || parsed < 0) return 0;
    if (parsed >= totalPages) return totalPages - 1;
    return parsed;
  }, [searchParams, totalPages]);

  // Navigate to a specific page
  const navigateTo = useCallback((pid: number) => {
    // Clamp pid to valid range
    const validPid = Math.max(0, Math.min(pid, totalPages - 1));

    // Build new URL params
    const params = new URLSearchParams(searchParams.toString());

    if (validPid === 0) {
      // Clean URL for cover page (remove pid param)
      params.delete('pid');
    } else {
      params.set('pid', String(validPid));
    }

    // Build URL with or without params
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    // Navigate without scrolling to top
    router.push(newUrl, { scroll: false });
  }, [router, pathname, searchParams, totalPages]);

  // Go to next page
  const goNext = useCallback(() => {
    if (currentPid < totalPages - 1) {
      navigateTo(currentPid + 1);
    }
  }, [currentPid, totalPages, navigateTo]);

  // Go to previous page
  const goPrev = useCallback(() => {
    if (currentPid > 0) {
      navigateTo(currentPid - 1);
    }
  }, [currentPid, navigateTo]);

  // Navigation availability
  const canGoNext = currentPid < totalPages - 1;
  const canGoPrev = currentPid > 0;

  return {
    currentPid,
    totalPages,
    navigateTo,
    goNext,
    goPrev,
    canGoNext,
    canGoPrev,
  };
}

export default usePageNavigation;
