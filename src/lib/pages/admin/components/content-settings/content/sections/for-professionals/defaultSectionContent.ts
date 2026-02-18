/**
 * Default For Professionals Page Section Content
 *
 * Factory functions for creating default section configurations.
 * These match the exact legacy content and design.
 */

import type {
  ForProfessionalsPageConfig,
  ForProfessionalsSection,
  PaginationCarouselSection,
  PassionIntoPowerSection,
  TwoBoxesSection,
  ExpertiseIntoSalesSection,
  EverythingYouNeedSection,
  FinalCTAForProsSection
} from './types';

/**
 * Generate a unique section ID
 */
function generateSectionId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Default Pagination Carousel Section
 */
export function getDefaultPaginationCarouselSection(order: number = 1): PaginationCarouselSection {
  return {
    id: generateSectionId('pagination-carousel'),
    type: 'pagination-carousel',
    name: 'Professional Carousel',
    order,
    visible: true,
    content: {}
  };
}

/**
 * Default Passion Into Power Section
 */
export function getDefaultPassionIntoPowerSection(order: number = 2): PassionIntoPowerSection {
  return {
    id: generateSectionId('passion-into-power'),
    type: 'passion-into-power',
    name: 'Passion Into Power',
    order,
    visible: true,
    content: {
      title: 'Turn Your Passion Into Power',
      subtitle: 'From viral content to e-commerce, Glamlink is where beauty meets technology. With AI-driven discovery on the horizon, this is your chance to claim your space, get discovered and thrive.',
      primaryButton: {
        text: 'Become A Founding Pro',
        action: 'download-pro',
        subtext: 'Limited to 100 pros'
      },
      secondaryButton: {
        text: 'E-Commerce Panel',
        action: 'external-link',
        link: 'https://crm.glamlink.net',
        subtext: 'Existing Pro'
      }
    }
  };
}

/**
 * Default Two Boxes Section
 */
export function getDefaultTwoBoxesSection(order: number = 3): TwoBoxesSection {
  return {
    id: generateSectionId('two-boxes'),
    type: 'two-boxes',
    name: 'Two Boxes',
    order,
    visible: true,
    content: {
      leftBox: {
        title: 'Lock In Your Profile Before Glamlink AI Goes Live',
        description: 'Glamlink is redefining how beauty professionals get discovered. Our upcoming AI will analyze clients needs and match them with the right treatments, products and professionals. AI connects your expertise with the right clients.',
        features: [
          'Secure your spot as one of the first pros AI recommends',
          'Turn your expertise into constant client flow',
          'Glamlink AI connects clients with the most relevant, engaged pros',
          'Set up your shop early so your products are included in the future AI-driven recommendations'
        ],
        buttonText: 'Join Before AI Launches'
      },
      rightBox: {
        title: 'Be One Of The 100 Founding Professionals',
        description: 'Founding Pros get early visibility, priority features and a badge of authority that sets you apart. Get featured in "The Glamlink Edit", be discovered faster and lead the future of beauty.',
        criteriaLabel: 'Criteria:',
        criteria: [
          'Complete your profile with at least 2 photo albums with your best work',
          'Add Services & Hours if you\'d like to be booked',
          'Add at least 1 Post and 1 Clip',
          'Refer 2 friends on the pinned post on Instagram @glamlink_app (& Follow)'
        ],
        buttonText: 'Claim Your Founders Badge'
      }
    }
  };
}

/**
 * Default Expertise Into Sales Section
 */
export function getDefaultExpertiseIntoSalesSection(order: number = 4): ExpertiseIntoSalesSection {
  return {
    id: generateSectionId('expertise-into-sales'),
    type: 'expertise-into-sales',
    name: 'Expertise Into Sales',
    order,
    visible: true,
    content: {
      title: 'Turn Your Expertise Into',
      titleGradientText: 'Unstoppable Sales',
      subtitle: 'If you\'re not selling retail, you\'re leaving money behind. Glamlink gives you the steps to sign up your shop and start earning. For a limited time, enjoy a lower platform fee while you grow.',
      video: {
        type: 'none',
        src: '/videos/ai-video.mp4',
        title: 'Watch How Pros Earn More',
        description: '3 minute setup • Instant results',
        placeholderTitle: 'Professional Video Coming Soon',
        placeholderDescription: 'Stay tuned for exclusive content showing how pros maximize their earnings'
      },
      features: [
        {
          id: generateSectionId('feature'),
          title: 'Your Shop, Everywhere',
          description: 'Be visible 24/7. Your products live in the main Shop tab where users browse anytime and directly on your profile for instant sales.',
          stat: '24/7',
          statLabel: 'Visibility'
        },
        {
          id: generateSectionId('feature'),
          title: 'Sell Through Your Content',
          description: 'Showcase your expertise with powerful before and after photos, engaging demo videos and client testimonials that turn trust into sales.',
          stat: '3x',
          statLabel: 'Conversion Rate'
        },
        {
          id: generateSectionId('feature'),
          title: 'An Ecosystem That Works Together',
          description: 'Your shop isn\'t isolated. Reviews, booking and future AI recommendations all drive clients back to you and your products.',
          stat: '360°',
          statLabel: 'Integration'
        },
        {
          id: generateSectionId('feature'),
          title: 'Built For Professionals',
          description: 'Glamlink is 100% beauty and wellness. Every product is reviewed and approved before it goes live, ensuring a professional marketplace clients can trust. As a seller, you\'re responsible for your products and compliance. All sellers must be licensed professionals and agree to Glamlink\'s seller terms.',
          stat: '100%',
          statLabel: 'Verified'
        }
      ],
      cta: {
        badge: 'Limited Time Offer',
        title: 'Join Now, Pay Less',
        subtitle: 'Sign up today and benefit from introductory platform fees.',
        buttonText: 'Start Selling',
        buttonLink: 'https://crm.glamlink.net',
        disclaimer: 'No setup fees • Instant approval • Cancel anytime'
      }
    }
  };
}

/**
 * Default Everything You Need Section
 */
export function getDefaultEverythingYouNeedSection(order: number = 5): EverythingYouNeedSection {
  return {
    id: generateSectionId('everything-you-need'),
    type: 'everything-you-need',
    name: 'Everything You Need',
    order,
    visible: true,
    content: {
      title: 'Everything You Need To Create, Build & Dominate',
      subtitle: 'Stop juggling multiple platforms. Start dominating one. Glamlink is the only platform built for beauty and wellness professionals that is social media, booking, e-commerce. It\'s an all-in-one ecosystem designed to put you in control.',
      features: [
        {
          id: generateSectionId('feature'),
          title: 'Geo-Discovery',
          description: 'Be discovered by new clients near you with our powerful location-based search',
          icon: '/icons/geo_discovery_4_transparent.png',
          animation: 'animate-pulse-radar'
        },
        {
          id: generateSectionId('feature'),
          title: 'Reviews That Sell',
          description: 'Collect verified reviews that build instant trust and turn browsers into bookings',
          icon: '/icons/reviews_3_transparent.png',
          animation: 'animate-star-burst'
        },
        {
          id: generateSectionId('feature'),
          title: 'E-Commerce',
          description: 'Sell professional-grade products directly from your profile',
          icon: '/icons/e-commerce_4_transparent.png',
          animation: 'animate-bounce-cart'
        },
        {
          id: generateSectionId('feature'),
          title: 'Social Media That Converts',
          description: 'Post content, share clips, build photo albums, and connect with clients—all without fighting algorithms',
          icon: '/icons/social_media_3_transparent.png',
          animation: 'animate-spin-social'
        },
        {
          id: generateSectionId('feature'),
          title: 'Founders Badge',
          description: 'Available only for our early professionals. Get featured, gain priority visibility, and exclusive perks',
          icon: '/icons/founder_badge_3_transparent.png',
          animation: 'animate-shine'
        },
        {
          id: generateSectionId('feature'),
          title: 'The Glamlink Edit',
          description: 'Get insider access to new features, learn the latest beauty trends and unlock opportunities to be featured',
          icon: '/icons/glamlink_edit_1_transparent.png',
          animation: 'animate-page-flip',
          isComingSoon: false
        },
        {
          id: generateSectionId('feature'),
          title: 'AI Discovery',
          description: 'When our AI launches, it will recommend YOU and your products directly to clients based on their needs',
          icon: '/icons/ai_discovery_1_transparent.png',
          animation: 'animate-glitch'
        },
        {
          id: generateSectionId('feature'),
          title: 'Business Growth Tools',
          description: 'Access analytics, AI-powered brainstorming, and business insights to scale your success',
          icon: '/icons/business_growth_1_transparent.png',
          animation: 'animate-chart-rise'
        }
      ]
    }
  };
}

/**
 * Default Final CTA For Pros Section
 */
export function getDefaultFinalCTAForProsSection(order: number = 6): FinalCTAForProsSection {
  return {
    id: generateSectionId('final-cta-for-pros'),
    type: 'final-cta-for-pros',
    name: 'Final CTA',
    order,
    visible: true,
    content: {
      title: 'Your Future in Beauty Starts Here',
      subtitle: 'Join the first 100 founding professionals and shape the future of beauty commerce.',
      primaryButton: {
        text: 'Become a Founding Pro',
        action: 'download-pro'
      },
      secondaryButton: {
        text: 'Access E-Commerce Panel',
        action: 'external-link',
        link: 'https://crm.glamlink.net'
      },
      disclaimer: 'Limited spots available • No credit card required to start'
    }
  };
}

/**
 * Get default section content by type
 */
export function getDefaultForProfessionalsSectionContent(
  type: string,
  order: number
): ForProfessionalsSection {
  switch (type) {
    case 'pagination-carousel':
      return getDefaultPaginationCarouselSection(order);
    case 'passion-into-power':
      return getDefaultPassionIntoPowerSection(order);
    case 'two-boxes':
      return getDefaultTwoBoxesSection(order);
    case 'expertise-into-sales':
      return getDefaultExpertiseIntoSalesSection(order);
    case 'everything-you-need':
      return getDefaultEverythingYouNeedSection(order);
    case 'final-cta-for-pros':
      return getDefaultFinalCTAForProsSection(order);
    default:
      throw new Error(`Unknown section type: ${type}`);
  }
}

/**
 * Get all default sections as array
 */
export function getAllDefaultForProfessionalsSections() {
  return [
    getDefaultPaginationCarouselSection(1),
    getDefaultPassionIntoPowerSection(2),
    getDefaultTwoBoxesSection(3),
    getDefaultExpertiseIntoSalesSection(4),
    getDefaultEverythingYouNeedSection(5),
    getDefaultFinalCTAForProsSection(6)
  ];
}

/**
 * Default complete for-professionals page configuration
 */
export function getDefaultForProfessionalsPageConfig(): ForProfessionalsPageConfig {
  return {
    id: 'for-professionals',
    sections: getAllDefaultForProfessionalsSections(),
    ssgEnabled: false
  };
}
