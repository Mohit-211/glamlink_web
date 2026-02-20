'use client';

/**
 * StyledDigitalBusinessCard - Professional styled digital card for standalone pages
 *
 * Used by: /for-professionals/[id] page
 *
 * Features:
 * - GLAMLINK iD branding logo at top
 * - Two-column layout: Left (Header & Bio, Signature Work) | Right (Map/Hours, Specialties, Promos)
 * - Styled containers with gradient backgrounds and decorative title lines
 * - Matches the apply page preview design
 * - Action buttons: Copy URL, Save as Image
 * - Analytics tracking for all user interactions
 *
 * IMPORTANT: Image export uses CondensedCardView (same as admin page)
 * to ensure IDENTICAL output between both "Save as Image" buttons.
 */

import React, { useRef, useMemo, useEffect } from 'react';
import { Link2, Download, Check, Loader2, X } from 'lucide-react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import GlamlinkIdLogo from './preview/components/GlamlinkIdLogo';
import { PreviewRowBasedLayout } from './preview/components/columns';
import PreviewBookingButton from './preview/components/PreviewBookingButton';
import FooterSection from './components/condensed/sections/FooterSection';
import { useCardShare } from './components/useCardShare';
import { useCardAnalytics } from '@/lib/features/analytics/hooks';
// Import CondensedCardView for image export - SAME component as admin page
import { CondensedCardView } from './components/export/CondensedCardView';
import {
  DEFAULT_CONDENSED_CARD_CONFIG,
  mergeWithDefaultConfig,
  migrateCondensedCardConfig,
} from './types/condensedCardConfig';
// import { useAppDispatch } from '@/store/hooks';
import { setConfig } from './store/digitalCardConfigSlice';
import { useAppDispatch } from '../../../../store/hooks';

// =============================================================================
// TYPES
// =============================================================================

export interface StyledDigitalBusinessCardProps {
  /** Full professional data from database */
  professional: Professional;
  /** Optional className for container */
  className?: string;
  /** Hide the teal border (useful in modal context) */
  hideBorder?: boolean;
  /** Optional close handler (shows X button when provided) */
  onClose?: () => void;
  /** Force single-column mobile layout (useful for narrow containers like homepage map panel) */
  forceMobileLayout?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function StyledDigitalBusinessCard({
  professional,
  className = '',
  hideBorder = false,
  onClose,
  forceMobileLayout = false,
}: StyledDigitalBusinessCardProps) {
  // Ref for display card (not used for export)
  const cardRef = useRef<HTMLDivElement>(null);

  // Ref for CondensedCardView - THIS is what gets exported (SAME as admin page)
  const condensedRef = useRef<HTMLDivElement>(null);

  // Get condensed card config from professional (same as admin page)
  const config = useMemo(() => {
    const rawConfig = (professional as any).condensedCardConfig;
    if (!rawConfig) return DEFAULT_CONDENSED_CARD_CONFIG;
    const migrated = migrateCondensedCardConfig(rawConfig);
    return mergeWithDefaultConfig(migrated);
  }, [professional]);

  // Initialize Redux with config for preview section components
  // This ensures section options (showQrCode, showPlayButton, etc.) and
  // title typography are properly applied in preview sections
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (config) {
      dispatch(setConfig({
        sections: config.sections || [],
        dimensions: config.dimensions,
        styles: config.styles,
      }));
    }
  }, []); // Only on mount - config is stable since professional doesn't change

  // Generate card URL for CondensedCardView
  const cardUrl = useMemo(() => {
    const slug = professional.cardUrl || professional.id || 'preview';
    return `https://glamlink.net/${slug}`;
  }, [professional.cardUrl, professional.id]);

  // Extract signature-work settings from condensed config
  const signatureWorkSettings = useMemo(() => {
    const signatureWorkSection = config.sections?.find(
      s => s.sectionType === 'signature-work'
    );
    return {
      capturedVideoFrame: signatureWorkSection?.props?.capturedVideoFrame ?? 4,
      showPlayButton: signatureWorkSection?.props?.showPlayButton ?? true,
      displayFullWidth: signatureWorkSection?.props?.displayFullWidth ?? false,
      hideCaption: signatureWorkSection?.props?.hideCaption ?? true,
    };
  }, [config]);

  // Analytics tracking (tracks view on mount)
  const {
    trackCopyUrl,
    trackSaveCard,
    trackBookClick,
    trackTextClick,
    trackWebsiteClick,
    trackInstagramClick,
    trackTiktokClick,
  } = useCardAnalytics({
    professionalId: professional.id,
    trackViewOnMount: true,
  });

  // Card sharing functionality - uses condensedRef for export (SAME as admin page)
  const {
    copyUrl,
    isCopied,
    saveAsImage,
    isSaving,
    previewImage,
    preprocessingStep,
    confirmDownload,
    clearPreview,
    isDownloading,
  } = useCardShare({ professional, cardRef, condensedRef });

  // Wrapped handlers that include analytics tracking
  const handleCopyUrl = async () => {
    await copyUrl();
    trackCopyUrl();
  };

  const handleConfirmDownload = () => {
    confirmDownload();
    trackSaveCard();
  };

  // Check if active promotions exist (must have at least one promo with isActive: true)
  const hasActivePromotions = !!(
    professional.promotions &&
    professional.promotions.length > 0 &&
    professional.promotions.some(promo => promo.isActive)
  );

  // Show promo section ONLY if there are active promotions
  // (QR code URL no longer triggers promo section display)
  const showPromoSection = hasActivePromotions;

  // Determine booking method from professional data
  // Use preferredBookingMethod if set, otherwise fall back to detecting available contact info
  const bookingMethod: 'text-to-book' | 'booking-link' | 'send-text' | 'instagram' | undefined = (() => {
    // If professional has a preferred booking method, use it (if the required data exists)
    if (professional.preferredBookingMethod) {
      switch (professional.preferredBookingMethod) {
        case 'send-text':
          return professional.phone ? 'send-text' : undefined;
        case 'instagram':
          return professional.instagram ? 'instagram' : undefined;
        case 'booking-link':
          return professional.bookingUrl ? 'booking-link' : undefined;
      }
    }
    // Fallback: detect from available data
    if (professional.bookingUrl) return 'booking-link';
    if (professional.phone) return 'text-to-book';
    return undefined;
  })();

  // Check if booking info exists (based on preferred method or any contact info)
  const hasBookingInfo = !!(professional.bookingUrl || professional.phone || professional.instagram);

  return (
    <div ref={cardRef} className={`styled-digital-business-card ${className} relative`}>
      {/* Action Buttons - Top Right (excluded from image export) */}
      <div className="absolute top-6 right-6 flex gap-2 z-10" data-export-exclude="true">
        <button
          onClick={handleCopyUrl}
          title="Copy card URL"
          className={`p-2 rounded-full shadow-md transition-colors ${
            isCopied
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {isCopied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
        </button>
        <button
          onClick={() => saveAsImage('condensed')}
          disabled={isSaving}
          title="Save as image"
          className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow-md transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
        </button>
        {onClose && (
          <button
            onClick={onClose}
            title="Close"
            className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 1st Backdrop (white background) */}
      <div className="bg-white overflow-hidden">
        {/* 2nd Backdrop (teal border when not hidden, light gray inside) */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            border: hideBorder ? 'none' : '4px solid #14b8a6',
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
              <PreviewRowBasedLayout
                professional={professional}
                condensedCardConfig={config}
                signatureWorkSettings={signatureWorkSettings}
                showPromo={showPromoSection}
                importantInfo={professional.importantInfo}
                forceMobileLayout={forceMobileLayout}
              />

              {/* Booking Button - Inside white wrapper */}
              {hasBookingInfo && (
                <div className="mt-4">
                  <PreviewBookingButton
                    professional={professional}
                    bookingMethod={bookingMethod}
                    onBookClick={trackBookClick}
                    onTextClick={trackTextClick}
                    onInstagramClick={trackInstagramClick}
                  />
                </div>
              )}
            </div>

            {/* Social Icons Footer - Always shown (includes Glamlink app link) */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <FooterSection
                professional={professional}
                onInstagramClick={trackInstagramClick}
                onTiktokClick={trackTiktokClick}
                onWebsiteClick={trackWebsiteClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Processing Overlay - shows while loading preview image */}
      {isSaving && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20 rounded-lg">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-teal-500" />
            <p className="text-gray-600 font-medium">
              {preprocessingStep || 'Loading preview...'}
            </p>
          </div>
        </div>
      )}

      {/* Preview Modal - shows generated image before download */}
      {previewImage && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] shadow-2xl flex flex-col">
            {/* Header with title and X button - fixed at top */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">Preview Your Digital Card</h3>
              <button
                onClick={clearPreview}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Scrollable image container */}
            <div className="flex-1 overflow-auto p-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={previewImage}
                  alt="Digital Card Preview"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Footer with action buttons - fixed at bottom */}
            <div className="flex gap-3 justify-end p-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={clearPreview}
                disabled={isDownloading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDownload}
                disabled={isDownloading}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2 disabled:opacity-50 min-w-[120px] justify-center"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden CondensedCardView for image export - SAME component as admin page */}
      {/* This ensures both "Save as Image" buttons produce IDENTICAL output */}
      {/* IMPORTANT: Use visibility:hidden instead of left:-9999px so layout is computed correctly */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: `${config.dimensions.width}px`,
          height: `${config.dimensions.height}px`,
          visibility: 'hidden',
          pointerEvents: 'none',
          zIndex: -9999,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <CondensedCardView
          ref={condensedRef}
          professional={professional}
          cardUrl={cardUrl}
          config={config}
        />
      </div>
    </div>
  );
}
