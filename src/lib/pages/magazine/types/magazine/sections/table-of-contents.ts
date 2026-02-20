import { BaseSectionStyling } from '../fields/typography';

export interface TableOfContentsContent extends BaseSectionStyling {
  type: 'table-of-contents';
  body: string; // Empty string, as TOC is generated from issue sections
}