"use client";

import { useState } from "react";
import { Filter, Grid3X3, List, Gift, Calendar, Clock, DollarSign, Tag } from "lucide-react";
import { PromoItem } from "../../items/promotions";
import { Professional } from "@/lib/pages/for-professionals/types/professional";

interface CurrentPromotionsProps {
  professional: Professional;
  className?: string;
  maxItems?: number;
  showExpired?: boolean;
}

/**
 * Transform simple promotion data to rich structure expected by PromoItem
 */
const transformPromotionData = (promo: any): any => {
  // Generate unique ID if not present
  const id = promo.id || `promo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Calculate status based on validUntil date and isActive flag
  const calculateStatus = (): "active" | "upcoming" | "expired" => {
    // Handle PromotionField's isActive boolean
    if (promo.isActive === false) return "expired";

    if (!promo.validUntil) return "active";

    const now = new Date();
    const validDate = new Date(promo.validUntil);

    if (validDate < now) return "expired";
    return "active";
  };

  const status = promo.status || calculateStatus();

  // Transform price information
  let discountPrice: number = 0;
  let originalPrice: number = 100;
  let priceUnit: string = "flat";

  if (promo.value) {
    const valueStr = promo.value.toString().toLowerCase();
    if (valueStr === "free") {
      discountPrice = 0;
      originalPrice = 100; // Default original price for free offers
    } else if (typeof promo.value === "string" && promo.value.includes("%")) {
      // Handle percentage discounts like "20% off"
      const percentMatch = promo.value.match(/(\d+)%/);
      if (percentMatch) {
        const discountPercent = parseInt(percentMatch[1]);
        originalPrice = promo.originalPrice ?? 200; // Use provided or default
        discountPrice = originalPrice * (1 - discountPercent / 100);
      }
    } else if (typeof promo.value === "string" && promo.value.includes("$")) {
      // Extract numeric value from price string like "$25" or "Save $50"
      const priceMatch = promo.value.match(/\$(\d+)/);
      if (priceMatch) {
        const priceValue = parseInt(priceMatch[1]);
        if (promo.value.toLowerCase().includes("save") || promo.value.toLowerCase().includes("off")) {
          // This is a discount amount
          discountPrice = priceValue;
          originalPrice = promo.originalPrice || (priceValue * 2); // Default to double the discount
        } else {
          // This is the final price
          discountPrice = priceValue;
          originalPrice = promo.originalPrice || (priceValue * 1.25); // Default to 25% more than final price
        }
      }
    } else if (typeof promo.value === "number") {
      discountPrice = promo.value;
      originalPrice = promo.originalPrice || (promo.value * 1.25);
    }
  } else if (promo.discountPrice !== undefined) {
    // Use provided discount price
    discountPrice = promo.discountPrice;
    originalPrice = promo.originalPrice || (promo.discountPrice * 1.25);
  } else if (promo.originalPrice !== undefined) {
    // Use provided original price and calculate discount
    originalPrice = promo.originalPrice;
    discountPrice = promo.discountPrice ?? (originalPrice * 0.8); // Default 20% off
  }

  // Create title from description or value if title is missing
  const title = promo.title || (
    promo.description
      ? promo.description.split(' ').slice(0, 5).join(' ') + (promo.description.split(' ').length > 5 ? '...' : '')
      : promo.value || "Special Offer"
  );

  // Determine promotional badges based on available data
  const isSpecialOffer = promo.isFeatured || promo.isSpecialOffer || promo.type === 'special' || false;
  const isLimitedTime = !!promo.validUntil || promo.type === 'limited-time';
  const isExclusive = promo.isExclusive || promo.type === 'package' || false;

  // Map category or infer from type
  let category = promo.category;
  if (!category && promo.type) {
    const typeToCategory: Record<string, string> = {
      'discount': 'special-offer',
      'special': 'special-offer',
      'package': 'package',
      'limited-time': 'special-offer'
    };
    category = typeToCategory[promo.type] || 'special-offer';
  }
  category = category || 'special-offer';

  // Create tags from available data
  const finalTags = Array.isArray(promo.tags) ? [...promo.tags] : [];

  // Add value as tag if present and not duplicate
  if (promo.value && typeof promo.value === 'string' && !finalTags.includes(promo.value)) {
    finalTags.push(promo.value);
  }

  // Add type as tag if present and not duplicate
  if (promo.type && !finalTags.includes(promo.type)) {
    finalTags.push(promo.type);
  }

  // Add code as tag if present and not duplicate
  if (promo.code && !finalTags.includes(promo.code)) {
    finalTags.push(promo.code);
  }

  // Add terms as conditions tag
  if (promo.terms && finalTags.length < 5) { // Limit tags to reasonable amount
    finalTags.push(promo.terms.slice(0, 20)); // Truncate long terms
  }

  // Generate sensible defaults for missing fields
  const generateBookingUrl = () => {
    if (promo.bookingUrl) return promo.bookingUrl;
    if (promo.link) return promo.link;
    return `https://glamlink.com/book?promo=${id}`; // Default booking URL
  };

  const generateDetailsUrl = () => {
    if (promo.detailsUrl) return promo.detailsUrl;
    return `https://glamlink.com/promo/${id}`; // Default details URL
  };

  const generateImageUrl = () => {
    if (promo.image) return promo.image;
    // Return a placeholder or default image URL
    return '/images/default-promo.jpg';
  };

  return {
    id,
    title,
    description: promo.description || "Special promotion available",
    originalPrice,
    discountPrice,
    priceUnit: promo.priceUnit || priceUnit,
    status,
    isSpecialOffer,
    isLimitedTime,
    isExclusive,
    validFrom: promo.validFrom || promo.startDate,
    validUntil: promo.validUntil || promo.endDate,
    bookingUrl: generateBookingUrl(),
    detailsUrl: generateDetailsUrl(),
    tags: finalTags.slice(0, 8), // Limit to 8 tags max
    category,
    conditions: promo.conditions || promo.terms || "Standard terms apply",
    usageLimit: promo.usageLimit || "One per customer",
    image: generateImageUrl(),
    rating: promo.rating || (promo.isFeatured ? 4.5 : 4.0) // Default rating
  };
};

export default function CurrentPromotions({
  professional,
  className = "",
  maxItems,
  showExpired = false,
}: CurrentPromotionsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("active");

  // Get promotions from professional data and transform them
  const rawPromotions = professional.promotions || [];
  console.log("CurrentPromotions - Raw promotions data:", rawPromotions);
  console.log("CurrentPromotions - Professional data:", professional);

  const promotions = rawPromotions.map(transformPromotionData);
  console.log("CurrentPromotions - Transformed promotions:", promotions);

  // Mock promotions data if none exists (for development)
  const mockPromotions = [
    {
      id: "promo-1",
      title: "New Client Special - 20% Off First Service",
      description: "Welcome offer for all new clients! Get 20% off your first service with us. Includes any haircut, color treatment, or styling service.",
      originalPrice: 150,
      discountPrice: 120,
      priceUnit: "flat",
      status: "active" as const,
      isSpecialOffer: true,
      isLimitedTime: true,
      isExclusive: false,
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      bookingUrl: "#",
      detailsUrl: "#",
      tags: ["new-client", "discount", "first-visit"],
      category: "special-offer",
      conditions: "Valid for first-time clients only. Cannot be combined with other offers.",
      usageLimit: "One time per client"
    },
    {
      id: "promo-2",
      title: "Balayage & Treatment Package",
      description: "Complete balayage service with deep conditioning treatment and style. Perfect for a complete hair transformation experience.",
      originalPrice: 280,
      discountPrice: 225,
      priceUnit: "flat",
      status: "active" as const,
      isSpecialOffer: false,
      isLimitedTime: true,
      isExclusive: true,
      validFrom: "2024-01-15",
      validUntil: "2024-03-31",
      bookingUrl: "#",
      detailsUrl: "#",
      tags: ["balayage", "package", "treatment"],
      category: "package",
      conditions: "Requires 24-hour cancellation notice. Includes consultation.",
      usageLimit: "Limited to 10 clients per month"
    },
    {
      id: "promo-3",
      title: "Refer a Friend - $25 Credit",
      description: "Refer a friend and both of you receive $25 credit toward your next service. It's our way of saying thank you for spreading the word!",
      originalPrice: 25,
      discountPrice: 0,
      priceUnit: "credit",
      status: "active" as const,
      isSpecialOffer: true,
      isLimitedTime: false,
      isExclusive: false,
      validFrom: "2024-01-01",
      validUntil: "2025-01-01",
      bookingUrl: "#",
      detailsUrl: "#",
      tags: ["referral", "credit", "friend"],
      category: "referral",
      conditions: "Friend must be a new client and mention your name at booking.",
      usageLimit: "Unlimited referrals"
    },
    {
      id: "promo-4",
      title: "Wedding Package Trial",
      description: "Special wedding hair and makeup trial package. Includes consultation, trial run, and wedding day scheduling preference.",
      originalPrice: 200,
      discountPrice: 150,
      priceUnit: "flat",
      status: "upcoming" as const,
      isSpecialOffer: true,
      isLimitedTime: true,
      isExclusive: true,
      validFrom: "2024-02-01",
      validUntil: "2024-06-30",
      bookingUrl: "#",
      detailsUrl: "#",
      tags: ["wedding", "trial", "special-occasion"],
      category: "wedding",
      conditions: "Must book at least 2 weeks in advance. Deposit required.",
      usageLimit: "One per wedding party"
    }
  ];

  const allPromotions = promotions.length > 0 ? promotions : mockPromotions;
  console.log("CurrentPromotions - Using promotions length:", promotions.length);
  console.log("CurrentPromotions - Final allPromotions length:", allPromotions.length);

  // Get unique categories and statuses
  const categories = ["all", ...new Set(allPromotions.map(promo => promo.category).filter(Boolean))];
  const statuses = ["all", "active", "upcoming", "expired"];

  // Filter promotions
  const filteredPromotions = allPromotions.filter(promo => {
    const categoryMatch = selectedCategory === "all" || promo.category === selectedCategory;
    const statusMatch = selectedStatus === "all" || promo.status === selectedStatus;

    // Show expired only if enabled
    const expiredMatch = showExpired || promo.status !== "expired";

    return categoryMatch && statusMatch && expiredMatch;
  });

  // Sort promotions: active first, then by creation date (newest first)
  const sortedPromotions = [...filteredPromotions].sort((a, b) => {
    // Status priority
    const statusPriority = { active: 0, upcoming: 1, expired: 2 };
    const aPriority = statusPriority[a.status as keyof typeof statusPriority] ?? 3;
    const bPriority = statusPriority[b.status as keyof typeof statusPriority] ?? 3;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Date sorting (newer first)
    const aDate = new Date(a.validFrom || a.validUntil || "1970-01-01");
    const bDate = new Date(b.validFrom || b.validUntil || "1970-01-01");
    return bDate.getTime() - aDate.getTime();
  });

  // Limit displayed items if maxItems is specified
  const displayPromotions = maxItems ? sortedPromotions.slice(0, maxItems) : sortedPromotions;

  // Check if any promotions are active
  const hasActivePromotions = sortedPromotions.some(promo => promo.status === "active");

  // Handle booking click
  const handleBookingClick = (promo: any) => {
    console.log(`Booking promotion: ${promo.title}`);
    // Here you would integrate with your booking system
    // For example, navigate to booking page with promotion ID
  };

  // No promotions state
  if (allPromotions.length === 0) {
    return (
      <div className={`current-promotions ${className}`}>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Current Promotions</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {professional.name} doesn't have any active promotions at the moment. Check back soon for special offers!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`current-promotions ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Promotions</h2>
          <p className="text-gray-600">
            Special offers and packages from {professional.name}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-glamlink-teal shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-white text-glamlink-teal shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {(categories.length > 2 || statuses.length > 1) && (
        <div className="mb-6 space-y-4">
          {/* Category Filter */}
          {categories.length > 2 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Category:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-glamlink-teal text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category === "all" ? "All Categories" : (
                    category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Status Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? "bg-glamlink-teal text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "all" ? "All Statuses" : (
                  status.charAt(0).toUpperCase() + status.slice(1)
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Promotions Summary */}
      <div className="mb-6 p-4 bg-glamlink-teal bg-opacity-5 rounded-lg border border-glamlink-teal border-opacity-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-glamlink-teal" />
            <span className="text-sm font-medium text-gray-900">
              {sortedPromotions.length} {sortedPromotions.length === 1 ? "Promotion" : "Promotions"} Available
            </span>
          </div>

          {hasActivePromotions && (
            <span className="text-sm text-glamlink-teal font-medium">
              {sortedPromotions.filter(p => p.status === "active").length} Active Now
            </span>
          )}
        </div>
      </div>

      {/* Promotions Grid/List */}
      <div className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          : "space-y-4"
      }>
        {displayPromotions.map((promotion) => (
          <PromoItem
            key={promotion.id}
            promotion={promotion}
            compact={viewMode === "list"}
            onBookingClick={() => handleBookingClick(promotion)}
          />
        ))}
      </div>

      {/* Load More indicator */}
      {maxItems && sortedPromotions.length > maxItems && (
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 mb-4">
            Showing {displayPromotions.length} of {sortedPromotions.length} promotions
          </p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="btn-secondary"
          >
            View All Promotions
          </button>
        </div>
      )}

      {/* Filter Info */}
      {(selectedCategory !== "all" || selectedStatus !== "all") && (
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedStatus("active");
            }}
            className="text-sm text-glamlink-teal hover:text-glamlink-teal-dark underline"
          >
            Clear filters - Show all promotions
          </button>
        </div>
      )}

      {/* No Results Message */}
      {displayPromotions.length === 0 && allPromotions.length > 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No promotions match your filters</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filter criteria to see more promotions.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedStatus("active");
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Call to Action */}
      {hasActivePromotions && (
        <div className="mt-8 p-6 bg-gradient-to-r from-glamlink-teal to-glamlink-purple rounded-lg text-white text-center">
          <h3 className="text-lg font-semibold mb-2">Ready to Book?</h3>
          <p className="mb-4 text-glamlink-teal-light">
            Take advantage of these special offers before they expire!
          </p>
          <button className="bg-white text-glamlink-teal px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Book Your Appointment
          </button>
        </div>
      )}
    </div>
  );
}