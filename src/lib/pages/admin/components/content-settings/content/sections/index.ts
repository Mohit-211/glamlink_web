// ============================================================================
// SECTION FIELD CONFIGURATIONS REGISTRY
// ============================================================================

// Shared field configs (used across multiple pages)
import {
  heroFieldConfig,
  featuresFieldConfig,
  howItWorksFieldConfig,
  testimonialsFieldConfig,
  ctaFieldConfig,
  bannerFieldConfig,
  htmlContentFieldConfig
} from './shared/fields';

// Home page field configs
import {
  whyGlamlinkFieldConfig,
  bookTrustedProsFieldConfig,
  founderBadgeFieldConfig
} from './home/fields';

// For Professionals page field configs
import {
  passionIntoPowerFieldConfig,
  twoBoxesFieldConfig,
  expertiseIntoSalesFieldConfig,
  everythingYouNeedFieldConfig,
  finalCtaForProsFieldConfig
} from './for-professionals/fields';

// Magazine page field configs
import { magazineHeroFieldConfig } from './magazine/fields';

// Promos page field configs
import { promosHeroFieldConfig } from './promos/fields';

// Digital Card page field configs
import {
  digitalCardHeroFieldConfig,
  digitalCardFinalCtaFieldConfig
} from './digital-card/fields';

import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Centralized registry of field configurations for all section types
 *
 * Maps each section type to its corresponding field configuration array.
 * This enables the generic SectionEditorModal to dynamically load the appropriate
 * fields based on the section type being edited.
 */
export const SECTION_FIELD_CONFIGS: Record<string, FieldConfig[]> = {
  // For Clients sections (shared fields)
  'hero': heroFieldConfig,
  'features': featuresFieldConfig,
  'how-it-works': howItWorksFieldConfig,
  'testimonials': testimonialsFieldConfig,
  'cta': ctaFieldConfig,
  'html-content': htmlContentFieldConfig,

  // Home sections
  'why-glamlink': whyGlamlinkFieldConfig,
  'book-trusted-pros': bookTrustedProsFieldConfig,
  'founder-badge': founderBadgeFieldConfig,

  // For Professionals sections
  'pagination-carousel': [],  // No editable fields - pulls from professionals collection
  'passion-into-power': passionIntoPowerFieldConfig,
  'two-boxes': twoBoxesFieldConfig,
  'expertise-into-sales': expertiseIntoSalesFieldConfig,
  'everything-you-need': everythingYouNeedFieldConfig,
  'final-cta-for-pros': finalCtaForProsFieldConfig,

  // Magazine sections
  'magazine-hero': magazineHeroFieldConfig,
  'magazine-listing': [],  // No editable fields - pulls from magazine_issues

  // Promos sections
  'promos-hero': promosHeroFieldConfig,
  'promos-listing': [],  // No editable fields - pulls from promos collection

  // Digital Card sections
  'digital-card-hero': digitalCardHeroFieldConfig,
  'digital-card-form': [],  // No editable fields - application form component
  'digital-card-final-cta': digitalCardFinalCtaFieldConfig,

  // Featured sections
  'featured-hero': [],  // No editable fields - hardcoded hero
  'featured-content-preview': [],  // No editable fields - hardcoded preview
  'featured-form': []  // No editable fields - application form
};

/**
 * Helper function to get field configuration for a specific section type
 *
 * @param type - The section type to get fields for
 * @returns Array of field configurations for the section type
 */
export const getSectionFieldConfig = (type: string): FieldConfig[] => {
  const config = SECTION_FIELD_CONFIGS[type];

  // If section type exists in registry but has empty config, it's intentionally non-editable
  if (config !== undefined) {
    return config;
  }

  // For unknown section types, return empty array (no fields)
  console.warn(`No field configuration found for section type: ${type}`);
  return [];
};

// Re-export all field configs for direct access if needed
export {
  // Shared fields
  heroFieldConfig,
  featuresFieldConfig,
  howItWorksFieldConfig,
  testimonialsFieldConfig,
  ctaFieldConfig,
  bannerFieldConfig,
  htmlContentFieldConfig,
  // Home fields
  whyGlamlinkFieldConfig,
  bookTrustedProsFieldConfig,
  founderBadgeFieldConfig,
  // For Professionals fields
  passionIntoPowerFieldConfig,
  twoBoxesFieldConfig,
  expertiseIntoSalesFieldConfig,
  everythingYouNeedFieldConfig,
  finalCtaForProsFieldConfig,
  // Magazine fields
  magazineHeroFieldConfig,
  // Promos fields
  promosHeroFieldConfig,
  // Digital Card fields
  digitalCardHeroFieldConfig,
  digitalCardFinalCtaFieldConfig
};
