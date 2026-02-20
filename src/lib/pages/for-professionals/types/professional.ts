import type { CondensedCardConfig } from '@/lib/features/digital-cards/types/condensedCardConfig';

// Sub-section configuration for composite sections (e.g., SignatureWorkAndActions)
export interface SubSectionConfig {
  id: string;              // e.g., "video", "specialties", "business-hours", "quick-actions"
  visible: boolean;        // Whether sub-section is shown
  order: number;           // Display order within parent section
}

// Section configuration for per-professional Digital Business Card customization
export interface ProfessionalSectionConfig {
  id: string;                    // e.g., "signature-work-actions", "bio-simple", "current-promotions"
  visible: boolean;              // Whether section is shown (affects BOTH mobile and desktop)
  column: 'left' | 'right' | 'full';  // Which column the section belongs to ('full' spans both columns)
  desktopOrder: number;          // Order in desktop view (within column)
  mobileOrder: number;           // Order in mobile view (independent of desktop)
  // Legacy field - kept for backward compatibility during migration
  order?: number;                // @deprecated - Use desktopOrder/mobileOrder instead
  props?: Record<string, any>;   // Optional override props for the section
  subSections?: SubSectionConfig[]; // Sub-section configuration for composite sections
}

// Re-export CondensedCardConfig for convenience
export type { CondensedCardConfig };

// Professional interface for comprehensive professional data management
export interface Professional {
  professional_title: any;
  id: string;

  // Ownership & Access Control
  ownerId?: string; // Firebase UID of the user who owns/manages this profile

  // Basic Information
  name: string;
  title: string; // This serves as "occupation"
  specialty: string; // Keep for backward compatibility
  location: string; // Keep for backward compatibility
  instagram?: string; // Keep for backward compatibility
  isFounder?: boolean;
  hasDigitalCard?: boolean; // Controls whether digital card is accessible
  modalType?: string; // For modal type filtering
  cardUrl?: string; // Custom URL slug for the digital card (e.g., "betty-smith")
  customHandle?: string; // Custom handle for the professional's URL (e.g., "betty-smith" for glamlink.net/betty-smith)

  // Default Condensed Card Image
  defaultCondensedCardImage?: string; // Firebase Storage URL for pre-saved condensed card image

  // Digital Business Card Section Configuration
  sectionsConfig?: ProfessionalSectionConfig[]; // Per-professional section order and visibility

  // Condensed Card Configuration
  condensedCardConfig?: CondensedCardConfig; // Custom layout for condensed card image export

  // Business Information
  business_name?: string; // New field for business name

  // Enhanced Fields
  specialties?: string[]; // Array of specialties
  gallery?: GalleryItem[]; // Mixed media gallery
  locationData?: LocationData; // Structured location data (single location - backward compatibility)
  locations?: LocationData[]; // Multiple business locations (up to 30)
  promotions?: Promotion[]; // Promotional offers
  enhancedSocialLinks?: EnhancedSocialLink[]; // Updated to array format
  businessHours?: string[]; // Operating hours as array of strings
  importantInfo?: string[]; // Important information items for digital card
  isSavable?: boolean;
  isSaved?: boolean;
  featuredMediaIndex?: number;
  tags?: string[];
  seoKeywords?: string[];
  metaDescription?: string;

  // Contact Information
  email?: string;
  phone?: string;
  website?: string;
  tiktok?: string;

  // Professional Details
  certificationLevel: "Bronze" | "Silver" | "Gold" | "Platinum";
  yearsExperience: number;
  bio?: string;
  description?: string;

  // Media
  profileImage?: string;
  portraitImage?: string;
  image?: string; // Alias for profileImage
  galleryImages?: string[];

  // Services & Treatments
  services?: ProfessionalService[];

  // Business Information
  salonName?: string;
  salonAddress?: string;
  pricing?: ProfessionalPricing;

  // Social Media
  socialLinks?: SocialLinks;

  // Availability
  availableDays?: string[];
  bookingUrl?: string;
  preferredBookingMethod?: 'send-text' | 'instagram' | 'booking-link';

  // Metadata
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  order?: number | null;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfessionalService {
  id: string;
  name: string;
  description: string;
  duration: string;
  price?: number;
  category: string;
  icon?: string;
  // Enhanced properties for SpecialitiesDisplay component
  certificationLevel?: string;
  priceUnit?: string; // "flat", "hourly", "consultation", etc.
  tags?: string[];
}

export interface ProfessionalPricing {
  consultation?: number;
  standard?: number;
  premium?: number;
  currency?: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
}

// Admin interface for form handling
export interface ProfessionalFormData extends Omit<Professional, 'id' | 'createdAt' | 'updatedAt'> {}

// API Response types
export interface ProfessionalsApiResponse {
  success: boolean;
  data?: Professional[];
  error?: string;
}

export interface ProfessionalApiResponse {
  success: boolean;
  data?: Professional;
  error?: string;
}

// Props interfaces
export interface ProfessionalCardProps {
  professional: Professional;
  onClick?: () => void;
  featured?: boolean;
  showFullDetails?: boolean;
}

export interface ProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Professional | null;
}

// Filter and search types
export interface ProfessionalFilters {
  specialty?: string;
  location?: string;
  certificationLevel?: string;
  featured?: boolean;
  searchQuery?: string;
}

export type SortField = 'name' | 'location' | 'specialty' | 'yearsExperience' | 'rating';
export type SortDirection = 'asc' | 'desc';

// Founding pro interface (simplified version for founding pros display)
export interface FoundingPro {
  id: string;
  name: string;
  title?: string;
  specialty?: string;
  location?: string;
  profileImage?: string;
  image?: string;
  instagram?: string;
  bio?: string;
  featured?: boolean;
  isFounder?: boolean;
  rating?: number;
}

// Enhanced Field Type Definitions

export interface GalleryItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
  caption?: string;
  duration?: string; // For videos (e.g., "2:30")
  size?: number; // File size in bytes
  uploadedAt?: string;
  // Enhanced properties for VideoDisplay component
  src?: string; // Alias for url (for VideoDisplay compatibility)
  title?: string; // Video/image title for display
  tags?: string[]; // Tags for categorization
}

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
  description?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  googleMapsUrl?: string;
  businessName?: string;
  phone?: string;
  email?: string;
  hours?: string | string[];  // Array of business hours (e.g., ["Mon-Fri: 9am-5pm", "Sat: 10am-2pm"]) - also accepts legacy string format

  // Multi-location support fields
  id?: string;           // Unique identifier for each location
  isPrimary?: boolean;   // Marks the primary/default location
  label?: string;        // Display label (e.g., "Main Office", "Downtown Studio")

  // Location type for address input mode
  locationType?: 'exact' | 'city';  // 'exact' = full address, 'city' = city/state only
}

export interface Promotion {
  id: string;
  title: string;
  description?: string; // Legacy description field (kept for backward compatibility)
  html?: string; // Primary HTML content field
  value?: string; // Simple display text like "20% Off" or "$50 Value"
  promoCode?: string; // Renamed from 'code' for clarity
  startDate?: string; // Renamed from 'validFrom' for clarity
  endDate?: string; // Renamed from 'validUntil' for clarity

  // Enhanced properties for PromoItem component
  validFrom?: string; // ISO date string for validity start
  validUntil?: string; // ISO date string for validity end
  status?: "active" | "upcoming" | "expired";
  originalPrice?: number;
  discountPrice?: number;
  priceUnit?: string; // "flat", "hourly", "consultation", etc.
  isSpecialOffer?: boolean;
  isLimitedTime?: boolean;
  isExclusive?: boolean;
  bookingUrl?: string;
  detailsUrl?: string;
  tags?: string[];
  category?: string;
  conditions?: string;
  usageLimit?: string;
  image?: string;
  rating?: number;

  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
}

export interface EnhancedSocialLink {
  platform: string; // Free text, no restrictions
  url: string;      // Direct URL
  handle?: string;   // Optional username/handle
}

// Legacy interface for backward compatibility
export interface EnhancedSocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
  pinterest?: string;
  snapchat?: string;
}

export interface EnhancedProfessionalService extends ProfessionalService {
  category: string;
  isPopular: boolean;
  duration: string;
  priceRange?: string;
  description: string;
  image?: string;
  isFeatured: boolean;
}