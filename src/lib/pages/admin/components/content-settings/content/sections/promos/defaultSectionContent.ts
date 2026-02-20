/**
 * Default Promos Page Section Content
 *
 * Factory functions for creating default section configurations.
 * These are used when adding new sections or initializing the page.
 */

import type {
  PromosPageConfig,
  PromosHeroSection,
  PromosListingSection
} from './types';

/**
 * Generate a unique section ID
 */
function generateSectionId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Default Promos Hero Section
 */
export function getDefaultPromosHeroSection(order: number = 1): PromosHeroSection {
  return {
    id: generateSectionId('promos-hero'),
    type: 'promos-hero',
    name: 'Hero Section',
    order,
    visible: true,
    content: {
      title: 'Glamlink Launch Perks',
      subtitle: 'Exclusive deals and giveaways during our Vegas launch'
    }
  };
}

/**
 * Default Promos Listing Section
 */
export function getDefaultPromosListingSection(order: number = 2): PromosListingSection {
  return {
    id: generateSectionId('promos-listing'),
    type: 'promos-listing',
    name: 'Promos Listing',
    order,
    visible: true,
    content: {}
  };
}

/**
 * Get default section content by type
 */
export function getDefaultPromosSectionContent(
  type: string,
  order: number
): PromosHeroSection | PromosListingSection {
  switch (type) {
    case 'promos-hero':
      return getDefaultPromosHeroSection(order);
    case 'promos-listing':
      return getDefaultPromosListingSection(order);
    default:
      throw new Error(`Unknown section type: ${type}`);
  }
}

/**
 * Get all default sections as array
 */
export function getAllDefaultPromosSections() {
  return [
    getDefaultPromosHeroSection(1),
    getDefaultPromosListingSection(2)
  ];
}

/**
 * Default complete promos page configuration
 */
export function getDefaultPromosPageConfig(): PromosPageConfig {
  return {
    id: 'promos',
    sections: getAllDefaultPromosSections(),
    ssgEnabled: false  // Use ISR revalidation instead
  };
}
