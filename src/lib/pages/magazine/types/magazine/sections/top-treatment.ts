import { BaseSectionStyling } from '../fields/typography';
import { ImageFieldType } from '../fields/image';

export interface TopTreatmentContent extends BaseSectionStyling {
  type: 'top-treatment';
  treatmentName: string;
  treatmentNameTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  heroImage: ImageFieldType;
  heroVideoSettings?: {
    videoType?: 'none' | 'file' | 'youtube'; // Type of video source (default: 'none')
    video?: string; // Optional video file URL (Firebase Storage)
    videoUrl?: string; // Optional YouTube video URL
  };
  // Legacy fields for backward compatibility (deprecated)
  heroVideoType?: 'none' | 'file' | 'youtube';
  heroVideo?: string;
  heroVideoUrl?: string;
  aCloserLook: string;
  aCloserLookTitle?: string; // Custom title text for "A Closer Look" section
  aCloserLookTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
  };
  benefits?: string[];
  keyBenefitsTitle?: string; // Custom title text for "Key Benefits" section
  keyBenefitsTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
  };
  duration?: string;
  frequency?: string;
  priceRange?: string;
  results?: string;
  expectedResultsTitle?: string; // Custom title text for "Expected Results" section
  expectedResultsTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
  };
  beforeAfter?: {
    before: ImageFieldType;
    after: ImageFieldType;
  };
  proInsights?: {
    proName: string;
    proImage?: ImageFieldType;
    quote: string;
  }[];
  proInsightsTitle?: string; // Custom title text for "Pro Insights" section
  proInsightsTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
  };
  additionalInfo?: string;
  goodToKnowTitle?: string; // Custom title text for "Good to Know" section
  goodToKnowTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
  };
  bookingLink?: string;
}