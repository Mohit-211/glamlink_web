/**
 * Treatment Categories Configuration
 *
 * Defines the treatment categories, slugs, and popular cities for the services module.
 * This is static configuration that can be migrated to Firestore in later phases.
 */

import type { TreatmentCategoryInfo, PopularCity } from '../types';

// =============================================================================
// TREATMENT CATEGORIES
// =============================================================================

export const TREATMENT_CATEGORIES: TreatmentCategoryInfo[] = [
  {
    id: 'injectables',
    name: 'Injectables',
    description: 'Botox, Fillers, Lip Filler',
    treatments: ['botox', 'dermal-fillers', 'lip-filler'],
    image: '/images/categories/injectables.jpg',
    icon: '💉',
  },
  {
    id: 'permanent-makeup',
    name: 'Permanent Makeup',
    description: 'Lip Blush, Microblading, Eyeliner',
    treatments: ['lip-blush', 'microblading', 'eyeliner-tattoo', 'lip-liner-tattoo'],
    image: '/images/categories/permanent-makeup.jpg',
    icon: '💋',
  },
  {
    id: 'skin-treatments',
    name: 'Skin Treatments',
    description: 'Facials, Peels, Microneedling',
    treatments: ['facials', 'chemical-peels', 'microneedling', 'dermaplaning'],
    image: '/images/categories/skin-treatments.jpg',
    icon: '✨',
  },
  {
    id: 'lashes-brows',
    name: 'Lashes & Brows',
    description: 'Extensions, Lamination, Tinting',
    treatments: ['lash-extensions', 'brow-lamination', 'lash-lift', 'brow-tinting'],
    image: '/images/categories/lashes-brows.jpg',
    icon: '👁️',
  },
  {
    id: 'hair-removal',
    name: 'Hair Removal',
    description: 'Laser, Waxing, Threading',
    treatments: ['laser-hair-removal', 'waxing', 'threading', 'sugaring'],
    image: '/images/categories/hair-removal.jpg',
    icon: '🪒',
  },
  {
    id: 'body-treatments',
    name: 'Body Treatments',
    description: 'Massage, Body Sculpting',
    treatments: ['massage', 'body-sculpting', 'spray-tan', 'body-wraps'],
    image: '/images/categories/body-treatments.jpg',
    icon: '💆',
  },
];

// =============================================================================
// VALID TREATMENT SLUGS (for URL validation)
// =============================================================================

export const VALID_TREATMENT_SLUGS: string[] = [
  // Injectables
  'botox',
  'dermal-fillers',
  'lip-filler',
  // Permanent Makeup
  'lip-blush',
  'microblading',
  'eyeliner-tattoo',
  'lip-liner-tattoo',
  // Skin Treatments
  'facials',
  'chemical-peels',
  'microneedling',
  'dermaplaning',
  // Lashes & Brows
  'lash-extensions',
  'brow-lamination',
  'lash-lift',
  'brow-tinting',
  // Hair Removal
  'laser-hair-removal',
  'waxing',
  'threading',
  'sugaring',
  // Body Treatments
  'massage',
  'body-sculpting',
  'spray-tan',
  'body-wraps',
];

// =============================================================================
// TREATMENT SLUG TO NAME MAPPING
// =============================================================================

export const TREATMENT_SLUG_TO_NAME: Record<string, string> = {
  // Injectables
  botox: 'Botox',
  'dermal-fillers': 'Dermal Fillers',
  'lip-filler': 'Lip Filler',
  // Permanent Makeup
  'lip-blush': 'Lip Blush',
  microblading: 'Microblading',
  'eyeliner-tattoo': 'Eyeliner Tattoo',
  'lip-liner-tattoo': 'Lip Liner Tattoo',
  // Skin Treatments
  facials: 'Facials',
  'chemical-peels': 'Chemical Peels',
  microneedling: 'Microneedling',
  dermaplaning: 'Dermaplaning',
  // Lashes & Brows
  'lash-extensions': 'Lash Extensions',
  'brow-lamination': 'Brow Lamination',
  'lash-lift': 'Lash Lift',
  'brow-tinting': 'Brow Tinting',
  // Hair Removal
  'laser-hair-removal': 'Laser Hair Removal',
  waxing: 'Waxing',
  threading: 'Threading',
  sugaring: 'Sugaring',
  // Body Treatments
  massage: 'Massage',
  'body-sculpting': 'Body Sculpting',
  'spray-tan': 'Spray Tan',
  'body-wraps': 'Body Wraps',
};

// =============================================================================
// POPULAR CITIES
// =============================================================================

export const POPULAR_CITIES: PopularCity[] = [
  { slug: 'las-vegas', city: 'Las Vegas', state: 'NV' },
  { slug: 'los-angeles', city: 'Los Angeles', state: 'CA' },
  { slug: 'miami', city: 'Miami', state: 'FL' },
  { slug: 'new-york', city: 'New York', state: 'NY' },
  { slug: 'phoenix', city: 'Phoenix', state: 'AZ' },
  { slug: 'dallas', city: 'Dallas', state: 'TX' },
  { slug: 'chicago', city: 'Chicago', state: 'IL' },
  { slug: 'houston', city: 'Houston', state: 'TX' },
  { slug: 'atlanta', city: 'Atlanta', state: 'GA' },
  { slug: 'san-diego', city: 'San Diego', state: 'CA' },
  { slug: 'denver', city: 'Denver', state: 'CO' },
  { slug: 'seattle', city: 'Seattle', state: 'WA' },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if a slug is a valid treatment
 */
export function isValidTreatmentSlug(slug: string): boolean {
  return VALID_TREATMENT_SLUGS.includes(slug);
}

/**
 * Get treatment name from slug
 */
export function getTreatmentName(slug: string): string {
  return TREATMENT_SLUG_TO_NAME[slug] || slug;
}

/**
 * Get category for a treatment slug
 */
export function getCategoryForTreatment(treatmentSlug: string): TreatmentCategoryInfo | undefined {
  return TREATMENT_CATEGORIES.find((cat) => cat.treatments.includes(treatmentSlug));
}

/**
 * Get all treatments in a category
 */
export function getTreatmentsInCategory(categoryId: string): string[] {
  const category = TREATMENT_CATEGORIES.find((cat) => cat.id === categoryId);
  return category?.treatments || [];
}
