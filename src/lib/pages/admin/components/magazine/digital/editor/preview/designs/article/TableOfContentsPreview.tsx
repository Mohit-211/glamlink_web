'use client';

/**
 * TableOfContentsPreview - 2-column grid of page entries
 * Reference: table-of-contents-layout.png
 *
 * Layout: 2-column grid of cards
 * Each card: Image at top, Title (black), Subtitle (teal), Page number (right)
 * Cards include data-pdf-link-page attribute for PDF internal link generation
 */

import React from 'react';
import type { DigitalPreviewComponentProps, TocEntry } from '../../../types';
import { useTableOfContentsProps } from '../util/usePageData';
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from '../util/previewHelpers';

// Glamlink teal color constant
const GLAMLINK_TEAL = '#14b8a6';

// Placeholder icon for empty image slots (defined outside component to avoid recreation)
const PlaceholderIcon = () => (
  <svg
    className="w-12 h-12"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default function TableOfContentsPreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const {
    tocTitle,
    tocEntries,
    backgroundColor,
    bgStyle,
    titleStyles,
  } = useTableOfContentsProps(pageData, pdfSettings);

  // Get page-level image placement setting (defaults to 'top')
  const imagePlacement = pageData?.tocImagePlacement || 'top';

  // Empty state
  if (!tocEntries || tocEntries.length === 0) {
    return (
      <div
        className="w-full h-full flex items-center justify-center p-8"
        style={{ backgroundColor }}
      >
        <span className="text-gray-400 text-sm">
          Add entries to create a table of contents
        </span>
      </div>
    );
  }

  // Calculate number of rows for equal-height grid
  const numRows = Math.ceil(tocEntries.length / 2);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6" style={bgStyle}>
      {/* Optional Header Title */}
      {tocTitle && (
        <h1
          className="text-2xl font-bold tracking-wider text-center mb-6 uppercase"
          style={titleStyles}
        >
          {tocTitle}
        </h1>
      )}

      {/* 2-Column Grid with equal row heights */}
      <div
        className="flex-1 grid grid-cols-2 gap-4 overflow-auto"
        style={{ gridTemplateRows: `repeat(${numRows}, 1fr)` }}
      >
        {tocEntries.map((entry, index) => (
          <TocCard
            key={index}
            entry={entry}
            imagePlacement={imagePlacement}
            data-pdf-link-page={entry.pageNumber}
          />
        ))}
      </div>
    </div>
  );
}

interface TocCardProps {
  entry: TocEntry;
  imagePlacement: 'top' | 'left';
  'data-pdf-link-page'?: number;
}

function TocCard({ entry, imagePlacement, ...rest }: TocCardProps) {
  const imageUrl = getImageUrl(entry.image);
  const objectFit = getImageObjectFit(entry.image);
  const objectPosition = getImageObjectPosition(entry.image);

  // LEFT LAYOUT: Image on left (50% width), content on right (50% width)
  if (imagePlacement === 'left') {
    return (
      <div
        className="flex flex-row h-full border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer"
        {...rest}
      >
        {/* Image - left side, 50% width, full height */}
        <div className="w-1/2 h-full bg-gray-100 flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={entry.title}
              className="w-full h-full"
              style={{
                objectFit: objectFit as React.CSSProperties['objectFit'],
                objectPosition,
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <PlaceholderIcon />
            </div>
          )}
        </div>
        {/* Content - right side, 50% width, fills height */}
        <div className="w-1/2 p-3 flex flex-col h-full">
          <div className="flex-1">
            <h3
              className="text-sm font-semibold leading-snug"
              style={{ color: '#000000' }}
            >
              {entry.title || 'Untitled'}
            </h3>
            {entry.subtitle && (
              <p
                className="text-xs leading-snug mt-1"
                style={{ color: GLAMLINK_TEAL }}
              >
                {entry.subtitle}
              </p>
            )}
          </div>
          <span className="text-xs text-gray-500 font-medium flex-shrink-0">
            p{entry.pageNumber}
          </span>
        </div>
      </div>
    );
  }

  // TOP LAYOUT (default): Image at top, content at bottom
  return (
    <div
      className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer"
      {...rest}
    >
      {/* Image at TOP - takes all remaining space */}
      <div className="w-full flex-1 min-h-[80px] bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={entry.title}
            className="w-full h-full"
            style={{
              objectFit: objectFit as React.CSSProperties['objectFit'],
              objectPosition,
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <PlaceholderIcon />
          </div>
        )}
      </div>

      {/* Content - fixed minimum height, doesn't expand */}
      <div className="p-2 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          {/* Title and Subtitle */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-xs font-semibold line-clamp-1 truncate"
              style={{ color: '#000000' }}
            >
              {entry.title || 'Untitled'}
            </h3>
            {entry.subtitle && (
              <p
                className="text-xs line-clamp-1 truncate leading-tight"
                style={{ color: GLAMLINK_TEAL }}
              >
                {entry.subtitle}
              </p>
            )}
          </div>
          {/* Page number - inline on right */}
          <span className="text-xs text-gray-500 font-medium flex-shrink-0">
            p{entry.pageNumber}
          </span>
        </div>
      </div>
    </div>
  );
}
