/**
 * Get Default Section Content
 *
 * Returns default content for a section based on page type and section type.
 * This ensures new sections are populated with sensible default values.
 */

import type { PageType } from '../types';

// Import default content from each page
import * as forClientsDefaults from '@/lib/pages/admin/components/content-settings/content/sections/for-clients/defaultSectionContent';
import * as homeDefaults from '@/lib/pages/admin/components/content-settings/content/sections/home/defaultSectionContent';
import * as digitalCardDefaults from '@/lib/pages/admin/components/content-settings/content/sections/digital-card/defaultSectionContent';

/**
 * Get default section content for a specific page and section type
 */
export function getDefaultSectionContent(pageType: PageType, sectionType: string, order: number = 1): any {
  // Handle For Clients page sections
  if (pageType === 'for-clients') {
    switch (sectionType) {
      case 'hero':
        return forClientsDefaults.getDefaultHeroSection(order);
      case 'features':
        return forClientsDefaults.getDefaultFeaturesSection(order);
      case 'how-it-works':
        return forClientsDefaults.getDefaultHowItWorksSection(order);
      case 'testimonials':
        return forClientsDefaults.getDefaultTestimonialsSection(order);
      case 'cta':
        return forClientsDefaults.getDefaultCTASection(order);
      case 'html-content':
        return forClientsDefaults.getDefaultHTMLContentSection(order);
    }
  }

  // Handle Home page sections
  if (pageType === 'home') {
    switch (sectionType) {
      case 'hero':
        return homeDefaults.getDefaultHeroSection(order);
      case 'why-glamlink':
        return homeDefaults.getDefaultWhyGlamlinkSection(order);
      case 'book-trusted-pros':
        return homeDefaults.getDefaultBookTrustedProsSection(order);
      case 'testimonials':
        return homeDefaults.getDefaultTestimonialsSection(order);
      case 'founder-badge':
        return homeDefaults.getDefaultFounderBadgeSection(order);
      case 'cta':
        return homeDefaults.getDefaultCTASection(order);
      case 'html-content':
        return homeDefaults.getDefaultHTMLContentSection(order);
    }
  }

  // Handle Digital Card page sections
  if (pageType === 'apply-digital-card') {
    switch (sectionType) {
      case 'digital-card-hero':
        return digitalCardDefaults.getDefaultDigitalCardHeroSection(order);
      case 'digital-card-form':
        return digitalCardDefaults.getDefaultDigitalCardFormSection(order);
      case 'digital-card-final-cta':
        return digitalCardDefaults.getDefaultDigitalCardFinalCTASection(order);
    }
  }

  // For other page types, fall back to shared section defaults
  // These sections (hero, cta, testimonials, html-content) are used across multiple pages
  switch (sectionType) {
    case 'hero':
      // Use home hero as default for other pages
      return homeDefaults.getDefaultHeroSection(order);
    case 'cta':
      // Use home CTA as default for other pages
      return homeDefaults.getDefaultCTASection(order);
    case 'testimonials':
      // Use home testimonials as default for other pages
      return homeDefaults.getDefaultTestimonialsSection(order);
    case 'html-content':
      // Use home HTML content as default for other pages
      return homeDefaults.getDefaultHTMLContentSection(order);
  }

  // For page-specific sections without defaults, return a basic structure
  // (e.g., magazine-hero, promos-hero, pagination-carousel, etc.)
  return {
    id: `${sectionType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: sectionType,
    name: `${sectionType} Section`,
    order,
    visible: true,
    content: {
      title: 'Edit this section to add content',
      description: 'Click the edit button to customize this section.'
    }
  };
}
