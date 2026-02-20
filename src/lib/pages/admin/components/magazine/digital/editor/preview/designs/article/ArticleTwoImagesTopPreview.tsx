'use client';

/**
 * ArticleTwoImagesTopPreview - Multiple images with title and article
 * Reference: page-article-2-image-top.png
 *
 * Layout: Two images at top (large + small with caption), title, two-column article
 * with optional third image or content block floated in the article.
 */

import React from 'react';
import type { DigitalPreviewComponentProps } from '../../../types';
import { useArticleTwoImagesTopProps } from '../util/usePageData';
import { ContentBlockRenderer } from '../util/ContentBlockRenderer';
import EmbeddableBusinessCard from '@/lib/pages/magazine/components/content/shared/EmbeddableBusinessCard';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ArticleTwoImagesTopPreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const {
    backgroundColor,
    mainImageUrl,
    mainImageFit,
    mainImagePosition,
    secondImageUrl,
    secondImageFit,
    secondImagePosition,
    secondImageCaption,
    articleTitle,
    subtitle,
    articleContent,
    thirdImageUrl,
    thirdImageFit,
    thirdImagePosition,
    thirdImageCaption,
    showDropCap,
    customBlock,
    professionalId,
    showThirdImage,
    showContentBlock,
    showDigitalCard,
  } = useArticleTwoImagesTopProps(pageData);

  // Handle empty state
  if (!mainImageUrl || !secondImageUrl || !articleTitle) {
    return (
      <div
        className="w-full h-full flex items-center justify-center p-8"
        style={{ backgroundColor }}
      >
        <span className="text-gray-400 text-sm">
          Add main image, second image, and title to preview layout
        </span>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full overflow-hidden p-6"
      style={{ backgroundColor, fontFamily: 'Georgia, serif' }}
    >
      {/* Top Images Row */}
      <div className="flex gap-4 mb-6" style={{ height: '35%' }}>
        {/* Main Image (Large) */}
        <div style={{ width: '65%' }}>
          <img
            src={mainImageUrl}
            alt="Main image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: mainImageFit as any,
              objectPosition: mainImagePosition,
            }}
          />
        </div>

        {/* Second Image (Small) with Caption */}
        <div style={{ width: '35%' }}>
          <img
            src={secondImageUrl}
            alt="Second image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: secondImageFit as any,
              objectPosition: secondImagePosition,
            }}
          />
          {secondImageCaption && (
            <p
              className="text-xs mt-2 text-gray-600"
              style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.4' }}
            >
              {secondImageCaption}
            </p>
          )}
        </div>
      </div>

      {/* Article Title */}
      <h1
        className="text-4xl font-bold text-center mb-2"
        style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em' }}
      >
        {articleTitle}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p
          className="text-sm text-center mb-6 text-gray-700"
          style={{ fontFamily: 'Arial, sans-serif', fontStyle: 'italic' }}
        >
          {subtitle}
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
        {/* Content Block, Digital Card, OR Third Image (floated right) */}
        {showContentBlock && customBlock ? (
          <div
            style={{
              float: 'right',
              width: '40%',
              marginLeft: '1rem',
              marginBottom: '1rem',
              breakInside: 'avoid',
            }}
          >
            <ContentBlockRenderer block={customBlock} />
          </div>
        ) : showDigitalCard ? (
          <div
            style={{
              float: 'right',
              width: '45%',
              marginLeft: '1rem',
              marginBottom: '1rem',
              breakInside: 'avoid',
            }}
          >
            <EmbeddableBusinessCard professionalId={professionalId} compact />
          </div>
        ) : showThirdImage && thirdImageUrl ? (
          <div
            style={{
              float: 'right',
              width: '40%',
              marginLeft: '1rem',
              marginBottom: '1rem',
            }}
          >
            <img
              src={thirdImageUrl}
              alt="Third image"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: thirdImageFit as any,
                objectPosition: thirdImagePosition,
              }}
            />
            {thirdImageCaption && (
              <p
                className="text-xs mt-1 text-gray-600"
                style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.4' }}
              >
                {thirdImageCaption}
              </p>
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
