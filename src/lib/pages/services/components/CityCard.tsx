'use client';

/**
 * CityCard - City/location card for services page
 *
 * Displays a city with pro count and link to location page.
 */

import React from 'react';
import Link from 'next/link';
import type { LocationCardData } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface CityCardProps {
  location: LocationCardData;
  className?: string;
  variant?: 'default' | 'compact';
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CityCard({ location, className = '', variant = 'default' }: CityCardProps) {
  const href = `/services/location/${location.slug}`;

  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-full
          bg-gray-50 hover:bg-glamlink-teal/10 border border-gray-200
          hover:border-glamlink-teal text-gray-700 hover:text-glamlink-teal
          transition-all duration-200
          ${className}
        `}
      >
        <span className="font-medium">{location.city}</span>
        {location.proCount > 0 && (
          <span className="text-sm text-gray-500">({location.proCount})</span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`
        group block p-5 rounded-xl bg-white border border-gray-100
        hover:border-glamlink-teal hover:shadow-md
        transition-all duration-300
        ${className}
      `}
    >
      {/* City name */}
      <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-glamlink-teal transition-colors">
        {location.city}
      </h3>

      {/* State */}
      <p className="text-sm text-gray-500 mb-2">{location.state}</p>

      {/* Pro count */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {location.proCount > 0 ? `${location.proCount} pros` : 'Coming soon'}
        </span>
        <svg
          className="w-4 h-4 text-glamlink-teal opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default CityCard;
