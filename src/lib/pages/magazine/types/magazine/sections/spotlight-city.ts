import { BaseSectionStyling } from '../fields/typography';

export interface SpotlightCityContent extends BaseSectionStyling {
  type: 'spotlight-city';
  cityName: string;
  cityImage?: string;
  description?: string;
  topPros?: {
    name: string;
    specialty: string;
    image?: string;
    link?: string;
    achievement?: string;
  }[];
  localEvents?: {
    title: string;
    date: string;
    location: string;
    description?: string;
  }[];
  trends?: {
    name: string;
    description: string;
    popularity?: 'emerging' | 'trending' | 'hot';
  }[];
}