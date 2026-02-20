import { BaseSectionStyling } from '../fields/typography';

export interface TrendReportContent extends BaseSectionStyling {
  type: 'trend-report';
  trends: {
    name: string;
    description: string;
    image?: string;
    products?: string[]; // Product IDs
    popularity: 'emerging' | 'trending' | 'viral';
  }[];
}