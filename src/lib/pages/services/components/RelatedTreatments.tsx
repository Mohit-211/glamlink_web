'use client';

/**
 * RelatedTreatments - Related treatments section for treatment pages
 *
 * Shows other treatments that users might be interested in.
 */

import React from 'react';
import Link from 'next/link';
import type { TreatmentContent } from '../config';
import { getCategoryForTreatment } from '../config';

// =============================================================================
// TYPES
// =============================================================================

export interface RelatedTreatmentsProps {
  treatments: TreatmentContent[];
  currentTreatmentName: string;
}

// =============================================================================
// TREATMENT CARD
// =============================================================================

interface RelatedTreatmentCardProps {
  treatment: TreatmentContent;
}

function RelatedTreatmentCard({ treatment }: RelatedTreatmentCardProps) {
  const category = getCategoryForTreatment(treatment.slug);

  return (
    <Link
      href={`/services/${treatment.slug}`}
      className="group block p-5 bg-white rounded-2xl border border-gray-100 hover:border-glamlink-teal hover:shadow-lg transition-all duration-300"
    >
      {/* Category badge */}
      {category && (
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium mb-3">
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </div>
      )}

      {/* Name */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-glamlink-teal transition-colors">
        {treatment.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {treatment.shortDescription}
      </p>

      {/* Quick info */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          ${treatment.priceRange.min}+
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {treatment.duration}
        </span>
      </div>

      {/* Arrow indicator */}
      <div className="mt-4 flex items-center text-glamlink-teal text-sm font-medium">
        <span>Learn more</span>
        <svg
          className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
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

// =============================================================================
// COMPONENT
// =============================================================================

export function RelatedTreatments({ treatments, currentTreatmentName }: RelatedTreatmentsProps) {
  if (treatments.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Related Treatments
          </h2>
          <p className="text-gray-600">
            Other treatments you might be interested in
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.slice(0, 3).map((treatment) => (
            <RelatedTreatmentCard key={treatment.slug} treatment={treatment} />
          ))}
        </div>

        {/* Back to all services */}
        <div className="mt-8 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Browse All Services
          </Link>
        </div>
      </div>
    </section>
  );
}

export default RelatedTreatments;
