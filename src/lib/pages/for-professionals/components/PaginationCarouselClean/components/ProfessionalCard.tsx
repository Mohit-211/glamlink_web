"use client";

import Image from "next/image";
import { Professional } from "../../../types/professional";
import { Star, MapPin, Instagram, Calendar, CreditCard, Award } from "lucide-react";

interface ProfessionalCardProps {
  professional: Professional;
  onClick?: () => void;
  featured?: boolean;
  className?: string;
}

/**
 * Extract city and state from a full address string or locationData
 * Example: "1770 N Green Valley Pkwy, Henderson, NV 89074, USA" -> "Henderson, NV"
 */
function getShortLocation(professional: Professional): string | null {
  // First, check if locationData has city and state
  if (professional.locationData) {
    const { city, state } = professional.locationData;
    if (city && state) {
      return `${city}, ${state}`;
    }
    if (city) return city;
    if (state) return state;
  }

  // If no locationData, try to parse the location string
  const location = professional.location;
  if (!location) return null;

  // Common US address format: "Street, City, State ZIP, Country"
  // Try to extract city and state from the comma-separated parts
  const parts = location.split(',').map(p => p.trim());

  if (parts.length >= 3) {
    // Assume format: Street, City, State ZIP, Country
    const city = parts[1];
    // State ZIP is usually in format "NV 89074" - extract just the state
    const stateZipPart = parts[2];
    const stateMatch = stateZipPart.match(/^([A-Z]{2})\s*\d*/);
    if (stateMatch) {
      return `${city}, ${stateMatch[1]}`;
    }
    // If no state pattern found, just return the city
    return city;
  } else if (parts.length === 2) {
    // Might be "City, State" already
    return location;
  }

  // If we can't parse it, return the original but truncated if too long
  return location.length > 30 ? location.substring(0, 30) + '...' : location;
}

export default function ProfessionalCard({
  professional,
  onClick,
  featured = false,
  className = ""
}: ProfessionalCardProps) {
  const renderStars = (rating: number = 0) => {
    const hasReviews = rating > 0 && (professional.reviewCount || 0) > 0;
    if (!hasReviews) return null;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)} ({professional.reviewCount} reviews)
        </span>
      </div>
    );
  };

  const getCertificationBadge = (level: string) => {
    const colors = {
      Bronze: "bg-orange-100 text-orange-800 border-orange-200",
      Silver: "bg-gray-100 text-gray-800 border-gray-200",
      Gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Platinum: "bg-purple-100 text-purple-800 border-purple-200"
    };

    return colors[level as keyof typeof colors] || colors.Bronze;
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 ${professional.hasDigitalCard ? 'cursor-pointer' : ''} group ${featured ? 'ring-2 ring-glamlink-teal' : ''} ${className}`}
      onClick={professional.hasDigitalCard ? onClick : undefined}
    >
      {/* Hero Image Section */}
      <div className="relative overflow-hidden">
        <Image
          src={professional.portraitImage || professional.profileImage || professional.image || "/images/cover_1_edited.png"}
          alt={professional.name}
          width={400}
          height={0}
          style={{ height: 'auto' }}
          className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {/* Founder Badge */}
          {professional.isFounder && (
            <div className="bg-glamlink-teal text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              Founder
            </div>
          )}
        </div>

      </div>

      {/* Profile Info Section */}
      <div className="p-6">
        {/* Name and Title */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-glamlink-teal transition-colors">
            {professional.name}
          </h3>
          <p className="text-gray-600 text-sm font-medium">{professional.title}</p>
        </div>

        {/* Location and Social */}
        <div className="flex flex-col gap-2 mb-4">
          {(professional.location || professional.locationData) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{getShortLocation(professional)}</span>
            </div>
          )}

          {professional.instagram && (
            <div className="flex items-center gap-2 text-sm text-glamlink-teal font-medium">
              <Instagram className="w-4 h-4" />
              <span>{professional.instagram}</span>
            </div>
          )}
        </div>

        {/* Specialty */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 bg-glamlink-teal/10 text-glamlink-teal px-3 py-1 rounded-full text-sm font-medium">
            <Award className="w-4 h-4" />
            {professional.specialty}
          </div>
        </div>

        {/* Services Preview */}
        {professional.services && professional.services.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Services</h4>
            <div className="flex flex-wrap gap-2">
              {professional.services.slice(0, 3).map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 bg-gray-50 text-gray-700 px-2 py-1 rounded-full text-xs"
                >
                  {service.icon && <span className="text-xs">{service.icon}</span>}
                  <span>{service.name}</span>
                  {service.price && <span className="text-gray-500">(${service.price})</span>}
                </div>
              ))}
              {professional.services.length > 3 && (
                <span className="text-xs text-gray-500 self-center">
                  +{professional.services.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <a
          href="https://qrco.de/bfw5e3"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-glamlink-teal text-white py-3 px-4 rounded-xl font-semibold hover:bg-glamlink-teal-dark transition-colors duration-200 flex items-center justify-center gap-2 text-center"
        >
          <Calendar className="w-4 h-4" />
          Book Now
        </a>

        {/* Contact Options */}
        {professional.bookingUrl && (
          <div className="mt-3 text-center">
            <a
              href={professional.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-glamlink-teal hover:text-glamlink-teal-dark font-medium"
            >
              View Full Profile →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}