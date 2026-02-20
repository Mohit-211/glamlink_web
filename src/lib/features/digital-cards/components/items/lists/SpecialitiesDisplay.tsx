"use client";

import { useState } from "react";
import { Clock, DollarSign, Star, CheckCircle, Award, Tag } from "lucide-react";
import { ProfessionalService } from "@/lib/pages/for-professionals/types/professional";

interface SpecialitiesDisplayProps {
  services?: ProfessionalService[];
  className?: string;
  showPricing?: boolean;
  showDuration?: boolean;
  showDescription?: boolean;
  category?: string;
  layout?: "grid" | "list";
  maxItems?: number;
}

export default function SpecialitiesDisplay({
  services = [],
  className = "",
  showPricing = true,
  showDuration = true,
  showDescription = true,
  category,
  layout = "grid",
  maxItems,
}: SpecialitiesDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null);

  // Filter services by category if specified
  const filteredServices = selectedCategory
    ? services.filter(service => service.category === selectedCategory)
    : services;

  // Limit displayed items if maxItems is specified
  const displayServices = maxItems ? filteredServices.slice(0, maxItems) : filteredServices;

  // Get unique categories
  const categories = [...new Set(services.map(service => service.category).filter(Boolean))];

  // Get icon for service category
  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "hair":
        return "✂️";
      case "makeup":
        return "💄";
      case "skincare":
        return "🧴";
      case "nails":
        return "💅";
      case "massage":
        return "💆";
      case "wellness":
        return "🌿";
      case "fitness":
        return "💪";
      case "cosmetic":
        return "⭐";
      default:
        return "💎";
    }
  };

  // Format price display
  const formatPrice = (price?: number, priceUnit?: string) => {
    if (!price && !priceUnit) return null;

    if (priceUnit === "consultation") {
      return "Consultation";
    }

    if (priceUnit === "starting-at") {
      return `Starting at $${price}`;
    }

    if (price) {
      return `$${price}`;
    }

    return priceUnit || "Price varies";
  };

  // Get certification level badge
  const getCertificationBadge = (certificationLevel?: string) => {
    switch (certificationLevel?.toLowerCase()) {
      case "expert":
      case "master":
        return (
          <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            <Award className="w-3 h-3 mr-1" />
            {certificationLevel}
          </span>
        );
      case "advanced":
        return (
          <span className="inline-flex items-center px-2 py-1 bg-glamlink-teal bg-opacity-10 text-glamlink-teal-dark text-xs rounded-full">
            <Star className="w-3 h-3 mr-1" />
            {certificationLevel}
          </span>
        );
      case "certified":
        return (
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            <CheckCircle className="w-3 h-3 mr-1" />
            {certificationLevel}
          </span>
        );
      default:
        return null;
    }
  };

  // Render single service item
  const renderServiceItem = (service: ProfessionalService) => (
    <div
      key={service.id}
      className={`bg-white border border-gray-200 rounded-lg p-4 hover:border-glamlink-teal transition-colors ${
        layout === "list" ? "flex items-start gap-4" : ""
      }`}
    >
      {/* Service Icon */}
      <div className={`flex-shrink-0 ${layout === "list" ? "mt-1" : "mb-3"}`}>
        <div className="w-12 h-12 bg-glamlink-teal bg-opacity-10 rounded-lg flex items-center justify-center text-2xl">
          {getCategoryIcon(service.category)}
        </div>
      </div>

      {/* Service Details */}
      <div className={`flex-1 ${layout === "grid" ? "text-center" : ""}`}>
        <div className="flex items-start justify-between mb-2">
          <div className={`flex-1 ${layout === "grid" ? "text-center" : ""}`}>
            <h3 className="font-semibold text-gray-900 mb-1">
              {service.name}
            </h3>
            {service.category && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-2">
                <Tag className="w-3 h-3 mr-1" />
                {service.category}
              </span>
            )}
          </div>

          {/* Certification Badge */}
          {service.certificationLevel && (
            <div className={`ml-2 ${layout === "grid" ? "mt-2" : ""}`}>
              {getCertificationBadge(service.certificationLevel)}
            </div>
          )}
        </div>

        {/* Description */}
        {showDescription && service.description && (
          <p className={`text-sm text-gray-600 mb-3 ${layout === "grid" ? "text-center" : ""}`}>
            {service.description.length > 120 && layout === "grid"
              ? `${service.description.substring(0, 120)}...`
              : service.description}
          </p>
        )}

        {/* Meta Information */}
        <div className={`flex items-center justify-between text-sm ${layout === "grid" ? "flex-col gap-2" : "gap-4"}`}>
          {/* Price */}
          {showPricing && (
            <div className="flex items-center text-gray-900 font-medium">
              <DollarSign className="w-4 h-4 mr-1 text-glamlink-teal" />
              {formatPrice(service.price, service.priceUnit)}
            </div>
          )}

          {/* Duration */}
          {showDuration && service.duration && (
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-1 text-glamlink-teal" />
              {service.duration}
            </div>
          )}
        </div>

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className={`mt-3 flex flex-wrap gap-1 ${layout === "grid" ? "justify-center" : ""}`}>
            {service.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-glamlink-teal bg-opacity-10 text-glamlink-teal-dark text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {service.tags.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                +{service.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // No services state
  if (services.length === 0) {
    return (
      <div className={`specialities-display ${className}`}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services listed</h3>
          <p className="text-gray-600">
            This professional hasn't added their services yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`specialities-display ${className}`}>
      {/* Category Filter */}
      {categories.length > 1 && !category && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? "bg-glamlink-teal text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Services
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-glamlink-teal text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {getCategoryIcon(cat)} {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Services Grid/List */}
      <div className={
        layout === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-4"
      }>
        {displayServices.map((service) => renderServiceItem(service))}
      </div>

      {/* Show More indicator */}
      {maxItems && filteredServices.length > maxItems && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Showing {displayServices.length} of {filteredServices.length} services
          </p>
        </div>
      )}

      {/* Category Filter Info */}
      {selectedCategory && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-sm text-glamlink-teal hover:text-glamlink-teal-dark underline"
          >
            Clear filter - Show all services
          </button>
        </div>
      )}
    </div>
  );
}