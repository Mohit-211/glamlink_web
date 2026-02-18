/**
 * usePageList - Build ordered page list from magazine issue
 *
 * Creates the page structure for the magazine viewer:
 * - pid=0: Cover
 * - pid=1: Table of Contents
 * - pid=2: Editor's Note (if exists)
 * - pid=3+: Sections from array
 *
 * Uses ThumbnailConfig for:
 * - Custom thumbnails per page type
 * - Visibility control (hidden pages)
 */

'use client';

import { useMemo } from 'react';
import type { MagazineIssue, ThumbnailConfig } from '../types/magazine/core';
import type { ViewerPage } from '../types';
import { extractThumbnailFromSection } from './useThumbnailExtraction';

/**
 * Build ordered page list from magazine issue
 *
 * @param issue - The magazine issue data
 * @param includeHidden - Whether to include hidden pages (default: false)
 * @returns Array of ViewerPage objects
 */
export function usePageList(issue: MagazineIssue, includeHidden = false): ViewerPage[] {
  return useMemo(() => {
    const pages: ViewerPage[] = [];
    const thumbnailConfig: ThumbnailConfig = issue.thumbnailConfig || {};
    const hiddenPages = thumbnailConfig.hiddenPages || {};

    // Helper to get cover image URL
    const getCoverThumbnail = (): string | null => {
      // First check custom thumbnail from config
      if (thumbnailConfig.coverThumbnail) {
        return thumbnailConfig.coverThumbnail;
      }
      // Fall back to cover images
      if (issue.coverImage) {
        if (typeof issue.coverImage === 'string') return issue.coverImage;
        return (issue.coverImage as { url?: string }).url || null;
      }
      if (issue.coverBackgroundImage) {
        if (typeof issue.coverBackgroundImage === 'string') return issue.coverBackgroundImage;
        return (issue.coverBackgroundImage as { url?: string }).url || null;
      }
      return null;
    };

    // pid=0: Cover
    const isCoverHidden = hiddenPages.cover || false;
    if (includeHidden || !isCoverHidden) {
      pages.push({
        pid: 0,
        type: 'cover',
        title: issue.title || 'Cover',
        thumbnail: getCoverThumbnail(),
      });
    }

    // pid=1: Table of Contents
    const isTocHidden = hiddenPages.toc || false;
    if (includeHidden || !isTocHidden) {
      pages.push({
        pid: 1,
        type: 'toc',
        title: 'Table of Contents',
        thumbnail: thumbnailConfig.tocThumbnail || null,
      });
    }

    // pid=2: Editor's Note (if exists)
    if (issue.editorNote) {
      const isEditorNoteHidden = hiddenPages.editorNote || false;
      if (includeHidden || !isEditorNoteHidden) {
        pages.push({
          pid: 2,
          type: 'editors-note',
          title: issue.editorNoteTocTitle || "Editor's Note",
          thumbnail: thumbnailConfig.editorNoteThumbnail || null,
        });
      }
    }

    // pid=3+ (or pid=2+ if no editor's note): Sections
    const sectionStartIndex = issue.editorNote ? 3 : 2;
    const sections = issue.sections || [];
    const hiddenSections = hiddenPages.sections || [];

    sections.forEach((section, idx) => {
      const isSectionHidden = hiddenSections.includes(section.id);
      if (includeHidden || !isSectionHidden) {
        const pid = sectionStartIndex + idx;
        // Get custom thumbnail from config, fall back to extracted thumbnail
        const customThumbnail = thumbnailConfig.sectionThumbnails?.[section.id];
        const extractedThumbnail = extractThumbnailFromSection(section);

        pages.push({
          pid,
          type: 'section',
          title: section.tocTitle || section.title || `Section ${idx + 1}`,
          thumbnail: customThumbnail || extractedThumbnail,
          sectionData: section,
        });
      }
    });

    // Re-index pids to be sequential for visible pages
    if (!includeHidden) {
      pages.forEach((page, index) => {
        page.pid = index;
      });
    }

    return pages;
  }, [issue, includeHidden]);
}

export default usePageList;
