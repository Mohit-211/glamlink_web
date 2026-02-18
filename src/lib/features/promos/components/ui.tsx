"use client";

import { PromoItem, PROMOS_GRID_CONFIG } from '@/lib/features/promos/config';
import {
  isPromoActive,
  isPromoExpired,
  getDaysRemaining,
  formatPromoDate,
  formatPromoDateRange,
} from '../utils/promoHelpers';

// Loading Spinner Component
export const LoadingSpinner = ({ size = "md", message = "Loading promos..." }: {
  size?: "sm" | "md" | "lg";
  message?: string;
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-glamlink-purple`}></div>
      <p className="mt-4 text-gray-600 text-sm">{message}</p>
    </div>
  );
};

// Error Message Component
export const ErrorMessage = ({ message, onRetry }: {
  message: string;
  onRetry?: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-red-500 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-gray-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-glamlink-purple text-white rounded-lg hover:bg-glamlink-purple/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

// Empty State Component
export const EmptyState = ({
  title = "No Promos Available",
  message = "Check back later for exciting promotions and offers!",
  actionButton
}: {
  title?: string;
  message?: string;
  actionButton?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-gray-400 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {actionButton}
    </div>
  );
};

// Get status badge styling
export const getPromoStatusBadge = (promo: PromoItem): {
  text: string;
  className: string;
} => {
  // Use modalStatusBadge if defined and not null, otherwise calculate default
  if (promo.modalStatusBadge && promo.modalStatusBadge !== null) {
    return {
      text: promo.modalStatusBadge,
      className: "px-2 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full"
    };
  }

  const isActive = isPromoActive(promo);
  const isExpired = isPromoExpired(promo);
  const daysRemaining = getDaysRemaining(promo);

  if (isExpired) {
    return {
      text: "Expired",
      className: "px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full"
    };
  }

  if (!isActive) {
    return {
      text: "Upcoming",
      className: "px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full"
    };
  }

  if (daysRemaining <= 3) {
    return {
      text: daysRemaining === 1 ? "Ends Today!" : `${daysRemaining} Days Left`,
      className: "px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full"
    };
  }

  if (daysRemaining <= 30) {
    return {
      text: `${daysRemaining} Days Left`,
      className: "px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-600 rounded-full"
    };
  }

  return {
    text: "Active",
    className: "px-2 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full"
  };
};

// Get modal status badge styling (always calculated, never uses modalStatusBadge)
export const getModalStatusBadge = (promo: PromoItem): {
  text: string;
  className: string;
} => {
  const isActive = isPromoActive(promo);
  const isExpired = isPromoExpired(promo);
  const daysRemaining = getDaysRemaining(promo);

  if (isExpired) {
    return {
      text: "Expired",
      className: "px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full"
    };
  }

  if (!isActive) {
    return {
      text: "Upcoming",
      className: "px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full"
    };
  }

  if (daysRemaining <= 3) {
    return {
      text: daysRemaining === 1 ? "Ends Today!" : `${daysRemaining} Days Left`,
      className: "px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full"
    };
  }

  if (daysRemaining <= 30) {
    return {
      text: `${daysRemaining} Days Left`,
      className: "px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-600 rounded-full"
    };
  }

  return {
    text: "Active",
    className: "px-2 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full"
  };
};

// Get discount badge styling
export const getDiscountBadge = (discount?: string | number | null): {
  text: string;
  className: string;
} | null => {
  if (!discount || discount === null) {
    return null;
  }

  // Handle numeric discounts (percentage)
  if (typeof discount === 'number') {
    if (discount <= 0) {
      return null;
    }
    return {
      text: `${discount}% OFF`,
      className: "absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg shadow-lg z-10"
    };
  }

  // Handle text discounts
  if (typeof discount === 'string') {
    const trimmedDiscount = discount.trim();
    if (!trimmedDiscount) {
      return null;
    }
    return {
      text: trimmedDiscount.toUpperCase(),
      className: "absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg shadow-lg z-10"
    };
  }

  return null;
};

// Get category badge styling
export const getCategoryBadge = (promo: PromoItem): {
  text: string;
  className: string;
} => {
  // Use modalCategoryBadge if defined and not null, otherwise use regular category
  if (promo.modalCategoryBadge && promo.modalCategoryBadge !== null) {
    return {
      text: promo.modalCategoryBadge,
      className: "px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
    };
  }

  const category = promo.category;

  if (!category) {
    return {
      text: "General",
      className: "px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
    };
  }

  const categoryColors: Record<string, string> = {
    "Skincare": "bg-pink-100 text-pink-700",
    "Makeup": "bg-purple-100 text-purple-700",
    "Hair Care": "bg-yellow-100 text-yellow-700",
    "Beauty Tools": "bg-blue-100 text-blue-700",
    "Wellness": "bg-green-100 text-green-700",
    "Fragrance": "bg-indigo-100 text-indigo-700",
    "Body Care": "bg-orange-100 text-orange-700",
    "All": "bg-gray-100 text-gray-700"
  };

  return {
    text: category,
    className: `px-2 py-1 text-xs font-medium rounded ${categoryColors[category] || "bg-gray-100 text-gray-700"}`
  };
};

// Get featured badge styling
export const getFeaturedBadge = (): {
  text: string;
  className: string;
} => {
  return {
    text: "Featured",
    className: "absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-glamlink-purple to-glamlink-teal text-white text-xs font-bold rounded-lg shadow-lg z-10"
  };
};

// Get card hover styles
export const getCardHoverStyles = (isActive: boolean): string => {
  const baseStyles = "transition-all duration-300 transform hover:scale-105 hover:shadow-xl";

  if (!isActive) {
    return `${baseStyles} opacity-75 hover:opacity-90`;
  }

  return baseStyles;
};

// Get CTA button styling
export const getCTAButtonStyles = (isActive: boolean, isExpired: boolean): string => {
  const baseStyles = "lg-custom:block px-6 py-2.5 text-sm-custom font-medium text-white bg-glamlink-teal rounded-full hover:bg-glamlink-teal-dark transition-colors duration-200 ml-auto";

  if (isExpired) {
    return `${baseStyles} bg-gray-200 text-gray-500 cursor-not-allowed`;
  }

  if (!isActive) {
    return `${baseStyles} bg-blue-100 text-blue-700 hover:bg-blue-200`;
  }

  return baseStyles;
};

// Get grid container classes
export const getGridContainerClasses = (): string => {
  return `
    grid grid-cols-1 gap-6
    md:grid-cols-2 md:gap-4
    lg:grid-cols-3 lg:gap-6
    xl:grid-cols-4 xl:gap-6
  `;
};

// Get responsive image classes
export const getResponsiveImageClasses = (): string => {
  return "w-full h-48 object-cover rounded-t-lg";
};

// Get countdown timer styling
export const getCountdownStyles = (daysRemaining: number): string => {
  if (daysRemaining <= 1) {
    return "text-red-600 font-bold animate-pulse";
  }
  if (daysRemaining <= 3) {
    return "text-orange-600 font-semibold";
  }
  if (daysRemaining <= 7) {
    return "text-yellow-600 font-medium";
  }
  return "text-green-600";
};


// Get component states for different views
export const getComponentStates = (promos: PromoItem[]) => {
  const activePromos = promos.filter(isPromoActive);
  const featuredPromos = promos.filter(p => p.featured && isPromoActive(p));
  const expiredPromos = promos.filter(isPromoExpired);
  const upcomingPromos = promos.filter(p => !isPromoActive(p) && !isPromoExpired(p));

  return {
    all: promos,
    active: activePromos,
    featured: featuredPromos,
    expired: expiredPromos,
    upcoming: upcomingPromos,
    hasData: promos.length > 0,
    hasActive: activePromos.length > 0,
    hasFeatured: featuredPromos.length > 0
  };
};

// Animation utilities
export const getAnimationDelay = (index: number): string => {
  return `animation-delay: ${index * 100}ms`;
};

export const getFadeInAnimation = (): string => {
  return "animate-fade-in";
};

// Card background gradient based on category
export const getCardBackgroundGradient = (category?: string): string => {
  const gradients: Record<string, string> = {
    "Skincare": "from-pink-50 to-purple-50",
    "Makeup": "from-purple-50 to-pink-50",
    "Hair Care": "from-yellow-50 to-orange-50",
    "Beauty Tools": "from-blue-50 to-indigo-50",
    "Wellness": "from-green-50 to-teal-50",
    "Fragrance": "from-indigo-50 to-purple-50",
    "Body Care": "from-orange-50 to-red-50"
  };

  return gradients[category || "All"] || "from-gray-50 to-gray-100";
};

// Export all utilities
export const uiUtils = {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  getPromoStatusBadge,
  getDiscountBadge,
  getCategoryBadge,
  getFeaturedBadge,
  getCardHoverStyles,
  getCTAButtonStyles,
  getGridContainerClasses,
  getResponsiveImageClasses,
  getCountdownStyles,
  formatPromoDateRange,
  formatPromoDate,
  getComponentStates,
  getAnimationDelay,
  getFadeInAnimation,
  getCardBackgroundGradient
};