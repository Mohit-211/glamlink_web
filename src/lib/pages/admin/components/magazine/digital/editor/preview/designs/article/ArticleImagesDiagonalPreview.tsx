'use client';

/**
 * ArticleImagesDiagonalPreview - Diagonal image positioning with flowing text
 * Reference: page-article-image-top-right-image-bottom-left.png (Vogue-style)
 *
 * Layout: Three-column article text with images positioned diagonally:
 * - Top-right image floats in the header area
 * - Bottom-left image floats within the column content
 * - Text flows naturally around both images
 */

import React from 'react';
import type { DigitalPreviewComponentProps } from '../../../types';
import { useArticleImagesDiagonalProps } from '../util/usePageData';
import { ContentBlockRenderer } from '../util/ContentBlockRenderer';
import EmbeddableBusinessCard from '@/lib/pages/magazine/components/content/shared/EmbeddableBusinessCard';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ArticleImagesDiagonalPreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const {
    backgroundColor,
    topRightImageUrl,
    topRightImageFit,
    topRightImagePosition,
    topRightCaption,
    bottomLeftImageUrl,
    bottomLeftImageFit,
    bottomLeftImagePosition,
    bottomLeftCaption,
    articleTitle,
    byline,
    articleContent,
    imageSize,
    imageWidthPercent,
    showDropCap,
    topRightBlock,
    topRightProfessionalId,
    showTopRightImage,
    showTopRightBlock,
    showTopRightDigitalCard,
    bottomLeftBlock,
    bottomLeftProfessionalId,
    showBottomLeftImage,
    showBottomLeftBlock,
    showBottomLeftDigitalCard,
  } = useArticleImagesDiagonalProps(pageData);

  // Handle empty state - allow content blocks, digital cards, or images
  const hasTopRightContent = showTopRightImage && topRightImageUrl || showTopRightBlock || showTopRightDigitalCard;
  const hasBottomLeftContent = showBottomLeftImage && bottomLeftImageUrl || showBottomLeftBlock || showBottomLeftDigitalCard;

  if (!hasTopRightContent || !hasBottomLeftContent || !articleContent) {
    return (
      <div
        className="w-full h-full flex items-center justify-center p-8"
        style={{ backgroundColor }}
      >
        <span className="text-gray-400 text-sm">
          Add both images (or content blocks) and article content to preview layout
        </span>
      </div>
    );
  }

  // Caption style (shared)
  const captionStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    fontSize: '0.75rem',
    lineHeight: '1.4',
    fontFamily: 'Arial, sans-serif',
    padding: '0.5rem',
    marginTop: '0.5rem',
  };

  return (
    <div
      className="w-full h-full overflow-hidden p-6"
      style={{ backgroundColor, fontFamily: 'Georgia, serif' }}
    >
      {/* Header Section with Floating Top-Right Image/Block */}
      <div style={{ overflow: 'hidden', marginBottom: '1rem' }}>
        {/* Top Right - Content Block, Digital Card, OR Image - Float Right */}
        {showTopRightBlock && topRightBlock ? (
          <div
            style={{
              float: 'right',
              width: imageWidthPercent,
              marginLeft: '1.5rem',
              marginBottom: '1rem',
            }}
          >
            <ContentBlockRenderer block={topRightBlock} />
          </div>
        ) : showTopRightDigitalCard ? (
          <div
            style={{
              float: 'right',
              width: imageWidthPercent,
              marginLeft: '1.5rem',
              marginBottom: '1rem',
            }}
          >
            <EmbeddableBusinessCard professionalId={topRightProfessionalId} compact />
          </div>
        ) : showTopRightImage && topRightImageUrl ? (
          <div
            style={{
              float: 'right',
              width: imageWidthPercent,
              marginLeft: '1.5rem',
              marginBottom: '1rem',
            }}
          >
            <img
              src={topRightImageUrl}
              alt="Top right image"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: topRightImageFit as any,
                objectPosition: topRightImagePosition,
                display: 'block',
              }}
            />
            {topRightCaption && (
              <div style={captionStyle}>{topRightCaption}</div>
            )}
          </div>
        ) : null}

        {/* Title and Byline - Flows around floated image */}
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
            className="text-xs uppercase tracking-wider mb-4 text-gray-600"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {byline}
          </p>
        )}
      </div>

      {/* Three-Column Article Content with Bottom-Left Image/Block */}
      <div
        className={showDropCap ? 'drop-cap-article' : ''}
        style={{
          columnCount: 3,
          columnGap: '1.5rem',
          textAlign: 'justify',
          fontSize: '0.8rem',
          lineHeight: '1.5',
        }}
      >
        {/* Bottom Left - Content Block, Digital Card, OR Image - Float Left Inside Columns */}
        {showBottomLeftBlock && bottomLeftBlock ? (
          <div
            style={{
              float: 'left',
              width: '45%',
              marginRight: '1rem',
              marginBottom: '1rem',
              breakInside: 'avoid',
            }}
          >
            <ContentBlockRenderer block={bottomLeftBlock} />
          </div>
        ) : showBottomLeftDigitalCard ? (
          <div
            style={{
              float: 'left',
              width: '45%',
              marginRight: '1rem',
              marginBottom: '1rem',
              breakInside: 'avoid',
            }}
          >
            <EmbeddableBusinessCard professionalId={bottomLeftProfessionalId} compact />
          </div>
        ) : showBottomLeftImage && bottomLeftImageUrl ? (
          <div
            style={{
              float: 'left',
              width: '45%',
              marginRight: '1rem',
              marginBottom: '1rem',
              breakInside: 'avoid',
            }}
          >
            <img
              src={bottomLeftImageUrl}
              alt="Bottom left image"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: bottomLeftImageFit as any,
                objectPosition: bottomLeftImagePosition,
                display: 'block',
              }}
            />
            {bottomLeftCaption && (
              <div style={captionStyle}>{bottomLeftCaption}</div>
            )}
          </div>
        ) : null}

        {/* Article Content */}
        <div dangerouslySetInnerHTML={{ __html: articleContent }} />
      </div>

      {/* Drop Cap Styling */}
      <style jsx>{`
        .drop-cap-article::first-letter {
          float: left;
          font-size: 3rem;
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
