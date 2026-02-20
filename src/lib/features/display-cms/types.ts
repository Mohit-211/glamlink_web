/**
 * Display CMS - Generalized Types
 *
 * Shared types for the display CMS system that can be used across multiple pages
 * (For Clients, For Professionals, Homepage, etc.)
 */

// Re-export types from admin content settings for consistency
export type {
  ForClientsSectionType,
  ForClientsPageConfig,
  ForClientsSection,
  HeroSectionContent,
  FeaturesSectionContent,
  HowItWorksSectionContent,
  TestimonialsSectionContent,
  CTASectionContent,
  HTMLContentSectionContent,
  SectionTemplate
} from '@/lib/pages/admin/components/content-settings/content/sections/for-clients/types';

// Base section interface - all sections extend this
export interface BaseSection {
  id: string;
  type: string;
  name: string;
  order: number;
  visible: boolean;
}

// Banner configuration
export interface BannerConfig {
  enabled: boolean;
  message: string;
  link?: string;
  backgroundColor?: string;
  textColor?: string;
  dismissible?: boolean;
}

export type {
  isHeroSection,
  isFeaturesSection,
  isHowItWorksSection,
  isTestimonialsSection,
  isCTASection,
  isHTMLContentSection
} from '@/lib/pages/admin/components/content-settings/content/sections/for-clients/types';

// Page type identifier for different CMS pages
export type PageType =
  | 'for-clients'
  | 'home'
  | 'about'
  | 'services'
  | 'contact'
  | 'for-professionals'
  | 'magazine'
  | 'promos'
  | 'apply-digital-card'
  | 'apply-featured';

// Generic page config structure that can be extended
export interface PageConfig {
  id: string;
  pageType?: PageType;  // Optional for backward compatibility
  sections: any[];
  banner?: BannerConfig;
  ssgEnabled?: boolean;  // Per-page SSG toggle for static site generation
  updatedAt?: string;
  updatedBy?: string;
}

// Category type for filter buttons - matches UI exactly
export type SectionCategory =
  | 'shared'           // Shared Sections button
  | PageType;          // Page-specific buttons (home, for-clients, etc.)

// Section registry item
// ALL sections work on ALL pages - category is ONLY for UI filter organization
export interface SectionRegistryItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  allowMultiple: boolean;
  category: SectionCategory;  // Which filter button shows this section (UI only)
}
