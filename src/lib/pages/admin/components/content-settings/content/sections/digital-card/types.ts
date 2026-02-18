/**
 * Digital Card Page - Section Types
 *
 * Type definitions for CMS-managed sections on the digital business card application page
 */

import type { BaseSection } from '@/lib/features/display-cms/types';

/**
 * GIF/Video Data for preview
 */
export interface GifData {
  stillSrc: string;
  gifSrc: string;
  alt: string;
  /** Optional delay in ms before playing when section scrolls into view (e.g., 2000 for 2 seconds) */
  playDelay?: number;
}

/**
 * Hero Section
 * Single card layout with text content on left, video preview on right
 */
export interface DigitalCardHeroSection extends BaseSection {
  type: 'digital-card-hero';
  content: {
    // Main headline
    headline: string;
    // First description paragraph (about Glam Card)
    description: string;
    // Platform section title
    platformTitle: string;
    // Platform section description (about Glamlink)
    platformDescription: string;
    // Video/GIF preview data
    gifData: GifData;
    // CTA button
    ctaText: string;
  };
}

/**
 * Form Section
 * Main application form with live digital card preview
 * No configurable content - wraps existing DigitalCardFormWithPreview component
 */
export interface DigitalCardFormSection extends BaseSection {
  type: 'digital-card-form';
  content: {};
}

/**
 * Final CTA Section
 * Gradient background section with title, subtitle, CTAs, and disclaimer
 */
export interface DigitalCardFinalCTASection extends BaseSection {
  type: 'digital-card-final-cta';
  content: {
    title: string;
    subtitle: string;
    primaryButton: {
      text: string;
      action: 'scroll-to-form';
    };
    secondaryButton: {
      text: string;
      action: 'external-link';
      link: string;
    };
    disclaimer: string;
  };
}

/**
 * Union type of all digital card page sections
 */
export type DigitalCardSection =
  | DigitalCardHeroSection
  | DigitalCardFormSection
  | DigitalCardFinalCTASection;

/**
 * Type guards for runtime section type checking
 */
export function isDigitalCardHeroSection(section: any): section is DigitalCardHeroSection {
  return section?.type === 'digital-card-hero';
}

export function isDigitalCardFormSection(section: any): section is DigitalCardFormSection {
  return section?.type === 'digital-card-form';
}

export function isDigitalCardFinalCTASection(section: any): section is DigitalCardFinalCTASection {
  return section?.type === 'digital-card-final-cta';
}
