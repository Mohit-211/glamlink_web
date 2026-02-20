import { BaseSectionStyling } from '../fields/typography';
import { ImageFieldType } from '../fields/image';

export interface CoverProFeatureContent extends BaseSectionStyling {
  type: 'cover-pro-feature';
  coverImage: ImageFieldType;
  coverImageAlt: string;
  professionalName: string;
  professionalTitle: string;
  professionalImage?: ImageFieldType;
  pullQuote?: string;
  journey: string;
  niche?: string;
  nicheTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  glamlinkSectionTitle?: string;
  glamlinkSectionTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  glamlinkUsage?: string;
  achievements?: string[];
  socialLinks?: {
    instagram?: string;
    website?: string;
    glamlinkProfile?: string;
  };
  photoGallery?: {
    title?: string;
    images: Array<{
      url: ImageFieldType;
      alt: string;
      caption?: string;
    }>;
  };
}