'use client';

/**
 * TreatmentCard - Treatment category card for services page
 *
 * Displays a treatment category with icon, name, description, and link.
 * If userLocationSlug is provided, links to treatment + location page.
 */

import React from 'react';
import Link from 'next/link';
import type { TreatmentCategoryInfo } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface TreatmentCardProps {
  category: TreatmentCategoryInfo;
  className?: string;
  /** If provided, links to /services/[treatment]/[location] instead of /services/[treatment] */
  userLocationSlug?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function TreatmentCard({ category, className = '', userLocationSlug }: TreatmentCardProps) {
  // Get the first treatment in the category
  const treatmentSlug = category.treatments[0] || category.id;

  // If user has shared location, link to treatment + location page
  // Otherwise, link to nationwide treatment page
  const href = userLocationSlug
    ? `/services/${treatmentSlug}/${userLocationSlug}`
    : `/services/${treatmentSlug}`;

  return (
    <Link
      href={href}
      className={`
        group block p-6 rounded-2xl bg-white border border-gray-100
        hover:border-glamlink-teal hover:shadow-lg
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      {/* Icon */}
      <div className="text-4xl mb-4">{category.icon || '💫'}</div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-glamlink-teal transition-colors">
        {category.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">{category.description}</p>

      {/* Treatment count */}
      <div className="flex items-center text-sm text-glamlink-teal font-medium">
        <span>{category.treatments.length} treatments</span>
        <svg
          className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
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

export default TreatmentCard;
