'use client';

import React, { useMemo } from 'react';
import type { Professional, ProfessionalSectionConfig } from '@/lib/pages/for-professionals/types/professional';
import type { ProfessionalPreviewComponentProps } from '@/lib/pages/admin/config/professionalPreviewComponents';
import { DEFAULT_SECTIONS_CONFIG } from '@/lib/pages/admin/config/sectionsRegistry';

// Import DBC section components
import { Header } from '@/lib/features/digital-cards/components/sections/header';
import { AboutMe, BioSimple, BioPreview } from '@/lib/features/digital-cards/components/sections/bio';
import { OverviewStats } from '@/lib/features/digital-cards/components/sections/content';
import { SignatureWorkAndActions, SignatureWork, VideoDisplaySection } from '@/lib/features/digital-cards/components/sections/media';
import { CurrentPromotions, CurrentPromotionsDetailed } from '@/lib/features/digital-cards/components/sections/promotions';
import { MemoizedMapSection, BusinessHours } from '@/lib/features/digital-cards/components/sections/contact';

interface SectionConfig {
  id: string;
  label: string;
  component: React.ComponentType<{ professional: Professional }>;
  props?: Record<string, any>;
  containerClassName?: string;
}

/**
 * DigitalBusinessCardPreview - Inline/embedded DBC preview for admin
 *
 * Features:
 * - Non-modal rendering (inline in preview pane)
 * - Respects sectionsConfig for section ordering and visibility
 * - Scaled container with max-height constraint
 * - Shows all DBC sections based on configuration
 * - Supports all 9 section types
 */
export default function DigitalBusinessCardPreview({ professional }: ProfessionalPreviewComponentProps) {
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
      tiktok: professional.tiktok,
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
      locations: professional.locations,  // Multi-location array support
      promotions: professional.promotions,
      enhancedSocialLinks: professional.enhancedSocialLinks,
      businessHours: professional.businessHours,
      tags: professional.tags,
      sectionsConfig: professional.sectionsConfig,
    };
  }, [professional]);

  // Get section configuration (use defaults if not provided)
  const sectionConfig = useMemo(() => {
    return transformedProfessional.sectionsConfig?.length
      ? transformedProfessional.sectionsConfig
      : DEFAULT_SECTIONS_CONFIG;
  }, [transformedProfessional.sectionsConfig]);

  // Get sub-sections config for SignatureWorkAndActions
  const signatureWorkSubSections = useMemo(() => {
    const swConfig = sectionConfig.find(s => s.id === 'signature-work-actions');
    return swConfig?.subSections;
  }, [sectionConfig]);

  // Get gallery items for SignatureWork
  const galleryItems = useMemo(() => {
    return transformedProfessional.gallery || [];
  }, [transformedProfessional.gallery]);

  // Find first video from gallery (for legacy/fallback)
  const videoItem = useMemo(() => {
    return transformedProfessional.gallery?.find(item => item.type === 'video') || null;
  }, [transformedProfessional.gallery]);

  // Get effective sections based on configuration
  const effectiveSections = useMemo(() => {
    // Define all available sections - complete registry
    const allSections: SectionConfig[] = [
      {
        id: 'signature-work-actions',
        label: 'Signature Work & Actions',
        component: SignatureWorkAndActions,
        props: {
          gallery: galleryItems,
          video: videoItem,
          subSectionsConfig: signatureWorkSubSections
        },
        containerClassName: 'mb-8'
      },
      {
        id: 'map-section',
        label: 'Location Map',
        component: MemoizedMapSection,
        containerClassName: 'mb-8'
      },
      {
        id: 'bio-simple',
        label: 'Professional Bio',
        component: BioSimple,
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
        label: 'Signature Work (Gallery)',
        component: SignatureWork,
        props: {
          gallery: galleryItems,
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

    // Filter visible sections and sort by order
    const visibleSectionIds = sectionConfig
      .filter(c => c.visible)
      .sort((a, b) => (a.desktopOrder ?? 0) - (b.desktopOrder ?? 0))
      .map(c => c.id);

    // Return sections in configured order
    return visibleSectionIds
      .map(id => allSections.find(s => s.id === id))
      .filter((s): s is SectionConfig => s !== undefined);
  }, [sectionConfig, galleryItems, videoItem, signatureWorkSubSections]);

  return (
    <div className="bg-gray-100 p-2 min-h-[400px]">
      {/* Preview container - full width */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
        {/* Header Component */}
        <Header professional={transformedProfessional} />

        {/* Content Sections */}
        <div className="p-6">
          {effectiveSections.map((section) => {
            const SectionComponent = section.component;
            return (
              <div key={section.id} className={section.containerClassName}>
                <SectionComponent
                  professional={transformedProfessional}
                  {...(section.props || {})}
                />
              </div>
            );
          })}

          {effectiveSections.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>No sections configured.</p>
              <p className="text-sm mt-2">Enable sections in the "Card Sections" tab.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
