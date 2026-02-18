'use client';

/**
 * ImageCenteredWithBorderPreview - Centered image with colored border
 *
 * Reference: full-page-image-centered.png
 * Layout: Colored background with centered image inset
 */

import React from 'react';
import type { DigitalPreviewComponentProps } from '../../../types';
import { useImageCenteredWithBorderProps } from '../util/usePageData';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ImageCenteredWithBorderPreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const {
    imageUrl,
    objectFit,
    objectPosition,
    borderColor,
    borderWidth,
    imageWidth,
    paddingPx,
  } = useImageCenteredWithBorderProps(pageData);

  if (!imageUrl) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: borderColor }}
      >
        <div className="bg-gray-200 flex items-center justify-center rounded"
          style={{
            width: imageWidth,
            height: '80%',
          }}
        >
          <span className="text-gray-400 text-sm">No image selected</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        backgroundColor: borderColor,
        padding: `${paddingPx}px`,
      }}
    >
      <img
        src={imageUrl}
        alt="Centered image with border"
        style={{
          width: imageWidth,
          height: '100%',
          objectFit: objectFit as any,
          objectPosition,
        }}
      />
    </div>
  );
}
