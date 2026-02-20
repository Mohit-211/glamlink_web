import { BaseSectionStyling } from '../fields/typography';

export interface FeaturedStoryContent extends BaseSectionStyling {
  type: 'featured-story';
  heroImage: string;
  heroImageAlt: string;
  author?: string;
  readTime?: string;
  body: string;
  images?: { url: string; caption?: string; alt: string }[];
}