// Email Template Configuration
// This file defines all available email templates and their data sources

export interface EmailConfiguration {
  id: string;
  name: string;
  description: string;
  dataFile: string;
  category: 'marketing' | 'transactional' | 'newsletter';
}

export interface TemplateConfiguration {
  id: string;
  name: string;
  component: string;
  description: string;
}

// Section-based email configurations
export const SECTION_BASED_EMAILS: EmailConfiguration[] = [
  {
    id: 'upcoming-issue-v1',
    name: 'Upcoming Issue V1',
    description: 'January 2025 Magazine Preview with Winter Glow feature',
    dataFile: 'Upcoming-Issue-1.json',
    category: 'newsletter'
  },
  {
    id: 'upcoming-issue-v2',
    name: 'Upcoming Issue V2',
    description: 'Alternative layout for magazine preview',
    dataFile: 'Upcoming-Issue-2.json',
    category: 'newsletter'
  },
  {
    id: 'upcoming-issue-v3',
    name: 'Upcoming Issue V3',
    description: 'Advanced layout with comprehensive sections',
    dataFile: 'Upcoming-Issue-3.json',
    category: 'newsletter'
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    description: 'New product announcement with feature highlights',
    dataFile: 'Product-Launch-1.json',
    category: 'marketing'
  },
  {
    id: 'weekly-digest',
    name: 'Weekly Beauty Digest',
    description: 'Weekly roundup of beauty tips and trends',
    dataFile: 'Weekly-Digest-1.json',
    category: 'newsletter'
  },
  {
    id: 'editorial-showcase',
    name: 'Editorial Showcase',
    description: 'Demonstrates new email sections including quotes, author signatures, product recommendations, tips, and social CTAs',
    dataFile: 'Editorial-Showcase.json',
    category: 'newsletter'
  },
  {
    id: 'engagement-showcase',
    name: 'Engagement Showcase',
    description: 'Comprehensive display of engagement sections: reward progress, challenges, leaderboards, and special offers',
    dataFile: 'Engagement-Showcase.json',
    category: 'marketing'
  },
  {
    id: 'content-showcase-part1',
    name: 'Content Showcase Part 1',
    description: 'Stories & Community: Featured stories, story grids, and community engagement (Gmail-optimized)',
    dataFile: 'Content-Showcase-Part1.json',
    category: 'newsletter'
  },
  {
    id: 'content-showcase-part2',
    name: 'Content Showcase Part 2',
    description: 'Events & Gallery: Event listings, photo galleries, and CTA with stats (Gmail-optimized)',
    dataFile: 'Content-Showcase-Part2.json',
    category: 'newsletter'
  },
  {
    id: 'modern-design-showcase-part1',
    name: 'Modern Design Part 1',
    description: 'Premium Features: Dark CTA modal with premium access features (Gmail-optimized)',
    dataFile: 'Modern-Design-Showcase-Part1.json',
    category: 'marketing'
  },
  {
    id: 'modern-design-showcase-part2',
    name: 'Modern Design Part 2',
    description: 'Products & Content: Circle image grids and interactive content cards (Gmail-optimized)',
    dataFile: 'Modern-Design-Showcase-Part2.json',
    category: 'marketing'
  },
  {
    id: 'thank-you-1',
    name: 'Thank You - Template 1',
    description: 'Order confirmation with ExploreItems and ViewProfiles sections',
    dataFile: 'Thank-you-1.json',
    category: 'transactional'
  },
  {
    id: 'thank-you-2',
    name: 'Thank You - Template 2',
    description: 'Welcome email with SignUpSteps onboarding guide and Popular Features',
    dataFile: 'Thank-you-2.json',
    category: 'transactional'
  },
  {
    id: 'glam-card-launch',
    name: 'Glam Card Launch',
    description: 'Welcome email for new Glam Card professionals with Launch Kit and PDF instructions',
    dataFile: 'Glam-Card-Launch.json',
    category: 'transactional'
  }
];

// Regular template configurations
export const REGULAR_TEMPLATES: TemplateConfiguration[] = [
  {
    id: 'thank-you-full',
    name: 'Thank You - Full Layout',
    component: 'ThankYouLayout1',
    description: 'Complete order confirmation with recommendations'
  },
  {
    id: 'thank-you-short',
    name: 'Thank You - Short Version',
    component: 'ThankYouShort',
    description: 'Minimal order confirmation'
  }
];

// Helper function to get configuration by ID
export function getSectionBasedEmailConfig(id: string): EmailConfiguration | undefined {
  return SECTION_BASED_EMAILS.find(config => config.id === id);
}

// Helper function to get data file path
export function getDataFilePath(filename: string): string {
  return `/lib/emails/data/${filename}`;
}

// Helper function to group configurations by category
export function getConfigurationsByCategory(category: EmailConfiguration['category']): EmailConfiguration[] {
  return SECTION_BASED_EMAILS.filter(config => config.category === category);
}