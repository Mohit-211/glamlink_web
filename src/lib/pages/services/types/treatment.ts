/**
 * Treatment Types for Services Module
 *
 * Defines the structure for treatments/services offered by professionals.
 */

// =============================================================================
// TREATMENT CATEGORY
// =============================================================================

export type TreatmentCategory =
  | 'injectables'
  | 'permanent-makeup'
  | 'skin-treatments'
  | 'lashes-brows'
  | 'hair-removal'
  | 'body-treatments';

// =============================================================================
// FAQ
// =============================================================================

export interface FAQ {
  question: string;
  answer: string;
}

// =============================================================================
// TREATMENT
// =============================================================================

export interface Treatment {
  id: string;
  slug: string;
  name: string;
  category: TreatmentCategory;
  description: string;
  shortDescription: string;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  duration: string;
  healingTime: string;
  relatedTreatments: string[];
  faqs: FAQ[];
  image: string;
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// =============================================================================
// TREATMENT CATEGORY INFO (for display cards)
// =============================================================================

export interface TreatmentCategoryInfo {
  id: TreatmentCategory;
  name: string;
  description: string;
  treatments: string[];
  image: string;
  icon?: string;
}

// =============================================================================
// TREATMENT OFFERING (from a professional)
// =============================================================================

export interface TreatmentOffering {
  treatmentId: string;
  treatmentSlug: string;
  treatmentName: string;
  priceMin: number;
  priceMax: number;
  duration: string;
  featured: boolean;
}
