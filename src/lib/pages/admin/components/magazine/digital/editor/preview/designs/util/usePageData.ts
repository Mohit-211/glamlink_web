/**
 * Custom hooks for extracting and processing props in Digital Page Preview components
 * Each hook encapsulates the variable extraction logic for its specific component
 */

import React from 'react';
import {
  getImageUrl,
  getImageObjectFit,
  getImageObjectPosition,
  getTypographyStyles,
  getCaptionPositionClasses,
} from './previewHelpers';
import type { DigitalPageData, PagePdfSettings, TocEntry, ImageObject } from '../../../types';

// =============================================================================
// HOOK: useFullPageImageProps
// =============================================================================

export interface FullPageImageProps {
  imageUrl: string;
  objectFit: string;
  objectPosition: string;
}

export function useFullPageImageProps(
  pageData: Partial<DigitalPageData>
): FullPageImageProps {
  return {
    imageUrl: getImageUrl(pageData.image),
    objectFit: getImageObjectFit(pageData.image),
    objectPosition: getImageObjectPosition(pageData.image),
  };
}

// =============================================================================
// HOOK: useImageCenteredWithBorderProps
// =============================================================================

export interface ImageCenteredWithBorderProps {
  imageUrl: string;
  objectFit: string;
  objectPosition: string;
  borderColor: string;
  borderWidth: number;
  imageWidth: string;
  paddingPx: number;
}

export function useImageCenteredWithBorderProps(
  pageData: Partial<DigitalPageData>
): ImageCenteredWithBorderProps {
  const imageUrl = getImageUrl(pageData.image);
  const objectFit = getImageObjectFit(pageData.image);
  const objectPosition = getImageObjectPosition(pageData.image);

  const borderColor = pageData.borderColor || '#8B2942';
  const borderWidth = pageData.borderWidth || 40;
  const imageWidth = pageData.imageWidth || '80%';

  const paddingPx = Math.max(borderWidth / 2, 16);

  return {
    imageUrl,
    objectFit,
    objectPosition,
    borderColor,
    borderWidth,
    imageWidth,
    paddingPx,
  };
}

// =============================================================================
// HOOK: useImageWithTitleProps
// =============================================================================

export interface ImageWithTitleProps {
  imageUrl: string;
  objectFit: string;
  objectPosition: string;
  backgroundColor: string;
  bgStyle: React.CSSProperties;
  titleStyles: React.CSSProperties;
  subtitleStyles: React.CSSProperties;
}

export function useImageWithTitleProps(
  pageData: Partial<DigitalPageData>,
  pdfSettings?: PagePdfSettings
): ImageWithTitleProps {
  const imageUrl = getImageUrl(pageData.image);
  const objectFit = getImageObjectFit(pageData.image);
  const objectPosition = getImageObjectPosition(pageData.image);
  const backgroundColor = pageData.backgroundColor || pdfSettings?.backgroundColor || '#ffffff';

  // Get background style
  const bgStyle: React.CSSProperties = {};
  if (backgroundColor) {
    if (
      backgroundColor.startsWith('#') ||
      backgroundColor.startsWith('linear-gradient') ||
      backgroundColor.startsWith('radial-gradient') ||
      backgroundColor.startsWith('rgb')
    ) {
      bgStyle.background = backgroundColor;
    }
  }

  const titleStyles = getTypographyStyles(pageData.titleTypography, {
    fontSize: '32px',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: '0.1em',
  });

  const subtitleStyles = getTypographyStyles(pageData.subtitleTypography, {
    fontSize: '14px',
    fontWeight: '400',
    color: '#374151',
    letterSpacing: '0.05em',
  });

  return {
    imageUrl,
    objectFit,
    objectPosition,
    backgroundColor,
    bgStyle,
    titleStyles,
    subtitleStyles,
  };
}

// =============================================================================
// HOOK: useImageWithCornerCaptionProps
// =============================================================================

export interface ImageWithCornerCaptionProps {
  imageUrl: string;
  objectFit: string;
  objectPosition: string;
  captionPosition: string;
  captionPositionClasses: string;
  hasCaptionContent: boolean;
  titleStyles: React.CSSProperties;
  captionStyles: React.CSSProperties;
  useFullPageImage: boolean;
  captionBackgroundColor: string;
  captionBoxStyle: React.CSSProperties;
}

export function useImageWithCornerCaptionProps(
  pageData: Partial<DigitalPageData>
): ImageWithCornerCaptionProps {
  const imageUrl = getImageUrl(pageData.image);
  const objectFit = getImageObjectFit(pageData.image);
  const objectPosition = getImageObjectPosition(pageData.image);
  const captionPosition = pageData.captionPosition || 'top-left';
  const hasCaptionContent = !!(pageData.captionTitle || pageData.caption);
  const useFullPageImage = pageData.useFullPageImage ?? true;
  const captionBackgroundColor = pageData.captionBackgroundColor || 'transparent';

  const captionPositionClasses = getCaptionPositionClasses(captionPosition as any);

  const titleStyles = getTypographyStyles(pageData.titleTypography, {
    fontSize: '10px',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: '0.05em',
  });

  const captionStyles = getTypographyStyles(pageData.captionTypography, {
    fontSize: '9px',
    color: '#374151',
    lineHeight: '1.4',
  });

  // Build caption box background style
  const captionBoxStyle: React.CSSProperties = {
    padding: '12px',
  };
  if (captionBackgroundColor && captionBackgroundColor !== 'transparent') {
    if (
      captionBackgroundColor.startsWith('#') ||
      captionBackgroundColor.startsWith('linear-gradient') ||
      captionBackgroundColor.startsWith('radial-gradient') ||
      captionBackgroundColor.startsWith('rgb')
    ) {
      captionBoxStyle.background = captionBackgroundColor;
    }
  }

  return {
    imageUrl,
    objectFit,
    objectPosition,
    captionPosition,
    captionPositionClasses,
    hasCaptionContent,
    titleStyles,
    captionStyles,
    useFullPageImage,
    captionBackgroundColor,
    captionBoxStyle,
  };
}

// =============================================================================
// HOOK: useImageWithTwoCornerCaptionsProps
// =============================================================================

export interface ImageWithTwoCornerCaptionsProps {
  imageUrl: string;
  objectFit: string;
  objectPosition: string;
  useFullPageImage: boolean;
  // Caption 1
  captionPosition: string;
  captionPositionClasses: string;
  hasCaptionContent: boolean;
  captionBackgroundColor: string;
  captionBoxStyle: React.CSSProperties;
  titleStyles: React.CSSProperties;
  captionStyles: React.CSSProperties;
  // Caption 2
  caption2Position: string;
  caption2PositionClasses: string;
  hasCaption2Content: boolean;
  caption2BackgroundColor: string;
  caption2BoxStyle: React.CSSProperties;
  caption2TitleStyles: React.CSSProperties;
  caption2Styles: React.CSSProperties;
}

export function useImageWithTwoCornerCaptionsProps(
  pageData: Partial<DigitalPageData>
): ImageWithTwoCornerCaptionsProps {
  const imageUrl = getImageUrl(pageData.image);
  const objectFit = getImageObjectFit(pageData.image);
  const objectPosition = getImageObjectPosition(pageData.image);
  const useFullPageImage = pageData.useFullPageImage ?? true;

  // Caption 1
  const captionPosition = pageData.captionPosition || 'top-left';
  const hasCaptionContent = !!(pageData.captionTitle || pageData.caption);
  const captionBackgroundColor = pageData.captionBackgroundColor || 'transparent';
  const captionPositionClasses = getCaptionPositionClasses(captionPosition as any);

  const titleStyles = getTypographyStyles(pageData.titleTypography, {
    fontSize: '10px',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: '0.05em',
  });

  const captionStyles = getTypographyStyles(pageData.captionTypography, {
    fontSize: '9px',
    color: '#374151',
    lineHeight: '1.4',
  });

  // Build caption 1 box background style
  const captionBoxStyle: React.CSSProperties = {
    padding: '12px',
  };
  if (captionBackgroundColor && captionBackgroundColor !== 'transparent') {
    if (
      captionBackgroundColor.startsWith('#') ||
      captionBackgroundColor.startsWith('linear-gradient') ||
      captionBackgroundColor.startsWith('radial-gradient') ||
      captionBackgroundColor.startsWith('rgb')
    ) {
      captionBoxStyle.background = captionBackgroundColor;
    }
  }

  // Caption 2
  const caption2Position = pageData.caption2Position || 'bottom-right';
  const hasCaption2Content = !!(pageData.caption2Title || pageData.caption2);
  const caption2BackgroundColor = pageData.caption2BackgroundColor || 'transparent';
  const caption2PositionClasses = getCaptionPositionClasses(caption2Position as any);

  const caption2TitleStyles = getTypographyStyles(pageData.caption2TitleTypography, {
    fontSize: '10px',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: '0.05em',
  });

  const caption2Styles = getTypographyStyles(pageData.caption2Typography, {
    fontSize: '9px',
    color: '#374151',
    lineHeight: '1.4',
  });

  // Build caption 2 box background style
  const caption2BoxStyle: React.CSSProperties = {
    padding: '12px',
  };
  if (caption2BackgroundColor && caption2BackgroundColor !== 'transparent') {
    if (
      caption2BackgroundColor.startsWith('#') ||
      caption2BackgroundColor.startsWith('linear-gradient') ||
      caption2BackgroundColor.startsWith('radial-gradient') ||
      caption2BackgroundColor.startsWith('rgb')
    ) {
      caption2BoxStyle.background = caption2BackgroundColor;
    }
  }

  return {
    imageUrl,
    objectFit,
    objectPosition,
    useFullPageImage,
    // Caption 1
    captionPosition,
    captionPositionClasses,
    hasCaptionContent,
    captionBackgroundColor,
    captionBoxStyle,
    titleStyles,
    captionStyles,
    // Caption 2
    caption2Position,
    caption2PositionClasses,
    hasCaption2Content,
    caption2BackgroundColor,
    caption2BoxStyle,
    caption2TitleStyles,
    caption2Styles,
  };
}

// =============================================================================
// HOOK: useImageWithTwoCaptionsProps
// =============================================================================

export interface ImageWithTwoCaptionsProps {
  imageUrl: string;
  objectFit: string;
  objectPosition: string;
  backgroundColor: string;
  bgStyle: React.CSSProperties;
  hasTitleBox: boolean;
  hasCaptionBox: boolean;
  titleStyles: React.CSSProperties;
  subtitleStyles: React.CSSProperties;
  captionStyles: React.CSSProperties;
}

export function useImageWithTwoCaptionsProps(
  pageData: Partial<DigitalPageData>,
  pdfSettings?: PagePdfSettings
): ImageWithTwoCaptionsProps {
  const imageUrl = getImageUrl(pageData.image);
  const objectFit = getImageObjectFit(pageData.image);
  const objectPosition = getImageObjectPosition(pageData.image);
  const backgroundColor = pageData.backgroundColor || pdfSettings?.backgroundColor || '#ffffff';

  const hasTitleBox = !!(pageData.titleBox || pageData.titleBoxContent);
  const hasCaptionBox = !!(pageData.captionTitle || pageData.captionContent);

  // Get background style
  const bgStyle: React.CSSProperties = {};
  if (backgroundColor) {
    if (
      backgroundColor.startsWith('#') ||
      backgroundColor.startsWith('linear-gradient') ||
      backgroundColor.startsWith('radial-gradient') ||
      backgroundColor.startsWith('rgb')
    ) {
      bgStyle.background = backgroundColor;
    }
  }

  const titleStyles = getTypographyStyles(pageData.titleTypography, {
    fontSize: '12px',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: '0.05em',
    textAlign: 'right',
  });

  const subtitleStyles = getTypographyStyles(pageData.subtitleTypography, {
    fontSize: '9px',
    color: '#374151',
    lineHeight: '1.5',
    textAlign: 'right',
  });

  const captionStyles = getTypographyStyles(pageData.captionTypography, {
    fontSize: '10px',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: '0.05em',
    textAlign: 'right',
  });

  return {
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
  };
}

// =============================================================================
// HOOK: useImageWithCaptionProps
// =============================================================================

export interface ImageWithCaptionProps {
  layout: any;
  backgroundColor: string;
  bgStyle: React.CSSProperties;
}

export function useImageWithCaptionProps(
  pageData: Partial<DigitalPageData>,
  pdfSettings?: PagePdfSettings
): ImageWithCaptionProps {
  // PRIORITY: Nested layout (form now writes nested) > Legacy flat keys > Defaults
  const nestedLayout = (pageData as any).layout;
  const layout = {
    imagePosition: nestedLayout?.imagePosition ?? (pageData as any)['layout.imagePosition'] ?? 'top',
    textAlignment: nestedLayout?.textAlignment ?? (pageData as any)['layout.textAlignment'] ?? 'center',
    contentPadding: nestedLayout?.contentPadding ?? (pageData as any)['layout.contentPadding'] ?? 24,
    imageSize: nestedLayout?.imageSize ?? (pageData as any)['layout.imageSize'] ?? 'large',
    verticalAlignment: nestedLayout?.verticalAlignment ?? (pageData as any)['layout.verticalAlignment'] ?? 'center',
  };

  const backgroundColor = pageData.backgroundColor || pdfSettings?.backgroundColor || '#ffffff';

  // Get background style
  const bgStyle: React.CSSProperties = {};
  if (backgroundColor) {
    if (
      backgroundColor.startsWith('#') ||
      backgroundColor.startsWith('linear-gradient') ||
      backgroundColor.startsWith('radial-gradient') ||
      backgroundColor.startsWith('rgb')
    ) {
      bgStyle.background = backgroundColor;
    }
  }

  return {
    layout,
    backgroundColor,
    bgStyle,
  };
}

// =============================================================================
// HOOK: useArticleStartHeroProps
// =============================================================================

export interface ArticleStartHeroProps {
  heroImageUrl: string;
  objectFit: string;
  objectPosition: string;
  backgroundColor: string;
  bgStyle: React.CSSProperties;
  dropCapEnabled: boolean;
  titleStyles: React.CSSProperties;
  subtitleStyles: React.CSSProperties;
}

export function useArticleStartHeroProps(
  pageData: Partial<DigitalPageData>,
  pdfSettings?: PagePdfSettings
): ArticleStartHeroProps {
  const heroImageUrl = getImageUrl(pageData.heroImage);
  const objectFit = getImageObjectFit(pageData.heroImage);
  const objectPosition = getImageObjectPosition(pageData.heroImage);
  const backgroundColor = pageData.backgroundColor || pdfSettings?.backgroundColor || '#ffffff';
  const dropCapEnabled = pageData.dropCapEnabled ?? true;

  // Get background style
  const bgStyle: React.CSSProperties = {};
  if (backgroundColor) {
    if (
      backgroundColor.startsWith('#') ||
      backgroundColor.startsWith('linear-gradient') ||
      backgroundColor.startsWith('radial-gradient') ||
      backgroundColor.startsWith('rgb')
    ) {
      bgStyle.background = backgroundColor;
    }
  }

  const titleStyles = getTypographyStyles(pageData.titleTypography, {
    fontSize: '24px',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: '0.05em',
    textAlign: 'center',
  });

  const subtitleStyles = getTypographyStyles(pageData.subtitleTypography, {
    fontSize: '14px',
    fontWeight: '400',
    color: '#4B5563',
    textAlign: 'center',
  });

  return {
    heroImageUrl,
    objectFit,
    objectPosition,
    backgroundColor,
    bgStyle,
    dropCapEnabled,
    titleStyles,
    subtitleStyles,
  };
}

// =============================================================================
// HOOK: useTwoColumnWithQuoteProps
// =============================================================================

// Content mode types
type ContentModeType = 'quote' | 'content-block' | 'digital-card' | 'image';

export interface TwoColumnWithQuoteProps {
  backgroundColor: string;
  articleTitle: string;
  byline: string;
  articleContent: string;
  pullQuote: string;
  quoteContext: string;
  quotePosition: number;
  // Content mode: determines what to display
  contentMode: ContentModeType;
  customBlock: {
    id: string;
    type: string;
    category: string;
    props: Record<string, any>;
    enabled: boolean;
    order: number;
  } | null;
  professionalId: string;
  // Computed flags for rendering
  showQuote: boolean;
  showContentBlock: boolean;
  showDigitalCard: boolean;
}

export function useTwoColumnWithQuoteProps(
  pageData: Partial<DigitalPageData>
): TwoColumnWithQuoteProps {
  // Content mode: new dropdown field, with fallback to legacy useContentBlock
  const contentMode: ContentModeType = pageData.contentMode
    || (pageData.useContentBlock ? 'content-block' : 'quote');

  const customBlock = pageData.customBlock || null;
  const professionalId = pageData.professionalId || '';

  // Computed flags based on contentMode
  const showQuote = contentMode === 'quote';
  const showContentBlock = contentMode === 'content-block' && customBlock !== null && customBlock.enabled !== false;
  const showDigitalCard = contentMode === 'digital-card' && !!professionalId;

  return {
    backgroundColor: pageData.backgroundColor || '#ffffff',
    articleTitle: pageData.articleTitle || '',
    byline: pageData.byline || '',
    articleContent: pageData.articleContent || '',
    pullQuote: pageData.pullQuote || '',
    quoteContext: pageData.quoteContext || '',
    quotePosition: pageData.quotePosition || 50,
    contentMode,
    customBlock,
    professionalId,
    showQuote,
    showContentBlock,
    showDigitalCard,
  };
}

// =============================================================================
// HOOK: useArticleTwoColumnTextProps
// =============================================================================

export interface ArticleTwoColumnTextProps {
  backgroundColor: string;
  articleTitle: string;
  byline: string;
  sidebarContent: string;
  sidebarBackgroundColor: string;
  articleContent: string;
  showDropCap: boolean;
  hasSidebar: boolean;
}

export function useArticleTwoColumnTextProps(
  pageData: Partial<DigitalPageData>
): ArticleTwoColumnTextProps {
  const sidebarContent = pageData.sidebarContent || '';

  return {
    backgroundColor: pageData.backgroundColor || '#ffffff',
    articleTitle: pageData.articleTitle || '',
    byline: pageData.byline || '',
    sidebarContent,
    sidebarBackgroundColor: pageData.sidebarBackgroundColor || '#000000',
    articleContent: pageData.articleContent || '',
    showDropCap: pageData.showDropCap !== false,
    hasSidebar: !!sidebarContent,
  };
}

// =============================================================================
// HOOK: useArticleTwoImagesTopProps
// =============================================================================

// Content mode types for third content area (image/content-block/digital-card)
type ThirdContentModeType = 'image' | 'content-block' | 'digital-card' | 'quote';

export interface ArticleTwoImagesTopProps {
  backgroundColor: string;
  mainImageUrl: string;
  mainImageFit: string;
  mainImagePosition: string;
  secondImageUrl: string;
  secondImageFit: string;
  secondImagePosition: string;
  secondImageCaption: string;
  articleTitle: string;
  subtitle: string;
  articleContent: string;
  thirdImageUrl: string;
  thirdImageFit: string;
  thirdImagePosition: string;
  thirdImageCaption: string;
  showDropCap: boolean;
  // Content mode: determines what to display in third slot
  contentMode: ThirdContentModeType;
  customBlock: {
    id: string;
    type: string;
    category: string;
    props: Record<string, any>;
    enabled: boolean;
    order: number;
  } | null;
  professionalId: string;
  // Computed flags for rendering
  showThirdImage: boolean;
  showContentBlock: boolean;
  showDigitalCard: boolean;
}

export function useArticleTwoImagesTopProps(
  pageData: Partial<DigitalPageData>
): ArticleTwoImagesTopProps {
  // Content mode: new dropdown field, with fallback to legacy useContentBlock
  const contentMode: ThirdContentModeType = pageData.contentMode
    || (pageData.useContentBlock ? 'content-block' : 'image');

  const customBlock = pageData.customBlock || null;
  const professionalId = pageData.professionalId || '';

  // Computed flags based on contentMode
  const showThirdImage = contentMode === 'image';
  const showContentBlock = contentMode === 'content-block' && customBlock !== null && customBlock.enabled !== false;
  const showDigitalCard = contentMode === 'digital-card' && !!professionalId;

  return {
    backgroundColor: pageData.backgroundColor || '#ffffff',
    mainImageUrl: getImageUrl(pageData.mainImage),
    mainImageFit: getImageObjectFit(pageData.mainImage),
    mainImagePosition: getImageObjectPosition(pageData.mainImage),
    secondImageUrl: getImageUrl(pageData.secondImage),
    secondImageFit: getImageObjectFit(pageData.secondImage),
    secondImagePosition: getImageObjectPosition(pageData.secondImage),
    secondImageCaption: pageData.secondImageCaption || '',
    articleTitle: pageData.articleTitle || '',
    subtitle: pageData.subtitle || '',
    articleContent: pageData.articleContent || '',
    thirdImageUrl: getImageUrl(pageData.thirdImage),
    thirdImageFit: getImageObjectFit(pageData.thirdImage),
    thirdImagePosition: getImageObjectPosition(pageData.thirdImage),
    thirdImageCaption: pageData.thirdImageCaption || '',
    showDropCap: pageData.showDropCap !== false,
    contentMode,
    customBlock,
    professionalId,
    showThirdImage,
    showContentBlock,
    showDigitalCard,
  };
}

// =============================================================================
// HOOK: useArticleImageCenterWithQuoteProps
// =============================================================================

export interface ArticleImageCenterWithQuoteProps {
  backgroundColor: string;
  heroImageUrl: string;
  heroImageFit: string;
  heroImagePosition: string;
  imageWidth: string;
  articleTitle: string;
  subtitle: string;
  articleContent: string;
  pullQuote: string;
  quoteContext: string;
  quotePosition: number;
  showDropCap: boolean;
  // Content mode: determines what to display
  contentMode: ContentModeType;
  customBlock: {
    id: string;
    type: string;
    category: string;
    props: Record<string, any>;
    enabled: boolean;
    order: number;
  } | null;
  professionalId: string;
  // Computed flags for rendering
  showQuote: boolean;
  showContentBlock: boolean;
  showDigitalCard: boolean;
}

export function useArticleImageCenterWithQuoteProps(
  pageData: Partial<DigitalPageData>
): ArticleImageCenterWithQuoteProps {
  // Content mode: new dropdown field, with fallback to legacy useContentBlock
  const contentMode: ContentModeType = pageData.contentMode
    || (pageData.useContentBlock ? 'content-block' : 'quote');

  const customBlock = pageData.customBlock || null;
  const professionalId = pageData.professionalId || '';

  // Computed flags based on contentMode
  const showQuote = contentMode === 'quote';
  const showContentBlock = contentMode === 'content-block' && customBlock !== null && customBlock.enabled !== false;
  const showDigitalCard = contentMode === 'digital-card' && !!professionalId;

  return {
    backgroundColor: pageData.backgroundColor || '#ffffff',
    heroImageUrl: getImageUrl(pageData.heroImage),
    heroImageFit: getImageObjectFit(pageData.heroImage),
    heroImagePosition: getImageObjectPosition(pageData.heroImage),
    imageWidth: pageData.imageWidth || '70%',
    articleTitle: pageData.articleTitle || '',
    subtitle: pageData.subtitle || '',
    articleContent: pageData.articleContent || '',
    pullQuote: pageData.pullQuote || '',
    quoteContext: pageData.quoteContext || '',
    quotePosition: pageData.quotePosition || 50,
    showDropCap: pageData.showDropCap !== false,
    contentMode,
    customBlock,
    professionalId,
    showQuote,
    showContentBlock,
    showDigitalCard,
  };
}

// =============================================================================
// HOOK: useArticleImagesDiagonalProps
// =============================================================================

// Content block type for diagonal layout
interface DiagonalContentBlock {
  id: string;
  type: string;
  category: string;
  props: Record<string, any>;
  enabled: boolean;
  order: number;
}

export interface ArticleImagesDiagonalProps {
  backgroundColor: string;
  topRightImageUrl: string;
  topRightImageFit: string;
  topRightImagePosition: string;
  topRightCaption: string;
  bottomLeftImageUrl: string;
  bottomLeftImageFit: string;
  bottomLeftImagePosition: string;
  bottomLeftCaption: string;
  articleTitle: string;
  byline: string;
  articleContent: string;
  imageSize: string;
  imageWidthPercent: string;
  showDropCap: boolean;
  // Top-right content mode and computed flags
  topRightContentMode: ThirdContentModeType;
  topRightBlock: DiagonalContentBlock | null;
  topRightProfessionalId: string;
  showTopRightImage: boolean;
  showTopRightBlock: boolean;
  showTopRightDigitalCard: boolean;
  // Bottom-left content mode and computed flags
  bottomLeftContentMode: ThirdContentModeType;
  bottomLeftBlock: DiagonalContentBlock | null;
  bottomLeftProfessionalId: string;
  showBottomLeftImage: boolean;
  showBottomLeftBlock: boolean;
  showBottomLeftDigitalCard: boolean;
}

export function useArticleImagesDiagonalProps(
  pageData: Partial<DigitalPageData>
): ArticleImagesDiagonalProps {
  const imageSize = pageData.imageSize || 'medium';

  // Convert image size to percentage
  const imageSizeMap: Record<string, string> = {
    small: '30%',
    medium: '40%',
    large: '50%',
  };
  const imageWidthPercent = imageSizeMap[imageSize] || '40%';

  // Top-right content mode: new dropdown field, with fallback to legacy useTopRightBlock
  const topRightContentMode: ThirdContentModeType = pageData.topRightContentMode
    || (pageData.useTopRightBlock ? 'content-block' : 'image');
  const topRightBlock = pageData.topRightBlock || null;
  const topRightProfessionalId = pageData.topRightProfessionalId || '';

  // Top-right computed flags
  const showTopRightImage = topRightContentMode === 'image';
  const showTopRightBlock = topRightContentMode === 'content-block' && topRightBlock !== null && topRightBlock.enabled !== false;
  const showTopRightDigitalCard = topRightContentMode === 'digital-card' && !!topRightProfessionalId;

  // Bottom-left content mode: new dropdown field, with fallback to legacy useBottomLeftBlock
  const bottomLeftContentMode: ThirdContentModeType = pageData.bottomLeftContentMode
    || (pageData.useBottomLeftBlock ? 'content-block' : 'image');
  const bottomLeftBlock = pageData.bottomLeftBlock || null;
  const bottomLeftProfessionalId = pageData.bottomLeftProfessionalId || '';

  // Bottom-left computed flags
  const showBottomLeftImage = bottomLeftContentMode === 'image';
  const showBottomLeftBlock = bottomLeftContentMode === 'content-block' && bottomLeftBlock !== null && bottomLeftBlock.enabled !== false;
  const showBottomLeftDigitalCard = bottomLeftContentMode === 'digital-card' && !!bottomLeftProfessionalId;

  return {
    backgroundColor: pageData.backgroundColor || '#ffffff',
    topRightImageUrl: getImageUrl(pageData.topRightImage),
    topRightImageFit: getImageObjectFit(pageData.topRightImage),
    topRightImagePosition: getImageObjectPosition(pageData.topRightImage),
    topRightCaption: pageData.topRightCaption || '',
    bottomLeftImageUrl: getImageUrl(pageData.bottomLeftImage),
    bottomLeftImageFit: getImageObjectFit(pageData.bottomLeftImage),
    bottomLeftImagePosition: getImageObjectPosition(pageData.bottomLeftImage),
    bottomLeftCaption: pageData.bottomLeftCaption || '',
    articleTitle: pageData.articleTitle || '',
    byline: pageData.byline || '',
    articleContent: pageData.articleContent || '',
    imageSize,
    imageWidthPercent,
    showDropCap: pageData.showDropCap !== false,
    // Top-right
    topRightContentMode,
    topRightBlock,
    topRightProfessionalId,
    showTopRightImage,
    showTopRightBlock,
    showTopRightDigitalCard,
    // Bottom-left
    bottomLeftContentMode,
    bottomLeftBlock,
    bottomLeftProfessionalId,
    showBottomLeftImage,
    showBottomLeftBlock,
    showBottomLeftDigitalCard,
  };
}

// =============================================================================
// HOOK: usePageImageWithCustomBlockProps
// =============================================================================

export interface PageImageWithCustomBlockProps {
  // Image props
  imageUrl: string;
  objectFit: string;
  objectPosition: string;
  // Page styling
  backgroundColor: string;
  bgStyle: React.CSSProperties;
  // Title/subtitle styling
  titleStyles: React.CSSProperties;
  subtitleStyles: React.CSSProperties;
  // Custom block
  customBlock: {
    id: string;
    type: string;
    category: string;
    props: Record<string, any>;
    enabled: boolean;
    order: number;
  } | null;
  hasCustomBlock: boolean;
  // Container styling
  blockContainerStyle: React.CSSProperties;
}

export function usePageImageWithCustomBlockProps(
  pageData: Partial<DigitalPageData>,
  pdfSettings?: PagePdfSettings
): PageImageWithCustomBlockProps {
  // Image props
  const imageUrl = getImageUrl(pageData.image);
  const objectFit = getImageObjectFit(pageData.image);
  const objectPosition = getImageObjectPosition(pageData.image);

  // Background
  const backgroundColor = pageData.backgroundColor || pdfSettings?.backgroundColor || '#ffffff';
  const bgStyle: React.CSSProperties = {};
  if (backgroundColor) {
    if (
      backgroundColor.startsWith('#') ||
      backgroundColor.startsWith('linear-gradient') ||
      backgroundColor.startsWith('radial-gradient') ||
      backgroundColor.startsWith('rgb')
    ) {
      bgStyle.background = backgroundColor;
    }
  }

  // Typography
  const titleStyles = getTypographyStyles(pageData.titleTypography, {
    fontSize: '32px',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: '0.1em',
    textAlign: 'center',
  });

  const subtitleStyles = getTypographyStyles(pageData.subtitleTypography, {
    fontSize: '14px',
    fontWeight: '400',
    color: '#374151',
    letterSpacing: '0.05em',
    textAlign: 'center',
  });

  // Custom block
  const customBlock = pageData.customBlock || null;
  const hasCustomBlock = customBlock !== null && customBlock.enabled !== false;

  // Block container styling
  const containerStyle = pageData.blockContainerStyle || {};
  const blockContainerStyle: React.CSSProperties = {
    marginTop: containerStyle.marginTop ? `${containerStyle.marginTop}px` : '16px',
    padding: containerStyle.padding ? `${containerStyle.padding}px` : '16px',
    borderRadius: containerStyle.borderRadius ? `${containerStyle.borderRadius}px` : '0',
    borderWidth: containerStyle.borderWidth ? `${containerStyle.borderWidth}px` : '0',
    borderStyle: containerStyle.borderWidth ? 'solid' : 'none',
    borderColor: containerStyle.borderColor || '#e5e7eb',
  };

  // Handle background color for container
  if (containerStyle.backgroundColor && containerStyle.backgroundColor !== 'transparent') {
    if (
      containerStyle.backgroundColor.startsWith('#') ||
      containerStyle.backgroundColor.startsWith('linear-gradient') ||
      containerStyle.backgroundColor.startsWith('radial-gradient') ||
      containerStyle.backgroundColor.startsWith('rgb')
    ) {
      blockContainerStyle.background = containerStyle.backgroundColor;
    }
  }

  return {
    imageUrl,
    objectFit,
    objectPosition,
    backgroundColor,
    bgStyle,
    titleStyles,
    subtitleStyles,
    customBlock,
    hasCustomBlock,
    blockContainerStyle,
  };
}

// =============================================================================
// HOOK: useTableOfContentsProps
// =============================================================================

export interface TableOfContentsProps {
  tocTitle: string;
  tocEntries: TocEntry[];
  backgroundColor: string;
  bgStyle: React.CSSProperties;
  titleStyles: React.CSSProperties;
}

export function useTableOfContentsProps(
  pageData: Partial<DigitalPageData>,
  pdfSettings?: PagePdfSettings
): TableOfContentsProps {
  const tocTitle = pageData.tocTitle || '';
  const tocEntries: TocEntry[] = pageData.tocEntries || [];
  const backgroundColor = pageData.backgroundColor || pdfSettings?.backgroundColor || '#ffffff';

  // Background style
  const bgStyle: React.CSSProperties = {};
  if (backgroundColor) {
    if (
      backgroundColor.startsWith('#') ||
      backgroundColor.startsWith('linear-gradient') ||
      backgroundColor.startsWith('radial-gradient') ||
      backgroundColor.startsWith('rgb')
    ) {
      bgStyle.background = backgroundColor;
    }
  }

  // Title typography
  const titleStyles = getTypographyStyles(pageData.tocTitleTypography, {
    fontSize: '24px',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: '0.1em',
    textAlign: 'center',
  });

  return {
    tocTitle,
    tocEntries,
    backgroundColor,
    bgStyle,
    titleStyles,
  };
}
