/**
 * For-Clients Page Content Configuration Types
 *
 * Used for customizing the for-clients page content via the admin panel.
 */

// Section type identifiers
export type ForClientsSectionType =
  | 'hero'
  | 'features'
  | 'how-it-works'
  | 'testimonials'
  | 'cta'
  | 'html-content';

// Base properties all sections share
export interface ForClientsSectionBase {
  id: string;
  type: ForClientsSectionType;
  name: string;
  order: number;
  visible: boolean;
}

// Hero section content
export interface HeroSectionContent extends ForClientsSectionBase {
  type: 'hero';
  content: {
    title: string;
    subtitle: string;
    mobileSubtitle?: string;
    backgroundImage?: string;
    phoneImages: string[];
    ctaButton: {
      text: string;
      action: string;
    };
  };
}

// Feature item for features section
export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  animation?: string;
  isComingSoon?: boolean;
}

// Features section content
export interface FeaturesSectionContent extends ForClientsSectionBase {
  type: 'features';
  content: {
    sectionTitle: string;
    features: FeatureItem[];
  };
}

// Step item for how-it-works section
export interface StepItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

// How It Works section content
export interface HowItWorksSectionContent extends ForClientsSectionBase {
  type: 'how-it-works';
  content: {
    sectionTitle: string;
    steps: StepItem[];
  };
}

// Testimonial item
export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
}

// Testimonials section content
export interface TestimonialsSectionContent extends ForClientsSectionBase {
  type: 'testimonials';
  content: {
    sectionTitle: string;
    testimonials: TestimonialItem[];
  };
}

// CTA section content
export interface CTASectionContent extends ForClientsSectionBase {
  type: 'cta';
  content: {
    heading: string;
    buttonText: string;
    buttonAction: string;
    backgroundColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
  };
}

// HTML Content section
export interface HTMLContentSectionContent extends ForClientsSectionBase {
  type: 'html-content';
  content: {
    html: string;
    containerClass?: string;
  };
}

// Union type for all section content types
export type ForClientsSection =
  | HeroSectionContent
  | FeaturesSectionContent
  | HowItWorksSectionContent
  | TestimonialsSectionContent
  | CTASectionContent
  | HTMLContentSectionContent;

// Banner configuration
export interface ForClientsBannerConfig {
  enabled: boolean;
  message: string;
  link?: string;
  backgroundColor?: string;
  textColor?: string;
  dismissible?: boolean;
}

// Complete page configuration stored in Firestore
export interface ForClientsPageConfig {
  id: string;
  banner?: ForClientsBannerConfig;
  sections: ForClientsSection[];
  updatedAt?: string;
  updatedBy?: string;
}

// Section template for save/load functionality
export interface SectionTemplate {
  id: string;
  name: string;
  sectionType: ForClientsSectionType;
  category?: string; // Optional category for organization (especially useful for html-content templates)
  content: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Type guard functions
export function isHeroSection(section: ForClientsSection): section is HeroSectionContent {
  return section.type === 'hero';
}

export function isFeaturesSection(section: ForClientsSection): section is FeaturesSectionContent {
  return section.type === 'features';
}

export function isHowItWorksSection(section: ForClientsSection): section is HowItWorksSectionContent {
  return section.type === 'how-it-works';
}

export function isTestimonialsSection(section: ForClientsSection): section is TestimonialsSectionContent {
  return section.type === 'testimonials';
}

export function isCTASection(section: ForClientsSection): section is CTASectionContent {
  return section.type === 'cta';
}

export function isHTMLContentSection(section: ForClientsSection): section is HTMLContentSectionContent {
  return section.type === 'html-content';
}

// Helper to get section type label
export function getSectionTypeLabel(type: ForClientsSectionType): string {
  const labels: Record<ForClientsSectionType, string> = {
    'hero': 'Hero Section',
    'features': 'Features Grid',
    'how-it-works': 'How It Works',
    'testimonials': 'Testimonials',
    'cta': 'Call to Action',
    'html-content': 'HTML Content'
  };
  return labels[type] || type;
}
