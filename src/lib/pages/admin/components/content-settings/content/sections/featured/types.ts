/**
 * Featured Application Page - Section Types
 *
 * Type definitions for CMS-managed sections on the get featured application page
 */

import type { BaseSection } from '@/lib/features/display-cms/types';

/**
 * Hero Section
 * Simple hero with title, subtitle, and scroll-to-form CTA
 */
export interface FeaturedHeroSection extends BaseSection {
  type: 'featured-hero';
  content: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
}

/**
 * Content Preview Section
 * Complex section with intro, content blocks, videos, and bottom CTA
 * No configurable content - wraps existing ContentPreview component
 */
export interface FeaturedContentPreviewSection extends BaseSection {
  type: 'featured-content-preview';
  content: {};
}

/**
 * Form Section
 * Main multi-step application form with form type selection
 * No configurable content - wraps existing FeaturedForm component
 */
export interface FeaturedFormSection extends BaseSection {
  type: 'featured-form';
  content: {};
}

/**
 * Union type of all featured application page sections
 */
export type FeaturedSection =
  | FeaturedHeroSection
  | FeaturedContentPreviewSection
  | FeaturedFormSection;

/**
 * Type guards for runtime section type checking
 */
export function isFeaturedHeroSection(section: any): section is FeaturedHeroSection {
  return section?.type === 'featured-hero';
}

export function isFeaturedContentPreviewSection(section: any): section is FeaturedContentPreviewSection {
  return section?.type === 'featured-content-preview';
}

export function isFeaturedFormSection(section: any): section is FeaturedFormSection {
  return section?.type === 'featured-form';
}
