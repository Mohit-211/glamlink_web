"use client";

import { Professional } from "@/lib/pages/for-professionals/types/professional";
import { CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";
import { formatUrl } from './utils/helpers';
import { FOOTER_DEFAULTS } from './utils/props';
import { selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';
import { useAppSelector } from "../../../../../../../store/hooks";

// =============================================================================
// SOCIAL ICON IMAGES
// Using PNG images from /public/icons/socials/ for better PDF compatibility
// =============================================================================

const SOCIAL_ICONS = {
  glamlink: '/images/logo-cropped.png',
  instagram: '/icons/socials/instagram.png',
  tiktok: '/icons/socials/tiktok.png',
  website: '/icons/socials/web.png',
} as const;

// Glamlink App Store URL (always shown)
const GLAMLINK_APP_STORE_URL = 'https://apps.apple.com/us/app/glamlink/id6502334118';

// =============================================================================
// COMPONENT
// =============================================================================

interface FooterSectionProps {
  professional: Professional;
  section?: CondensedCardSectionInstance;
  /** Analytics tracking callback for Glamlink App Store click */
  onGlamlinkClick?: () => void;
  /** Analytics tracking callback for Instagram click */
  onInstagramClick?: () => void;
  /** Analytics tracking callback for TikTok click */
  onTiktokClick?: () => void;
  /** Analytics tracking callback for website click */
  onWebsiteClick?: () => void;
}

export default function FooterSection({
  professional,
  section,
  onGlamlinkClick,
  onInstagramClick,
  onTiktokClick,
  onWebsiteClick,
}: FooterSectionProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('footer'));

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  const iconSize = mergedProps?.iconSize ?? 32;
  const spacing = mergedProps?.spacing ?? 24;

  // Map icon names to their tracking callbacks
  const trackingCallbacks: Record<string, (() => void) | undefined> = {
    glamlink: onGlamlinkClick,
    instagram: onInstagramClick,
    tiktok: onTiktokClick,
    website: onWebsiteClick,
  };

  const icons = [
    // Glamlink App Store icon - always shown
    {
      name: 'glamlink' as const,
      url: GLAMLINK_APP_STORE_URL,
      iconSrc: SOCIAL_ICONS.glamlink,
      show: true
    },
    // Professional's social links - conditionally shown
    {
      name: 'instagram' as const,
      url: formatUrl(professional?.instagram, 'instagram'),
      iconSrc: SOCIAL_ICONS.instagram,
      show: !!professional?.instagram
    },
    {
      name: 'tiktok' as const,
      url: formatUrl(professional?.tiktok, 'tiktok'),
      iconSrc: SOCIAL_ICONS.tiktok,
      show: !!professional?.tiktok
    },
    {
      name: 'website' as const,
      url: formatUrl(professional?.website, 'website'),
      iconSrc: SOCIAL_ICONS.website,
      show: !!professional?.website
    }
  ].filter(icon => icon.show);

  /**
   * Handle social icon click - track analytics then allow navigation
   */
  const handleIconClick = (iconName: string) => {
    const trackFn = trackingCallbacks[iconName];
    if (trackFn) {
      trackFn();
    }
  };

  return (
    <div className="footer-section flex justify-center items-center" style={{ gap: `${spacing}px` }}>
      {icons.map(({ name, url, iconSrc }) => (
        <a
          key={name}
          href={url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon hover:opacity-70 transition-opacity"
          title={name.charAt(0).toUpperCase() + name.slice(1)}
          onClick={() => handleIconClick(name)}
        >
          <img
            src={iconSrc}
            alt={`${name} icon`}
            style={{ width: iconSize, height: iconSize }}
            className="object-contain"
            onError={(e) => {
              console.error(`Failed to load icon: ${iconSrc}`);
              // Hide broken image
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </a>
      ))}
    </div>
  );
}
