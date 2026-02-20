"use client";

import { Professional } from "@/lib/pages/for-professionals/types/professional";
import { CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";
import { selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';
import { useAppSelector } from "../../../../../../../store/hooks";

// =============================================================================
// TYPES
// =============================================================================

interface HeaderAndBioProps {
  professional: Professional;
  section?: CondensedCardSectionInstance;
}

// Image size presets mapping
const IMAGE_SIZE_MAP: Record<string, number> = {
  small: 60,
  medium: 80,
  large: 120,
  fullWidth: 160,
};

// =============================================================================
// ICON COMPONENTS
// =============================================================================

function VerifiedBadge({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block ml-1"
    >
      {/* Shield shape with gradient */}
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#F4D03F" />
          <stop offset="100%" stopColor="#C5A028" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"
        fill="url(#shieldGradient)"
      />
      {/* Checkmark */}
      <path
        d="M10 14.2l-2.6-2.6L6 13l4 4 8-8-1.4-1.4L10 14.2z"
        fill="#fff"
      />
    </svg>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

function WebsiteIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

// =============================================================================
// SOCIAL LINKS COMPONENT
// =============================================================================

interface SocialLinksProps {
  professional: Professional;
  iconSize?: number;
}

function SocialLinks({ professional, iconSize = 18 }: SocialLinksProps) {
  const instagram = professional.instagram;
  const tiktok = professional.tiktok;
  const website = professional.website;

  const hasLinks = instagram || tiktok || website;
  if (!hasLinks) return null;

  return (
    <div className="flex items-center gap-3 mt-2">
      {instagram && (
        <a
          href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-pink-500 transition-colors"
          aria-label="Instagram"
        >
          <InstagramIcon size={iconSize} />
        </a>
      )}
      {tiktok && (
        <a
          href={tiktok.startsWith('http') ? tiktok : `https://tiktok.com/@${tiktok.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-black transition-colors"
          aria-label="TikTok"
        >
          <TikTokIcon size={iconSize} />
        </a>
      )}
      {website && (
        <a
          href={website.startsWith('http') ? website : `https://${website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-glamlink-teal transition-colors"
          aria-label="Website"
        >
          <WebsiteIcon size={iconSize} />
        </a>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * HeaderAndBio - Profile card layout with circular image, name/title, and bio
 *
 * Supports two layouts:
 *
 * Standard Layout (Small, Medium, Large):
 * ┌─────────────────────────────────────────┐
 * │ ┌───────┐  Name ✓                       │
 * │ │ Image │  Title                        │
 * │ │ (circle)│  Business Name              │
 * │ └───────┘  [Social Icons]               │
 * │                                         │
 * │ Bio text...                             │
 * └─────────────────────────────────────────┘
 *
 * Full Width Layout:
 * ┌─────────────────────────────────────────┐
 * │           ┌───────────┐                 │
 * │           │   Image   │                 │
 * │           │  (circle) │                 │
 * │           └───────────┘                 │
 * │              Name ✓                     │
 * │              Title                      │
 * │           Business Name                 │
 * │          [Social Icons]                 │
 * │                                         │
 * │ Bio text...                             │
 * └─────────────────────────────────────────┘
 */
export default function HeaderAndBio({ professional, section }: HeaderAndBioProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('headerAndBio'));

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  // Extract props with defaults - these come from Redux via toggleGroup
  const showVerifiedBadge = mergedProps?.showVerifiedBadge ?? true;
  const showProfileImage = mergedProps?.showProfileImage ?? true;
  const showName = mergedProps?.showName ?? true;
  const showTitle = mergedProps?.showTitle ?? true;
  const showCompany = mergedProps?.showCompany ?? true;
  const showSocialLinks = mergedProps?.showSocialLinks ?? true;

  // Handle imageSize - can be string preset or number (backward compatible)
  const imageSizeValue = mergedProps?.imageSize ?? 'medium';
  const imageSize = typeof imageSizeValue === 'string'
    ? (IMAGE_SIZE_MAP[imageSizeValue] || 80)
    : imageSizeValue;
  const isFullWidth = imageSizeValue === 'fullWidth';

  // Font sizes
  const nameFontSize = mergedProps?.nameFontSize ?? '1.25rem';
  const occupationFontSize = mergedProps?.occupationFontSize ?? '1rem';
  const bioFontSize = mergedProps?.bioFontSize ?? '0.875rem';

  // Professional data - use bioOverride from section props if provided, otherwise fall back to professional bio
  const bioOverride = mergedProps?.bioOverride;
  const bio = bioOverride || professional?.bio || professional?.description || '';
  const businessName = professional?.business_name || professional?.locationData?.businessName || professional?.location || '';
  const isVerified = professional?.certificationLevel !== undefined;

  // Full Width Layout - centered image with info below
  if (isFullWidth) {
    return (
      <div className="header-and-bio">
        {/* Centered Layout */}
        <div className="flex flex-col items-center text-center mb-4">
          {/* Circular Profile Image */}
          {showProfileImage && (
            <div
              className="rounded-full overflow-hidden border-2 border-gray-200 mb-3"
              style={{ width: imageSize, height: imageSize }}
            >
              <img
                src={professional.profileImage || professional.image}
                alt={professional.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Name with Verified Badge */}
          {showName && (
            <div className="flex items-center justify-center flex-wrap">
              <h2
                className="font-bold text-gray-900"
                style={{ fontSize: nameFontSize }}
              >
                {professional.name}
              </h2>
              {showVerifiedBadge && isVerified && <VerifiedBadge size={20} />}
            </div>
          )}

          {/* Occupation/Title */}
          {showTitle && professional.title && (
            <p
              className="text-glamlink-teal font-medium"
              style={{ fontSize: occupationFontSize }}
            >
              {professional.title}
            </p>
          )}

          {/* Business Name / Location (Company) */}
          {showCompany && businessName && (
            <p
              className="text-gray-600"
              style={{ fontSize: occupationFontSize }}
            >
              {businessName}
            </p>
          )}

          {/* Social Links */}
          {showSocialLinks && (
            <SocialLinks professional={professional} iconSize={20} />
          )}
        </div>

        {/* Bio - supports HTML content for rich text formatting */}
        {bio && (
          <div
            className="text-gray-700 [&_*]:text-inherit"
            style={{ fontSize: bioFontSize }}
            dangerouslySetInnerHTML={{ __html: bio }}
          />
        )}
      </div>
    );
  }

  // Standard Layout - image on left, info on right
  return (
    <div className="header-and-bio">
      {/* Profile Row: Image + Name/Title */}
      <div className="flex items-start gap-4 mb-4">
        {/* Circular Profile Image */}
        {showProfileImage && (
          <div
            className="flex-shrink-0 rounded-full overflow-hidden border-2 border-gray-200"
            style={{ width: imageSize, height: imageSize }}
          >
            <img
              src={professional.profileImage || professional.image}
              alt={professional.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Name, Title, Business */}
        <div className="flex-1 min-w-0">
          {/* Name with Verified Badge */}
          {showName && (
            <div className="flex items-center flex-wrap">
              <h2
                className="font-bold text-gray-900"
                style={{ fontSize: nameFontSize }}
              >
                {professional.name}
              </h2>
              {showVerifiedBadge && isVerified && <VerifiedBadge size={20} />}
            </div>
          )}

          {/* Occupation/Title */}
          {showTitle && professional.title && (
            <p
              className="text-glamlink-teal font-medium"
              style={{ fontSize: occupationFontSize }}
            >
              {professional.title}
            </p>
          )}

          {/* Business Name / Location (Company) */}
          {showCompany && businessName && (
            <p
              className="text-gray-600"
              style={{ fontSize: occupationFontSize }}
            >
              {businessName}
            </p>
          )}

          {/* Social Links */}
          {showSocialLinks && (
            <SocialLinks professional={professional} iconSize={18} />
          )}
        </div>
      </div>

      {/* Bio - supports HTML content for rich text formatting */}
      {bio && (
        <div
          className="text-gray-700 [&_*]:text-inherit"
          style={{ fontSize: bioFontSize }}
          dangerouslySetInnerHTML={{ __html: bio }}
        />
      )}
    </div>
  );
}
