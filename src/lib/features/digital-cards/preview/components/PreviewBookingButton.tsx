'use client';

/**
 * PreviewBookingButton - Booking action button for styled digital card preview
 *
 * Behavior based on preferred booking method:
 * - "text-to-book" / "send-text": Shows "SEND TEXT" button
 *   - Mobile: Opens SMS app
 *   - Desktop: Shows contact info message below button
 * - "booking-link": Shows "BOOK NOW" button (opens booking URL)
 * - "instagram": Shows "DM ON INSTAGRAM" button (opens Instagram profile)
 */

import React, { useState, useEffect } from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';

// =============================================================================
// TYPES
// =============================================================================

export interface PreviewBookingButtonProps {
  professional: Partial<Professional>;
  bookingMethod?: 'text-to-book' | 'booking-link' | 'send-text' | 'instagram';
  /** Analytics tracking callback for book button click */
  onBookClick?: () => void;
  /** Analytics tracking callback for text/SMS button click */
  onTextClick?: () => void;
  /** Analytics tracking callback for Instagram button click */
  onInstagramClick?: () => void;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Check if user is on a mobile device
 */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check for mobile user agent or touch device
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileDevice = mobileRegex.test(userAgent.toLowerCase());
      // Also check for small screen width as fallback
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

/**
 * Format phone number for display (e.g., "(702) 555-1234")
 */
function formatPhoneForDisplay(phone: string | undefined): string {
  if (!phone) return '';
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Format as (XXX) XXX-XXXX if 10 digits
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  // Format as +X (XXX) XXX-XXXX if 11 digits (with country code)
  if (digits.length === 11) {
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  // Return original if can't format
  return phone;
}

/**
 * Format phone number for SMS link
 */
function formatPhoneForSMS(phone: string | undefined): string {
  if (!phone) return '';
  // Remove all non-digit characters except +
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Format URL to ensure it's clickable
 */
function formatUrl(url: string | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
}

/**
 * Format Instagram handle to full URL
 */
function formatInstagramUrl(instagram: string | undefined): string | null {
  if (!instagram) return null;
  // If already a full URL, return as-is
  if (instagram.includes('instagram.com')) {
    return instagram.startsWith('http') ? instagram : `https://${instagram}`;
  }
  // Remove @ if present and build URL
  const cleanHandle = instagram.replace('@', '').trim();
  return `https://instagram.com/${cleanHandle}`;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function PreviewBookingButton({
  professional,
  bookingMethod,
  onBookClick,
  onTextClick,
  onInstagramClick,
}: PreviewBookingButtonProps) {
  const isMobile = useIsMobile();
  const [showContactInfo, setShowContactInfo] = useState(false);

  if (!bookingMethod) return null;

  const phone = professional.phone;
  const bookingUrl = professional.bookingUrl;
  const instagram = professional.instagram;
  const proName = professional.name || 'this professional';

  // Text to Book mode (includes both "text-to-book" and "send-text")
  if (bookingMethod === 'text-to-book' || bookingMethod === 'send-text') {
    if (!phone) return null;

    const formattedPhone = formatPhoneForSMS(phone);
    const displayPhone = formatPhoneForDisplay(phone);
    const smsLink = `sms:${formattedPhone}`;

    const handleTextClick = (e: React.MouseEvent) => {
      if (onTextClick) {
        onTextClick();
      }
      // On desktop, prevent default SMS behavior and show contact info instead
      if (!isMobile) {
        e.preventDefault();
        setShowContactInfo(true);
      }
    };

    return (
      <div className="preview-booking-button flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 w-full">
          {/* Decorative line left - matches Specialties title styling */}
          <div className="flex-1 min-w-[20px] h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />

          {/* Button */}
          <a
            href={smsLink}
            onClick={handleTextClick}
            className="px-6 py-2 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal/90 transition-colors text-center whitespace-nowrap"
            style={{ minWidth: '140px' }}
          >
            SEND TEXT
          </a>

          {/* Decorative line right - matches Specialties title styling */}
          <div className="flex-1 min-w-[20px] h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
        </div>

        {/* Contact info message - shown on desktop after clicking */}
        {showContactInfo && !isMobile && (
          <p className="text-sm text-gray-600 text-center mt-1 animate-fadeIn">
            Reach out to &quot;{proName}&quot; at <span className="font-semibold text-glamlink-teal">{displayPhone}</span>
          </p>
        )}
      </div>
    );
  }

  // Booking Link mode
  if (bookingMethod === 'booking-link') {
    const formattedUrl = formatUrl(bookingUrl);
    if (!formattedUrl) return null;

    const handleBookClick = () => {
      if (onBookClick) {
        onBookClick();
      }
    };

    return (
      <div className="preview-booking-button flex items-center gap-3">
        {/* Decorative line left - matches Specialties title styling */}
        <div className="flex-1 min-w-[20px] h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />

        {/* Button */}
        <a
          href={formattedUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleBookClick}
          className="px-6 py-2 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal/90 transition-colors text-center whitespace-nowrap"
          style={{ minWidth: '140px' }}
        >
          BOOK NOW
        </a>

        {/* Decorative line right - matches Specialties title styling */}
        <div className="flex-1 min-w-[20px] h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
      </div>
    );
  }

  // Instagram mode
  if (bookingMethod === 'instagram') {
    const instagramUrl = formatInstagramUrl(instagram);
    if (!instagramUrl) return null;

    const handleInstagramClick = () => {
      if (onInstagramClick) {
        onInstagramClick();
      }
    };

    return (
      <div className="preview-booking-button flex items-center gap-3">
        {/* Decorative line left - matches Specialties title styling */}
        <div className="flex-1 min-w-[20px] h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />

        {/* Button */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleInstagramClick}
          className="px-6 py-2 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal/90 transition-colors text-center whitespace-nowrap"
          style={{ minWidth: '140px' }}
        >
          DM ON INSTAGRAM
        </a>

        {/* Decorative line right - matches Specialties title styling */}
        <div className="flex-1 min-w-[20px] h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
      </div>
    );
  }

  return null;
}
