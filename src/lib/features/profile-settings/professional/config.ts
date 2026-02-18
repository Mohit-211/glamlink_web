/**
 * Professional Settings Configuration
 *
 * Default settings, option definitions, and constants
 */

import type {
  PricingDisplay,
  PortfolioAccess,
  ReviewVisibility,
  ProfessionalSettings,
} from './types';

export const PRICING_DISPLAY_OPTIONS: {
  value: PricingDisplay;
  label: string;
  description: string;
}[] = [
  {
    value: 'public',
    label: 'Show All Prices',
    description: 'Display full pricing on your profile',
  },
  {
    value: 'range_only',
    label: 'Show Price Ranges',
    description: 'Display price ranges like "$50-$150"',
  },
  {
    value: 'request_only',
    label: 'Request Quote',
    description: 'Customers must contact you for pricing',
  },
  {
    value: 'hidden',
    label: 'Hide All Prices',
    description: 'Do not display any pricing information',
  },
];

export const PORTFOLIO_ACCESS_OPTIONS: {
  value: PortfolioAccess;
  label: string;
  description: string;
}[] = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone can view your portfolio',
  },
  {
    value: 'clients_only',
    label: 'Clients Only',
    description: 'Only past/current clients can view',
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can view your portfolio',
  },
];

export const REVIEW_VISIBILITY_OPTIONS: {
  value: ReviewVisibility;
  label: string;
  description: string;
  warning?: string;
}[] = [
  {
    value: 'all',
    label: 'Show All Reviews',
    description: 'Display all reviews on your profile',
  },
  {
    value: 'positive_only',
    label: 'Positive Only',
    description: 'Only show reviews 4 stars and above',
    warning: 'This may affect customer trust',
  },
  {
    value: 'hidden',
    label: 'Hide Reviews',
    description: 'Do not display reviews section',
    warning: 'Hiding reviews may significantly impact bookings',
  },
];

export const DEFAULT_PROFESSIONAL_SETTINGS: ProfessionalSettings = {
  certifications: {
    showCertifications: true,
    showVerifiedBadge: true,
    showCertificationDates: true,
    showIssuingOrganization: true,
    highlightedCertifications: [],
  },
  portfolio: {
    access: 'public',
    showBeforeAfter: true,
    watermarkImages: false,
    allowDownload: false,
    showClientTestimonials: true,
    requireConsentForPublic: true,
  },
  pricing: {
    display: 'public',
    showStartingAt: true,
    showPriceRange: true,
    showDuration: true,
    showAddOns: true,
    consultationRequired: [],
    customPriceMessage: 'Contact for custom pricing',
  },
  reviews: {
    visibility: 'all',
    showRating: true,
    showReviewCount: true,
    showReviewerName: true,
    showReviewDate: true,
    highlightedReviews: [],
    minimumRatingToShow: 1,
    allowResponses: true,
    autoPublish: true,
  },
};
