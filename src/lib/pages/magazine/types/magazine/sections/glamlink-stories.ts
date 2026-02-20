import { BaseSectionStyling } from '../fields/typography';

export interface GlamlinkStoriesContent extends BaseSectionStyling {
  type: 'glamlink-stories';
  stories: {
    profileName: string;
    profileImage?: string;
    image: string;
    caption?: string;
    storyType?: 'before-after' | 'tutorial' | 'product' | 'review' | 'post';
    timestamp?: string;
    likes?: number;
    comments?: number;
    views?: number;
    tags?: string[];
    isVideo?: boolean;
    link?: string;
  }[];
  featuredStories?: {
    title: string;
    description: string;
    image: string;
    profileName: string;
    profileImage?: string;
    badge?: string;
    link?: string;
  }[];
}