/**
 * Home Page Content Configuration Types
 *
 * Used for customizing the homepage content via the admin panel.
 */

import type { BannerConfig } from '@/lib/features/display-cms/types';

// Section type identifiers for homepage
export type HomeSectionType =
  | 'hero'
  | 'why-glamlink'
  | 'book-trusted-pros'
  | 'testimonials'
  | 'founder-badge'
  | 'cta'
  | 'html-content'
  | 'pro-discovery-map'
  | 'digital-cards-showcase'
  | 'digital-card-cta';

// Base properties all sections share
export interface HomeSectionBase {
  id: string;
  type: HomeSectionType;
  name: string;
  order: number;
  visible: boolean;
}

// Hero section content (legacy-compatible)
export interface HeroSection extends HomeSectionBase {
  type: 'hero';
  content: {
    title: string;
    subtitle: string;
    buttons: Array<{
      text: string;
      action: 'download-client' | 'download-pro';
      style: 'primary' | 'secondary';
    }>;
    phoneImage: string;  // Single image, not array
  };
}

// Why Glamlink section content (home-specific)
export interface WhyGlamlinkItem {
  id: string;
  title: string;
  description: string;
  icon: string;  // Material-UI icon name
}

export interface WhyGlamlinkSection extends HomeSectionBase {
  type: 'why-glamlink';
  content: {
    // Left card - For Clients
    title: string;
    subtitle: string;
    features: WhyGlamlinkItem[];
    // Right card - For Professionals
    proCard: {
      title: string;
      subtitle: string;
      features: WhyGlamlinkItem[];
    };
  };
}

// Book Trusted Pros section content (home-specific)
export interface BookTrustedProsSection extends HomeSectionBase {
  type: 'book-trusted-pros';
  content: {
    services: Array<{
      image: string;
      alt: string;
      title: string;
    }>;
  };
}

// Testimonial item
export interface TestimonialItem {
  id: string;
  text: string;
  name: string;
  role: string;
  image?: string;
}

// Testimonials section content (shared)
export interface TestimonialsSection extends HomeSectionBase {
  type: 'testimonials';
  content: {
    title: string;
    items: TestimonialItem[];
  };
}

// Founder Badge section content (home-specific)
export interface FounderBadgeSection extends HomeSectionBase {
  type: 'founder-badge';
  content: {
    image: string;
    title: string;
    description: string;
    subtext: string;
  };
}

// CTA section content (shared)
export interface CTASection extends HomeSectionBase {
  type: 'cta';
  content: {
    title: string;
    subtitle: string;
    userSection: {
      title: string;
      description: string;
      button: {
        text: string;
        action: string;
      };
    };
    proSection: {
      title: string;
      description: string;
      button: {
        text: string;
        action: string;
      };
    };
  };
}

// HTML Content section (universal)
export interface HTMLContentSection extends HomeSectionBase {
  type: 'html-content';
  content: {
    html: string;
    containerClass?: string;
  };
}

// Pro Discovery Map section (interactive map with professionals)
export interface ProDiscoveryMapSection extends HomeSectionBase {
  type: 'pro-discovery-map';
  content: {
    title: string;
    subtitle?: string;
    showCategories: boolean;
    showSearch: boolean;
    defaultCategory: string; // 'all' or category id from professionalCategories.ts
    mapHeight: string; // e.g., '600px'
  };
}

// Digital Cards Showcase section (professional cards carousel)
export interface DigitalCardsShowcaseSection extends HomeSectionBase {
  type: 'digital-cards-showcase';
  content: {
    title: string;
    subtitle?: string;
    showSearch: boolean;
    showFilters: boolean;
    cardsPerPage: number;
  };
}

// Digital Card CTA section (promotional section with autoplay gif)
export interface DigitalCardCTASection extends HomeSectionBase {
  type: 'digital-card-cta';
  content: {
    title: string;              // "The Link in Bio, Evolved."
    description: string;        // First paragraph about Glam Card
    subheading: string;         // "Powered by Glamlink. Built for the Beauty + Wellness Pro."
    subDescription: string;     // Second paragraph about platform
    ctaText: string;            // "Apply for Your Glam Card"
    ctaLink: string;            // "/apply/digital-card"
    gifData: {
      stillSrc: string;         // Static phone mockup image
      gifSrc: string;           // MP4 video showing card interaction
      alt: string;
      playDelay?: number;       // Optional delay in ms before playing (e.g., 2000 for 2 seconds)
    };
  };
}

// Union type of all home page sections
export type HomeSection =
  | HeroSection
  | WhyGlamlinkSection
  | BookTrustedProsSection
  | TestimonialsSection
  | FounderBadgeSection
  | CTASection
  | HTMLContentSection
  | ProDiscoveryMapSection
  | DigitalCardsShowcaseSection
  | DigitalCardCTASection;

// Page configuration
export interface HomePageConfig {
  id: 'home';
  banner?: BannerConfig;
  sections: HomeSection[];
  ssgEnabled?: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

// Type guards for section types
export function isHeroSection(section: HomeSection): section is HeroSection {
  return section.type === 'hero';
}

export function isWhyGlamlinkSection(section: HomeSection): section is WhyGlamlinkSection {
  return section.type === 'why-glamlink';
}

export function isBookTrustedProsSection(section: HomeSection): section is BookTrustedProsSection {
  return section.type === 'book-trusted-pros';
}

export function isTestimonialsSection(section: HomeSection): section is TestimonialsSection {
  return section.type === 'testimonials';
}

export function isFounderBadgeSection(section: HomeSection): section is FounderBadgeSection {
  return section.type === 'founder-badge';
}

export function isCTASection(section: HomeSection): section is CTASection {
  return section.type === 'cta';
}

export function isHTMLContentSection(section: HomeSection): section is HTMLContentSection {
  return section.type === 'html-content';
}

export function isProDiscoveryMapSection(section: HomeSection): section is ProDiscoveryMapSection {
  return section.type === 'pro-discovery-map';
}

export function isDigitalCardsShowcaseSection(section: HomeSection): section is DigitalCardsShowcaseSection {
  return section.type === 'digital-cards-showcase';
}

export function isDigitalCardCTASection(section: HomeSection): section is DigitalCardCTASection {
  return section.type === 'digital-card-cta';
}
