import { BaseSectionStyling } from '../fields/typography';

export interface BeautyTipsContent extends BaseSectionStyling {
  type: 'beauty-tips';
  tips: {
    title: string;
    description: string;
    image?: string;
    products?: string[]; // Product IDs
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }[];
}