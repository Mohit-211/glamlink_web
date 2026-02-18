'use client';

/**
 * ImageWithTitlePreview - Centered image with title and subtitle below
 *
 * Reference: page-image-with-title.png
 * Layout: Centered image (80% width), title centered below, subtitle below title
 */

import React from 'react';
import type { DigitalPreviewComponentProps } from '../../../types';
import { useImageWithTitleProps } from '../util/usePageData';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ImageWithTitlePreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const {
    imageUrl,
    objectFit,
    objectPosition,
    backgroundColor,
    bgStyle,
    titleStyles,
    subtitleStyles,
  } = useImageWithTitleProps(pageData, pdfSettings);

  return (
    <div className="w-full h-full flex flex-col" style={bgStyle}>
      {/* Image Section - takes most of the space */}
      <div className="flex-1 flex items-center justify-center p-8">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={pageData.title || 'Image'}
            className="max-w-[80%] max-h-full object-contain"
            style={{
              objectFit: objectFit as any,
              objectPosition,
            }}
          />
        ) : (
          <div className="w-[80%] h-64 bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-400 text-sm">No image selected</span>
          </div>
        )}
      </div>

      {/* Title Section - fixed at bottom */}
      <div className="flex-shrink-0 pb-8 px-8 text-center">
        {pageData.title && (
          <h1
            className="text-3xl font-bold tracking-wider uppercase mb-2"
            style={titleStyles}
          >
            {pageData.title}
          </h1>
        )}
        {pageData.subtitle && (
          <p
            className="text-sm tracking-wide"
            style={subtitleStyles}
          >
            {pageData.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
