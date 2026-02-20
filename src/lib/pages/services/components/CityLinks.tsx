'use client';

/**
 * CityLinks - "Find in Your City" section for treatment pages
 *
 * Shows cities where this treatment is available with pro counts.
 */

import React from 'react';
import Link from 'next/link';
import type { LocationCardData } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface CityLinksProps {
  cities: LocationCardData[];
  treatmentSlug: string;
  treatmentName: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CityLinks({ cities, treatmentSlug, treatmentName }: CityLinksProps) {
  if (cities.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Find {treatmentName} in Your City
          </h2>
          <p className="text-gray-600">
            Browse {treatmentName.toLowerCase()} artists by location
          </p>
        </div>

        {/* City Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/services/${treatmentSlug}/${city.slug}`}
              className="group p-4 bg-white rounded-xl border border-gray-100 hover:border-glamlink-teal hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-1">
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-glamlink-teal transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
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
                <span className="font-medium text-gray-900 group-hover:text-glamlink-teal transition-colors line-clamp-1">
                  {city.city}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {city.state} {city.proCount > 0 && `• ${city.proCount} pros`}
              </p>
            </Link>
          ))}
        </div>

        {/* View All Cities Link */}
        <div className="mt-6 text-center">
          <Link
            href={`/services/location`}
            className="inline-flex items-center gap-2 text-glamlink-teal font-medium hover:underline"
          >
            View all cities
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CityLinks;
