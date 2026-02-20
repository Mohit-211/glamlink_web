/**
 * Shared helper functions for Digital Page Preview components
 * Consolidates common image, typography, layout, and rendering utilities
 */

import React from 'react';
import type { ImageObject, TypographySettings } from '../../../types';

// =============================================================================
// IMAGE HELPER FUNCTIONS
// =============================================================================

/**
 * Extract URL from image (handles both string URLs and ImageObject)
 */
export const getImageUrl = (image: string | ImageObject | undefined): string => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
};

/**
 * Get CSS object-fit value from ImageObject
 */
export const getImageObjectFit = (image: string | ImageObject | undefined): string => {
  if (!image || typeof image === 'string') return 'cover';
  return image.objectFit || 'cover';
};

/**
 * Get CSS object-position value from ImageObject (percentage-based)
 */
export const getImageObjectPosition = (image: string | ImageObject | undefined): string => {
  if (!image || typeof image === 'string') return 'center center';
  const x = image.objectPositionX ?? 50;
  const y = image.objectPositionY ?? 50;
  return `${x}% ${y}%`;
};

// =============================================================================
// TYPOGRAPHY HELPER FUNCTIONS
// =============================================================================

/**
 * Build CSS styles from typography settings with optional defaults
 */
export const getTypographyStyles = (
  typography: TypographySettings | undefined,
  defaults?: Partial<TypographySettings>
): React.CSSProperties => {
  const merged = { ...defaults, ...typography };
  return {
    fontSize: merged.fontSize,
    fontFamily: merged.fontFamily,
    fontWeight: merged.fontWeight as any,
    textAlign: merged.textAlign,
    color: merged.color,
    lineHeight: merged.lineHeight,
    letterSpacing: merged.letterSpacing,
  };
};

// =============================================================================
// DROP CAP RENDERING
// =============================================================================

/**
 * Render article content with optional drop cap styling
 * Used in: ArticleStartHeroPreview, ArticleImageCenterWithQuotePreview,
 *          ArticleImagesDiagonalPreview, ArticleTwoColumnTextPreview,
 *          ArticleTwoImagesTopPreview
 */
export const renderWithDropCap = (content: string, enabled: boolean): React.ReactNode => {
  if (!enabled || !content) {
    return <div dangerouslySetInnerHTML={{ __html: content || '' }} />;
  }

  // Strip HTML tags to get first letter
  const textContent = content.replace(/<[^>]*>/g, '');
  const firstLetter = textContent.charAt(0);
  const restOfFirstWord = textContent.split(' ')[0].slice(1);

  // Find the rest of the content after the first word
  const firstWordLength = textContent.split(' ')[0].length;
  const remainingContent = content.slice(content.indexOf(textContent.charAt(0)) + firstWordLength);

  return (
    <div className="relative">
      <span
        className="float-left text-6xl font-bold leading-none mr-2 mt-1"
        style={{
          fontFamily: 'Georgia, serif',
          color: '#000000',
        }}
      >
        {firstLetter}
      </span>
      <span className="font-semibold">{restOfFirstWord}</span>
      <span dangerouslySetInnerHTML={{ __html: remainingContent }} />
    </div>
  );
};

// =============================================================================
// LAYOUT HELPER FUNCTIONS (Component-specific)
// =============================================================================

/**
 * Get Tailwind classes for vertical alignment
 * Used in: ImageWithCaptionPreview
 */
export const getVerticalAlignmentClasses = (alignment: string | undefined): string => {
  switch (alignment) {
    case 'top':
      return 'justify-start';
    case 'bottom':
      return 'justify-end';
    case 'center':
    default:
      return 'justify-center';
  }
};

/**
 * Get Tailwind classes for text alignment
 * Used in: ImageWithCaptionPreview
 */
export const getTextAlignmentClasses = (alignment: string | undefined): string => {
  switch (alignment) {
    case 'left':
      return 'text-left items-start';
    case 'right':
      return 'text-right items-end';
    case 'center':
    default:
      return 'text-center items-center';
  }
};

/**
 * Get Tailwind classes for image size based on position
 * Used in: ImageWithCaptionPreview
 */
export const getImageSizeClasses = (size: string | undefined, position: string | undefined): string => {
  if (position === 'left' || position === 'right') {
    switch (size) {
      case 'small':
        return 'w-1/4';
      case 'medium':
        return 'w-1/3';
      case 'large':
        return 'w-1/2';
      case 'full':
        return 'w-2/3';
      default:
        return 'w-1/2';
    }
  }
  switch (size) {
    case 'small':
      return 'h-1/4';
    case 'medium':
      return 'h-1/3';
    case 'large':
      return 'h-1/2';
    case 'full':
      return 'h-2/3';
    default:
      return 'h-1/2';
  }
};

/**
 * Get Tailwind position classes for caption placement
 * Used in: ImageWithCornerCaptionPreview
 */
export const getCaptionPositionClasses = (position: string | undefined): string => {
  switch (position) {
    case 'top-left':
      return 'top-4 left-4';
    case 'top-right':
      return 'top-4 right-4';
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'bottom-right':
      return 'bottom-4 right-4';
    default:
      return 'top-4 left-4';
  }
};
