'use client';

import React, { Suspense, useMemo, useLayoutEffect, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { MagazineViewerProps, ViewerPage } from '../../types';
import type { ThumbnailConfig } from '../../types/magazine/core';
import { usePageList } from '../../hooks/usePageList';
import { usePageNavigation } from '../../hooks/usePageNavigation';
import { useKeyboardNavigation, usePageData } from './useIssueViewer';
import MagazinePageView from '../magazine/MagazinePageView';
import { NavigationArrows, ThumbnailNavigation } from './navigation';
import { PageInput } from './navigation/PageInput';
import MagazineCTA from './MagazineCTA';
import { useMagazineAnalytics } from '@/lib/features/analytics/hooks';

/**
 * IssueViewerContent - Inner component that handles issue viewing
 */
function IssueViewerContent({ issue }: MagazineViewerProps) {
  // Build page list including hidden pages (for arrow navigation)
  const allPages = usePageList(issue, true);

  // Filter pages for thumbnail display only (exclude hidden pages)
  const visibleThumbnailPages = useMemo(() => {
    const thumbnailConfig: ThumbnailConfig = issue.thumbnailConfig || {};
    const hiddenPages = thumbnailConfig.hiddenPages || {};
    const hiddenSections = hiddenPages.sections || [];

    return allPages.filter((page) => {
      if (page.type === 'cover') return !hiddenPages.cover;
      if (page.type === 'toc') return !hiddenPages.toc;
      if (page.type === 'editors-note') return !hiddenPages.editorNote;
      if (page.type === 'section' && page.sectionData) {
        return !hiddenSections.includes(page.sectionData.id);
      }
      return true;
    });
  }, [allPages, issue.thumbnailConfig]);

  // Navigation state - use total of ALL pages (including hidden)
  const { currentPid, navigateTo, totalPages } = usePageNavigation(allPages.length);

  // Get current page data from all pages
  const currentPage = allPages[currentPid];

  // Analytics tracking - use actual document ID, not urlId
  const {
    trackPageView,
    trackNavigation,
  } = useMagazineAnalytics({
    issueId: issue.id,
    trackViewOnMount: true, // Auto-tracks issue_view
  });

  // Track page views when page changes
  const previousPid = useRef<number | null>(null);
  useEffect(() => {
    if (previousPid.current !== currentPid && currentPage) {
      trackPageView(
        currentPid,
        currentPage.sectionData?.id,
        currentPage.sectionData?.type,
        currentPage.title
      );
      previousPid.current = currentPid;
    }
  }, [currentPid, currentPage, trackPageView]);

  // Build page data using the hook
  const { pageViewData, allPagesData } = usePageData({
    currentPage,
    issue,
    pages: allPages,
  });

  // Reset scroll to 0 after DOM updates but before browser paints
  useLayoutEffect(() => {
    const magazinePage = document.querySelector('.magazine-page');
    if (magazinePage) {
      magazinePage.scrollTop = 0;
    }
  }, [currentPid]);

  // Navigation function - just navigate, useLayoutEffect handles scroll
  const navigateWithScroll = (pid: number) => {
    navigateTo(pid);
  };

  // Keyboard navigation (uses navigateWithScroll for scroll-to-top behavior)
  useKeyboardNavigation({
    currentPid,
    totalPages,
    navigateTo: navigateWithScroll,
  });

  const isFirstPage = currentPid === 0;
  const isLastPage = currentPid === totalPages - 1;

  const handlePrevious = () => {
    if (!isFirstPage) {
      trackNavigation(currentPid, currentPid - 1, 'arrow');
      navigateWithScroll(currentPid - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      trackNavigation(currentPid, currentPid + 1, 'arrow');
      navigateWithScroll(currentPid + 1);
    }
  };

  // Handle thumbnail navigation with tracking
  const handleThumbnailNavigate = (pid: number) => {
    trackNavigation(currentPid, pid, 'thumbnail');
    navigateWithScroll(pid);
  };

  const { leftArrow, rightArrow } = NavigationArrows({
    isFirstPage,
    isLastPage,
    onPrevious: handlePrevious,
    onNext: handleNext,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Main Content */}
      <div className="container mx-auto px-0 md:px-6 py-4 sm:py-6 md:py-8 max-w-5xl">
        {/* Magazine Page with Arrows on sides */}
        <div className="flex items-center gap-0 md:gap-4 mb-8 sm:mb-10 md:mb-12">
          {/* Left Arrow - hidden on mobile */}
          <div className="flex-shrink-0 hidden md:block">
            {leftArrow}
          </div>

          {/* Current Page - full width on mobile */}
          <div className="flex-1 w-full md:max-w-4xl mx-auto">
            {pageViewData && (
              <MagazinePageView
                page={pageViewData}
                totalPages={totalPages}
                issue={issue}
                pages={allPagesData}
                onNavigate={navigateTo}
              />
            )}
          </div>

          {/* Right Arrow - hidden on mobile */}
          <div className="flex-shrink-0 hidden md:block">
            {rightArrow}
          </div>
        </div>

        {/* Page Title + Number (centered) */}
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <PageInput
              currentSpread={currentPid}
              totalSpreads={totalPages}
              onNavigate={navigateTo}
              pageTitle={currentPage?.title}
            />
          </div>

          {/* Thumbnail Navigation */}
          <ThumbnailNavigation
            pages={visibleThumbnailPages}
            currentPid={currentPid}
            onNavigate={handleThumbnailNavigate}
          />

          {/* Additional Navigation Links */}
          <div className="flex justify-center gap-4 mt-8">
            <Link
              href="/magazine"
              className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-glamlink-teal text-white rounded-full hover:bg-glamlink-teal-dark transition-colors"
            >
              ← Back to Magazine
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Component */}
      <MagazineCTA issueId={issue.urlId || issue.id} issueTitle={issue.title} />
    </div>
  );
}

/**
 * Loading state for the viewer
 */
function IssueViewerLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          {/* Thumbnail strip skeleton */}
          <div className="flex gap-4 overflow-hidden py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-20 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
            ))}
          </div>
          {/* Content skeleton */}
          <div className="h-96 bg-gray-200 rounded-lg mt-8" />
        </div>
      </div>
    </div>
  );
}

/**
 * IssueViewer - Main viewer component wrapped in Suspense
 *
 * Single-page magazine viewer with URL param navigation (?pid=X).
 * Includes thumbnail navigation strip and arrow navigation.
 */
export function IssueViewer({ issue }: MagazineViewerProps) {
  return (
    <Suspense fallback={<IssueViewerLoading />}>
      <IssueViewerContent issue={issue} />
    </Suspense>
  );
}

// Export the loading component for reuse
export { IssueViewerLoading };

export default IssueViewer;
