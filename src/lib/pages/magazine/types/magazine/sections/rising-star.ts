import { BaseSectionStyling } from '../fields/typography';
import { ImageFieldType } from '../fields/image';

export interface RisingStarContent extends BaseSectionStyling {
  type: 'rising-star';
  starName: string;
  starTitle?: string;
  starTitle2?: string; // Second line for title/role (optional)
  starTitle2Typography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
  }; // Typography settings for title/role 2
  starImage?: ImageFieldType;
  starImageHeight?: string; // Custom height for profile image (px, vh, em, etc.)
  bio: string;
  contentTitle?: string; // Title for main content section
  contentTitleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  content: string; // Rich HTML content
  quote?: string;
  quoteAuthor?: string;
  quoteOverImage?: boolean; // Display quote overlaid on star image
  photoGallery?: {
    title?: string;
    images: Array<{
      url: ImageFieldType;
      alt: string;
      caption?: string;
    }>;
  };
  accoladesTitle?: string; // Title for the accolades section
  accolades?: (string | {
    title: string;
    description?: string;
    icon?: string;
  })[];
  socialLinks?: {
    instagram?: string | { url: string; label?: string };
    website?: string | { url: string; label?: string };
    glamlinkProfile?: string | { url: string; label?: string };
  };
}