import { BaseSectionStyling } from '../fields/typography';

export interface WhatsHotWhatsOutContent extends BaseSectionStyling {
  type: 'whats-hot-whats-out';
  hotItems: {
    item: string;
    reason?: string;
    emoji?: string;
  }[];
  outItems: {
    item: string;
    reason?: string;
    emoji?: string;
  }[];
}