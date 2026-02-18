/**
 * Promos Page Section Types
 *
 * Type definitions for the promos page CMS sections.
 */

import type { BaseSection } from '@/lib/features/display-cms/types';

/**
 * Promos Hero Section
 *
 * Simple hero section with title and subtitle
 */
export interface PromosHeroSection extends BaseSection {
  type: 'promos-hero';
  content: {
    title: string;
    subtitle: string;
  };
}

/**
 * Promos Listing Section
 *
 * Wraps the existing PromosPage component.
 * Data is fetched server-side and passed as props.
 */
export interface PromosListingSection extends BaseSection {
  type: 'promos-listing';
  content: {
    // No configurable content - this wraps existing client component
    // Promos are fetched from database in page component
  };
}

/**
 * Union type of all promos section types
 */
export type PromosSection =
  | PromosHeroSection
  | PromosListingSection;

/**
 * Promos Page Configuration
 */
export interface PromosPageConfig {
  id: 'promos';
  sections: PromosSection[];
  ssgEnabled: boolean;
}

/**
 * Type guard for PromosHeroSection
 */
export function isPromosHeroSection(section: PromosSection): section is PromosHeroSection {
  return section.type === 'promos-hero';
}

/**
 * Type guard for PromosListingSection
 */
export function isPromosListingSection(section: PromosSection): section is PromosListingSection {
  return section.type === 'promos-listing';
}
