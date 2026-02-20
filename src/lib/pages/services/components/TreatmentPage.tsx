'use client';

/**
 * TreatmentPage - Main treatment detail page component
 *
 * Displays all information about a specific treatment including:
 * - Hero with treatment info
 * - Quick stats
 * - City links for finding pros
 * - Featured professionals
 * - About section with educational content
 * - FAQs
 * - Related treatments
 */

import React from 'react';
import Link from 'next/link';
import { useTreatmentData } from '../hooks';
import { TreatmentHero } from './TreatmentHero';
import { TreatmentStats } from './TreatmentStats';
import { CityLinks } from './CityLinks';
import { TreatmentFAQs } from './TreatmentFAQs';
import { RelatedTreatments } from './RelatedTreatments';
import { ProCard } from './ProCard';

// =============================================================================
// TYPES
// =============================================================================

export interface TreatmentPageProps {
  treatmentSlug: string;
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-gray-100 h-80 md:h-96 mb-8" />

      {/* Stats skeleton */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Cities skeleton */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="h-8 bg-gray-200 w-48 mb-6 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Pros skeleton */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="h-8 bg-gray-200 w-48 mb-6 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// NOT FOUND
// =============================================================================

function NotFoundContent({ treatmentSlug }: { treatmentSlug: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Treatment Not Found</h1>
        <p className="text-gray-600 mb-8">
          We couldn&apos;t find a treatment matching &quot;{treatmentSlug}&quot;.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-6 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Browse All Services
        </Link>
      </div>
    </div>
  );
}

// =============================================================================
// ERROR STATE
// =============================================================================

function ErrorContent({ error }: { error: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Unable to load treatment</h2>
        <p className="text-red-600">{error}</p>
        <Link
          href="/services"
          className="mt-4 inline-flex items-center text-red-700 hover:underline"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Services
        </Link>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION HEADER
// =============================================================================

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
}

function SectionHeader({ title, subtitle, viewAllLink, viewAllText = 'View All' }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="text-glamlink-teal font-medium hover:underline flex items-center gap-1"
        >
          {viewAllText}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}

// =============================================================================
// ABOUT SECTION
// =============================================================================

interface AboutSectionProps {
  treatment: NonNullable<ReturnType<typeof useTreatmentData>['treatment']>;
}

function AboutSection({ treatment }: AboutSectionProps) {
  return (
    <section id="about" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* What is it */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              About {treatment.name}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {treatment.longDescription}
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                <p className="font-medium text-gray-900">{treatment.duration}</p>
              </div>
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Healing</p>
                <p className="font-medium text-gray-900">{treatment.healingTime}</p>
              </div>
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Results Last</p>
                <p className="font-medium text-gray-900">{treatment.resultsLast}</p>
              </div>
            </div>
          </div>

          {/* What to expect */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">What to Expect</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {treatment.whatToExpect}
            </p>
            <div className="p-4 bg-glamlink-teal/5 border border-glamlink-teal/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-glamlink-teal/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-glamlink-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Price Range</p>
                  <p className="text-sm text-gray-600">
                    Typical costs range from ${treatment.priceRange.min} to ${treatment.priceRange.max}.
                    Prices vary by provider, location, and specific treatment details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TreatmentPage({ treatmentSlug }: TreatmentPageProps) {
  const {
    treatment,
    category,
    featuredPros,
    pros,
    stats,
    cityStats,
    relatedTreatments,
    isLoading,
    error,
    isValidSlug,
  } = useTreatmentData(treatmentSlug);

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Invalid slug
  if (!isValidSlug || !treatment) {
    return <NotFoundContent treatmentSlug={treatmentSlug} />;
  }

  // Error state
  if (error) {
    return <ErrorContent error={error} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <TreatmentHero treatment={treatment} category={category} />

      {/* Stats */}
      <TreatmentStats stats={stats} treatmentName={treatment.name} />

      {/* Find in Your City */}
      <CityLinks cities={cityStats} treatmentSlug={treatmentSlug} treatmentName={treatment.name} />

      {/* Featured Professionals */}
      {featuredPros.length > 0 && (
        <section id="professionals" className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader
              title={`${treatment.name} Artists`}
              subtitle={`Find verified ${treatment.name.toLowerCase()} professionals`}
              viewAllLink="/for-professionals"
              viewAllText="See All Pros"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredPros.map((pro) => (
                <ProCard key={pro.id} professional={pro} />
              ))}
            </div>
            {pros.length > 8 && (
              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  Showing {Math.min(8, featuredPros.length)} of {pros.length} {treatment.name.toLowerCase()} professionals
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* About Section */}
      <AboutSection treatment={treatment} />

      {/* FAQs */}
      <TreatmentFAQs faqs={treatment.faqs} treatmentName={treatment.name} />

      {/* Related Treatments */}
      <RelatedTreatments
        treatments={relatedTreatments}
        currentTreatmentName={treatment.name}
      />

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-glamlink-teal to-glamlink-teal-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your {treatment.name} Artist?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Browse verified professionals, read reviews, and book with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#professionals"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-glamlink-teal font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Browse {treatment.name} Pros
            </a>
            <Link
              href="/apply/get-featured"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Are You a Pro?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TreatmentPage;
