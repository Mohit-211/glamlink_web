'use client';

/**
 * StyledDigitalCardPreview - Professional styled preview for digital card application
 *
 * Features:
 * - GLAMLINK iD branding logo at top
 * - Two-column layout: Left (Header & Bio, Signature Work) | Right (Map/Hours, Specialties, Promos)
 * - Styled containers with gradient backgrounds and decorative title lines
 * - Real-time updates as form data changes
 * - Empty states when data is missing (no mock data)
 *
 * Styling matches the condensed card design from the admin panel.
 */

import React, { useMemo } from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import GlamlinkIdLogo from './components/GlamlinkIdLogo';
import { PreviewRowBasedLayout } from './components/columns';
import PreviewBookingButton from './components/PreviewBookingButton';
import FooterSection from '@/lib/features/digital-cards/components/condensed/sections/FooterSection';
import { useAppSelector } from '../../../../../store/hooks';
import { selectSections } from '@/lib/features/digital-cards/store';

// =============================================================================
// TYPES
// =============================================================================

export interface StyledDigitalCardPreviewProps {
  /** Professional data (partial - from form transformation) */
  professional: Partial<Professional>;
  /** Whether to show promotions section */
  showPromoSection?: boolean;
  /** Promotion details text (for creating temporary promotion) */
  promotionDetails?: string;
  /** Preferred booking method from form */
  bookingMethod?: 'text-to-book' | 'booking-link' | 'send-text' | 'instagram';
  /** Important info items for display */
  importantInfo?: string[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function StyledDigitalCardPreview({
  professional,
  showPromoSection: showPromoSectionProp,
  promotionDetails: promotionDetailsProp,
  bookingMethod,
  importantInfo: importantInfoProp,
}: StyledDigitalCardPreviewProps) {
  // READ FROM REDUX - sections as source of truth for live updates
  const reduxSections = useAppSelector(selectSections);

  // Ensure professional has required defaults
  const transformedProfessional = useMemo<Partial<Professional>>(() => {
    const baseConfig = {
      id: professional.id || 'preview',
      name: professional.name || '',
      title: professional.title || '',
      specialty: professional.specialty || '',
      location: professional.location || professional.locationData?.address || '',
      certificationLevel: professional.certificationLevel,
      yearsExperience: professional.yearsExperience,

      // Media
      profileImage: professional.profileImage,
      portraitImage: professional.portraitImage,
      image: professional.image,

      // Bio
      bio: professional.bio || '',
      description: professional.description,

      // Services
      services: professional.services || [],
      specialties: professional.specialties || [],

      // Contact
      email: professional.email,
      phone: professional.phone,
      website: professional.website,
      instagram: professional.instagram,
      tiktok: professional.tiktok,
      bookingUrl: professional.bookingUrl,

      // Ratings
      rating: professional.rating,
      reviewCount: professional.reviewCount,

      // Enhanced fields
      business_name: professional.business_name,
      gallery: professional.gallery,
      locationData: professional.locationData,
      locations: professional.locations,
      promotions: professional.promotions,
      businessHours: professional.businessHours,
      tags: professional.tags,

      // Section configuration for dynamic rendering
      sectionsConfig: professional.sectionsConfig,

      // Important info for sections
      importantInfo: professional.importantInfo,

      // Condensed card configuration - use Redux sections when available
      condensedCardConfig: professional.condensedCardConfig,
    };

    // Use Redux sections as source of truth when available (for live preview updates)
    if (reduxSections.length > 0 && baseConfig.condensedCardConfig) {
      baseConfig.condensedCardConfig = {
        ...baseConfig.condensedCardConfig,
        sections: reduxSections,
      };
    }

    return baseConfig;
  }, [professional, reduxSections]);

  // Check if active promotions exist (must have at least one promo with isActive: true)
  // Use prop if provided, otherwise extract from professional data
  const hasActivePromotions = !!(
    transformedProfessional.promotions &&
    transformedProfessional.promotions.length > 0 &&
    transformedProfessional.promotions.some(promo => promo.isActive)
  );

  // Show promo section if prop is provided, otherwise check for active promotions
  const showPromoSection = showPromoSectionProp !== undefined ? showPromoSectionProp : hasActivePromotions;

  // Use importantInfo prop if provided, otherwise extract from professional data
  const importantInfo = importantInfoProp ?? transformedProfessional.importantInfo;

  // Use promotionDetails prop if provided
  const promotionDetails = promotionDetailsProp;

  // Check if any social links exist
  const hasSocialLinks = !!(
    transformedProfessional.instagram ||
    transformedProfessional.tiktok ||
    transformedProfessional.website
  );

  // Check if booking info exists based on booking method
  const hasBookingInfo = !!(
    (bookingMethod === 'text-to-book' && transformedProfessional.phone) ||
    (bookingMethod === 'send-text' && transformedProfessional.phone) ||
    (bookingMethod === 'booking-link' && transformedProfessional.bookingUrl) ||
    (bookingMethod === 'instagram' && transformedProfessional.instagram)
  );

  return (
    <div className="styled-digital-business-card bg-gray-50 p-3">
      {/* 1st Backdrop (white background) */}
      <div className="bg-white overflow-hidden">
        {/* 2nd Backdrop (teal border, light gray inside) */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            border: '4px solid #14b8a6',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e5e7eb 100%)',
          }}
        >
          {/* Inner content */}
          <div className="p-4">
            {/* GLAMLINK iD Logo */}
            <GlamlinkIdLogo height={60} />

            {/* White shadow-drop container around grid content */}
            <div
              className="mt-4 bg-white rounded-xl p-4"
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Row-based layout - renders sections in correct row order */}
              {/* Settings come from condensedCardConfig.sections[].props.innerSectionProps */}
              <PreviewRowBasedLayout
                professional={transformedProfessional}
                condensedCardConfig={transformedProfessional.condensedCardConfig}
                showPromo={showPromoSection}
                promotionDetails={promotionDetails}
                importantInfo={importantInfo}
              />

              {/* Booking Button - Inside white wrapper */}
              {hasBookingInfo && (
                <div className="mt-4">
                  <PreviewBookingButton
                    professional={transformedProfessional}
                    bookingMethod={bookingMethod}
                  />
                </div>
              )}
            </div>

            {/* Social Icons Footer */}
            {hasSocialLinks && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <FooterSection professional={transformedProfessional as Professional} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
