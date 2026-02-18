import { BaseSectionStyling } from '../fields/typography';

export interface WhatsNewGlamlinkContent extends BaseSectionStyling {
  type: 'whats-new-glamlink';
  globalBackgroundColor?: string; // Global background for all feature cards
  sneakPeeksGlobalBackgroundColor?: string; // Global background for all sneak peek cards
  tipsGlobalBackgroundColor?: string; // Global background for all tip cards  
  features?: {
    title: string;
    description: string;
    icon?: string;
    availability?: string;
    backgroundColor?: string; // Individual card background (overrides global)
  }[];
  sneakPeeks?: {
    title: string;
    teaser: string;
    releaseDate?: string;
    backgroundColor?: string; // Individual card background (overrides global)
  }[];
  tips?: {
    title: string;
    description: string;
    link?: string;
    backgroundColor?: string; // Individual card background (overrides global)
  }[];
  usageBoosts?: {
    title: string;
    impact: string;
    metric?: string;
  }[];
  ctaButtonText?: string;
  ctaButtonLink?: string;
}