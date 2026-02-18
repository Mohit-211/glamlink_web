/**
 * Content Blocks Configuration Index
 * 
 * This file exports all content block configurations and provides
 * helper functions for the AI-CMS system to work with them.
 * 
 * Usage:
 * ```typescript
 * import { getContentBlockConfigs } from '/lib/pages/magazine/config/ai-cms/content-blocks/';
 * const configs = getContentBlockConfigs();
 * ```
 */

// Import all content block configurations

// whats-new-glamlink category
export { featureListConfig } from './feature-list.config';
export { sneakPeeksConfig } from './sneak-peeks.config';
export { tipsListConfig } from './tips-list.config';

// maries-corner category
export { authorBadgeConfig } from './author-badge.config';
export { mariesPicksConfig } from './maries-picks.config';
export { numberedTipsConfig } from './numbered-tips.config';
export { quoteBlockConfig } from './quote-block.config';
export { socialFollowConfig } from './social-follow.config';

// top-treatment category
export { beforeAfterImagesConfig } from './before-after-images.config';
export { proInsightsConfig } from './pro-insights.config';
export { treatmentDetailsConfig } from './treatment-details.config';

// cover-pro-feature category
export { accoladesListConfig } from './accolades-list.config';
export { professionalProfileConfig } from './professional-profile.config';

// magazine-closing category
export { nextIssuePreviewConfig } from './next-issue-preview.config';
export { spotlightReelConfig } from './spotlight-reel.config';

// rising-star category
export { achievementsGridConfig } from './achievements-grid.config';
export { starProfileConfig } from './star-profile.config';

// top-product-spotlight category
export { productDetailsConfig } from './product-details.config';
export { similarProductsConfig } from './similar-products.config';

// shared category
export { richContentConfig } from './rich-content.config';
export { sectionHeaderConfig } from './section-header.config';
export { photoGalleryConfig } from './photo-gallery.config';
export { socialLinksConfig } from './social-links.config';
export { quoteCarouselConfig } from './quote-carousel.config';
export { videoBlockConfig } from './video-block.config';

// Legacy configs
export { photoGalleryProductsConfig } from './photo-gallery-products.config';

// Import types
export type { FeatureListConfig } from './feature-list.config';
export type { SneakPeeksConfig } from './sneak-peeks.config';
export type { TipsListConfig } from './tips-list.config';
export type { AuthorBadgeConfig } from './author-badge.config';
export type { MariesPicksConfig } from './maries-picks.config';
export type { NumberedTipsConfig } from './numbered-tips.config';
export type { QuoteBlockConfig } from './quote-block.config';
export type { SocialFollowConfig } from './social-follow.config';
export type { BeforeAfterImagesConfig } from './before-after-images.config';
export type { ProInsightsConfig } from './pro-insights.config';
export type { TreatmentDetailsConfig } from './treatment-details.config';
export type { AccoladesListConfig } from './accolades-list.config';
export type { ProfessionalProfileConfig } from './professional-profile.config';
export type { NextIssuePreviewConfig } from './next-issue-preview.config';
export type { SpotlightReelConfig } from './spotlight-reel.config';
export type { AchievementsGridConfig } from './achievements-grid.config';
export type { StarProfileConfig } from './star-profile.config';
export type { ProductDetailsConfig } from './product-details.config';
export type { SimilarProductsConfig } from './similar-products.config';
export type { RichContentConfig } from './rich-content.config';
export type { SectionHeaderConfig } from './section-header.config';
export type { PhotoGalleryConfig } from './photo-gallery.config';
export type { SocialLinksConfig } from './social-links.config';
export type { QuoteCarouselConfig } from './quote-carousel.config';
export type { VideoBlockConfig } from './video-block.config';
export type { PhotoGalleryProductsConfig } from './photo-gallery-products.config';

// Combined configuration object
import { featureListConfig } from './feature-list.config';
import { sneakPeeksConfig } from './sneak-peeks.config';
import { tipsListConfig } from './tips-list.config';
import { authorBadgeConfig } from './author-badge.config';
import { mariesPicksConfig } from './maries-picks.config';
import { numberedTipsConfig } from './numbered-tips.config';
import { quoteBlockConfig } from './quote-block.config';
import { socialFollowConfig } from './social-follow.config';
import { beforeAfterImagesConfig } from './before-after-images.config';
import { proInsightsConfig } from './pro-insights.config';
import { treatmentDetailsConfig } from './treatment-details.config';
import { accoladesListConfig } from './accolades-list.config';
import { professionalProfileConfig } from './professional-profile.config';
import { nextIssuePreviewConfig } from './next-issue-preview.config';
import { spotlightReelConfig } from './spotlight-reel.config';
import { achievementsGridConfig } from './achievements-grid.config';
import { starProfileConfig } from './star-profile.config';
import { productDetailsConfig } from './product-details.config';
import { similarProductsConfig } from './similar-products.config';
import { richContentConfig } from './rich-content.config';
import { sectionHeaderConfig } from './section-header.config';
import { photoGalleryConfig } from './photo-gallery.config';
import { socialLinksConfig } from './social-links.config';
import { quoteCarouselConfig } from './quote-carousel.config';
import { videoBlockConfig } from './video-block.config';
import { photoGalleryProductsConfig } from './photo-gallery-products.config';

/**
 * Get all content block configurations
 * Returns a map of block type -> configuration
 */
export const getContentBlockConfigs = () => {
  return {
    // whats-new-glamlink category
    'FeatureList': featureListConfig,
    'SneakPeeks': sneakPeeksConfig,
    'TipsList': tipsListConfig,
    
    // maries-corner category
    'AuthorBadge': authorBadgeConfig,
    'MariesPicks': mariesPicksConfig,
    'NumberedTips': numberedTipsConfig,
    'QuoteBlock': quoteBlockConfig,
    'SocialFollow': socialFollowConfig,
    
    // top-treatment category
    'BeforeAfterImages': beforeAfterImagesConfig,
    'ProInsights': proInsightsConfig,
    'TreatmentDetails': treatmentDetailsConfig,
    
    // cover-pro-feature category
    'AccoladesList': accoladesListConfig,
    'ProfessionalProfile': professionalProfileConfig,
    
    // magazine-closing category
    'NextIssuePreview': nextIssuePreviewConfig,
    'SpotlightReel': spotlightReelConfig,
    
    // rising-star category
    'AchievementsGrid': achievementsGridConfig,
    'StarProfile': starProfileConfig,
    
    // top-product-spotlight category
    'ProductDetails': productDetailsConfig,
    'SimilarProducts': similarProductsConfig,
    
    // shared category
    'RichContent': richContentConfig,
    'SectionHeader': sectionHeaderConfig,
    'PhotoGallery': photoGalleryConfig,
    'SocialLinks': socialLinksConfig,
    'QuoteCarousel': quoteCarouselConfig,
    'VideoBlock': videoBlockConfig,

    // Legacy configs
    'PhotoGalleryProducts': photoGalleryProductsConfig
  };
};

/**
 * Get configuration for a specific content block type
 */
export const getContentBlockConfig = (blockType: string) => {
  const configs = getContentBlockConfigs();
  return (configs as any)[blockType];
};

/**
 * Get all available content block types
 */
export const getAvailableBlockTypes = () => {
  return Object.keys(getContentBlockConfigs());
};

/**
 * Check if a content block type has a configuration
 */
export const hasContentBlockConfig = (blockType: string): boolean => {
  return blockType in getContentBlockConfigs();
};

/**
 * The path this configuration covers
 * This can be used by the AI system to identify which config set to use
 */
export const CONFIG_PATH = '/lib/pages/magazine/config/ai-cms/content-blocks/';

/**
 * Content type identifier for this configuration set
 */
export const CONTENT_TYPE = 'magazine-content-blocks';

/**
 * Default configuration for unknown block types
 * This provides a fallback when a block type doesn't have a specific config
 */
export const defaultBlockConfig = {
  type: 'unknown',
  displayName: 'Unknown Block',
  description: 'Content block without specific configuration',
  category: 'generic',
  complexity: 'medium' as const,
  fields: {
    title: {
      aiEnabled: true,
      type: 'text' as const,
      displayName: 'Title',
      description: 'Block title or heading'
    },
    content: {
      aiEnabled: true,
      type: 'html' as const,
      displayName: 'Content',
      description: 'Main content of the block'
    },
    description: {
      aiEnabled: true,
      type: 'text' as const,
      displayName: 'Description',
      description: 'Block description or subtitle'
    }
  },
  aiPrompts: {
    system: 'You are editing content for a magazine. Make the content engaging and appropriate for the target audience.',
    examples: [
      'Make this more engaging and professional',
      'Add more specific details',
      'Improve the tone and readability'
    ]
  }
};