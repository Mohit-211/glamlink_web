/**
 * Digital Preview Components Registry
 * Configuration for available digital page preview components
 */

import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import type {
  DigitalPageData,
  DigitalPageType,
  DigitalPreviewComponentProps,
} from '@/lib/pages/admin/components/magazine/digital/editor/types';

// Import field configurations
import {
  imageWithCaptionPageFields,
  fullBleedImagePageFields,
  textOnlyPageFields,
  fullPageImageFields,
  imageWithTitleFields,
  imageWithCornerCaptionFields,
  imageWithTwoCornerCaptionsFields,
  articleStartHeroFields,
  imageCenteredWithBorderFields,
  imageWithTwoCaptionsFields,
  twoColumnWithQuoteFields,
  articleTwoColumnTextFields,
  articleTwoImagesTopFields,
  articleImageCenterWithQuoteFields,
  articleImagesDiagonalFields,
  pageImageWithCustomBlockFields,
  pageCustomFields,
  tableOfContentsFields,
  getDefaultImageWithCaptionPage,
  getDefaultFullBleedImagePage,
  getDefaultTextOnlyPage,
  getDefaultFullPageImage,
  getDefaultImageWithTitle,
  getDefaultImageWithCornerCaption,
  getDefaultImageWithTwoCornerCaptions,
  getDefaultArticleStartHero,
  getDefaultImageCenteredWithBorder,
  getDefaultImageWithTwoCaptions,
  getDefaultTwoColumnWithQuote,
  getDefaultArticleTwoColumnText,
  getDefaultArticleTwoImagesTop,
  getDefaultArticleImageCenterWithQuote,
  getDefaultArticleImagesDiagonal,
  getDefaultPageImageWithCustomBlock,
  getDefaultPageCustom,
  getDefaultTableOfContents,
} from './fields/digital';

// Import preview components
import ImageWithCaptionPreview from '../components/magazine/digital/editor/preview/designs/image/ImageWithCaptionPreview';
import FullPageImagePreview from '../components/magazine/digital/editor/preview/designs/image/FullPageImagePreview';
import ImageWithTitlePreview from '../components/magazine/digital/editor/preview/designs/image/ImageWithTitlePreview';
import ImageWithCornerCaptionPreview from '../components/magazine/digital/editor/preview/designs/image/ImageWithCornerCaptionPreview';
import ImageWithTwoCornerCaptionsPreview from '../components/magazine/digital/editor/preview/designs/image/ImageWithTwoCornerCaptionsPreview';
import ArticleStartHeroPreview from '../components/magazine/digital/editor/preview/designs/article/ArticleStartHeroPreview';
import ImageCenteredWithBorderPreview from '../components/magazine/digital/editor/preview/designs/image/ImageCenteredWithBorderPreview';
import ImageWithTwoCaptionsPreview from '../components/magazine/digital/editor/preview/designs/image/ImageWithTwoCaptionsPreview';
import TwoColumnWithQuotePreview from '../components/magazine/digital/editor/preview/designs/article/TwoColumnWithQuotePreview';
import ArticleTwoColumnTextPreview from '../components/magazine/digital/editor/preview/designs/article/ArticleTwoColumnTextPreview';
import ArticleTwoImagesTopPreview from '../components/magazine/digital/editor/preview/designs/article/ArticleTwoImagesTopPreview';
import ArticleImageCenterWithQuotePreview from '../components/magazine/digital/editor/preview/designs/article/ArticleImageCenterWithQuotePreview';
import ArticleImagesDiagonalPreview from '../components/magazine/digital/editor/preview/designs/article/ArticleImagesDiagonalPreview';
import PageImageWithCustomBlockPreview from '../components/magazine/digital/editor/preview/designs/article/PageImageWithCustomBlockPreview';
import PageCustom from '../components/magazine/digital/editor/preview/designs/custom/PageCustom';
import TableOfContentsPreview from '../components/magazine/digital/editor/preview/designs/article/TableOfContentsPreview';

// =============================================================================
// DIGITAL PREVIEW COMPONENT INTERFACE
// =============================================================================

// Category type for page filtering
export type DigitalPageCategory = 'image' | 'article' | 'custom';

export interface DigitalPreviewComponent {
  id: DigitalPageType;
  label: string;
  description: string;
  component: React.ComponentType<DigitalPreviewComponentProps>;
  fields: FieldConfig[];
  getDefaultData: () => Partial<DigitalPageData>;
  icon?: string;
  category: DigitalPageCategory;
}

// =============================================================================
// PREVIEW COMPONENTS REGISTRY
// =============================================================================

/**
 * List of available digital page preview components
 *
 * To add a new page type:
 * 1. Create the preview component in /editor/preview/designs/
 * 2. Add field configuration in /config/fields/digital.ts
 * 3. Add entry here with unique id, label, component, fields, and defaults
 */
export const digitalPreviewComponents: DigitalPreviewComponent[] = [
  // ==========================================================================
  // IMAGE CATEGORY - Image-focused layouts
  // ==========================================================================
  {
    id: 'image-with-caption',
    label: 'Image with Caption',
    description: 'A page featuring an image with title, subtitle, and caption text',
    component: ImageWithCaptionPreview,
    fields: imageWithCaptionPageFields,
    getDefaultData: getDefaultImageWithCaptionPage,
    icon: '🖼️',
    category: 'image',
  },
  {
    id: 'full-page-image',
    label: 'Full Page Image',
    description: 'Full bleed image covering the entire page',
    component: FullPageImagePreview,
    fields: fullPageImageFields,
    getDefaultData: getDefaultFullPageImage,
    icon: '📷',
    category: 'image',
  },
  {
    id: 'image-with-title',
    label: 'Image with Title',
    description: 'Centered image with title and subtitle below',
    component: ImageWithTitlePreview,
    fields: imageWithTitleFields,
    getDefaultData: getDefaultImageWithTitle,
    icon: '🎯',
    category: 'image',
  },
  {
    id: 'image-with-corner-caption',
    label: 'Image with Corner Caption',
    description: 'Full page image with caption box in a corner',
    component: ImageWithCornerCaptionPreview,
    fields: imageWithCornerCaptionFields,
    getDefaultData: getDefaultImageWithCornerCaption,
    icon: '📌',
    category: 'image',
  },
  {
    id: 'image-with-two-corner-captions',
    label: 'Image with Two Corner Captions',
    description: 'Full page image with two caption boxes in different corners',
    component: ImageWithTwoCornerCaptionsPreview,
    fields: imageWithTwoCornerCaptionsFields,
    getDefaultData: getDefaultImageWithTwoCornerCaptions,
    icon: '📍',
    category: 'image',
  },
  {
    id: 'image-centered-with-border',
    label: 'Image with Border',
    description: 'Centered image with colored border/background',
    component: ImageCenteredWithBorderPreview,
    fields: imageCenteredWithBorderFields,
    getDefaultData: getDefaultImageCenteredWithBorder,
    icon: '🖼️',
    category: 'image',
  },
  {
    id: 'image-with-two-captions',
    label: 'Image with Two Captions',
    description: 'Image with title box and caption box on the right',
    component: ImageWithTwoCaptionsPreview,
    fields: imageWithTwoCaptionsFields,
    getDefaultData: getDefaultImageWithTwoCaptions,
    icon: '📋',
    category: 'image',
  },
  // ==========================================================================
  // ARTICLE CATEGORY - Text-heavy and multi-element layouts
  // ==========================================================================
  {
    id: 'article-start-hero',
    label: 'Article Start Hero',
    description: 'Article page with hero image and two-column text',
    component: ArticleStartHeroPreview,
    fields: articleStartHeroFields,
    getDefaultData: getDefaultArticleStartHero,
    icon: '📰',
    category: 'article',
  },
  {
    id: 'two-column-with-quote',
    label: 'Two-Column with Quote',
    description: 'Two-column article with large centered pull quote',
    component: TwoColumnWithQuotePreview,
    fields: twoColumnWithQuoteFields,
    getDefaultData: getDefaultTwoColumnWithQuote,
    icon: '📄',
    category: 'article',
  },
  {
    id: 'article-two-column-text',
    label: 'Article Two-Column Text',
    description: 'Article with optional sidebar and two-column body text',
    component: ArticleTwoColumnTextPreview,
    fields: articleTwoColumnTextFields,
    getDefaultData: getDefaultArticleTwoColumnText,
    icon: '📰',
    category: 'article',
  },
  {
    id: 'article-two-images-top',
    label: 'Article with Two Images',
    description: 'Two images at top, title, and two-column article',
    component: ArticleTwoImagesTopPreview,
    fields: articleTwoImagesTopFields,
    getDefaultData: getDefaultArticleTwoImagesTop,
    icon: '🖼️',
    category: 'article',
  },
  {
    id: 'article-image-center-with-quote',
    label: 'Centered Image with Quote',
    description: 'Large centered image, title, and article with pull quote',
    component: ArticleImageCenterWithQuotePreview,
    fields: articleImageCenterWithQuoteFields,
    getDefaultData: getDefaultArticleImageCenterWithQuote,
    icon: '📸',
    category: 'article',
  },
  {
    id: 'article-images-diagonal',
    label: 'Diagonal Image Layout',
    description: 'Images at top-right and bottom-left with flowing text',
    component: ArticleImagesDiagonalPreview,
    fields: articleImagesDiagonalFields,
    getDefaultData: getDefaultArticleImagesDiagonal,
    icon: '🎨',
    category: 'article',
  },
  {
    id: 'page-image-with-custom-block',
    label: 'Image with Custom Block',
    description: 'Image with title and customizable content block from web preview system',
    component: PageImageWithCustomBlockPreview,
    fields: pageImageWithCustomBlockFields,
    getDefaultData: getDefaultPageImageWithCustomBlock,
    icon: '🧩',
    category: 'article',
  },
  // ==========================================================================
  // CUSTOM CATEGORY - Composable layouts with objects
  // ==========================================================================
  {
    id: 'page-custom',
    label: 'Custom Layout',
    description: 'Compose your own layout with Text, Image, and Spacer objects',
    component: PageCustom,
    fields: pageCustomFields,
    getDefaultData: getDefaultPageCustom,
    icon: '🎨',
    category: 'custom',
  },
  {
    id: 'table-of-contents',
    label: 'Table of Contents',
    description: '2-column grid of page entries with images and page links',
    component: TableOfContentsPreview,
    fields: tableOfContentsFields,
    getDefaultData: getDefaultTableOfContents,
    icon: '📑',
    category: 'article',
  },
  // Future page types can be added here:
  // {
  //   id: 'full-bleed-image',
  //   label: 'Full Bleed Image',
  //   description: 'Full page image with optional overlay text',
  //   component: FullBleedImagePreview,
  //   fields: fullBleedImagePageFields,
  //   getDefaultData: getDefaultFullBleedImagePage,
  //   icon: '📷',
  // },
  // {
  //   id: 'text-only',
  //   label: 'Text Only',
  //   description: 'Text-focused page with title, subtitle, and body content',
  //   component: TextOnlyPreview,
  //   fields: textOnlyPageFields,
  //   getDefaultData: getDefaultTextOnlyPage,
  //   icon: '📝',
  // },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a preview component configuration by ID
 */
export const getDigitalPreviewComponent = (
  id: DigitalPageType
): DigitalPreviewComponent | undefined => {
  return digitalPreviewComponents.find((component) => component.id === id);
};

/**
 * Get fields for a specific page type
 */
export const getFieldsForDigitalPage = (id: DigitalPageType): FieldConfig[] => {
  const component = getDigitalPreviewComponent(id);
  return component?.fields || imageWithCaptionPageFields;
};

/**
 * Get default data for a specific page type
 */
export const getDefaultDigitalPageData = (id: DigitalPageType): Partial<DigitalPageData> => {
  const component = getDigitalPreviewComponent(id);
  return component?.getDefaultData() || getDefaultImageWithCaptionPage();
};

// =============================================================================
// RE-EXPORTS
// =============================================================================

export type { DigitalPreviewComponentProps } from '@/lib/pages/admin/components/magazine/digital/editor/types';
