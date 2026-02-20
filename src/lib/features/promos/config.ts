// Promos Page Configuration and Type Definitions

// Redux State Interface
export interface PromosStateInterface {
  promos: PromoItem[];
  featuredPromos: PromoItem[];
  isLoading: boolean;
  error: string | null;
}

// Custom Modal Configuration
export interface CustomModalConfig {
  id: string;
  name: string;
  description: string;
  component?: string; // Component import path for reference
}

// Promo Data Interface
export interface PromoItem {
  id: string;
  title: string;
  subtitle?: string | null;
  descriptionShort?: string | null;
  description: string;
  modalContentHeader?: string | null;
  image: string;
  link: string;
  ctaText: string;
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  popupDisplay: string; // Name for popup display
  visible: boolean;
  featured: boolean;
  category?: string | null;
  discount?: string | number | null;
  modalStatusBadge?: string | null;
  modalCategoryBadge?: string | null;
  modalType?: 'standard' | 'custom'; // Modal type selection
  customModalId?: string; // Reference to custom modal component
  priority?: number; // Higher number = higher priority
  createdAt?: string;
  updatedAt?: string;
}

// Component State Interfaces
export interface PromoCardState {
  promo: PromoItem;
  isActive: boolean;
  isExpired: boolean;
  daysRemaining: number;
}

export interface PromoModalState {
  isOpen: boolean;
  promo: PromoItem | null;
}

// Component Props Types
export type PromosPageProps = {
  state: PromosPageStateInterface;
  handlers?: PromosPageHandlersType;
};

export interface PromosPageStateInterface {
  promos: PromoItem[];
  featuredPromos: PromoItem[];
  isLoading: boolean;
  error: string | null;
  selectedPromo: PromoItem | null;
  isModalOpen: boolean;
}

export interface PromosPageHandlersType {
  onPromoClick?: (promo: PromoItem) => void;
  onModalClose?: () => void;
  onCtaClick?: (promo: PromoItem) => void;
}

export type PromoCardProps = {
  state: PromoCardStateInterface;
  handlers?: PromoCardHandlersType;
};

export interface PromoCardStateInterface {
  promo: PromoItem;
  isActive: boolean;
  isExpired: boolean;
  daysRemaining: number;
  isFeatured: boolean;
}

export interface PromoCardHandlersType {
  onCardClick?: (promo: PromoItem) => void;
  onCtaClick?: (promo: PromoItem, e: React.MouseEvent) => void;
}

export type PromoModalProps = {
  state: PromoModalStateInterface;
  handlers?: PromoModalHandlersType;
  isDownloadModalOpen?: boolean;
  closeDownloadModal?: () => void;
};

export interface PromoModalStateInterface {
  isOpen: boolean;
  promo: PromoItem | null;
}

export interface PromoModalHandlersType {
  onClose?: () => void;
  onCtaClick?: () => void;
  onOpenDownloadModal?: () => void;
}

// API Response Types
export interface PromosApiResponse {
  success: boolean;
  data?: {
    promos: PromoItem[];
    featuredPromos: PromoItem[];
  };
  error?: string;
}

export interface PromoApiResponse {
  success: boolean;
  data?: PromoItem;
  error?: string;
}

// Constants
export const PROMOS_API_ENDPOINT = "/api/promos";
export const PROMOS_COLLECTION = "promos";

// Default values
export const DEFAULT_PROMO_IMAGE = "/images/placeholder.png";
export const DEFAULT_CTA_TEXT = "Learn More";
export const DEFAULT_POPUP_DISPLAY = "Special Offer";

// Promo Categories
export const PROMO_CATEGORIES = [
  "All",
  "Skincare",
  "Makeup",
  "Hair Care",
  "Beauty Tools",
  "Wellness",
  "Fragrance",
  "Body Care"
] as const;

export type PromoCategory = typeof PROMO_CATEGORIES[number];

// Helper functions
export const isPromoActive = (promo: PromoItem): boolean => {
  const now = new Date();
  const startDate = new Date(promo.startDate);
  const endDate = new Date(promo.endDate);
  return now >= startDate && now <= endDate;
};

export const isPromoExpired = (promo: PromoItem): boolean => {
  const now = new Date();
  const endDate = new Date(promo.endDate);
  return now > endDate;
};

export const getDaysRemaining = (promo: PromoItem): number => {
  const now = new Date();
  const endDate = new Date(promo.endDate);
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export const formatPromoDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatPromoDateRange = (startDate: string, endDate: string): string => {
  const start = formatPromoDate(startDate);
  const end = formatPromoDate(endDate);
  return `${start} - ${end}`;
};


// Grid configuration
export const PROMOS_GRID_CONFIG = {
  desktop: { cols: 3, gap: 6 },
  tablet: { cols: 2, gap: 4 },
  mobile: { cols: 1, gap: 4 }
} as const;

// Animation constants
export const ANIMATION_DURATION = 0.3;
export const ANIMATION_DELAY = 0.1;