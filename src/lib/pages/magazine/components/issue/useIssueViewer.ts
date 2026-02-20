'use client';

import { useEffect, useMemo } from 'react';
import type { MagazinePage as MagazinePageType, MagazineIssue } from '../../types/magazine/core';
import type { ViewerPage } from '../../types/viewer';

// ============================================================================
// Types
// ============================================================================

export interface UseKeyboardNavigationOptions {
  currentPid: number;
  totalPages: number;
  navigateTo: (pid: number) => void;
  enabled?: boolean;
}

export interface UsePageDataOptions {
  currentPage: ViewerPage | undefined;
  issue: MagazineIssue;
  pages: ViewerPage[];
}

export interface UsePageDataResult {
  pageViewData: MagazinePageType | null;
  allPagesData: MagazinePageType[];
}

// ============================================================================
// useKeyboardNavigation
// ============================================================================

/**
 * Hook for handling keyboard navigation in the magazine viewer.
 * Listens for ArrowLeft/ArrowRight key presses and navigates accordingly.
 */
export const useKeyboardNavigation = ({
  currentPid,
  totalPages,
  navigateTo,
  enabled = true,
}: UseKeyboardNavigationOptions): void => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't navigate if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'ArrowLeft' && currentPid > 0) {
        navigateTo(currentPid - 1);
      } else if (e.key === 'ArrowRight' && currentPid < totalPages - 1) {
        navigateTo(currentPid + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPid, totalPages, navigateTo, enabled]);
};

// ============================================================================
// usePageData
// ============================================================================

/**
 * Hook for building MagazinePageView-compatible page data from issue and current page.
 */
export const usePageData = ({
  currentPage,
  issue,
  pages,
}: UsePageDataOptions): UsePageDataResult => {
  // Build MagazinePageView-compatible page data
  const pageViewData: MagazinePageType | null = useMemo(() => {
    if (!currentPage) return null;

    const buildPageData = (): MagazinePageType => {
      switch (currentPage.type) {
        case 'cover':
          return {
            pageNumber: currentPage.pid + 1,
            isLeftPage: false,
            sections: [
              {
                section: {
                  id: 'cover',
                  type: 'featured-story',
                  title: issue.title,
                  subtitle: issue.subtitle,
                  content: {
                    type: 'featured-story',
                    heroImage: issue.descriptionImage
                      ? issue.descriptionImage
                      : (issue.coverDisplayMode === 'background' ||
                          (!issue.coverDisplayMode && issue.useCoverBackground)) &&
                        issue.coverBackgroundImage
                        ? issue.coverBackgroundImage
                        : issue.coverImage,
                    heroImageAlt: issue.coverImageAlt,
                    body: issue.description,
                    readTime: '',
                  },
                },
              },
            ],
          };

        case 'toc':
          return {
            pageNumber: currentPage.pid + 1,
            isLeftPage: false,
            sections: [
              {
                section: {
                  id: 'table-of-contents',
                  type: 'table-of-contents',
                  title: 'Table of Contents',
                  content: {
                    type: 'table-of-contents',
                    body: '',
                  },
                },
              },
            ],
          };

        case 'editors-note':
          return {
            pageNumber: currentPage.pid + 1,
            isLeftPage: false,
            sections: [
              {
                section: {
                  id: 'editor-note',
                  type: 'featured-story',
                  title: issue.editorNoteTocTitle || "Editor's Note",
                  content: {
                    type: 'featured-story',
                    heroImage: '',
                    heroImageAlt: '',
                    body: issue.editorNote || '',
                  },
                },
              },
            ],
          };

        case 'section':
          if (!currentPage.sectionData) {
            return {
              pageNumber: currentPage.pid + 1,
              isLeftPage: false,
              sections: [],
            };
          }
          return {
            pageNumber: currentPage.pid + 1,
            isLeftPage: false,
            sections: [
              {
                section: {
                  ...currentPage.sectionData,
                  id: currentPage.sectionData.id || `section-${currentPage.pid}`,
                },
              },
            ],
          };

        default:
          return {
            pageNumber: currentPage.pid + 1,
            isLeftPage: false,
            sections: [],
          };
      }
    };

    return buildPageData();
  }, [currentPage, issue]);

  // Build all pages for MagazinePageView (needed for TOC links)
  const allPagesData: MagazinePageType[] = useMemo(() => {
    return pages.map((page, idx) => ({
      pageNumber: idx + 1,
      isLeftPage: false,
      sections: page.sectionData
        ? [{ section: page.sectionData }]
        : [],
    }));
  }, [pages]);

  return { pageViewData, allPagesData };
};
