'use client';

/**
 * TreatmentHero - Hero section for treatment pages
 *
 * Displays treatment name, description, and key info.
 */

import React from 'react';
import Link from 'next/link';
import type { TreatmentContent } from '../config';
import type { TreatmentCategoryInfo } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface TreatmentHeroProps {
  treatment: TreatmentContent;
  category: TreatmentCategoryInfo | null;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function TreatmentHero({ treatment, category }: TreatmentHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-glamlink-teal/5 via-white to-purple-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/services" className="hover:text-glamlink-teal transition-colors">
            Services
          </Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {category && (
            <>
              <span className="text-gray-400">{category.name}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
          <span className="text-gray-900 font-medium">{treatment.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div>
            {/* Category badge */}
            {category && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glamlink-teal/10 text-glamlink-teal text-sm font-medium mb-4">
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              {treatment.name}{' '}
              <span className="text-glamlink-teal">Artists</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-6">
              {treatment.shortDescription}
            </p>

            {/* Quick info pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-sm">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">{treatment.duration}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-sm">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">
                  ${treatment.priceRange.min} - ${treatment.priceRange.max}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-sm">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-gray-700">Heals in {treatment.healingTime}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#professionals"
                className="inline-flex items-center justify-center px-6 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
              >
                Find {treatment.name} Artists
              </a>
              <a
                href="#about"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right side - could be image or decorative element */}
          <div className="hidden md:block">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-glamlink-teal/20 to-purple-100/50 rounded-3xl" />
              <div className="absolute inset-4 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">{category?.icon || '✨'}</div>
                  <p className="text-gray-500 font-medium">Results last</p>
                  <p className="text-2xl font-bold text-gray-900">{treatment.resultsLast}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TreatmentHero;
