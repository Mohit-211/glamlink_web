/**
 * Default Home Page Section Content
 *
 * Factory functions for creating default section configurations.
 * These are used when adding new sections or initializing the page.
 */

import type {
  HomePageConfig,
  HeroSection,
  WhyGlamlinkSection,
  BookTrustedProsSection,
  TestimonialsSection,
  FounderBadgeSection,
  CTASection,
  HTMLContentSection,
  ProDiscoveryMapSection,
  DigitalCardsShowcaseSection,
  DigitalCardCTASection
} from './types';
import type { BannerConfig } from '@/lib/features/display-cms/types';

/**
 * Generate a unique section ID
 */
function generateSectionId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Default banner configuration
 */
export function getDefaultBanner(): BannerConfig {
  return {
    enabled: false,
    message: 'Welcome to Glamlink!',
    backgroundColor: '#24bbcb',
    textColor: '#ffffff',
    dismissible: true
  };
}

/**
 * Default Hero Section
 */
export function getDefaultHeroSection(order: number = 1): HeroSection {
  return {
    id: generateSectionId('hero'),
    type: 'hero',
    name: 'Hero Section',
    order,
    visible: true,
    content: {
      title: 'THE PLATFORM POWERING THE BEAUTY INDUSTRY',
      subtitle: 'Connect. Book. Sell. Grow. Everything beauty, in one seamless experience',
      buttons: [
        {
          text: 'I\'m a Client - Download Now',
          action: 'download-client',
          style: 'primary'
        },
        {
          text: 'I\'m a Beauty Pro - Grow With Glamlink',
          action: 'download-pro',
          style: 'secondary'
        }
      ],
      phoneImage: '/images/hero pic-website.png'
    }
  };
}

/**
 * Default Why Glamlink Section
 */
export function getDefaultWhyGlamlinkSection(order: number = 2): WhyGlamlinkSection {
  return {
    id: generateSectionId('why-glamlink'),
    type: 'why-glamlink',
    name: 'Why Glamlink',
    order,
    visible: true,
    content: {
      // Left Card - For Clients
      title: 'Why Glamlink?',
      subtitle: 'A smarter way to discover trusted beauty professionals and shop expert-approved products.',
      features: [
        {
          id: generateSectionId('item'),
          title: 'Verified Professionals Only',
          description: 'Discover local experts with real experience, real reviews, and real results.',
          icon: 'PersonOutline'
        },
        {
          id: generateSectionId('item'),
          title: 'Shop Pro-Approved Products',
          description: 'Buy the exact products your beauty pro recommends - no more guessing.',
          icon: 'ShoppingBagOutlined'
        },
        {
          id: generateSectionId('item'),
          title: 'One-Stop Beauty Hub',
          description: 'Book appointments, shop products, and manage everything in one app.',
          icon: 'CalendarTodayOutlined'
        },
        {
          id: generateSectionId('item'),
          title: 'Support Small Businesses',
          description: 'Every purchase directly supports independent beauty entrepreneurs.',
          icon: 'RocketLaunchOutlined'
        }
      ],
      // Right Card - For Professionals
      proCard: {
        title: 'For Professionals',
        subtitle: 'Get discovered, get booked, and unlock new ways to grow.',
        features: [
          {
            id: generateSectionId('item'),
            title: 'Get Discovered',
            description: "Be found by what you do best. Whether it's lashes, microblading, brows, we'll help connect you to clients actively searching for your exact services.",
            icon: 'SearchOutlined'
          },
          {
            id: generateSectionId('item'),
            title: 'Booked & Busy',
            description: 'Fill your calendar with real bookings. Our smart tools help you manage clients, stay organized, and grow your business seamlessly.',
            icon: 'EventNoteOutlined'
          },
          {
            id: generateSectionId('item'),
            title: 'Create. Earn. Expand',
            description: "From selling your favorite products to launching your own brand or app, it's possible.",
            icon: 'AttachMoneyOutlined'
          },
          {
            id: generateSectionId('item'),
            title: 'Smarter Tools, Built for You',
            description: 'AI-powered features are helping you do more with the right clients.',
            icon: 'AutoAwesomeOutlined'
          }
        ]
      }
    }
  };
}

/**
 * Default Book Trusted Pros Section
 */
export function getDefaultBookTrustedProsSection(order: number = 3): BookTrustedProsSection {
  return {
    id: generateSectionId('book-trusted-pros'),
    type: 'book-trusted-pros',
    name: 'Book Trusted Pros',
    order,
    visible: true,
    content: {
      services: [
        {
          image: '/images/search_by_service.png',
          alt: 'Professional hair styling',
          title: 'Search by Service'
        },
        {
          image: '/images/calendar_booked_w_glamlink_resized.png',
          alt: 'Professional facial treatment',
          title: 'Book Trusted Pros'
        },
        {
          image: '/images/shop_professional_products.png',
          alt: 'Relaxing spa massage',
          title: 'Shop Professional Products'
        }
      ]
    }
  };
}

/**
 * Default Testimonials Section
 */
export function getDefaultTestimonialsSection(order: number = 4): TestimonialsSection {
  return {
    id: generateSectionId('testimonials'),
    type: 'testimonials',
    name: 'Testimonials',
    order,
    visible: true,
    content: {
      title: 'What Our Users Are Saying',
      items: [
        {
          id: generateSectionId('testimonial'),
          text: 'I\'m so excited to have one platform where I can do everything for my esthetician business. Now I can focus on launching my new skincare line and sell it directly on Glamlink!',
          name: 'Jessica M.',
          role: 'Esthetician',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
        },
        {
          id: generateSectionId('testimonial'),
          text: 'I\'ve been waiting for something like this. Glamlink lets me showcase my work, build my brand, and actually get discovered by people looking for what I do. It finally feels like a platform built for beauty pros.',
          name: 'Lina R.',
          role: 'Brow Specialist',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
        },
        {
          id: generateSectionId('testimonial'),
          text: 'I love seeing real results before I book. With the reviews and the option to shop, I actually feel confident in who I\'m choosing and what I\'m buying.',
          name: 'Amanda J.',
          role: 'Glamlink user',
          image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop'
        },
        {
          id: generateSectionId('testimonial'),
          text: 'I didn\'t even know half these treatments existed. Glamlink opened up a whole new world — and now I can actually shop products I trust too.',
          name: 'Jasmine R.',
          role: 'Glamlink user',
          image: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=100&h=100&fit=crop'
        }
      ]
    }
  };
}

/**
 * Default Founder Badge Section
 */
export function getDefaultFounderBadgeSection(order: number = 5): FounderBadgeSection {
  return {
    id: generateSectionId('founder-badge'),
    type: 'founder-badge',
    name: 'Founder Badge',
    order,
    visible: true,
    content: {
      image: '/images/gold_badge.png',
      title: 'Founder Badge (First 100 Only)',
      description: 'Early professionals get exclusive visibility, permanent perks, and first access to new tools.',
      subtext: 'Join now and be recognized as a Founding Member.'
    }
  };
}

/**
 * Default CTA Section
 */
export function getDefaultCTASection(order: number = 6): CTASection {
  return {
    id: generateSectionId('cta'),
    type: 'cta',
    name: 'Final CTA',
    order,
    visible: true,
    content: {
      title: 'Download Glamlink for Free',
      subtitle: 'Whether you\'re booking a beauty service or building your business.',
      userSection: {
        title: 'For Users',
        description: 'Discover trusted pros, book instantly, and shop expert-approved products.',
        button: {
          text: 'Download for Users',
          action: 'download-user'
        }
      },
      proSection: {
        title: 'For Professionals',
        description: 'Build your brand, grow your client base, and sell products directly.',
        button: {
          text: 'Download for Pros',
          action: 'download-pro'
        }
      }
    }
  };
}

/**
 * Default HTML Content Section
 */
export function getDefaultHTMLContentSection(order: number): HTMLContentSection {
  return {
    id: generateSectionId('html-content'),
    type: 'html-content',
    name: 'Custom HTML Section',
    order,
    visible: true,
    content: {
      html: '<div class="text-center py-12"><h2 class="text-3xl font-bold">Custom Content</h2></div>',
      containerClass: 'bg-white'
    }
  };
}

/**
 * Default Pro Discovery Map Section
 * Interactive map showing professionals filtered by category
 */
export function getDefaultProDiscoveryMapSection(order: number = 2): ProDiscoveryMapSection {
  return {
    id: generateSectionId('pro-discovery-map'),
    type: 'pro-discovery-map',
    name: 'Pro Discovery Map',
    order,
    visible: true,
    content: {
      title: 'Find Your Perfect Pro',
      subtitle: 'Browse beauty professionals near you by specialty',
      showCategories: true,
      showSearch: true,
      defaultCategory: 'all',
      mapHeight: '600px'
    }
  };
}

/**
 * Default Digital Cards Showcase Section
 * Carousel of professional digital cards from /for-professionals
 */
export function getDefaultDigitalCardsShowcaseSection(order: number = 3): DigitalCardsShowcaseSection {
  return {
    id: generateSectionId('digital-cards-showcase'),
    type: 'digital-cards-showcase',
    name: 'Digital Cards Showcase',
    order,
    visible: true,
    content: {
      title: 'Meet The Pros',
      subtitle: 'Browse our network of certified beauty professionals',
      showSearch: true,
      showFilters: true,
      cardsPerPage: 6
    }
  };
}

/**
 * Default Digital Card CTA Section
 * Promotional section with autoplay gif showcasing the digital card feature
 */
export function getDefaultDigitalCardCTASection(order: number = 3): DigitalCardCTASection {
  return {
    id: generateSectionId('digital-card-cta'),
    type: 'digital-card-cta',
    name: 'Digital Card CTA',
    order,
    visible: true,
    content: {
      title: 'The Link in Bio, Evolved.',
      description: 'Introducing the Glam Card — your sleek, all-in-one digital hub that puts your brand front and center. Showcase your services, share your socials, link your shop, and give clients an instant way to book and connect. Forget messy links — now everything lives in one place.',
      subheading: 'Powered by Glamlink. Built for the Beauty + Wellness Pro.',
      subDescription: 'Glamlink is more than a booking app — it\'s the platform helping beauty entrepreneurs build, grow, and scale their brands. From discovery to checkout, we connect clients with trusted professionals and give pros the tools to run their entire business in one place.',
      ctaText: 'Apply for Your Glam Card',
      ctaLink: '/apply/digital-card',
      gifData: {
        stillSrc: '/images/digital-card-preview.png',
        gifSrc: '/videos/digital-card-demo.mp4',
        alt: 'Digital Glam Card Preview'
      }
    }
  };
}

/**
 * Get default section content by type
 */
export function getDefaultSectionContent(
  type: string,
  order: number
): HeroSection | WhyGlamlinkSection | BookTrustedProsSection | TestimonialsSection | FounderBadgeSection | CTASection | HTMLContentSection | ProDiscoveryMapSection | DigitalCardsShowcaseSection | DigitalCardCTASection {
  switch (type) {
    case 'hero':
      return getDefaultHeroSection(order);
    case 'why-glamlink':
      return getDefaultWhyGlamlinkSection(order);
    case 'book-trusted-pros':
      return getDefaultBookTrustedProsSection(order);
    case 'testimonials':
      return getDefaultTestimonialsSection(order);
    case 'founder-badge':
      return getDefaultFounderBadgeSection(order);
    case 'cta':
      return getDefaultCTASection(order);
    case 'html-content':
      return getDefaultHTMLContentSection(order);
    case 'pro-discovery-map':
      return getDefaultProDiscoveryMapSection(order);
    case 'digital-cards-showcase':
      return getDefaultDigitalCardsShowcaseSection(order);
    case 'digital-card-cta':
      return getDefaultDigitalCardCTASection(order);
    default:
      throw new Error(`Unknown section type: ${type}`);
  }
}

/**
 * Get all default sections
 */
export function getAllDefaultHomeSections() {
  return [
    getDefaultHeroSection(1),
    getDefaultWhyGlamlinkSection(2),
    getDefaultBookTrustedProsSection(3),
    getDefaultTestimonialsSection(4),
    getDefaultFounderBadgeSection(5),
    getDefaultCTASection(6)
  ];
}

/**
 * Default complete home page configuration
 */
export function getDefaultHomePageConfig(): HomePageConfig {
  return {
    id: 'home',
    banner: getDefaultBanner(),
    sections: getAllDefaultHomeSections(),
    ssgEnabled: false  // Default to dynamic rendering
  };
}
