/**
 * Featured Application Page - Default Section Content
 *
 * Factory functions that return default content for each featured section type.
 * Content based on legacy get featured application page.
 */

import type {
  FeaturedHeroSection,
  FeaturedContentPreviewSection,
  FeaturedFormSection,
} from './types';

/**
 * Generate unique section ID
 */
function generateSectionId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Default Hero Section
 *
 * Simple hero with title, subtitle, and "Apply Now" CTA
 */
export function getDefaultFeaturedHeroSection(order: number = 1): FeaturedHeroSection {
  return {
    id: generateSectionId('featured-hero'),
    type: 'featured-hero',
    name: 'Hero Section',
    order,
    visible: true,
    content: {
      title: 'Get Featured in The Glamlink Edit',
      subtitle: 'Choose your feature and apply for your spotlight article',
      ctaText: 'Apply Now'
    }
  };
}

/**
 * Default Content Preview Section
 *
 * Wraps existing ContentPreview component with intro, content blocks, and videos
 * No configurable content
 */
export function getDefaultFeaturedContentPreviewSection(order: number = 2): FeaturedContentPreviewSection {
  return {
    id: generateSectionId('featured-content-preview'),
    type: 'featured-content-preview',
    name: 'Content Preview Section',
    order,
    visible: true,
    content: {}
  };
}

/**
 * Default Form Section
 *
 * Wraps existing FeaturedForm component
 * No configurable content
 */
export function getDefaultFeaturedFormSection(order: number = 3): FeaturedFormSection {
  return {
    id: generateSectionId('featured-form'),
    type: 'featured-form',
    name: 'Application Form',
    order,
    visible: true,
    content: {}
  };
}

/**
 * Get all default sections for featured application page
 */
export function getAllDefaultFeaturedSections(): (
  | FeaturedHeroSection
  | FeaturedContentPreviewSection
  | FeaturedFormSection
)[] {
  return [
    getDefaultFeaturedHeroSection(1),
    getDefaultFeaturedContentPreviewSection(2),
    getDefaultFeaturedFormSection(3)
  ];
}
