"use client";

import { useState } from "react";
import { Calendar, Clock, Tag, Gift, Star, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { Promotion } from "@/lib/pages/for-professionals/types/professional";

interface PromoItemProps {
  promotion: Promotion;
  className?: string;
  showDescription?: boolean;
  showTags?: boolean;
  compact?: boolean;
  onBookingClick?: () => void;
}

export default function PromoItem({
  promotion,
  className = "",
  showDescription = true,
  showTags = true,
  compact = false,
  onBookingClick,
}: PromoItemProps) {
  const [imageError, setImageError] = useState(false);

  // Check if promotion is expired
  const isExpired = promotion.validUntil ? new Date(promotion.validUntil) < new Date() : false;

  // Check if promotion is active
  const isActive = promotion.status === "active" && !isExpired;

  // Calculate discount percentage
  const discountPercentage = promotion.originalPrice && promotion.discountPrice
    ? Math.round(((promotion.originalPrice - promotion.discountPrice) / promotion.originalPrice) * 100)
    : 0;

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get status badge
  const getStatusBadge = () => {
    if (isExpired) {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
          <AlertCircle className="w-3 h-3 mr-1" />
          Expired
        </span>
      );
    }

    if (promotion.status === "active") {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    }

    if (promotion.status === "upcoming") {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
          <Clock className="w-3 h-3 mr-1" />
          Upcoming
        </span>
      );
    }

    return null;
  };

  // Get promotional badge
  const getPromotionalBadge = () => {
    if (promotion.isSpecialOffer) {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-glamlink-teal bg-opacity-10 text-glamlink-teal-dark text-xs rounded-full font-medium">
          <Gift className="w-3 h-3 mr-1" />
          Special Offer
        </span>
      );
    }

    if (promotion.isLimitedTime) {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
          <Clock className="w-3 h-3 mr-1" />
          Limited Time
        </span>
      );
    }

    if (promotion.isExclusive) {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
          <Star className="w-3 h-3 mr-1" />
          Exclusive
        </span>
      );
    }

    return null;
  };

  // Handle booking click
  const handleBookingClick = () => {
    if (onBookingClick) {
      onBookingClick();
    } else if (promotion.bookingUrl) {
      window.open(promotion.bookingUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Compact layout
  if (compact) {
    return (
      <div className={`promo-item-compact bg-white border border-gray-200 rounded-lg p-4 hover:border-glamlink-teal transition-colors ${className} ${!isActive ? 'opacity-75' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{promotion.title}</h3>
              {getStatusBadge()}
            </div>

            {showDescription && promotion.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {promotion.description}
              </p>
            )}

            {/* Price and Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getPromotionalBadge()}
                {promotion.discountPrice && (
                  <span className="font-bold text-glamlink-teal text-lg">
                    ${promotion.discountPrice}
                  </span>
                )}
                {promotion.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${promotion.originalPrice}
                  </span>
                )}
              </div>

              {isActive && promotion.bookingUrl && (
                <button
                  onClick={handleBookingClick}
                  className="btn-primary btn-sm"
                >
                  Book Now
                </button>
              )}
            </div>

            {/* Validity */}
            {promotion.validUntil && (
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                Valid until {formatDate(promotion.validUntil)}
                {isExpired && <span className="text-red-500 ml-1">(Expired)</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full layout
  return (
    <div className={`promo-item bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-glamlink-teal transition-all hover:shadow-lg ${className} ${!isActive ? 'opacity-75' : ''}`}>
      {/* Header with Image or Background */}
      <div className="relative">
        {promotion.image && !imageError ? (
          <div className="h-48 bg-gray-100">
            <img
              src={promotion.image}
              alt={promotion.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            {/* Overlay with discount */}
            {discountPercentage > 0 && (
              <div className="absolute top-3 right-3 bg-glamlink-teal text-white px-3 py-1 rounded-full font-bold text-sm">
                {discountPercentage}% OFF
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-glamlink-teal to-glamlink-purple flex items-center justify-center">
            <div className="text-center text-white p-4">
              <Gift className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-xl font-bold">{promotion.title}</h3>
              {discountPercentage > 0 && (
                <div className="mt-2 bg-white text-glamlink-teal px-3 py-1 rounded-full font-bold text-sm inline-block">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {getStatusBadge()}
          {getPromotionalBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Description */}
        {showDescription && promotion.description && (
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            {promotion.description}
          </p>
        )}

        {/* Price Display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {promotion.discountPrice && (
              <div>
                <span className="text-2xl font-bold text-glamlink-teal">
                  ${promotion.discountPrice}
                </span>
                {promotion.priceUnit && promotion.priceUnit !== "flat" && (
                  <span className="text-sm text-gray-500">/{promotion.priceUnit}</span>
                )}
              </div>
            )}
            {promotion.originalPrice && (
              <div className="flex flex-col">
                <span className="text-lg text-gray-500 line-through">
                  ${promotion.originalPrice}
                </span>
                {discountPercentage > 0 && promotion.originalPrice && promotion.discountPrice ? (
                  <span className="text-xs text-green-600 font-medium">
                    Save ${promotion.originalPrice - promotion.discountPrice}
                  </span>
                ) : null}
              </div>
            )}
            {!promotion.discountPrice && !promotion.originalPrice && promotion.priceUnit && (
              <span className="text-lg font-medium text-gray-900">
                {promotion.priceUnit}
              </span>
            )}
          </div>

          {/* Rating if available */}
          {promotion.rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm text-gray-700">{promotion.rating}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {showTags && promotion.tags && promotion.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {promotion.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Validity Information */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between text-sm">
            {promotion.validFrom && (
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                From {formatDate(promotion.validFrom)}
              </div>
            )}
            {promotion.validUntil && (
              <div className={`flex items-center ${isExpired ? 'text-red-600' : 'text-gray-600'}`}>
                <Calendar className="w-4 h-4 mr-1" />
                Until {formatDate(promotion.validUntil)}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isActive && promotion.bookingUrl && (
            <button
              onClick={handleBookingClick}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              Book Now
              {promotion.bookingUrl.includes('http') && <ExternalLink className="w-4 h-4" />}
            </button>
          )}

          {promotion.detailsUrl && (
            <a
              href={promotion.detailsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2"
            >
              Details
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Additional Information */}
        {promotion.conditions && (
          <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <strong>Conditions:</strong> {promotion.conditions}
          </div>
        )}

        {/* Usage limit if available */}
        {promotion.usageLimit && (
          <div className="mt-2 text-xs text-gray-500">
            <strong>Limit:</strong> {promotion.usageLimit}
          </div>
        )}
      </div>
    </div>
  );
}