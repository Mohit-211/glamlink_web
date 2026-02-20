import { BaseSectionStyling } from '../fields/typography';

export interface MariesColumnContent extends BaseSectionStyling {
  type: 'maries-column';
  title: string;
  subtitle?: string;
  authorImage?: string;
  openingQuote?: string;
  mainContent: string;
  keyTakeaways?: string[];
  actionItems?: string[];
  closingThought?: string;
  signatureImage?: string;
}