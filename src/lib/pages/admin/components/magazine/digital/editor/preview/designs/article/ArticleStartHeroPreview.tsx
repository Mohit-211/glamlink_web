'use client';

/**
 * ArticleStartHeroPreview - Article start page with hero image
 *
 * Reference: page-article-start-1.png
 * Layout: Large hero image at top, title, subtitle, 2-column article text
 */

import React from 'react';
import type { DigitalPreviewComponentProps } from '../../../types';
import { useArticleStartHeroProps } from '../util/usePageData';
import { renderWithDropCap } from '../util/previewHelpers';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ArticleStartHeroPreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const {
    heroImageUrl,
    objectFit,
    objectPosition,
    backgroundColor,
    bgStyle,
    dropCapEnabled,
    titleStyles,
    subtitleStyles,
  } = useArticleStartHeroProps(pageData, pdfSettings);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={bgStyle}>
      {/* Hero Image Section - approximately 40% of page */}
      <div className="w-full h-[40%] flex-shrink-0">
        {heroImageUrl ? (
          <img
            src={heroImageUrl}
            alt={pageData.title || 'Hero image'}
            className="w-full h-full"
            style={{
              objectFit: objectFit as any,
              objectPosition,
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No hero image selected</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col px-6 py-4 overflow-hidden">
        {/* Title */}
        {pageData.title && (
          <h1
            className="text-2xl font-bold tracking-wide uppercase mb-2 text-center"
            style={titleStyles}
          >
            {pageData.title}
          </h1>
        )}

        {/* Subtitle / Deck */}
        {pageData.subtitle && (
          <p
            className="text-sm text-center mb-4 italic"
            style={subtitleStyles}
          >
            {pageData.subtitle}
          </p>
        )}

        {/* Divider line */}
        <div className="w-16 h-0.5 bg-black mx-auto mb-4" />

        {/* Two Column Article Content */}
        {pageData.articleContent && (
          <div className="flex-1 overflow-hidden">
            <div
              className="text-xs leading-relaxed columns-2 gap-4"
              style={{
                fontSize: '10px',
                lineHeight: '1.6',
                color: '#1F2937',
              }}
            >
              {renderWithDropCap(pageData.articleContent, dropCapEnabled)}
            </div>
          </div>
        )}

        {/* Placeholder if no content */}
        {!pageData.articleContent && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Article content will appear here...</span>
          </div>
        )}
      </div>
    </div>
  );
}
