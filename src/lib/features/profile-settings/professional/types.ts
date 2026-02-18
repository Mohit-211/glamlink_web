/**
 * Professional Settings Types
 *
 * Types for controlling how professional information appears on public profiles
 */

export type PricingDisplay = 'public' | 'request_only' | 'range_only' | 'hidden';
export type PortfolioAccess = 'public' | 'clients_only' | 'private';
export type ReviewVisibility = 'all' | 'positive_only' | 'hidden';

export interface CertificationDisplaySettings {
  showCertifications: boolean;                  // Show certifications section
  showVerifiedBadge: boolean;                   // Show verified badge
  showCertificationDates: boolean;              // Show when certified
  showIssuingOrganization: boolean;             // Show who issued cert
  highlightedCertifications: string[];          // IDs of certs to feature
}

export interface PortfolioSettings {
  access: PortfolioAccess;
  showBeforeAfter: boolean;                     // Show before/after comparisons
  watermarkImages: boolean;                     // Add watermark to portfolio images
  allowDownload: boolean;                       // Allow customers to download images
  showClientTestimonials: boolean;              // Show testimonials on gallery items
  requireConsentForPublic: boolean;             // Only show with client consent
}

export interface PricingSettings {
  display: PricingDisplay;
  showStartingAt: boolean;                      // Show "Starting at $XX"
  showPriceRange: boolean;                      // Show "$50-$150" ranges
  showDuration: boolean;                        // Show service duration
  showAddOns: boolean;                          // Show add-on pricing
  consultationRequired: string[];               // Service IDs requiring consultation
  customPriceMessage?: string;                  // "Contact for pricing" message
}

export interface ReviewSettings {
  visibility: ReviewVisibility;
  showRating: boolean;                          // Show star rating
  showReviewCount: boolean;                     // Show total review count
  showReviewerName: boolean;                    // Show reviewer's name
  showReviewDate: boolean;                      // Show when reviewed
  highlightedReviews: string[];                 // IDs of reviews to feature
  minimumRatingToShow: number;                  // Only show reviews >= X stars (1-5)
  allowResponses: boolean;                      // Allow responding to reviews
  autoPublish: boolean;                         // Auto-publish or require approval
}

export interface ProfessionalSettings {
  certifications: CertificationDisplaySettings;
  portfolio: PortfolioSettings;
  pricing: PricingSettings;
  reviews: ReviewSettings;
}

export interface UseProfessionalReturn {
  settings: ProfessionalSettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  updateCertificationSettings: (updates: Partial<CertificationDisplaySettings>) => Promise<void>;
  updatePortfolioSettings: (updates: Partial<PortfolioSettings>) => Promise<void>;
  updatePricingSettings: (updates: Partial<PricingSettings>) => Promise<void>;
  updateReviewSettings: (updates: Partial<ReviewSettings>) => Promise<void>;
}
