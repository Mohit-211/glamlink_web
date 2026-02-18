'use client';

/**
 * ArticleImageCenterWithQuotePreview - Centered image + article with quote
 * Reference: page-article-image-center-2-col-with-quote.png
 *
 * Layout: Large centered image, title, then article content split into sections
 * with pull quote (or content block) centered at the specified position.
 */

import React, { useMemo } from 'react';
import type { DigitalPreviewComponentProps } from '../../../types';
import { useArticleImageCenterWithQuoteProps } from '../util/usePageData';
import { splitContentAtPosition } from '../util/contentHelpers';
import { ContentBlockRenderer } from '../util/ContentBlockRenderer';
import EmbeddableBusinessCard from '@/lib/pages/magazine/components/content/shared/EmbeddableBusinessCard';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ArticleImageCenterWithQuotePreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const {
    backgroundColor,
    heroImageUrl,
    heroImageFit,
    heroImagePosition,
    imageWidth,
    articleTitle,
    subtitle,
    articleContent,
    pullQuote,
    quoteContext,
    quotePosition,
    showDropCap,
    customBlock,
    professionalId,
    showQuote,
    showContentBlock,
    showDigitalCard,
  } = useArticleImageCenterWithQuoteProps(pageData);

  // Split content at the quote position percentage
  const [firstSection, secondSection] = useMemo(
    () => splitContentAtPosition(articleContent, quotePosition),
    [articleContent, quotePosition]
  );

  // Handle empty state
  if (!heroImageUrl || !articleTitle) {
    return (
      <div
        className="w-full h-full flex items-center justify-center p-8"
        style={{ backgroundColor }}
      >
        <span className="text-gray-400 text-sm">
          Add hero image and title to preview layout
        </span>
      </div>
    );
  }

  // Column styling (reused for both sections)
  const columnStyle: React.CSSProperties = {
    columnCount: 2,
    columnGap: '2rem',
    textAlign: 'justify',
    fontSize: '0.875rem',
    lineHeight: '1.6',
  };

  return (
    <div
      className="w-full h-full overflow-hidden p-6"
      style={{ backgroundColor, fontFamily: 'Georgia, serif' }}
    >
      {/* Centered Hero Image */}
      <div className="flex justify-center mb-6" style={{ height: '40%' }}>
        <img
          src={heroImageUrl}
          alt="Hero image"
          style={{
            width: imageWidth,
            height: '100%',
            objectFit: heroImageFit as any,
            objectPosition: heroImagePosition,
          }}
        />
      </div>

      {/* Article Title (Centered) */}
      <h1
        className="text-4xl font-bold text-center mb-2"
        style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em' }}
      >
        {articleTitle}
      </h1>

      {/* Subtitle (Centered) */}
      {subtitle && (
        <p
          className="text-sm text-center mb-6 text-gray-700"
          style={{ fontFamily: 'Arial, sans-serif', fontStyle: 'italic' }}
        >
          {subtitle}
        </p>
      )}

      {/* First Section - Two Columns */}
      {firstSection && (
        <div
          className={showDropCap ? 'drop-cap-article' : ''}
          style={columnStyle}
        >
          <div dangerouslySetInnerHTML={{ __html: firstSection }} />
        </div>
      )}

      {/* Content Block, Digital Card, OR Pull Quote - Full Width, Centered */}
      {showContentBlock && customBlock ? (
        <div className="my-6 mx-auto" style={{ maxWidth: '90%' }}>
          <ContentBlockRenderer block={customBlock} />
        </div>
      ) : showDigitalCard ? (
        <div className="my-6 mx-auto" style={{ maxWidth: '90%' }}>
          <EmbeddableBusinessCard professionalId={professionalId} compact />
        </div>
      ) : showQuote && pullQuote ? (
        <div
          className="my-6 mx-auto"
          style={{
            maxWidth: '80%',
            textAlign: 'center',
            borderTop: '2px solid #000',
            borderBottom: '2px solid #000',
            padding: '1.5rem 1rem',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <p
            className="text-lg font-semibold mb-2"
            style={{ lineHeight: '1.3' }}
          >
            {pullQuote}
          </p>
          {quoteContext && (
            <p className="text-xs text-gray-700">{quoteContext}</p>
          )}
        </div>
      ) : null}

      {/* Second Section - Two Columns */}
      {secondSection && (
        <div style={columnStyle}>
          <div dangerouslySetInnerHTML={{ __html: secondSection }} />
        </div>
      )}

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
