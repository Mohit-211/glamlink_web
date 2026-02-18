'use client';

/**
 * ImageWithCornerCaptionPreview - Full page image with caption box in corner
 *
 * Reference: page-image-with-caption.png
 * Layout: Full bleed image with small caption box in specified corner
 *
 * Features:
 * - useFullPageImage: When true, image fills entire page (respects pdfSettings margin)
 * - captionBackgroundColor: Background color for caption box (default: transparent)
 */

import React from 'react';
import type { DigitalPreviewComponentProps } from '../../../types';
import { useImageWithCornerCaptionProps } from '../util/usePageData';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ImageWithCornerCaptionPreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const {
    imageUrl,
    objectFit,
    objectPosition,
    captionPosition,
    captionPositionClasses,
    hasCaptionContent,
    titleStyles,
    captionStyles,
    useFullPageImage,
    captionBoxStyle,
  } = useImageWithCornerCaptionProps(pageData);

  // Internal padding when not using full page image
  const containerPadding = useFullPageImage ? 0 : 24;

  return (
    <div className="relative w-full h-full" style={{ padding: containerPadding }}>
      {/* Background Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={pageData.captionTitle || 'Page image'}
          className={useFullPageImage ? "absolute inset-0 w-full h-full" : "w-full h-full rounded"}
          style={{
            objectFit: objectFit as any,
            objectPosition,
          }}
        />
      ) : (
        <div className={`${useFullPageImage ? "absolute inset-0" : "w-full h-full rounded"} bg-gray-200 flex items-center justify-center`}>
          <span className="text-gray-400 text-sm">No image selected</span>
        </div>
      )}

      {/* Caption Box - transparent background by default */}
      {hasCaptionContent && (
        <div
          className={`absolute ${captionPositionClasses} max-w-[200px]`}
          style={captionBoxStyle}
        >
          {pageData.captionTitle && (
            <h3
              className="text-xs font-bold uppercase tracking-wide mb-1"
              style={titleStyles}
            >
              {pageData.captionTitle}
            </h3>
          )}
          {pageData.caption && (
            <p
              className="text-xs leading-tight"
              style={captionStyles}
            >
              {pageData.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
