'use client';

/**
 * TwoColumnWithQuotePreview - Two-column article with centered pull quote
 * Reference: page-2-column-with-center-quote.png
 *
 * Layout: Two side-by-side columns with a centered quote/block that text wraps around.
 * Uses runtime measurement to dynamically insert spacers for proper text wrapping.
 *
 * Key approach:
 * - Two flex columns instead of CSS columns
 * - Quote positioned absolutely in center
 * - Spacers inserted dynamically based on measured positions
 * - Recalculates on resize/font load
 */

import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import type { DigitalPreviewComponentProps } from '../../../types';
import { useTwoColumnWithQuoteProps } from '../util/usePageData';
import { splitIntoTwoColumns } from '../util/contentHelpers';
import { ContentBlockRenderer } from '../util/ContentBlockRenderer';
import EmbeddableBusinessCard from '@/lib/pages/magazine/components/content/shared/EmbeddableBusinessCard';

// =============================================================================
// SPACER CLASS NAME (for cleanup)
// =============================================================================

const SPACER_CLASS = 'js-dynamic-spacer';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function TwoColumnWithQuotePreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const {
    backgroundColor,
    articleTitle,
    byline,
    articleContent,
    pullQuote,
    quoteContext,
    quotePosition,
    customBlock,
    professionalId,
    showQuote,
    showContentBlock,
    showDigitalCard,
  } = useTwoColumnWithQuoteProps(pageData);

  // Refs for runtime measurement
  const wrapperRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  // Split content into two columns
  const { leftColumn, rightColumn } = useMemo(
    () => splitIntoTwoColumns(articleContent),
    [articleContent]
  );

  // Determine if we should show the centered element
  const hasContent = showContentBlock && customBlock;
  const hasDigitalCard = showDigitalCard;
  const hasQuote = showQuote && pullQuote;
  const showCenteredElement = hasContent || hasDigitalCard || hasQuote;

  // ==========================================================================
  // RUNTIME MEASUREMENT & SPACER PLACEMENT
  // ==========================================================================

  const placeQuoteAndSpacers = useCallback(() => {
    const wrapper = wrapperRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    const quoteWrapper = quoteRef.current;

    if (!wrapper || !leftCol || !rightCol || !quoteWrapper || !showCenteredElement) {
      return;
    }

    // Clear existing spacers
    leftCol.querySelectorAll(`.${SPACER_CLASS}`).forEach((n) => n.remove());
    rightCol.querySelectorAll(`.${SPACER_CLASS}`).forEach((n) => n.remove());

    // Measure dimensions
    const wrapperRect = wrapper.getBoundingClientRect();
    const leftRect = leftCol.getBoundingClientRect();
    const rightRect = rightCol.getBoundingClientRect();
    const contentHeight = wrapperRect.height;
    const wrapperWidth = wrapperRect.width;

    // Calculate desired top position based on quotePosition percentage
    const desiredTop = contentHeight * (quotePosition / 100);

    // Measure quote dimensions
    quoteWrapper.style.visibility = 'hidden';
    quoteWrapper.style.top = '0px';
    const quoteHeight = quoteWrapper.offsetHeight || 140;
    const quoteWidth = quoteWrapper.offsetWidth;

    // Set quote to final position
    quoteWrapper.style.top = `${Math.round(desiredTop)}px`;
    quoteWrapper.style.visibility = '';

    // Calculate spacer width based on actual quote width
    // The spacer needs to cover the portion of the quote that overlaps the column
    const wrapperCenter = wrapperWidth / 2;
    const quoteLeft = wrapperCenter - quoteWidth / 2;
    const quoteRight = wrapperCenter + quoteWidth / 2;

    // Gap between columns (gap-8 = 2rem = 32px at default font size)
    const columnGap = 32;
    const extraMargin = 12; // Additional margin for clean text wrapping

    // Left column: spacer needs to cover from column's right edge to quote's left edge
    const leftColRight = leftRect.right - wrapperRect.left;
    const leftSpacerWidth = Math.max(0, leftColRight - quoteLeft + extraMargin);
    const leftSpacerPercent = (leftSpacerWidth / leftRect.width) * 100;

    // Right column: spacer needs to cover from column's left edge to quote's right edge
    const rightColLeft = rightRect.left - wrapperRect.left;
    const rightSpacerWidth = Math.max(0, quoteRight - rightColLeft + extraMargin);
    const rightSpacerPercent = (rightSpacerWidth / rightRect.width) * 100;

    // Calculate target Y relative to each column's top
    const leftTargetY = desiredTop - (leftRect.top - wrapperRect.top);
    const rightTargetY = desiredTop - (rightRect.top - wrapperRect.top);

    // Helper to find insertion point - looks at DIRECT children only
    const findInsertBefore = (colEl: HTMLElement, targetY: number): Element | null => {
      const children = Array.from(colEl.children).filter(
        (child) => !child.classList.contains(SPACER_CLASS)
      );
      const colRect = colEl.getBoundingClientRect();

      for (let i = 0; i < children.length; i++) {
        const childRect = children[i].getBoundingClientRect();
        const childTopRelative = childRect.top - colRect.top;
        if (childTopRelative >= targetY - 1) {
          return children[i];
        }
      }
      return null;
    };

    // Create spacer element with calculated width
    const createSpacer = (side: 'left' | 'right', height: number, widthPercent: number): HTMLDivElement => {
      const spacer = document.createElement('div');
      spacer.className = SPACER_CLASS;
      spacer.style.height = `${Math.max(0, Math.round(height + 24))}px`; // +24 for padding around quote
      spacer.style.width = `${Math.min(70, Math.max(25, widthPercent))}%`; // Clamp 25-70%
      spacer.style.clear = side === 'left' ? 'right' : 'left';
      spacer.style.float = side === 'left' ? 'right' : 'left';
      spacer.style.shapeOutside = 'inset(0)';
      if (side === 'left') {
        spacer.style.marginLeft = '8px';
      } else {
        spacer.style.marginRight = '8px';
      }
      return spacer;
    };

    // Find and insert spacers
    const leftInsertBefore = findInsertBefore(leftCol, leftTargetY);
    const rightInsertBefore = findInsertBefore(rightCol, rightTargetY);

    const leftSpacer = createSpacer('left', quoteHeight, leftSpacerPercent);
    const rightSpacer = createSpacer('right', quoteHeight, rightSpacerPercent);

    if (leftInsertBefore) {
      leftCol.insertBefore(leftSpacer, leftInsertBefore);
    } else {
      leftCol.appendChild(leftSpacer);
    }

    if (rightInsertBefore) {
      rightCol.insertBefore(rightSpacer, rightInsertBefore);
    } else {
      rightCol.appendChild(rightSpacer);
    }
  }, [quotePosition, showCenteredElement]);

  // Run measurement after render and on changes
  useEffect(() => {
    // Initial placement after fonts load
    const runOnceReady = () => {
      if (document.fonts && document.fonts.status !== 'loaded') {
        document.fonts.ready
          .then(placeQuoteAndSpacers)
          .catch(placeQuoteAndSpacers);
      } else {
        placeQuoteAndSpacers();
      }
    };

    // Small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(runOnceReady, 50);

    // Resize handler
    let resizeTimeout: NodeJS.Timeout | null = null;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(placeQuoteAndSpacers, 120);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [placeQuoteAndSpacers, articleContent, pullQuote, customBlock]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

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

  // Column text styling
  const columnTextStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    lineHeight: '1.6',
    textAlign: 'justify',
  };

  // Paragraph styling
  const paragraphStyle: React.CSSProperties = {
    marginBottom: '1em',
  };

  return (
    <div
      className="w-full h-full overflow-hidden p-8"
      style={{ backgroundColor, fontFamily: 'Georgia, serif' }}
    >
      {/* Article Header */}
      {articleTitle && (
        <h1
          className="text-2xl font-bold mb-2 text-center"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {articleTitle}
        </h1>
      )}

      {byline && (
        <p
          className="text-xs uppercase tracking-wider mb-6 text-center text-gray-600"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {byline}
        </p>
      )}

      {/* Two-Column Layout with Centered Quote */}
      <div
        ref={wrapperRef}
        className="relative flex gap-8"
        style={{ minHeight: '200px' }}
      >
        {/* Centered Quote/Block - Absolutely Positioned */}
        {showCenteredElement && (
          <div
            ref={quoteRef}
            className="absolute left-1/2 -translate-x-1/2 z-10"
            style={{ width: '50%' }}
          >
            {hasContent ? (
              <div className="bg-white">
                <ContentBlockRenderer block={customBlock} />
              </div>
            ) : hasDigitalCard ? (
              <div className="bg-white">
                <EmbeddableBusinessCard professionalId={professionalId} compact />
              </div>
            ) : hasQuote ? (
              <div
                className="bg-white"
                style={{
                  textAlign: 'center',
                  borderTop: '2px solid #000',
                  borderBottom: '2px solid #000',
                  padding: '1.5rem 1rem',
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                <p
                  className="text-xl font-semibold mb-2"
                  style={{ lineHeight: '1.3' }}
                >
                  {pullQuote}
                </p>
                {quoteContext && (
                  <p className="text-sm text-gray-700">{quoteContext}</p>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Left Column */}
        <div ref={leftColRef} className="flex-1" style={columnTextStyle}>
          {leftColumn.map((paragraph, index) => (
            <div
              key={`left-${index}`}
              style={paragraphStyle}
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}
        </div>

        {/* Right Column */}
        <div ref={rightColRef} className="flex-1" style={columnTextStyle}>
          {rightColumn.map((paragraph, index) => (
            <div
              key={`right-${index}`}
              style={paragraphStyle}
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
