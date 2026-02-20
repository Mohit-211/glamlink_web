'use client';

import React, { useMemo } from 'react';
import ProfessionalCard from '@/lib/pages/for-professionals/components/PaginationCarouselClean/components/ProfessionalCard';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import type { ProfessionalPreviewComponentProps } from '@/lib/pages/admin/config/professionalPreviewComponents';

/**
 * ProfessionalCardPreview - Wraps ProfessionalCard for admin preview
 *
 * Features:
 * - Transforms Partial<Professional> to complete Professional with defaults
 * - Scaled container for fitting in split-pane preview
 * - No click interaction (preview only)
 */
export default function ProfessionalCardPreview({ professional }: ProfessionalPreviewComponentProps) {
  // Transform partial professional data to complete structure with defaults
  const transformedProfessional = useMemo<Professional>(() => {
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

      // Ratings
      rating: professional.rating,
      reviewCount: professional.reviewCount,
      featured: professional.featured ?? false,

      // Enhanced fields
      business_name: professional.business_name,
      specialties: professional.specialties,
      gallery: professional.gallery,
      locationData: professional.locationData,
      promotions: professional.promotions,
      enhancedSocialLinks: professional.enhancedSocialLinks,
      businessHours: professional.businessHours,
      tags: professional.tags,
      sectionsConfig: professional.sectionsConfig,
    };
  }, [professional]);

  return (
    <div className="p-4 flex justify-center items-start bg-gray-100 min-h-[400px]">
      <div className="w-[320px] transform scale-90 origin-top">
        <ProfessionalCard
          professional={transformedProfessional}
          onClick={() => {}} // No-op for preview
          featured={false}
          className=""
        />
      </div>
    </div>
  );
}
