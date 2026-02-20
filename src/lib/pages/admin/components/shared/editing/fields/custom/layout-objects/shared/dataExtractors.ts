/**
 * Data Extractors for Custom Block Components
 *
 * Component-specific functions to extract and transform data from web sections
 * into custom block props format.
 */

import type { FieldDefinition } from '@/lib/pages/admin/components/magazine/web/editor/config/content-discovery/types';

export type DataExtractor = (content: any) => Record<string, any>;

/**
 * Component-specific extractors
 *
 * Each extractor handles the unique data structure of its section type,
 * mapping section content fields to component prop names.
 */
export const extractors: Record<string, DataExtractor> = {
  /**
   * NumberedTips - Extract from maries-corner sideStories
   */
  'NumberedTips': (content) => ({
    tips: content.sideStories || content.tips || [],
    title: content.numberedTipsTitle || content.title || '',
    displayNumbers: content.displayNumbers ?? true,
    // Section title typography
    titleFontSize: content.titleFontSize || 'text-xl',
    titleFontFamily: content.titleFontFamily || 'font-sans',
    titleFontWeight: content.titleFontWeight || 'font-bold',
    titleColor: content.titleColor || 'text-gray-900',
    titleAlignment: content.titleAlignment || 'left'
  }),

  /**
   * MariesPicks - Extract from maries-corner mariesPicks
   */
  'MariesPicks': (content) => ({
    title: content.mariesPicks?.title || 'MARIE\'S PICKS',
    products: content.mariesPicks?.products || []
  }),

  /**
   * PhotoGallery - Extract from various gallery fields
   */
  'PhotoGallery': (content) => ({
    title: content.photoGalleryTitle || content.title || '',
    columns: content.galleryColumns || content.columns || 2,
    photos: content.photoGallery || content.photos || []
  }),

  /**
   * QuoteBlock - Extract quote and attribution
   */
  'QuoteBlock': (content) => ({
    quote: content.quote || content.text || '',
    attribution: content.attribution || content.author || '',
    variant: content.variant || 'default'
  }),

  /**
   * SocialFollow - Extract social media links
   */
  'SocialFollow': (content) => ({
    title: content.socialTitle || 'FOLLOW US',
    instagram: content.instagram || content.instagramUrl || '',
    facebook: content.facebook || content.facebookUrl || '',
    twitter: content.twitter || content.twitterUrl || '',
    tiktok: content.tiktok || content.tiktokUrl || ''
  }),

  /**
   * Stats - Extract statistics array
   */
  'Stats': (content) => ({
    items: content.stats || content.items || [],
    layout: content.layout || 'grid',
    columns: content.columns || 3
  }),

  /**
   * RichContent - Extract HTML content
   */
  'RichContent': (content) => ({
    content: content.content || content.html || content.richContent || '',
    className: content.className || ''
  }),

  /**
   * BeforeAfter - Extract before/after images
   */
  'BeforeAfter': (content) => ({
    beforeImage: content.beforeImage || content.before || '',
    afterImage: content.afterImage || content.after || '',
    title: content.title || 'Before & After',
    description: content.description || ''
  }),

  /**
   * ProductDetails - Extract product information
   */
  'ProductDetails': (content) => ({
    name: content.name || content.productName || '',
    price: content.price || '',
    description: content.description || '',
    image: content.image || content.mainImage || '',
    features: content.features || []
  }),

  /**
   * ProfileCard - Extract profile data
   */
  'ProfileCard': (content) => ({
    name: content.name || '',
    title: content.title || content.jobTitle || '',
    image: content.image || content.profileImage || '',
    bio: content.bio || content.description || '',
    social: content.social || {}
  })
};

/**
 * Fallback extractor - Search content for matching field names
 *
 * Used when no specific extractor exists for a component.
 * Performs deep search of content object to find matching field names.
 *
 * @param content - Section content object
 * @param fields - Expected field definitions from content-discovery
 * @returns Extracted data or null if no matches found
 */
export function searchContentForFields(
  content: any,
  fields: FieldDefinition[]
): Record<string, any> | null {
  const extracted: Record<string, any> = {};

  for (const field of fields) {
    const value = deepFind(content, field.name);
    if (value !== undefined) {
      extracted[field.name] = value;
    }
  }

  return Object.keys(extracted).length > 0 ? extracted : null;
}

/**
 * Deep search utility
 *
 * Recursively searches an object for a specific key, returning the first match found.
 * Useful for finding nested fields in complex content structures.
 *
 * @param obj - Object to search
 * @param key - Key to find
 * @returns Value if found, undefined otherwise
 */
function deepFind(obj: any, key: string): any {
  if (obj === null || typeof obj !== 'object') return undefined;

  // Direct match
  if (key in obj) return obj[key];

  // Recursive search
  for (const k in obj) {
    const result = deepFind(obj[k], key);
    if (result !== undefined) return result;
  }

  return undefined;
}
