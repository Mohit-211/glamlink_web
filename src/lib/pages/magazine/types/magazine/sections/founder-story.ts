import { BaseSectionStyling } from '../fields/typography';

export interface FounderStoryContent extends BaseSectionStyling {
  type: 'founder-story';
  founderName: string;
  founderTitle: string;
  founderImage: string;
  companyName: string;
  companyLogo?: string;
  story: string;
  keyAchievements?: string[];
  quote?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
  images?: { url: string; caption?: string; alt: string }[];
}