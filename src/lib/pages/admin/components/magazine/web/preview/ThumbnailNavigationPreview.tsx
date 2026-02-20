'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import type { PreviewComponentProps } from '@/lib/pages/admin/config/previewComponents';
import type { MagazineIssueSection, ThumbnailConfig } from '@/lib/pages/magazine/types/magazine/core';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';

interface SectionItem {
  id: string;
  title: string;
  tocTitle?: string;
  type: string;
  content?: any;
}

/**
 * Helper to get image URL from string or ImageFieldType
 */
function getImageUrl(value: any): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.url) return value.url;
  return undefined;
}

/**
 * Extract thumbnail from section content based on section type
 */
function extractSectionThumbnail(section: SectionItem): string | undefined {
  const content = section.content || {};

  switch (section.type) {
    case 'cover-pro-feature':
      return getImageUrl(content.coverImage) || getImageUrl(content.professionalImage);
    case 'rising-star':
      return getImageUrl(content.starImage);
    case 'maries-corner':
      return getImageUrl(content.mainStory?.backgroundImage) || getImageUrl(content.authorImage);
    case 'top-treatment':
      return getImageUrl(content.heroImage);
    case 'top-product-spotlight':
      return getImageUrl(content.productImage);
    case 'glamlink-stories':
      return getImageUrl(content.stories?.[0]?.image);
    case 'spotlight-city':
      return getImageUrl(content.cityImage);
    case 'magazine-closing':
      return getImageUrl(content.nextIssueCover);
    case 'featured-story':
      return getImageUrl(content.heroImage);
    case 'custom-section':
      const imageBlock = content.contentBlocks?.find((b: any) => b.type === 'image');
      return getImageUrl(imageBlock?.image);
    default:
      return undefined;
  }
}

interface ThumbnailItemPreviewProps {
  label: string;
  thumbnail?: string;
  isHidden: boolean;
  isActive: boolean;
  onClick: () => void;
  layout: 'portrait' | 'landscape';
}

/**
 * Individual thumbnail item for preview
 */
function ThumbnailItemPreview({ label, thumbnail, isHidden, isActive, onClick, layout }: ThumbnailItemPreviewProps) {
  if (isHidden) return null;

  // Aspect ratio based on layout: portrait is 3:4, landscape is 4:3
  const aspectClass = layout === 'landscape' ? 'aspect-[4/3]' : 'aspect-[3/4]';

  return (
    <div className="flex flex-col">
      <button
        onClick={onClick}
        className={`
          relative ${aspectClass} rounded-md overflow-hidden cursor-pointer transition-all
          ${isActive
            ? 'ring-2 ring-glamlink-teal ring-offset-2 scale-105'
            : 'hover:scale-102 opacity-80 hover:opacity-100'}
        `}
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 25vw, 200px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-500">
              {label.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </button>
      {/* Title below thumbnail */}
      <p className="mt-1 text-xs font-medium text-gray-700 text-center truncate px-1">
        {label}
      </p>
    </div>
  );
}

/**
 * ThumbnailNavigationPreview - Preview of magazine thumbnail navigation
 *
 * Shows how the thumbnail navigation will look in the magazine viewer.
 * Respects hidden pages configuration and displays in a 4-column grid.
 *
 * Uses FormContext to get current form data (including thumbnailConfig edits)
 * and fetches sections from API since they're stored separately.
 */
export default function ThumbnailNavigationPreview({ issue }: PreviewComponentProps) {
  const [activePid, setActivePid] = useState(0);

  // Try to get form context for live updates
  let formContext: ReturnType<typeof useFormContext> | null = null;
  try {
    formContext = useFormContext();
  } catch {
    // Not inside FormProvider, use issue prop directly
  }

  // Get current form data or fall back to issue prop
  const issueId = formContext?.getFieldValue('id') || issue.id || '';
  const thumbnailConfig: ThumbnailConfig = formContext?.getFieldValue('thumbnailConfig') || issue.thumbnailConfig || {};
  const hasEditorNote = !!(formContext?.getFieldValue('editorNote') || issue.editorNote);
  const coverImage = formContext?.getFieldValue('coverImage') || issue.coverImage;

  // State for sections loaded from API
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [isLoadingSections, setIsLoadingSections] = useState(false);

  // Fetch sections from API when issueId changes
  useEffect(() => {
    if (!issueId || issueId === 'new-issue') {
      setSections([]);
      return;
    }

    const fetchSections = async () => {
      setIsLoadingSections(true);
      try {
        const response = await fetch(`/api/magazine/sections?issueId=${issueId}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch sections');
        }
        const data = await response.json();
        const sectionsList = data.sections || [];
        setSections(sectionsList.map((s: any) => ({
          id: s.id,
          title: s.title || '',
          tocTitle: s.tocTitle,
          type: s.type || 'unknown',
          content: s.content
        })));
      } catch (err) {
        console.error('Error fetching sections for preview:', err);
        setSections([]);
      } finally {
        setIsLoadingSections(false);
      }
    };

    fetchSections();
  }, [issueId]);

  // Build page list from current data
  const pages = useMemo(() => {
    const result: Array<{
      pid: number;
      type: string;
      label: string;
      thumbnail?: string;
      isHidden: boolean;
    }> = [];

    let pid = 0;

    // Cover
    result.push({
      pid: pid++,
      type: 'cover',
      label: 'Cover',
      thumbnail: thumbnailConfig.coverThumbnail || getImageUrl(coverImage),
      isHidden: thumbnailConfig.hiddenPages?.cover || false,
    });

    // Table of Contents
    result.push({
      pid: pid++,
      type: 'toc',
      label: 'TOC',
      thumbnail: thumbnailConfig.tocThumbnail,
      isHidden: thumbnailConfig.hiddenPages?.toc || false,
    });

    // Editor's Note (if exists)
    if (hasEditorNote) {
      result.push({
        pid: pid++,
        type: 'editors-note',
        label: "Editor's Note",
        thumbnail: thumbnailConfig.editorNoteThumbnail,
        isHidden: thumbnailConfig.hiddenPages?.editorNote || false,
      });
    }

    // Sections
    sections.forEach((section) => {
      const sectionThumbnail = thumbnailConfig.sectionThumbnails?.[section.id] || extractSectionThumbnail(section);
      const isHidden = thumbnailConfig.hiddenPages?.sections?.includes(section.id) || false;

      result.push({
        pid: pid++,
        type: 'section',
        label: section.tocTitle || section.title || `Section ${section.id}`,
        thumbnail: sectionThumbnail,
        isHidden,
      });
    });

    return result;
  }, [thumbnailConfig, coverImage, hasEditorNote, sections]);

  // Filter visible pages
  const visiblePages = pages.filter(p => !p.isHidden);

  // Reset active pid if it's out of bounds
  useEffect(() => {
    if (activePid >= visiblePages.length && visiblePages.length > 0) {
      setActivePid(0);
    }
  }, [visiblePages.length, activePid]);

  if (isLoadingSections) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-500">Loading sections...</span>
        </div>
      </div>
    );
  }

  if (visiblePages.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500">No visible thumbnails configured.</p>
        <p className="text-sm text-gray-400 mt-2">
          Add thumbnails in the Thumbnails tab or ensure pages are not hidden.
        </p>
      </div>
    );
  }

  // Get layout preference (default to portrait)
  const layout = thumbnailConfig.thumbnailLayout || 'portrait';

  // Grid columns: more for landscape (wider items), fewer for portrait (taller items)
  const gridColsClass = layout === 'landscape' ? 'grid-cols-3' : 'grid-cols-4';

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Thumbnail Navigation Preview ({visiblePages.length} pages) - {layout === 'landscape' ? 'Landscape' : 'Portrait'}
      </h3>

      {/* Navigation Container - mimics the actual layout */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          {/* Prev Arrow */}
          <button
            onClick={() => setActivePid(Math.max(0, activePid - 1))}
            disabled={activePid === 0}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Thumbnail Grid */}
          <div className={`flex-1 grid ${gridColsClass} gap-4`}>
            {visiblePages.map((page, index) => (
              <ThumbnailItemPreview
                key={`${page.type}-${page.pid}`}
                label={page.label}
                thumbnail={page.thumbnail}
                isHidden={page.isHidden}
                isActive={index === activePid}
                onClick={() => setActivePid(index)}
                layout={layout}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={() => setActivePid(Math.min(visiblePages.length - 1, activePid + 1))}
            disabled={activePid >= visiblePages.length - 1}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Current Page Info */}
        <div className="mt-4 text-center text-sm text-gray-600">
          {visiblePages[activePid]?.label || 'Unknown Page'}
          <span className="text-gray-400 ml-2">
            ({activePid + 1} of {visiblePages.length})
          </span>
        </div>
      </div>

      {/* Hidden Pages Info */}
      {pages.some(p => p.isHidden) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>{pages.filter(p => p.isHidden).length}</strong> page(s) hidden from navigation
          </p>
        </div>
      )}
    </div>
  );
}
