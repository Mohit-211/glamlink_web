/**
 * Default Section Content for For-Clients Page
 *
 * Provides default values when creating new sections or
 * as fallback when no configuration exists.
 */

import {
  ForClientsSection,
  ForClientsSectionType,
  ForClientsBannerConfig,
  ForClientsPageConfig,
  HeroSectionContent,
  FeaturesSectionContent,
  HowItWorksSectionContent,
  TestimonialsSectionContent,
  CTASectionContent,
  HTMLContentSectionContent,
  FeatureItem,
  StepItem,
  TestimonialItem
} from './types';

/**
 * Generate a unique ID for new items
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Default banner configuration
 */
export const getDefaultBanner = (): ForClientsBannerConfig => ({
  enabled: false,
  message: 'Check out our latest offers!',
  link: '',
  backgroundColor: '#24bbcb',
  textColor: '#ffffff',
  dismissible: true
});

/**
 * Default hero section
 */
export const getDefaultHeroSection = (order: number = 1): HeroSectionContent => ({
  id: generateId('hero'),
  type: 'hero',
  name: 'Main Hero',
  order,
  visible: true,
  content: {
    title: 'Redefining How The World Discovers Beauty',
    subtitle: 'The first beauty/wellness platform to connect you with trusted beauty professionals, real results and the expert products you actually need.',
    mobileSubtitle: 'Your All-In-One Beauty Platform',
    phoneImages: [
      '/images/Phone Holding 1-min-cropped.png',
      '/images/Phone Holding 2-min-cropped.png',
      '/images/Phone Holding 3-min-cropped.png'
    ],
    ctaButton: {
      text: 'Download Glamlink',
      action: 'download'
    },
    backgroundImage: '/images/for-clients-background-desktop-final.png'
  }
});

/**
 * Default feature item
 */
export const getDefaultFeatureItem = (): FeatureItem => ({
  id: generateId('feature'),
  title: 'New Feature',
  description: 'Description of this feature',
  icon: '/icons/certified_professional_1_transparent.png',
  animation: 'animate-scan-radar',
  isComingSoon: false
});

/**
 * Default features section
 */
export const getDefaultFeaturesSection = (order: number = 2): FeaturesSectionContent => ({
  id: generateId('features'),
  type: 'features',
  name: 'Features',
  order,
  visible: true,
  content: {
    sectionTitle: 'Your Link To Everything Beauty',
    features: [
      {
        id: generateId('feature'),
        title: 'Discover Certified Professionals',
        description: 'Explore top beauty professionals by their work, their expertise and reviews, near you',
        icon: '/icons/certified_professional_1_transparent.png',
        animation: 'animate-scan-radar',
        isComingSoon: false
      },
      {
        id: generateId('feature'),
        title: 'Before & After Gallery',
        description: 'See real transformation results from treatments and products',
        icon: '/icons/before_after_5_transparent.png',
        animation: 'animate-flip-reveal',
        isComingSoon: false
      },
      {
        id: generateId('feature'),
        title: 'Expert Clips',
        description: 'Your front row seat to expert beauty content, meet the pros, their skills and their results.',
        icon: '/icons/expert_clips_1_transparent.png',
        animation: 'animate-play-pulse',
        isComingSoon: false
      },
      {
        id: generateId('feature'),
        title: 'Expert Approved Beauty Products',
        description: 'From results driven routines to in depth product insights, shop the tools and products trusted by professionals-right from their profiles.',
        icon: '/icons/expert_approved_4_transparent.png',
        animation: 'animate-stamp-approve',
        isComingSoon: false
      },
      {
        id: generateId('feature'),
        title: 'Booking Feature',
        description: 'Request appointments in seconds and track them with ease',
        icon: '/icons/booking_3_transparent.png',
        animation: 'animate-calendar-slide',
        isComingSoon: false
      },
      {
        id: generateId('feature'),
        title: 'AI Beauty Companion',
        description: 'Smarter recommendations, tailored to you, coming soon',
        icon: '/icons/ai_beauty_1_transparent.png',
        animation: 'animate-ai-scan',
        isComingSoon: true
      }
    ]
  }
});

/**
 * Default step item
 */
export const getDefaultStepItem = (number: string = '1'): StepItem => ({
  id: generateId('step'),
  number,
  title: 'New Step',
  description: 'Description of this step'
});

/**
 * Default how-it-works section
 */
export const getDefaultHowItWorksSection = (order: number = 3): HowItWorksSectionContent => ({
  id: generateId('how-it-works'),
  type: 'how-it-works',
  name: 'How It Works',
  order,
  visible: true,
  content: {
    sectionTitle: 'How Glamlink Works for You',
    steps: [
      {
        id: generateId('step'),
        number: '1',
        title: 'Search Smart',
        description: 'Find beauty/wellness professionals, treatments and trusted products near you'
      },
      {
        id: generateId('step'),
        number: '2',
        title: 'Beauty In Action',
        description: 'Watch clips, explore before & afters and read reviews'
      },
      {
        id: generateId('step'),
        number: '3',
        title: 'Book/Shop',
        description: 'Request appointments or shop pro-approved products'
      },
      {
        id: generateId('step'),
        number: '4',
        title: 'Glow & Share',
        description: 'Get results you love, leave reviews and grow your beauty circle'
      }
    ]
  }
});

/**
 * Default testimonial item
 */
export const getDefaultTestimonialItem = (): TestimonialItem => ({
  id: generateId('testimonial'),
  quote: 'This is a sample testimonial.',
  author: 'Customer Name',
  role: 'User'
});

/**
 * Default testimonials section
 */
export const getDefaultTestimonialsSection = (order: number = 4): TestimonialsSectionContent => ({
  id: generateId('testimonials'),
  type: 'testimonials',
  name: 'Testimonials',
  order,
  visible: true,
  content: {
    sectionTitle: 'What Our Clients Say',
    testimonials: [
      {
        id: generateId('testimonial'),
        quote: 'The before and after photo albums and clips made it so easy to pick the right pro. I booked my first treatment and can\'t wait for next week.',
        author: 'Mary Madison',
        role: 'User'
      },
      {
        id: generateId('testimonial'),
        quote: 'I love that Glamlink has everything beauty in one place-booking, reviews and even shopping. Total game-changer.',
        author: 'Olivia Hart',
        role: 'User'
      }
    ]
  }
});

/**
 * Default CTA section
 */
export const getDefaultCTASection = (order: number = 5): CTASectionContent => ({
  id: generateId('cta'),
  type: 'cta',
  name: 'Final CTA',
  order,
  visible: true,
  content: {
    heading: 'Meet The Pros, Shop Their Secrets, Elevate Your Best Self',
    buttonText: 'Create Free Account',
    buttonAction: 'download',
    gradientFrom: 'glamlink-teal',
    gradientTo: 'cyan-600'
  }
});

/**
 * Default HTML Content section
 */
export const getDefaultHTMLContentSection = (order: number = 6): HTMLContentSectionContent => ({
  id: generateId('html-content'),
  type: 'html-content',
  name: 'Custom HTML Section',
  order,
  visible: true,
  content: {
    html: '<div class="py-16 text-center">\n  <h2 class="text-3xl font-bold mb-4">Custom HTML Content</h2>\n  <p class="text-gray-600">Add your custom HTML content here.</p>\n</div>',
    containerClass: 'bg-white'
  }
});

/**
 * Get default content for a section type
 */
export function getDefaultSectionContent(type: ForClientsSectionType, order: number): ForClientsSection {
  switch (type) {
    case 'hero':
      return getDefaultHeroSection(order);
    case 'features':
      return getDefaultFeaturesSection(order);
    case 'how-it-works':
      return getDefaultHowItWorksSection(order);
    case 'testimonials':
      return getDefaultTestimonialsSection(order);
    case 'cta':
      return getDefaultCTASection(order);
    case 'html-content':
      return getDefaultHTMLContentSection(order);
    default:
      throw new Error(`Unknown section type: ${type}`);
  }
}

/**
 * Get all default sections
 */
export function getAllDefaultForClientsSections() {
  return [
    getDefaultHeroSection(1),
    getDefaultFeaturesSection(2),
    getDefaultHowItWorksSection(3),
    getDefaultTestimonialsSection(4),
    getDefaultCTASection(5)
  ];
}

/**
 * Get default page configuration with all sections
 */
export function getDefaultPageConfig(): ForClientsPageConfig {
  return {
    id: 'for-clients',
    banner: getDefaultBanner(),
    sections: getAllDefaultForClientsSections()
  };
}
