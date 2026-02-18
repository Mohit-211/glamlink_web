/**
 * Unified Section Registry
 *
 * - category: Which filter button shows this section (ONLY for UI organization)
 * - ALL sections work on ALL pages. No artificial restrictions.
 */

import type { PageType, SectionRegistryItem } from './types';

/**
 * Section Registry
 *
 * category = Which filter tab shows this section (UI organization only)
 * ALL sections can be used on ANY page - no restrictions
 */
const ALL_SECTIONS: SectionRegistryItem[] = [
  // ===== SHARED SECTIONS (appear under "Shared Sections" button) =====
  {
    id: 'hero',
    label: 'Hero Section',
    description: 'Main hero banner with title, subtitle, and call-to-action',
    icon: 'HomeIcon',
    allowMultiple: false,
    category: 'shared'
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    description: 'Customer testimonials and reviews',
    icon: 'ChatIcon',
    allowMultiple: true,
    category: 'shared'
  },
  {
    id: 'cta',
    label: 'Call to Action',
    description: 'Final call-to-action section with heading and button',
    icon: 'ArrowRightIcon',
    allowMultiple: true,
    category: 'shared'
  },
  {
    id: 'html-content',
    label: 'HTML Content',
    description: 'Custom HTML content for specialized sections',
    icon: 'CodeIcon',
    allowMultiple: true,
    category: 'shared'
  },

  // ===== HOME PAGE SECTIONS (appear under "Home" button) =====
  {
    id: 'why-glamlink',
    label: 'Why Glamlink',
    description: 'Highlight key features and benefits of Glamlink',
    icon: 'StarIcon',
    allowMultiple: false,
    category: 'home'
  },
  {
    id: 'book-trusted-pros',
    label: 'Book Trusted Pros',
    description: 'Call-to-action for booking professional services',
    icon: 'UserGroupIcon',
    allowMultiple: false,
    category: 'home'
  },
  {
    id: 'founder-badge',
    label: 'Founder Badge',
    description: 'Founder message with photo and credentials',
    icon: 'UserIcon',
    allowMultiple: false,
    category: 'home'
  },

  // ===== FOR CLIENTS SECTIONS (appear under "For Clients" button) =====
  {
    id: 'features',
    label: 'Features Grid',
    description: 'Grid of feature cards with icons and descriptions',
    icon: 'StarIcon',
    allowMultiple: true,
    category: 'for-clients'
  },
  {
    id: 'how-it-works',
    label: 'How It Works',
    description: 'Step-by-step guide showing the process',
    icon: 'ListIcon',
    allowMultiple: true,
    category: 'for-clients'
  },

  // ===== FOR PROFESSIONALS SECTIONS (appear under "For Professionals" button) =====
  {
    id: 'pagination-carousel',
    label: 'Professional Carousel',
    description: 'Founding professionals carousel with filtering',
    icon: 'UserGroupIcon',
    allowMultiple: false,
    category: 'for-professionals'
  },
  {
    id: 'passion-into-power',
    label: 'Passion Into Power CTA',
    description: 'First CTA section with two buttons',
    icon: 'StarIcon',
    allowMultiple: false,
    category: 'for-professionals'
  },
  {
    id: 'two-boxes',
    label: 'Two Boxes Section',
    description: 'AI Discovery + Founders Badge side by side',
    icon: 'GridIcon',
    allowMultiple: false,
    category: 'for-professionals'
  },
  {
    id: 'expertise-into-sales',
    label: 'Expertise Into Sales',
    description: 'E-commerce features with video player',
    icon: 'VideoIcon',
    allowMultiple: false,
    category: 'for-professionals'
  },
  {
    id: 'everything-you-need',
    label: 'Everything You Need',
    description: '8 feature cards with animated icons',
    icon: 'GridIcon',
    allowMultiple: false,
    category: 'for-professionals'
  },
  {
    id: 'final-cta-for-pros',
    label: 'Final CTA',
    description: 'Final call-to-action with gradient background',
    icon: 'ArrowRightIcon',
    allowMultiple: false,
    category: 'for-professionals'
  },

  // ===== MAGAZINE SECTIONS (appear under "Magazine" button) =====
  {
    id: 'magazine-hero',
    label: 'Magazine Hero',
    description: 'Hero section for magazine page',
    icon: 'HomeIcon',
    allowMultiple: false,
    category: 'magazine'
  },
  {
    id: 'magazine-listing',
    label: 'Magazine Listing',
    description: 'Issues grouped by year with filtering',
    icon: 'DocumentTextIcon',
    allowMultiple: false,
    category: 'magazine'
  },

  // ===== PROMOS SECTIONS (appear under "Promos" button) =====
  {
    id: 'promos-hero',
    label: 'Promos Hero',
    description: 'Hero section for promos page',
    icon: 'HomeIcon',
    allowMultiple: false,
    category: 'promos'
  },
  {
    id: 'promos-listing',
    label: 'Promos Listing',
    description: 'Promo cards grid with modal routing',
    icon: 'GiftIcon',
    allowMultiple: false,
    category: 'promos'
  },

  // ===== DIGITAL CARD SECTIONS (appear under "Digital Card" button) =====
  {
    id: 'digital-card-hero',
    label: 'Hero Section',
    description: 'Hero with Apply Now CTA',
    icon: 'HomeIcon',
    allowMultiple: false,
    category: 'apply-digital-card'
  },
  {
    id: 'digital-card-form',
    label: 'Application Form',
    description: 'Digital card form with live preview',
    icon: 'DocumentTextIcon',
    allowMultiple: false,
    category: 'apply-digital-card'
  },
  {
    id: 'digital-card-final-cta',
    label: 'Final CTA',
    description: 'Final call-to-action section',
    icon: 'ArrowRightIcon',
    allowMultiple: false,
    category: 'apply-digital-card'
  },

  // ===== FEATURED SECTIONS (appear under "Featured" button) =====
  {
    id: 'featured-hero',
    label: 'Hero Section',
    description: 'Hero with Apply Now CTA',
    icon: 'HomeIcon',
    allowMultiple: false,
    category: 'apply-featured'
  },
  {
    id: 'featured-content-preview',
    label: 'Content Preview',
    description: 'Preview blocks with videos',
    icon: 'VideoIcon',
    allowMultiple: false,
    category: 'apply-featured'
  },
  {
    id: 'featured-form',
    label: 'Application Form',
    description: 'Multi-step featured application form',
    icon: 'DocumentTextIcon',
    allowMultiple: false,
    category: 'apply-featured'
  }
];

/**
 * Export the registry
 */
export const SECTION_REGISTRY = ALL_SECTIONS;

/**
 * Get all sections (optionally filtered by existing sections for allowMultiple check)
 *
 * ALL sections work on ALL pages - no restrictions
 */
export function getSectionsForPage(
  _pageType: PageType,  // Unused - all sections work everywhere
  existingSectionTypes: string[] = []
): SectionRegistryItem[] {
  return SECTION_REGISTRY.filter(item => {
    // Check allowMultiple constraint only
    if (item.allowMultiple) return true;
    return !existingSectionTypes.includes(item.id);
  });
}

/**
 * Get section registry item by ID
 */
export function getSectionRegistryItem(id: string): SectionRegistryItem | undefined {
  return SECTION_REGISTRY.find(item => item.id === id);
}

/**
 * Check if a section can be used - ALWAYS true, all sections work everywhere
 */
export function isSectionCompatible(_sectionId: string, _pageType: PageType): boolean {
  return true;  // All sections work on all pages
}

/**
 * Get all sections in a specific category (matches filter button)
 */
export function getSectionsByCategory(category: string): SectionRegistryItem[] {
  if (category === 'shared') {
    return SECTION_REGISTRY.filter(item => item.category === 'shared');
  }
  return SECTION_REGISTRY.filter(item => item.category === category);
}

/**
 * Get shared sections (category: 'shared')
 */
export function getSharedSections(): SectionRegistryItem[] {
  return SECTION_REGISTRY.filter(item => item.category === 'shared');
}

/**
 * Check if a section can be added to a page
 */
export function canAddSection(
  sectionId: string,
  _pageType: PageType,  // Unused - all sections work everywhere
  existingSectionTypes: string[]
): boolean {
  const item = getSectionRegistryItem(sectionId);
  if (!item) return false;

  // Only check allowMultiple - no page compatibility restrictions
  if (item.allowMultiple) return true;
  return !existingSectionTypes.includes(sectionId);
}
