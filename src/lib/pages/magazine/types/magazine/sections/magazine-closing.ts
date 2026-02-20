import { BaseSectionStyling } from '../fields/typography';
import { ImageFieldType } from '../fields/image';

export interface MagazineClosingContent extends BaseSectionStyling {
  type: 'magazine-closing';
  
  // Display toggles
  showWhatsNext?: boolean;
  showSpotlightReel?: boolean;
  showJoinMovement?: boolean;
  
  // What's Next fields
  nextIssueTitle?: string;
  nextIssueTitleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  nextIssueCover?: ImageFieldType;
  nextIssueDate?: string;
  nextIssueDescription?: string; // Rich text description for next issue
  upcomingHighlights?: Array<{
    title: string;
    description?: string;
    image?: ImageFieldType;
  }>;
  upcomingHighlightsTitle?: string; // Title for upcoming highlights section
  upcomingHighlightsTitleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  
  // Spotlight Reel fields
  reelTitle?: string;
  reelTitleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  reelSubTitle?: string; // Subtitle for the reel section
  reelSubTitleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  spotlights?: Array<{
    image: ImageFieldType;
    name: string;
    caption?: string;
    link?: string;
  }>;
  gridLayout?: '2x3' | '3x2';
  
  // Join Movement fields
  heroHeadline?: string;
  heroHeadlineTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  heroSubheadline?: string; // Renamed from subheadline for clarity
  heroSubheadlineTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  howToGetFeaturedTitle?: string; // New field for the title
  howToGetFeaturedTitleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  bullets?: string[];
  backgroundImage?: ImageFieldType;
  useOverlayStyle?: boolean;
  
  // Common CTA fields
  ctaHeadline?: string;
  ctaHeadlineTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  ctaQrCode?: string;
  ctaLink?: string;
  ctaButtonText?: string;
  ctaTagline?: string; // Optional tagline below CTA button
  ctaTaglineTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
}