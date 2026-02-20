import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import { DEFAULT_SECTIONS_CONFIG } from '@/lib/pages/admin/config/sectionsRegistry';
import type { SectionConfig } from './useDigitalBusinessCardPreview';

// Import DBC section components
import { AboutMe, BioPreview } from '@/lib/features/digital-cards/components/sections/bio';
import { OverviewStats } from '@/lib/features/digital-cards/components/sections/content';
import { SignatureWorkAndActions, SignatureWork, VideoDisplaySection } from '@/lib/features/digital-cards/components/sections/media';
import { CurrentPromotions, CurrentPromotionsDetailed } from '@/lib/features/digital-cards/components/sections/promotions';
import { BusinessHours } from '@/lib/features/digital-cards/components/sections/contact';

// =============================================================================
// TRANSFORM FUNCTIONS
// =============================================================================

/**
 * Transform partial professional data to complete structure with defaults
 */
export function transformProfessionalWithDefaults(professional: Partial<Professional>): Professional {
  return {
    id: professional.id || 'preview',
    name: professional.name || 'Professional Name',
    title: professional.title || 'Beauty Professional',
    specialty: professional.specialty || 'General',
    location: professional.location || professional.locationData?.address || 'Location',
    certificationLevel: professional.certificationLevel || 'Silver',
    yearsExperience: professional.yearsExperience ?? 5,

    // Optional fields
    instagram: professional.instagram,
    tiktok: professional.tiktok,
    isFounder: professional.isFounder ?? false,
    hasDigitalCard: professional.hasDigitalCard ?? true,

    // Media
    profileImage: professional.profileImage,
    portraitImage: professional.portraitImage,
    image: professional.image,

    // Bio
    bio: professional.bio,
    description: professional.description,

    // Services
    services: professional.services || [],

    // Contact
    email: professional.email,
    phone: professional.phone,
    website: professional.website,
    bookingUrl: professional.bookingUrl,
    preferredBookingMethod: professional.preferredBookingMethod,

    // Ratings
    rating: professional.rating,
    reviewCount: professional.reviewCount,
    featured: professional.featured ?? false,

    // Enhanced fields
    business_name: professional.business_name,
    specialties: professional.specialties,
    gallery: professional.gallery,
    locationData: professional.locationData,
    locations: professional.locations,  // Multi-location array support
    promotions: professional.promotions,
    enhancedSocialLinks: professional.enhancedSocialLinks,
    businessHours: professional.businessHours,
    tags: professional.tags,
    importantInfo: professional.importantInfo,
    sectionsConfig: professional.sectionsConfig,

    // Default condensed card image (for "Download Saved Img" button)
    defaultCondensedCardImage: professional.defaultCondensedCardImage,
  };
}

/**
 * Transform form data for preview container with all fields including condensedCardConfig
 * Returns Partial<Professional> since form data may be incomplete
 */
export function transformFormDataForPreview(
  formData: Partial<Professional>
): Partial<Professional> {
  return {
    // Core fields
    id: formData.id || 'preview',
    name: formData.name || 'Professional Name',
    title: formData.title || 'Beauty Professional',
    specialty: formData.specialty || 'General',
    location: formData.location || formData.locationData?.address || 'Location',
    certificationLevel: formData.certificationLevel || 'Silver',
    yearsExperience: formData.yearsExperience ?? 5,

    // Status flags
    instagram: formData.instagram,
    tiktok: formData.tiktok,
    isFounder: formData.isFounder ?? false,
    hasDigitalCard: formData.hasDigitalCard ?? true,
    featured: formData.featured ?? false,

    // Media
    profileImage: formData.profileImage,
    portraitImage: formData.portraitImage,
    image: formData.image,
    gallery: formData.gallery,

    // Content
    bio: formData.bio,
    description: formData.description,

    // Services & promotions
    services: formData.services || [],
    specialties: formData.specialties,
    promotions: formData.promotions,

    // Contact
    email: formData.email,
    phone: formData.phone,
    website: formData.website,
    bookingUrl: formData.bookingUrl,
    preferredBookingMethod: formData.preferredBookingMethod,

    // Location
    locationData: formData.locationData,
    locations: formData.locations,

    // Social & Business
    enhancedSocialLinks: formData.enhancedSocialLinks,
    business_name: formData.business_name,
    businessHours: formData.businessHours,
    tags: formData.tags,
    importantInfo: formData.importantInfo,

    // Ratings
    rating: formData.rating,
    reviewCount: formData.reviewCount,

    // Section configuration (use defaults if empty)
    sectionsConfig: formData.sectionsConfig?.length
      ? formData.sectionsConfig
      : DEFAULT_SECTIONS_CONFIG,

    // Condensed Card configuration (CRITICAL: pass through for preview)
    condensedCardConfig: formData.condensedCardConfig,

    // Default condensed card image (for "Download Saved Img" button)
    defaultCondensedCardImage: formData.defaultCondensedCardImage,
  };
}

/**
 * Get all available section configurations
 */
export function getAllSectionConfigs(
  videoItem: { type: string; url: string; thumbnail?: string } | null,
  signatureWorkSubSections?: any
): SectionConfig[] {
  return [
    {
      id: 'signature-work-actions',
      label: 'Signature Work & Actions',
      component: SignatureWorkAndActions,
      props: {
        video: videoItem,
        subSectionsConfig: signatureWorkSubSections
      },
      containerClassName: 'mb-8'
    },
    {
      id: 'about-me',
      label: 'About Me',
      component: AboutMe,
      containerClassName: 'mb-8'
    },
    {
      id: 'current-promotions',
      label: 'Current Promotions',
      component: CurrentPromotions,
      containerClassName: 'mb-8'
    },
    {
      id: 'signature-work',
      label: 'Signature Work (Video Only)',
      component: SignatureWork,
      props: {
        video: videoItem
      },
      containerClassName: 'mb-8'
    },
    {
      id: 'video-display',
      label: 'Video Display',
      component: VideoDisplaySection,
      props: {
        video: videoItem
      },
      containerClassName: 'mb-8'
    },
    {
      id: 'business-hours',
      label: 'Business Hours',
      component: BusinessHours,
      containerClassName: 'mb-8'
    },
    {
      id: 'overview-stats',
      label: 'Overview Stats',
      component: OverviewStats,
      containerClassName: 'mb-8'
    },
    {
      id: 'bio-preview',
      label: 'Bio Preview',
      component: BioPreview,
      containerClassName: 'mb-8'
    },
    {
      id: 'current-promotions-detailed',
      label: 'Promotions (Detailed)',
      component: CurrentPromotionsDetailed,
      containerClassName: 'mb-8'
    }
  ];
}
