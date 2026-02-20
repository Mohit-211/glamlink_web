import { BaseSectionStyling } from '../fields/typography';

export interface ProTipsContent extends BaseSectionStyling {
  type: 'pro-tips';
  authorName: string;
  authorTitle?: string;
  authorImage?: string;
  topic: string;
  tips: {
    title: string;
    content: string;
    icon?: string;
    proTip?: string;
  }[];
  callToAction?: {
    text: string;
    link: string;
  };
}