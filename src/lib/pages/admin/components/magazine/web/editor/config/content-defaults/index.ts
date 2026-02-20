import { authorBadgeDefaults } from './author-badge-defaults';
import { richContentDefaults } from './rich-text-content-defaults';
import { numberedTipsDefaults } from './numbered-tips-defaults';
import { socialFollowDefaults } from './social-follow-defaults';
import { photoGalleryDefaults } from './photo-gallery-defaults';
import { featureListDefaults } from './feature-list-defaults';
import { sneakPeeksDefaults } from './sneak-peeks-defaults';
import { tipsListDefaults } from './tips-list-defaults';

// Import shared components defaults
import { sharedComponentsDefaults } from './shared-components-defaults';

// Import new content defaults
import { magazineClosingDefaults } from './magazine-closing-defaults';
import { topProductSpotlightDefaults } from './top-product-spotlight-defaults';
import { topTreatmentDefaults } from './top-treatment-defaults';
import { risingStarDefaults } from './rising-star-defaults';
import { coverProFeatureDefaults } from './cover-pro-feature-defaults';
import { mariesCornerDefaults } from './maries-corner-defaults';

/**
 * Convert kebab-case to PascalCase for category matching
 * Example: "maries-corner" → "MariesCorner"
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Map of component defaults by component name
export const componentDefaults: Record<string, any> = {
  'AuthorBadge': authorBadgeDefaults,
  'RichContent': richContentDefaults,
  'NumberedTips': numberedTipsDefaults,
  'SocialFollow': socialFollowDefaults,
  'PhotoGallery': photoGalleryDefaults,
  'FeatureList': featureListDefaults,
  'SneakPeeks': sneakPeeksDefaults,
  'TipsList': tipsListDefaults,

  // Shared components defaults
  'MediaItem': sharedComponentsDefaults.MediaItem,
  'Stats': sharedComponentsDefaults.Stats,
  'CTAStat': sharedComponentsDefaults.CTAStat,
  'SectionHeader': sharedComponentsDefaults.SectionHeader,
  'SectionDivider': sharedComponentsDefaults.SectionDivider,
  
  // Magazine Closing defaults
  'NextIssuePreview': magazineClosingDefaults.NextIssuePreview,
  'SpotlightReel': magazineClosingDefaults.SpotlightReel,
  'CallToAction': magazineClosingDefaults.CallToAction,
  
  // Top Product Spotlight defaults
  'ProductDetails': topProductSpotlightDefaults.ProductDetails,
  'PhotoGalleryProducts': topProductSpotlightDefaults.PhotoGalleryProducts,
  'SimilarProducts': topProductSpotlightDefaults.SimilarProducts,
  
  // Top Treatment defaults
  'BeforeAfterImages': topTreatmentDefaults.BeforeAfterImages,
  'TreatmentDetails': topTreatmentDefaults.TreatmentDetails,
  'ProInsights': topTreatmentDefaults.ProInsights,
  
  // Rising Star defaults
  'StarProfile': risingStarDefaults.StarProfile,
  'AchievementsGrid': risingStarDefaults.AchievementsGrid,
  'SocialLinks': risingStarDefaults.SocialLinks,
  
  // Cover Pro Feature defaults
  'ProfessionalProfile': coverProFeatureDefaults.ProfessionalProfile,
  'AccoladesList': coverProFeatureDefaults.AccoladesList,
  
  // Marie's Corner defaults
  'QuoteBlock': mariesCornerDefaults.QuoteBlock,
  'SocialFollow_MariesCorner': mariesCornerDefaults.SocialFollow,
  
  // Note: Some components like PhotoGallery and RichContent have multiple versions
  // The main PhotoGallery uses photoGalleryDefaults, but Rising Star has its own
  'PhotoGallery_RisingStar': risingStarDefaults.PhotoGallery,
  'PhotoGallery_CoverProFeature': coverProFeatureDefaults.PhotoGallery,
  'PhotoGallery_MariesCorner': mariesCornerDefaults.PhotoGallery,
  'RichContent_RisingStar': risingStarDefaults.RichContent,
  'RichContent_TopTreatment': topTreatmentDefaults.RichContent,
  'RichContent_CoverProFeature': coverProFeatureDefaults.RichContent,
  'RichContent_MariesCorner': mariesCornerDefaults.RichContent,
  'SectionHeader_CoverProFeature': coverProFeatureDefaults.SectionHeader,
  'SocialLinks_RisingStar': risingStarDefaults.SocialLinks,
  'AuthorBadge_MariesCorner': mariesCornerDefaults.AuthorBadge,
};

/**
 * Get default props for a component type
 * Supports category-specific overrides with robust matching
 *
 * @param componentType - Component name (e.g., "PhotoGallery")
 * @param category - Optional category for category-specific defaults (e.g., "maries-corner")
 * @returns Default props object or empty object if no defaults found
 *
 * @example
 * getComponentDefaults('PhotoGallery', 'shared')         → General PhotoGallery defaults
 * getComponentDefaults('PhotoGallery', 'maries-corner')  → Marie's Corner-specific defaults
 */
export function getComponentDefaults(
  componentType: string,
  category?: string
): Record<string, any> {
  // Try category-specific defaults first (with proper PascalCase matching)
  if (category) {
    const categoryPascal = toPascalCase(category);
    const categorySpecificKey = `${componentType}_${categoryPascal}`;

    if (componentDefaults[categorySpecificKey]) {
      return componentDefaults[categorySpecificKey];
    }
  }

  // Fall back to general component defaults
  return componentDefaults[componentType] || {};
}

// Export individual default collections for direct access
export { sharedComponentsDefaults } from './shared-components-defaults';
export { magazineClosingDefaults } from './magazine-closing-defaults';
export { topProductSpotlightDefaults } from './top-product-spotlight-defaults';
export { topTreatmentDefaults } from './top-treatment-defaults';
export { risingStarDefaults } from './rising-star-defaults';
export { coverProFeatureDefaults } from './cover-pro-feature-defaults';
export { mariesCornerDefaults } from './maries-corner-defaults';