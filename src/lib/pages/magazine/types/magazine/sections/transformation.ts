import { BaseSectionStyling } from '../fields/typography';

export interface TransformationContent extends BaseSectionStyling {
  type: 'transformation';
  transformations: {
    id: string;
    title: string;
    beforeImage: string;
    afterImage: string;
    timeframe: string;
    products: string[]; // Product IDs
    provider?: string; // Provider ID
    testimonial?: string;
  }[];
}