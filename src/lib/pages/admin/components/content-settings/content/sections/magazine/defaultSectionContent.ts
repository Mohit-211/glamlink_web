/**
 * Default Magazine Page Section Content
 *
 * Factory functions for creating default section configurations.
 * These are used when adding new sections or initializing the page.
 */

import type {
  MagazinePageConfig,
  MagazineHeroSection,
  MagazineListingSection
} from './types';

/**
 * Generate a unique section ID
 */
function generateSectionId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Default Magazine Hero Section
 */
export function getDefaultMagazineHeroSection(order: number = 1): MagazineHeroSection {
  return {
    id: generateSectionId('magazine-hero'),
    type: 'magazine-hero',
    name: 'Hero Section',
    order,
    visible: true,
    content: {
      title: 'The Glamlink Edit',
      subtitle: 'From industry leaders to rising stars, your weekly source for top professional treatments, products, and insights'
    }
  };
}

/**
 * Default Magazine Listing Section
 */
export function getDefaultMagazineListingSection(order: number = 2): MagazineListingSection {
  return {
    id: generateSectionId('magazine-listing'),
    type: 'magazine-listing',
    name: 'Magazine Listing',
    order,
    visible: true,
    content: {}
  };
}

/**
 * Get default section content by type
 */
export function getDefaultMagazineSectionContent(
  type: string,
  order: number
): MagazineHeroSection | MagazineListingSection {
  switch (type) {
    case 'magazine-hero':
      return getDefaultMagazineHeroSection(order);
    case 'magazine-listing':
      return getDefaultMagazineListingSection(order);
    default:
      throw new Error(`Unknown section type: ${type}`);
  }
}

/**
 * Get all default sections as array
 */
export function getAllDefaultMagazineSections() {
  return [
    getDefaultMagazineHeroSection(1),
    getDefaultMagazineListingSection(2)
  ];
}

/**
 * Default complete magazine page configuration
 */
export function getDefaultMagazinePageConfig(): MagazinePageConfig {
  return {
    id: 'magazine',
    sections: getAllDefaultMagazineSections(),
    ssgEnabled: false  // Use ISR revalidation instead
  };
}
