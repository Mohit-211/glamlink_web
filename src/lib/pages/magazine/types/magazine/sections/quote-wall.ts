import { BaseSectionStyling } from '../fields/typography';

export interface QuoteWallContent extends BaseSectionStyling {
  type: 'quote-wall';
  quotes: {
    text: string;
    author: string;
    authorTitle?: string;
    authorImage?: string;
    featured?: boolean;
  }[];
  theme?: string;
}