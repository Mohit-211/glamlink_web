'use client';

/**
 * FullPageImagePreview - Full bleed image covering entire page
 *
 * Reference: full-page-image.png
 * Layout: Image covers entire page with object-fit: cover
 */

import React from 'react';
import type { DigitalPreviewComponentProps } from '../../../types';
import { useFullPageImageProps } from '../util/usePageData';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function FullPageImagePreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const { imageUrl, objectFit, objectPosition } = useFullPageImageProps(pageData);

  if (!imageUrl) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No image selected</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <img
        src={imageUrl}
        alt="Full page image"
        className="w-full h-full"
        style={{
          objectFit: objectFit as any,
          objectPosition,
        }}
      />
    </div>
  );
}
