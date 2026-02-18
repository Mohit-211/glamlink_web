'use client';

/**
 * ProCard - Professional card for services page
 *
 * Displays a professional with image, name, title, location, and rating.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Professional } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface ProCardProps {
  professional: Professional;
  className?: string;
  onClick?: () => void;
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ProCard({ professional, className = '', onClick }: ProCardProps) {
  const imageUrl = professional.profileImage || professional.image || '/images/default-avatar.png';
  const displayLocation =
    professional.locationData?.city && professional.locationData?.state
      ? `${professional.locationData.city}, ${professional.locationData.state}`
      : professional.location || 'Location TBD';

  // Link to professional's digital card if they have one
  const href = professional.hasDigitalCard
    ? `/for-professionals/${professional.cardUrl || professional.id}`
    : '#';

  const cardContent = (
    <div
      className={`
        group relative rounded-2xl bg-white border border-gray-100 overflow-hidden
        hover:border-glamlink-teal hover:shadow-lg
        transition-all duration-300
        ${className}
      `}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={professional.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Featured badge */}
        {professional.featured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-glamlink-teal text-white text-xs font-medium rounded-full">
            Featured
          </div>
        )}

        {/* Certification badge */}
        {professional.certificationLevel && (
          <div
            className={`
              absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full
              ${
                professional.certificationLevel === 'Platinum'
                  ? 'bg-purple-100 text-purple-800'
                  : professional.certificationLevel === 'Gold'
                    ? 'bg-yellow-100 text-yellow-800'
                    : professional.certificationLevel === 'Silver'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-amber-100 text-amber-800'
              }
            `}
          >
            {professional.certificationLevel}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-glamlink-teal transition-colors line-clamp-1">
          {professional.name}
        </h3>

        {/* Title / Specialty */}
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {professional.title || professional.specialty}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="line-clamp-1">{displayLocation}</span>
        </div>

        {/* Rating */}
        {professional.rating && professional.rating > 0 && (
          <RatingStars rating={professional.rating} />
        )}
      </div>
    </div>
  );

  // If there's an onClick handler or no digital card, render as div
  if (onClick || !professional.hasDigitalCard) {
    return (
      <div onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
        {cardContent}
      </div>
    );
  }

  // Otherwise render as link
  return <Link href={href}>{cardContent}</Link>;
}

export default ProCard;
