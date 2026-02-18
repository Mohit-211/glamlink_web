import { BaseSectionStyling } from '../fields/typography';

export interface EventRoundUpContent extends BaseSectionStyling {
  type: 'event-roundup';
  upcomingEvents?: {
    title: string;
    date: string;
    location: string;
    description: string;
    image?: string;
    registrationLink?: string;
  }[];
  pastEvents?: {
    title: string;
    date: string;
    highlights: string[];
    images?: string[];
    attendees?: number;
  }[];
}