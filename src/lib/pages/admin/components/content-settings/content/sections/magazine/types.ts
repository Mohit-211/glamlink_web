/**
 * Magazine Page Section Types
 *
 * Type definitions for the magazine page CMS sections.
 */

import type { BaseSection } from '@/lib/features/display-cms/types';

/**
 * Magazine Hero Section
 *
 * Simple hero section with title and subtitle
 */
export interface MagazineHeroSection extends BaseSection {
  type: 'magazine-hero';
  content: {
    title: string;
    subtitle: string;
  };
}

/**
 * Magazine Listing Section
 *
 * Wraps the existing MagazineListingClient component.
 * Data is fetched server-side and passed as props.
 */
export interface MagazineListingSection extends BaseSection {
  type: 'magazine-listing';
  content: {
    // No configurable content - this wraps existing client component
    // Issues are fetched from database in page component
  };
}

/**
 * Union type of all magazine section types
 */
export type MagazineSection =
  | MagazineHeroSection
  | MagazineListingSection;

/**
 * Magazine Page Configuration
 */
export interface MagazinePageConfig {
  id: 'magazine';
  sections: MagazineSection[];
  ssgEnabled: boolean;
}

/**
 * Type guard for MagazineHeroSection
 */
export function isMagazineHeroSection(section: MagazineSection): section is MagazineHeroSection {
  return section.type === 'magazine-hero';
}

/**
 * Type guard for MagazineListingSection
 */
export function isMagazineListingSection(section: MagazineSection): section is MagazineListingSection {
  return section.type === 'magazine-listing';
}
