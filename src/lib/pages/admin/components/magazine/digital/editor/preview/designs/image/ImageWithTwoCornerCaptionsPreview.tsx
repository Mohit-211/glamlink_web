'use client';

/**
 * ImageWithTwoCornerCaptionsPreview - Full page image with TWO caption boxes in corners
 *
 * Similar to ImageWithCornerCaptionPreview but with two independent caption boxes.
 *
 * Features:
 * - useFullPageImage: When true, image fills entire page (respects pdfSettings margin)
 * - captionBackgroundColor: Background color for caption 1 box (default: transparent)
 * - caption2BackgroundColor: Background color for caption 2 box (default: transparent)
 * - Independent positioning for each caption (top-left, top-right, bottom-left, bottom-right)
 */

import React from 'react';
import type { DigitalPreviewComponentProps } from '../../../types';
import { useImageWithTwoCornerCaptionsProps } from '../util/usePageData';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ImageWithTwoCornerCaptionsPreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const {
    imageUrl,
    objectFit,
    objectPosition,
    useFullPageImage,
    // Caption 1
    captionPositionClasses,
    hasCaptionContent,
    captionBoxStyle,
    titleStyles,
    captionStyles,
    // Caption 2
    caption2PositionClasses,
    hasCaption2Content,
    caption2BoxStyle,
    caption2TitleStyles,
    caption2Styles,
  } = useImageWithTwoCornerCaptionsProps(pageData);

  // Internal padding when not using full page image
  const containerPadding = useFullPageImage ? 0 : 24;

  return (
    <div className="relative w-full h-full" style={{ padding: containerPadding }}>
      {/* Background Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={pageData.captionTitle || pageData.caption2Title || 'Page image'}
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

      {/* Caption Box 1 - transparent background by default */}
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

      {/* Caption Box 2 - transparent background by default */}
      {hasCaption2Content && (
        <div
          className={`absolute ${caption2PositionClasses} max-w-[200px]`}
          style={caption2BoxStyle}
        >
          {pageData.caption2Title && (
            <h3
              className="text-xs font-bold uppercase tracking-wide mb-1"
              style={caption2TitleStyles}
            >
              {pageData.caption2Title}
            </h3>
          )}
          {pageData.caption2 && (
            <p
              className="text-xs leading-tight"
              style={caption2Styles}
            >
              {pageData.caption2}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
