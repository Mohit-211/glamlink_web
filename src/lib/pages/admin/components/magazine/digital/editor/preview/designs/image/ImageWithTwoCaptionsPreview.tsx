'use client';

/**
 * ImageWithTwoCaptionsPreview - Image with two positioned caption boxes
 *
 * Reference: page-image-with-2-captions.png
 * Layout: Main image on left (~70%), title box top-right, caption box bottom-right
 */

import React from 'react';
import type { DigitalPreviewComponentProps } from '../../../types';
import { useImageWithTwoCaptionsProps } from '../util/usePageData';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ImageWithTwoCaptionsPreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const {
    imageUrl,
    objectFit,
    objectPosition,
    backgroundColor,
    bgStyle,
    hasTitleBox,
    hasCaptionBox,
    titleStyles,
    subtitleStyles,
    captionStyles,
  } = useImageWithTwoCaptionsProps(pageData, pdfSettings);

  return (
    <div className="relative w-full h-full flex" style={bgStyle}>
      {/* Main Image - Left side (~70%) */}
      <div className="w-[70%] h-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={pageData.titleBox || 'Main image'}
            className="w-full h-full"
            style={{
              objectFit: objectFit as any,
              objectPosition,
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image selected</span>
          </div>
        )}
      </div>

      {/* Right side content area (~30%) */}
      <div className="w-[30%] h-full flex flex-col justify-between py-4 px-3">
        {/* Title Box - Top Right */}
        {hasTitleBox && (
          <div className="text-right">
            {pageData.titleBox && (
              <h2
                className="text-sm font-bold uppercase tracking-wide mb-2"
                style={titleStyles}
              >
                {pageData.titleBox}
              </h2>
            )}
            {pageData.titleBoxContent && (
              <p
                className="text-xs leading-relaxed"
                style={subtitleStyles}
              >
                {pageData.titleBoxContent}
              </p>
            )}
          </div>
        )}

        {/* Spacer if no title box */}
        {!hasTitleBox && <div />}

        {/* Caption Box - Bottom Right */}
        {hasCaptionBox && (
          <div className="text-right">
            {pageData.captionTitle && (
              <h3
                className="text-xs font-bold uppercase tracking-wide mb-1"
                style={captionStyles}
              >
                {pageData.captionTitle}
              </h3>
            )}
            {pageData.captionContent && (
              <p
                className="text-xs leading-relaxed"
                style={{
                  fontSize: '8px',
                  color: '#374151',
                  lineHeight: '1.5',
                  textAlign: 'right',
                }}
              >
                {pageData.captionContent}
              </p>
            )}
          </div>
        )}

        {/* Page Number Placeholder - Bottom */}
        <div className="text-right text-xs text-gray-400 mt-2">
          <span style={{ fontSize: '8px' }}>113</span>
        </div>
      </div>

      {/* Left margin text (photographer credits - vertical) */}
      <div
        className="absolute left-1 top-1/2 -translate-y-1/2 transform -rotate-90 origin-center"
        style={{
          fontSize: '6px',
          color: '#9CA3AF',
          whiteSpace: 'nowrap',
        }}
      >
        PHOTOGRAPHER CREDIT
      </div>
    </div>
  );
}
