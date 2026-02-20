'use client';

/**
 * ArticleTwoColumnTextPreview - Article with optional sidebar and drop cap
 * Reference: page-article-start-2-col.png
 * Layout: Optional dark sidebar on left, two-column article with drop cap
 */

import React from 'react';
import type { DigitalPreviewComponentProps } from '../../../types';
import { useArticleTwoColumnTextProps } from '../util/usePageData';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ArticleTwoColumnTextPreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const {
    backgroundColor,
    articleTitle,
    byline,
    sidebarContent,
    sidebarBackgroundColor,
    articleContent,
    showDropCap,
    hasSidebar,
  } = useArticleTwoColumnTextProps(pageData);

  // Handle empty state
  if (!articleContent) {
    return (
      <div
        className="w-full h-full flex items-center justify-center p-8"
        style={{ backgroundColor }}
      >
        <span className="text-gray-400 text-sm">
          Add article content to preview layout
        </span>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full overflow-hidden flex"
      style={{ backgroundColor, fontFamily: 'Georgia, serif' }}
    >
      {/* Optional Sidebar */}
      {hasSidebar && (
        <div
          className="flex-shrink-0 p-6"
          style={{
            width: '25%',
            backgroundColor: sidebarBackgroundColor,
            color: '#ffffff',
            fontSize: '0.75rem',
            lineHeight: '1.5',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: sidebarContent }} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {/* Article Header */}
        {articleTitle && (
          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {articleTitle}
          </h1>
        )}

        {byline && (
          <p
            className="text-xs uppercase tracking-wider mb-6 text-gray-600"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {byline}
          </p>
        )}

        {/* Two-Column Article Content */}
        <div
          className={showDropCap ? 'drop-cap-article' : ''}
          style={{
            columnCount: 2,
            columnGap: '2rem',
            textAlign: 'justify',
            fontSize: '0.875rem',
            lineHeight: '1.6',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: articleContent }} />
        </div>
      </div>

      {/* Drop Cap Styling */}
      <style jsx>{`
        .drop-cap-article::first-letter {
          float: left;
          font-size: 3.5rem;
          line-height: 0.8;
          margin-right: 0.5rem;
          margin-top: 0.2rem;
          font-weight: bold;
          font-family: 'Arial', sans-serif;
        }
      `}</style>
    </div>
  );
}
