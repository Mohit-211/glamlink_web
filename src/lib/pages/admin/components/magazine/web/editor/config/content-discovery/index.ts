// Central export for all content discovery components

import { ContentComponentInfo, CATEGORY_LABELS, getAllCategories } from './types';
import { sharedComponents } from './shared';
import { coverProFeatureComponents } from './cover-pro-feature';
import { magazineClosingComponents } from './magazine-closing';
import { mariesCornerComponents } from './maries-corner';
import { risingStarComponents } from './rising-star';
import { topProductSpotlightComponents } from './top-product-spotlight';
import { topTreatmentComponents } from './top-treatment';
import { whatsNewGlamlinkComponents } from './whats-new-glamlink';
import { coinDropComponents } from './coin-drop';
import { glamlinkStoriesComponents } from './glamlink-stories';
import { spotlightCityComponents } from './spotlight-city';

// Export types
export type { ContentComponentInfo, FieldDefinition } from './types';
export { CATEGORY_LABELS, getAllCategories } from './types';

// Combine all components into a single array
export const CONTENT_COMPONENTS: ContentComponentInfo[] = [
  ...sharedComponents,
  ...coverProFeatureComponents,
  ...magazineClosingComponents,
  ...mariesCornerComponents,
  ...risingStarComponents,
  ...topProductSpotlightComponents,
  ...topTreatmentComponents,
  ...whatsNewGlamlinkComponents,
  ...coinDropComponents,
  ...glamlinkStoriesComponents,
  ...spotlightCityComponents,
];

// Helper function to get component info by name and category
export function getComponentInfo(name: string, category: string): ContentComponentInfo | undefined {
  return CONTENT_COMPONENTS.find(c => c.name === name && c.category === category);
}

// Helper function to get all components for a specific category
export function getComponentsByCategory(category: string): ContentComponentInfo[] {
  return CONTENT_COMPONENTS.filter(c => c.category === category);
}

// Helper function to search components by name or description
export function searchComponents(query: string): ContentComponentInfo[] {
  const lowerQuery = query.toLowerCase();
  return CONTENT_COMPONENTS.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.displayName.toLowerCase().includes(lowerQuery) ||
    c.description.toLowerCase().includes(lowerQuery)
  );
}

// Export individual category components for direct access
export {
  sharedComponents,
  coverProFeatureComponents,
  magazineClosingComponents,
  mariesCornerComponents,
  risingStarComponents,
  topProductSpotlightComponents,
  topTreatmentComponents,
  whatsNewGlamlinkComponents,
  coinDropComponents,
  glamlinkStoriesComponents,
  spotlightCityComponents,
};