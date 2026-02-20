"use client";

/**
 * EmbeddableBusinessCard - Inline version of DigitalBusinessCard for content blocks
 *
 * Fetches professional data from API and renders the business card inline (no modal).
 * Used as a content block in the magazine editor's CustomSectionPreview.
 */

import { useEffect, useState } from "react";
import Image from "next/image";

// =============================================================================
// TYPES
// =============================================================================

interface Professional {
  id: string;
  name: string;
  title?: string;
  specialty?: string;
  location?: string;
  instagram?: string;
  email?: string;
  website?: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  image?: string;
  certificationLevel?: string;
  yearsExperience?: number;
  rating?: number;
  reviewCount?: number;
  isFounder?: boolean;
  services?: Array<{
    id: string;
    name: string;
    description?: string;
    price?: number;
    duration?: string;
  }>;
  promotions?: Array<{
    id: string;
    title: string;
    description?: string;
    discountPrice?: number;
    originalPrice?: number;
    validUntil?: string;
    status?: string;
  }>;
  gallery?: Array<{
    id: string;
    type: "image" | "video";
    url: string;
    thumbnail?: string;
    title?: string;
  }>;
}

interface EmbeddableBusinessCardProps {
  professionalId?: string;
  showVideo?: boolean;
  showPromotions?: boolean;
  showServices?: boolean;
  compact?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function EmbeddableBusinessCard({
  professionalId,
  showVideo = true,
  showPromotions = true,
  showServices = true,
  compact = false,
}: EmbeddableBusinessCardProps) {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch professional data
  useEffect(() => {
    const fetchProfessional = async () => {
      if (!professionalId) {
        setIsLoading(false);
        setError("No professional selected");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // First try to fetch all professionals and find the one we need
        const response = await fetch("/api/professionals", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch professional");
        }

        const data = await response.json();
        const prosList = Array.isArray(data) ? data : data.data || [];
        const foundPro = prosList.find((p: Professional) => p.id === professionalId);

        if (!foundPro) {
          throw new Error("Professional not found");
        }

        setProfessional(foundPro);
      } catch (err) {
        console.error("Error fetching professional:", err);
        setError(err instanceof Error ? err.message : "Failed to load professional");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessional();
  }, [professionalId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !professional) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <div className="text-4xl mb-3">👤</div>
        <p className="text-gray-500 text-sm">{error || "No professional selected"}</p>
        {professionalId && (
          <p className="text-gray-400 text-xs mt-1">ID: {professionalId}</p>
        )}
      </div>
    );
  }

  // Get profile image with fallback
  const profileImage =
    professional.profileImage ||
    professional.image ||
    `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="100" fill="#22B8C8"/>
        <circle cx="100" cy="80" r="30" fill="white"/>
        <ellipse cx="100" cy="150" rx="50" ry="30" fill="white"/>
      </svg>
    `)}`;

  // Get video from gallery
  const videoItem = professional.gallery?.find((item) => item.type === "video");

  // Get active promotions
  const activePromotions = professional.promotions?.filter(
    (promo) => promo.status === "active" || !promo.status
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header Section */}
      <div className={`p-4 ${compact ? "" : "md:p-6"}`}>
        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <div
            className={`relative flex-shrink-0 rounded-full border-2 border-glamlink-teal overflow-hidden ${
              compact ? "w-16 h-16" : "w-20 h-20 md:w-24 md:h-24"
            }`}
          >
            <Image
              src={profileImage}
              alt={professional.name}
              fill
              className="object-cover"
              sizes={compact ? "64px" : "(max-width: 768px) 80px, 96px"}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3
              className={`font-bold text-gray-900 truncate ${
                compact ? "text-lg" : "text-xl md:text-2xl"
              }`}
            >
              {professional.name}
            </h3>
            {professional.title && (
              <p
                className={`text-gray-600 truncate ${
                  compact ? "text-sm" : "text-base"
                }`}
              >
                {professional.title}
              </p>
            )}
            {professional.specialty && (
              <p className="text-sm text-glamlink-teal truncate">
                {professional.specialty}
              </p>
            )}
            {professional.location && (
              <p className="text-sm text-gray-500 truncate">
                📍 {professional.location}
              </p>
            )}

            {/* Rating */}
            {professional.rating && professional.rating > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-gray-700">
                  {professional.rating.toFixed(1)}
                </span>
                {professional.reviewCount && (
                  <span className="text-xs text-gray-500">
                    ({professional.reviewCount} reviews)
                  </span>
                )}
              </div>
            )}

            {/* Founder Badge */}
            {professional.isFounder && (
              <span className="inline-block mt-2 px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-medium rounded-full">
                ✨ Founding Pro
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Video Section */}
      {showVideo && videoItem && !compact && (
        <div className="border-t border-gray-100">
          <div className="p-4">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm">
              Signature Work
            </h4>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video
                src={videoItem.url}
                poster={videoItem.thumbnail}
                controls
                className="w-full h-full object-cover"
              />
            </div>
            {videoItem.title && (
              <p className="text-sm text-gray-600 mt-2">{videoItem.title}</p>
            )}
          </div>
        </div>
      )}

      {/* Bio Section */}
      {professional.bio && !compact && (
        <div className="border-t border-gray-100 p-4">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">About</h4>
          <p className="text-sm text-gray-600 line-clamp-3">{professional.bio}</p>
        </div>
      )}

      {/* Services Section */}
      {showServices && professional.services && professional.services.length > 0 && !compact && (
        <div className="border-t border-gray-100 p-4">
          <h4 className="font-semibold text-gray-800 mb-3 text-sm">Services</h4>
          <div className="space-y-2">
            {professional.services.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-2"
              >
                <span className="text-sm text-gray-700">{service.name}</span>
                {service.price && (
                  <span className="text-sm font-medium text-glamlink-teal">
                    ${service.price}
                  </span>
                )}
              </div>
            ))}
            {professional.services.length > 3 && (
              <p className="text-xs text-gray-500 text-center">
                +{professional.services.length - 3} more services
              </p>
            )}
          </div>
        </div>
      )}

      {/* Promotions Section */}
      {showPromotions && activePromotions && activePromotions.length > 0 && !compact && (
        <div className="border-t border-gray-100 p-4">
          <h4 className="font-semibold text-gray-800 mb-3 text-sm">
            Current Promotions
          </h4>
          <div className="space-y-2">
            {activePromotions.slice(0, 2).map((promo) => (
              <div
                key={promo.id}
                className="bg-gradient-to-r from-glamlink-teal/10 to-glamlink-teal/5 rounded-lg p-3"
              >
                <p className="font-medium text-gray-800 text-sm">{promo.title}</p>
                {promo.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {promo.description}
                  </p>
                )}
                {promo.discountPrice && promo.originalPrice && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-bold text-glamlink-teal">
                      ${promo.discountPrice}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ${promo.originalPrice}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Section */}
      <div className="border-t border-gray-100 bg-gray-50 p-3">
        <div className="flex items-center justify-center gap-4 text-sm">
          {professional.website && (
            <a
              href={professional.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-glamlink-teal hover:underline"
            >
              Website
            </a>
          )}
          {professional.instagram && (
            <a
              href={`https://instagram.com/${professional.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-glamlink-teal hover:underline"
            >
              Instagram
            </a>
          )}
          {professional.email && (
            <a
              href={`mailto:${professional.email}`}
              className="text-glamlink-teal hover:underline"
            >
              Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
