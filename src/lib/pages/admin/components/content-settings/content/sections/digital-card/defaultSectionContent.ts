/**
 * Digital Card Page - Default Section Content
 *
 * Factory functions that return default content for each digital card section type.
 * Content based on legacy digital business card application page.
 */

import type {
  DigitalCardHeroSection,
  DigitalCardFormSection,
  DigitalCardFinalCTASection,
} from './types';

/**
 * Generate unique section ID
 */
function generateSectionId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Default Hero Section
 *
 * Single card layout with text content on left, video preview on right
 */
export function getDefaultDigitalCardHeroSection(order: number = 1): DigitalCardHeroSection {
  return {
    id: generateSectionId('digital-card-hero'),
    type: 'digital-card-hero',
    name: 'Hero Section',
    order,
    visible: true,
    content: {
      headline: 'The Link in Bio, Evolved.',
      description: 'Your digital presence should be as refined as your craft. The <strong>Glam Card</strong> is the new industry standard-a high-conversion storefront designed to turn followers into clients instantly. Move beyond static links and give your audience the first impression they\'ve been waiting for. Feature a <strong>personal video greeting</strong>, a <strong>tour of your space</strong>, or a <strong>promo of your signature work</strong> alongside <strong>integrated mapping</strong> and <strong>one-touch booking</strong>. It\'s the most efficient way to bridge the gap between discovery and a confirmed appointment.',
      platformTitle: 'Powered by Glamlink. Built for the Beauty + Wellness Pro.',
      platformDescription: 'The Glam Card is your front door; <strong>Glamlink</strong> is your powerhouse. This is the first professional ecosystem designed specifically to scale beauty and wellness businesses. Centralize your entire brand in one destination-from <strong>Service Menus</strong> and <strong>Direct Booking</strong> to <strong>Clips</strong> and <strong>Photo Albums</strong> that act as your living portfolio. Build undeniable authority with <strong>Verified Reviews</strong> and prepare to scale your revenue with an <strong>Integrated Shop</strong> coming soon. Glamlink removes the noise of traditional social media, giving you and your clients the platform the industry deserves.',
      gifData: {
        stillSrc: '/images/GlamlinkProfile.png',
        gifSrc: '/videos/GlamlinkProfile.mp4',
        alt: 'Glam Card digital business card demonstration'
      },
      ctaText: 'Apply for Your Glam Card'
    }
  };
}

/**
 * Default Form Section
 *
 * Wraps existing DigitalCardFormWithPreview component
 * No configurable content
 */
export function getDefaultDigitalCardFormSection(order: number = 2): DigitalCardFormSection {
  return {
    id: generateSectionId('digital-card-form'),
    type: 'digital-card-form',
    name: 'Application Form',
    order,
    visible: true,
    content: {}
  };
}

/**
 * Default Final CTA Section
 *
 * Gradient background section encouraging application
 */
export function getDefaultDigitalCardFinalCTASection(order: number = 3): DigitalCardFinalCTASection {
  return {
    id: generateSectionId('digital-card-final-cta'),
    type: 'digital-card-final-cta',
    name: 'Final CTA Section',
    order,
    visible: true,
    content: {
      title: 'Ready to Get Your Digital Card?',
      subtitle: 'Join our network of beauty professionals and get discovered by clients.',
      primaryButton: {
        text: 'Apply for Digital Card',
        action: 'scroll-to-form'
      },
      secondaryButton: {
        text: 'Access E-Commerce Panel',
        action: 'external-link',
        link: 'https://crm.glamlink.net'
      },
      disclaimer: 'Free digital business card • Quick approval • Professional digital presence'
    }
  };
}

/**
 * Get all default sections for digital card page
 */
export function getAllDefaultDigitalCardSections(): (
  | DigitalCardHeroSection
  | DigitalCardFormSection
  | DigitalCardFinalCTASection
)[] {
  return [
    getDefaultDigitalCardHeroSection(1),
    getDefaultDigitalCardFormSection(2),
    getDefaultDigitalCardFinalCTASection(3)
  ];
}
