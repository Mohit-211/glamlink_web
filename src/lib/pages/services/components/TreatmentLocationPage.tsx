'use client';

/**
 * TreatmentLocationPage - Treatment + Location page component
 *
 * Main SEO landing page for treatment + city combinations.
 * Example: "/services/lip-blush/las-vegas" -> "Lip Blush in Las Vegas"
 *
 * Displays:
 * - Hero with treatment + location info
 * - Local stats (pro count, reviews, prices)
 * - Featured local professionals
 * - All local professionals
 * - About section with educational content
 * - FAQs
 * - Nearby cities with same treatment
 * - Related treatments in same location
 */

import React from 'react';
import Link from 'next/link';
import { useTreatmentLocationData } from '../hooks/useTreatmentLocationData';
import { TreatmentFAQs } from './TreatmentFAQs';
import { ProCard } from './ProCard';
import type { LocationCardData } from '../types';
import type { TreatmentContent } from '../config';

// =============================================================================
// TYPES
// =============================================================================

export interface TreatmentLocationPageProps {
  treatmentSlug: string;
  locationSlug: string;
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-gray-100 h-72 md:h-80 mb-8" />

      {/* Stats skeleton */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Pros skeleton */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="h-8 bg-gray-200 w-64 mb-6 rounded" />
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

function NotFoundContent({
  treatmentSlug,
  locationSlug,
  isValidTreatment,
}: {
  treatmentSlug: string;
  locationSlug: string;
  isValidTreatment: boolean;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {isValidTreatment ? 'Location Not Found' : 'Treatment Not Found'}
        </h1>
        <p className="text-gray-600 mb-8">
          {isValidTreatment
            ? `We couldn't find professionals for this treatment in "${locationSlug.replace(/-/g, ' ')}".`
            : `We couldn't find a treatment matching "${treatmentSlug}".`}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isValidTreatment && (
            <Link
              href={`/services/${treatmentSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
            >
              View All Locations
            </Link>
          )}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-glamlink-teal text-glamlink-teal font-semibold rounded-full hover:bg-glamlink-teal/5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Browse All Services
          </Link>
        </div>
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
        <h2 className="text-lg font-semibold text-red-800 mb-2">Unable to load page</h2>
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
// HERO SECTION
// =============================================================================

interface HeroProps {
  treatment: TreatmentContent;
  city: string;
  state: string;
  localProCount: number;
  categoryName?: string;
}

function Hero({ treatment, city, state, localProCount, categoryName }: HeroProps) {
  const locationDisplay = state ? `${city}, ${state}` : city;

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 md:py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                Services
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li>
              <Link
                href={`/services/${treatment.slug}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {treatment.name}
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li className="text-white">{city}</li>
          </ol>
        </nav>

        {/* Category Badge */}
        {categoryName && (
          <span className="inline-block px-3 py-1 bg-glamlink-teal/20 text-glamlink-teal rounded-full text-sm font-medium mb-4">
            {categoryName}
          </span>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          {treatment.name} in {city}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl">
          Find and book verified {treatment.name.toLowerCase()} professionals in {locationDisplay}
        </p>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
            <svg className="w-5 h-5 text-glamlink-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {locationDisplay}
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
            <svg className="w-5 h-5 text-glamlink-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {localProCount} {localProCount === 1 ? 'Pro' : 'Pros'} in {city}
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
            <svg className="w-5 h-5 text-glamlink-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ${treatment.priceRange.min} - ${treatment.priceRange.max}
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#professionals"
            className="inline-flex items-center justify-center px-8 py-4 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
          >
            Browse Local Pros
          </a>
          <Link
            href={`/services/${treatment.slug}`}
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
          >
            View All Locations
          </Link>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// STATS SECTION
// =============================================================================

interface StatsProps {
  localProCount: number;
  localReviewCount: number;
  priceRange: { min: number; max: number };
  nationalProCount: number;
  city: string;
}

function Stats({ localProCount, localReviewCount, priceRange, nationalProCount, city }: StatsProps) {
  return (
    <section className="py-8 md:py-12 -mt-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Local Pros */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold text-glamlink-teal mb-1">
              {localProCount}
            </div>
            <p className="text-sm text-gray-600">Pros in {city}</p>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold text-glamlink-teal mb-1">
              {localReviewCount.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Local Reviews</p>
          </div>

          {/* Price Range */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold text-glamlink-teal mb-1">
              ${priceRange.min}+
            </div>
            <p className="text-sm text-gray-600">Starting Price</p>
          </div>

          {/* Nationwide */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-400 mb-1">
              {nationalProCount}
            </div>
            <p className="text-sm text-gray-600">Nationwide</p>
          </div>
        </div>
      </div>
    </section>
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
// NO PROS MESSAGE
// =============================================================================

interface NoProsMessageProps {
  treatmentName: string;
  city: string;
  treatmentSlug: string;
}

function NoProsMessage({ treatmentName, city, treatmentSlug }: NoProsMessageProps) {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No {treatmentName} Pros in {city} Yet
          </h3>
          <p className="text-gray-600 mb-6">
            We don&apos;t have any verified {treatmentName.toLowerCase()} professionals in {city} at the moment.
            Check back soon or browse other cities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/services/${treatmentSlug}`}
              className="inline-flex items-center justify-center px-6 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
            >
              View All {treatmentName} Locations
            </Link>
            <Link
              href="/apply/featured"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-glamlink-teal text-glamlink-teal font-semibold rounded-full hover:bg-glamlink-teal/5 transition-colors"
            >
              Are You a {treatmentName} Pro?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// NEARBY CITIES SECTION
// =============================================================================

interface NearbyCitiesProps {
  cities: LocationCardData[];
  treatmentSlug: string;
  treatmentName: string;
}

function NearbyCities({ cities, treatmentSlug, treatmentName }: NearbyCitiesProps) {
  if (cities.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title={`${treatmentName} in Other Cities`}
          subtitle="Find professionals in nearby locations"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/services/${treatmentSlug}/${city.slug}`}
              className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-glamlink-teal hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 group-hover:bg-glamlink-teal/10 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-glamlink-teal transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate group-hover:text-glamlink-teal transition-colors">
                    {city.city}
                  </p>
                  <p className="text-xs text-gray-500">
                    {city.proCount} {city.proCount === 1 ? 'pro' : 'pros'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// RELATED TREATMENTS IN CITY
// =============================================================================

interface RelatedInCityProps {
  treatments: TreatmentContent[];
  locationSlug: string;
  city: string;
}

function RelatedInCity({ treatments, locationSlug, city }: RelatedInCityProps) {
  if (treatments.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title={`Other Treatments in ${city}`}
          subtitle="Explore more beauty services in your area"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.slice(0, 6).map((treatment) => (
            <Link
              key={treatment.slug}
              href={`/services/${treatment.slug}/${locationSlug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-glamlink-teal transition-colors mb-2">
                  {treatment.name} in {city}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {treatment.shortDescription}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    ${treatment.priceRange.min}+
                  </span>
                  <span className="text-glamlink-teal font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    View Pros
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// ABOUT SECTION
// =============================================================================

interface AboutSectionProps {
  treatment: TreatmentContent;
  city: string;
}

function AboutSection({ treatment, city }: AboutSectionProps) {
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">What to Expect in {city}</h3>
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
                  <p className="font-medium text-gray-900 mb-1">Price Range in {city}</p>
                  <p className="text-sm text-gray-600">
                    Typical costs in {city} range from ${treatment.priceRange.min} to ${treatment.priceRange.max}.
                    Prices vary by provider and specific treatment details.
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

export function TreatmentLocationPage({ treatmentSlug, locationSlug }: TreatmentLocationPageProps) {
  const {
    treatment,
    category,
    location,
    localPros,
    featuredLocalPros,
    stats,
    nearbyCities,
    relatedTreatments,
    isLoading,
    error,
    isValidTreatment,
    isValidLocation,
  } = useTreatmentLocationData(treatmentSlug, locationSlug);

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Invalid treatment or location
  if (!isValidTreatment || !isValidLocation || !treatment || !location) {
    return (
      <NotFoundContent
        treatmentSlug={treatmentSlug}
        locationSlug={locationSlug}
        isValidTreatment={isValidTreatment}
      />
    );
  }

  // Error state
  if (error) {
    return <ErrorContent error={error} />;
  }

  const cityDisplay = location.state ? `${location.city}, ${location.state}` : location.city;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <Hero
        treatment={treatment}
        city={location.city}
        state={location.state}
        localProCount={stats.localProCount}
        categoryName={category?.name}
      />

      {/* Stats */}
      <Stats
        localProCount={stats.localProCount}
        localReviewCount={stats.localReviewCount}
        priceRange={stats.priceRange}
        nationalProCount={stats.nationalProCount}
        city={location.city}
      />

      {/* Local Professionals or No Pros Message */}
      {localPros.length > 0 ? (
        <section id="professionals" className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader
              title={`${treatment.name} Artists in ${location.city}`}
              subtitle={`${stats.localProCount} verified professional${stats.localProCount !== 1 ? 's' : ''} in ${cityDisplay}`}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredLocalPros.map((pro) => (
                <ProCard key={pro.id} professional={pro} />
              ))}
            </div>
            {localPros.length > 8 && (
              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm mb-4">
                  Showing {Math.min(8, featuredLocalPros.length)} of {localPros.length} professionals in {location.city}
                </p>
                <Link
                  href="/for-professionals"
                  className="inline-flex items-center gap-2 text-glamlink-teal font-medium hover:underline"
                >
                  View All Professionals
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>
      ) : (
        <NoProsMessage
          treatmentName={treatment.name}
          city={location.city}
          treatmentSlug={treatmentSlug}
        />
      )}

      {/* About Section */}
      <AboutSection treatment={treatment} city={location.city} />

      {/* FAQs */}
      <TreatmentFAQs faqs={treatment.faqs} treatmentName={treatment.name} />

      {/* Nearby Cities */}
      <NearbyCities
        cities={nearbyCities}
        treatmentSlug={treatmentSlug}
        treatmentName={treatment.name}
      />

      {/* Related Treatments in This City */}
      <RelatedInCity
        treatments={relatedTreatments}
        locationSlug={locationSlug}
        city={location.city}
      />

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-glamlink-teal to-glamlink-teal-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for {treatment.name} in {location.city}?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Browse verified professionals, read reviews, and book with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {localPros.length > 0 ? (
              <a
                href="#professionals"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-glamlink-teal font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Browse {location.city} Pros
              </a>
            ) : (
              <Link
                href={`/services/${treatmentSlug}`}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-glamlink-teal font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Find {treatment.name} Near You
              </Link>
            )}
            <Link
              href="/apply/featured"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Are You a Pro in {location.city}?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TreatmentLocationPage;
