/**
 * Digital Page Editor - Default Values and Example Data
 * Default data functions and example data with real Unsplash images
 */

import type {
  DigitalPageData,
} from '@/lib/pages/admin/components/magazine/digital/editor/types';

// =============================================================================
// DEFAULT VALUES FUNCTIONS
// =============================================================================

export const getDefaultFullPageImage = (): Partial<DigitalPageData> => ({
  type: 'full-page-image',
  image: '/images/placeholder.png',
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 0,
  },
});

export const getDefaultImageWithTitle = (): Partial<DigitalPageData> => ({
  type: 'image-with-title',
  title: '',
  subtitle: '',
  image: '/images/placeholder.png',
  backgroundColor: '#ffffff',
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 20,
  },
});

export const getDefaultImageWithCornerCaption = (): Partial<DigitalPageData> => ({
  type: 'image-with-corner-caption',
  image: '/images/placeholder.png',
  useFullPageImage: true,
  captionTitle: '',
  caption: '',
  captionPosition: 'top-left',
  captionBackgroundColor: 'transparent',
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 0,
  },
});

export const getDefaultImageWithTwoCornerCaptions = (): Partial<DigitalPageData> => ({
  type: 'image-with-two-corner-captions',
  image: '/images/placeholder.png',
  useFullPageImage: true,
  // Caption 1
  captionTitle: '',
  caption: '',
  captionPosition: 'top-left',
  captionBackgroundColor: 'transparent',
  // Caption 2
  caption2Title: '',
  caption2: '',
  caption2Position: 'bottom-right',
  caption2BackgroundColor: 'transparent',
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 0,
  },
});

export const getDefaultArticleStartHero = (): Partial<DigitalPageData> => ({
  type: 'article-start-hero',
  heroImage: '/images/placeholder.png',
  title: '',
  subtitle: '',
  articleContent: '',
  dropCapEnabled: true,
  backgroundColor: '#ffffff',
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 20,
  },
});

export const getDefaultImageCenteredWithBorder = (): Partial<DigitalPageData> => ({
  type: 'image-centered-with-border',
  image: '/images/placeholder.png',
  borderColor: '#8B2942',
  borderWidth: 40,
  imageWidth: '80%',
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#8B2942',
    margin: 0,
  },
});

export const getDefaultImageWithTwoCaptions = (): Partial<DigitalPageData> => ({
  type: 'image-with-two-captions',
  image: '/images/placeholder.png',
  titleBox: '',
  titleBoxContent: '',
  captionTitle: '',
  captionContent: '',
  backgroundColor: '#ffffff',
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 0,
  },
});

export const getDefaultImageWithCaptionPage = (): Partial<DigitalPageData> => ({
  type: 'image-with-caption',
  title: '',
  subtitle: '',
  caption: '',
  backgroundColor: '#ffffff',
  layout: {
    imagePosition: 'top',
    textAlignment: 'center',
    contentPadding: 24,
    imageSize: 'large',
    verticalAlignment: 'center',
  },
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 20,
  },
});

export const getDefaultFullBleedImagePage = (): Partial<DigitalPageData> => ({
  type: 'full-bleed-image',
  title: '',
  backgroundColor: '#000000',
  layout: {
    imagePosition: 'background',
    textAlignment: 'center',
    contentPadding: 40,
    imageSize: 'full',
    verticalAlignment: 'bottom',
  },
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#000000',
    margin: 0,
  },
});

export const getDefaultTextOnlyPage = (): Partial<DigitalPageData> => ({
  type: 'text-only',
  title: '',
  subtitle: '',
  caption: '',
  backgroundColor: '#ffffff',
  layout: {
    imagePosition: 'top',
    textAlignment: 'center',
    contentPadding: 40,
    imageSize: 'full',
    verticalAlignment: 'center',
  },
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 20,
  },
});

export const getDefaultTwoColumnWithQuote = (): Partial<DigitalPageData> => ({
  type: 'two-column-with-quote',
  articleTitle: '',
  byline: '',
  articleContent: '',
  pullQuote: '',
  quoteContext: '',
  quotePosition: 50,
  // Content mode: 'quote' | 'content-block' | 'digital-card'
  contentMode: 'quote',
  customBlock: null,
  professionalId: '',
  backgroundColor: '#ffffff',
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 20,
  },
});

export const getDefaultArticleTwoColumnText = (): Partial<DigitalPageData> => ({
  type: 'article-two-column-text',
  articleTitle: '',
  byline: '',
  sidebarContent: '',
  sidebarBackgroundColor: '#000000',
  articleContent: '',
  showDropCap: true,
  backgroundColor: '#ffffff',
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 20,
  },
});

export const getDefaultArticleTwoImagesTop = (): Partial<DigitalPageData> => ({
  type: 'article-two-images-top',
  mainImage: '/images/placeholder.png',
  secondImage: '/images/placeholder.png',
  secondImageCaption: '',
  articleTitle: '',
  subtitle: '',
  articleContent: '',
  thirdImage: '',
  thirdImageCaption: '',
  // Content mode: 'image' | 'content-block' | 'digital-card'
  contentMode: 'image',
  customBlock: null,
  professionalId: '',
  showDropCap: true,
  backgroundColor: '#ffffff',
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 20,
  },
});

export const getDefaultArticleImageCenterWithQuote = (): Partial<DigitalPageData> => ({
  type: 'article-image-center-with-quote',
  heroImage: '/images/placeholder.png',
  imageWidth: '70%',
  articleTitle: '',
  subtitle: '',
  articleContent: '',
  pullQuote: '',
  quoteContext: '',
  quotePosition: 50,
  // Content mode: 'quote' | 'content-block' | 'digital-card'
  contentMode: 'quote',
  customBlock: null,
  professionalId: '',
  showDropCap: true,
  backgroundColor: '#ffffff',
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 20,
  },
});

export const getDefaultArticleImagesDiagonal = (): Partial<DigitalPageData> => ({
  type: 'article-images-diagonal',
  // Top right content: 'image' | 'content-block' | 'digital-card'
  topRightContentMode: 'image',
  topRightImage: '/images/placeholder.png',
  topRightCaption: '',
  topRightBlock: null,
  topRightProfessionalId: '',
  // Article content
  articleTitle: '',
  byline: '',
  articleContent: '',
  // Bottom left content: 'image' | 'content-block' | 'digital-card'
  bottomLeftContentMode: 'image',
  bottomLeftImage: '/images/placeholder.png',
  bottomLeftCaption: '',
  bottomLeftBlock: null,
  bottomLeftProfessionalId: '',
  // Layout options
  imageSize: 'medium',
  showDropCap: true,
  backgroundColor: '#ffffff',
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 20,
  },
});

export const getDefaultPageImageWithCustomBlock = (): Partial<DigitalPageData> => ({
  type: 'page-image-with-custom-block',
  image: '/images/placeholder.png',
  title: '',
  subtitle: '',
  backgroundColor: '#ffffff',
  customBlock: null,
  blockContainerStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: '#e5e7eb',
    borderRadius: 0,
    padding: 16,
    marginTop: 16,
  },
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 20,
  },
});

export const getDefaultPageCustom = (): Partial<DigitalPageData> => ({
  type: 'page-custom',
  backgroundColor: '#ffffff',
  objects: [],
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 0,
  },
});

export const getDefaultTableOfContents = (): Partial<DigitalPageData> => ({
  type: 'table-of-contents',
  tocTitle: 'CONTENTS',
  tocEntries: [],
  backgroundColor: '#ffffff',
  pdfSettings: {
    ratio: 'a4-portrait',
    backgroundColor: '#ffffff',
    margin: 20,
  },
});

// =============================================================================
// EXAMPLE DATA FOR PREVIEW (with real images)
// =============================================================================
// These functions provide example data with real Unsplash images for testing
// the html2canvas preview generation without requiring user uploads.

export const getExampleFullPageImage = (): Partial<DigitalPageData> => ({
  ...getDefaultFullPageImage(),
  image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
});

export const getExampleImageWithTitle = (): Partial<DigitalPageData> => ({
  ...getDefaultImageWithTitle(),
  title: 'Summer Beauty Essentials',
  subtitle: 'Discover the season\'s must-have products',
  image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
  backgroundColor: '#f8f4f0',
});

export const getExampleImageWithCornerCaption = (): Partial<DigitalPageData> => ({
  ...getDefaultImageWithCornerCaption(),
  image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
  captionTitle: 'SUN QUEEN',
  caption: 'Embrace the golden glow with our summer collection featuring sun-kissed highlights and bronzed perfection.',
  captionPosition: 'bottom-right',
});

export const getExampleArticleStartHero = (): Partial<DigitalPageData> => ({
  ...getDefaultArticleStartHero(),
  heroImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
  title: 'The Art of Natural Beauty',
  subtitle: 'How minimalist skincare is transforming the industry',
  articleContent: '<p>The beauty industry is experiencing a renaissance. More consumers than ever are seeking products that enhance their natural features rather than mask them. This shift toward authenticity has sparked a revolution in how brands approach product development and marketing.</p><p>Leading dermatologists and beauty experts agree that the future lies in understanding and working with our skin\'s natural biology. From microbiome-friendly formulations to personalized skincare routines based on genetic markers, the innovations are endless.</p><p>Join us as we explore the science behind this movement and discover how you can embrace your authentic beauty journey.</p>',
  dropCapEnabled: true,
  backgroundColor: '#ffffff',
});

export const getExampleImageCenteredWithBorder = (): Partial<DigitalPageData> => ({
  ...getDefaultImageCenteredWithBorder(),
  image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
  borderColor: '#8B2942',
  borderWidth: 40,
  imageWidth: '80%',
});

export const getExampleImageWithTwoCaptions = (): Partial<DigitalPageData> => ({
  ...getDefaultImageWithTwoCaptions(),
  image: 'https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?w=800&q=80',
  titleBox: 'GO FOR GOLD',
  titleBoxContent: 'This season\'s hottest trend is all about embracing warm, golden tones that complement every skin tone.',
  captionTitle: 'BEAUTY NOTE',
  captionContent: 'Apply highlighter to the high points of your facecheekbones, brow bone, and the bridge of your nosefor a natural, luminous glow.',
  backgroundColor: '#faf7f2',
});

export const getExampleImageWithCaptionPage = (): Partial<DigitalPageData> => ({
  ...getDefaultImageWithCaptionPage(),
  title: 'Radiant Skin Secrets',
  subtitle: 'Expert tips for a glowing complexion',
  image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
  caption: 'Achieving radiant skin starts with understanding your unique skin type and building a routine that nourishes from within.',
  backgroundColor: '#f5f5f5',
});

export const getExampleFullBleedImagePage = (): Partial<DigitalPageData> => ({
  ...getDefaultFullBleedImagePage(),
  title: 'BEAUTY REIMAGINED',
  image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80',
  backgroundColor: '#000000',
});

export const getExampleTextOnlyPage = (): Partial<DigitalPageData> => ({
  ...getDefaultTextOnlyPage(),
  title: 'The Future of Beauty',
  subtitle: 'Innovation meets tradition',
  caption: '<p>As we look toward the future of beauty, one thing becomes clear: the industry is undergoing a profound transformation. Sustainability, inclusivity, and authenticity are no longer buzzwordsthey\'re the foundations upon which modern brands are built.</p><p>From lab-grown ingredients to AI-powered skincare analysis, technology is opening new possibilities while ancient wisdom from around the world continues to inspire formulations. This beautiful marriage of old and new is creating products that are both effective and ethical.</p>',
  backgroundColor: '#ffffff',
});

// =============================================================================
// PAGE TYPE MAPPINGS
// =============================================================================

/**
 * Map of page types to their default data functions
 * Used by getDefaultDataForPageType in previews.ts
 */
export const defaultPageMap: Record<string, () => Partial<DigitalPageData>> = {
  'image-with-caption': getDefaultImageWithCaptionPage,
  'full-bleed-image': getDefaultFullBleedImagePage,
  'text-only': getDefaultTextOnlyPage,
  'full-page-image': getDefaultFullPageImage,
  'image-with-title': getDefaultImageWithTitle,
  'image-with-corner-caption': getDefaultImageWithCornerCaption,
  'image-with-two-corner-captions': getDefaultImageWithTwoCornerCaptions,
  'article-start-hero': getDefaultArticleStartHero,
  'image-centered-with-border': getDefaultImageCenteredWithBorder,
  'image-with-two-captions': getDefaultImageWithTwoCaptions,
  'two-column-with-quote': getDefaultTwoColumnWithQuote,
  'article-two-column-text': getDefaultArticleTwoColumnText,
  'article-two-images-top': getDefaultArticleTwoImagesTop,
  'article-image-center-with-quote': getDefaultArticleImageCenterWithQuote,
  'article-images-diagonal': getDefaultArticleImagesDiagonal,
  'page-image-with-custom-block': getDefaultPageImageWithCustomBlock,
  'page-custom': getDefaultPageCustom,
  'table-of-contents': getDefaultTableOfContents,
};

/**
 * Map of page types to their example data functions
 * Used by the "Generate Example" button in the preview panel
 */
const examplePageMap: Record<string, () => Partial<DigitalPageData>> = {
  'image-with-caption': getExampleImageWithCaptionPage,
  'full-bleed-image': getExampleFullBleedImagePage,
  'text-only': getExampleTextOnlyPage,
  'full-page-image': getExampleFullPageImage,
  'image-with-title': getExampleImageWithTitle,
  'image-with-corner-caption': getExampleImageWithCornerCaption,
  'article-start-hero': getExampleArticleStartHero,
  'image-centered-with-border': getExampleImageCenteredWithBorder,
  'image-with-two-captions': getExampleImageWithTwoCaptions,
};

export const getExampleDataForPageType = (pageType: string): Partial<DigitalPageData> => {
  const getExample = examplePageMap[pageType] || examplePageMap['image-with-caption'];
  return getExample();
};
