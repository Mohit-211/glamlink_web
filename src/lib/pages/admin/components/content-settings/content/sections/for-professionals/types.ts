/**
 * For Professionals Page Section Types
 *
 * Type definitions for the for-professionals page CMS sections.
 */

import type { BaseSection } from '@/lib/features/display-cms/types';

/**
 * Pagination Carousel Section
 *
 * Wraps the existing PaginationCarouselClean component.
 * Data is fetched from database, no CMS configuration needed.
 */
export interface PaginationCarouselSection extends BaseSection {
  type: 'pagination-carousel';
  content: {
    // No configurable content - wraps existing carousel component
  };
}

/**
 * Passion Into Power Section
 *
 * First CTA section with two action buttons
 */
export interface PassionIntoPowerSection extends BaseSection {
  type: 'passion-into-power';
  content: {
    title: string;
    subtitle: string;
    primaryButton: {
      text: string;
      action: 'download-pro' | 'external-link';
      subtext: string;
    };
    secondaryButton: {
      text: string;
      action: 'external-link';
      link: string;
      subtext: string;
    };
  };
}

/**
 * Two Boxes Section
 *
 * Two-column layout with AI features and Founders Badge
 */
export interface TwoBoxesSection extends BaseSection {
  type: 'two-boxes';
  content: {
    leftBox: {
      title: string;
      description: string;
      features: string[];
      buttonText: string;
    };
    rightBox: {
      title: string;
      description: string;
      criteriaLabel: string;
      criteria: string[];
      buttonText: string;
    };
  };
}

/**
 * Expertise Into Sales Section
 *
 * E-commerce features showcase with video and feature cards
 */
export interface ExpertiseIntoSalesSection extends BaseSection {
  type: 'expertise-into-sales';
  content: {
    title: string;
    titleGradientText: string;
    subtitle: string;
    video: {
      type: 'local' | 'youtube' | 'none';
      src: string;
      title: string;
      description: string;
      thumbnail?: string;
      placeholderTitle: string;
      placeholderDescription: string;
    };
    features: Array<{
      id: string;
      title: string;
      description: string;
      stat: string;
      statLabel: string;
    }>;
    cta: {
      badge: string;
      title: string;
      subtitle: string;
      buttonText: string;
      buttonLink: string;
      disclaimer: string;
    };
  };
}

/**
 * Everything You Need Section
 *
 * Platform features grid with animated icons
 */
export interface EverythingYouNeedSection extends BaseSection {
  type: 'everything-you-need';
  content: {
    title: string;
    subtitle: string;
    features: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      animation: string;
      isComingSoon?: boolean;
    }>;
  };
}

/**
 * Final CTA For Pros Section
 *
 * Final call-to-action with gradient background
 */
export interface FinalCTAForProsSection extends BaseSection {
  type: 'final-cta-for-pros';
  content: {
    title: string;
    subtitle: string;
    primaryButton: {
      text: string;
      action: 'download-pro';
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
 * Union type of all for-professionals section types
 */
export type ForProfessionalsSection =
  | PaginationCarouselSection
  | PassionIntoPowerSection
  | TwoBoxesSection
  | ExpertiseIntoSalesSection
  | EverythingYouNeedSection
  | FinalCTAForProsSection;

/**
 * For Professionals Page Configuration
 */
export interface ForProfessionalsPageConfig {
  id: 'for-professionals';
  sections: ForProfessionalsSection[];
  ssgEnabled: boolean;
}

/**
 * Type guard for PaginationCarouselSection
 */
export function isPaginationCarouselSection(section: ForProfessionalsSection): section is PaginationCarouselSection {
  return section.type === 'pagination-carousel';
}

/**
 * Type guard for PassionIntoPowerSection
 */
export function isPassionIntoPowerSection(section: ForProfessionalsSection): section is PassionIntoPowerSection {
  return section.type === 'passion-into-power';
}

/**
 * Type guard for TwoBoxesSection
 */
export function isTwoBoxesSection(section: ForProfessionalsSection): section is TwoBoxesSection {
  return section.type === 'two-boxes';
}

/**
 * Type guard for ExpertiseIntoSalesSection
 */
export function isExpertiseIntoSalesSection(section: ForProfessionalsSection): section is ExpertiseIntoSalesSection {
  return section.type === 'expertise-into-sales';
}

/**
 * Type guard for EverythingYouNeedSection
 */
export function isEverythingYouNeedSection(section: ForProfessionalsSection): section is EverythingYouNeedSection {
  return section.type === 'everything-you-need';
}

/**
 * Type guard for FinalCTAForProsSection
 */
export function isFinalCTAForProsSection(section: ForProfessionalsSection): section is FinalCTAForProsSection {
  return section.type === 'final-cta-for-pros';
}
