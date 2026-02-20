'use client';

/**
 * ServicesPage - Main Browse All Services page
 *
 * Displays:
 * - Location detection prompt
 * - Hero section with search
 * - Browse by Category (treatment categories)
 * - Popular Cities (with pro counts)
 * - Featured Professionals
 */

import React from 'react';
import Link from 'next/link';
import { useServicesData } from '../hooks';
import { useUserLocation } from '../hooks/useUserLocation';
import { TreatmentCard } from './TreatmentCard';
import { CityCard } from './CityCard';
import { ProCard } from './ProCard';
import LocationPrompt from './LocationPrompt';

// =============================================================================
// LOADING SKELETON
// =============================================================================

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-gray-100 h-64 mb-12" />

      {/* Categories skeleton */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="h-8 bg-gray-200 w-48 mb-6 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Cities skeleton */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="h-8 bg-gray-200 w-48 mb-6 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl" />
          ))}
        </div>
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
// HERO SECTION
// =============================================================================

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-glamlink-teal/5 via-white to-purple-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-glamlink-teal/20 text-glamlink-teal text-sm font-medium mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Verified Beauty Professionals
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          Find Your Perfect{' '}
          <span className="text-glamlink-teal">Beauty Pro</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Browse treatments, discover local professionals, and book your next appointment
          with confidence.
        </p>

        {/* Search placeholder - functional search can be added later */}
        <div className="max-w-xl mx-auto">
          <div className="flex items-center bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-2">
            <div className="flex items-center flex-1 px-4">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search treatments or cities..."
                className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                disabled
              />
            </div>
            <button
              className="px-6 py-3 bg-glamlink-teal text-white font-medium rounded-full hover:bg-glamlink-teal-dark transition-colors"
              disabled
            >
              Search
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">Coming soon: Smart search across treatments and locations</p>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ServicesPage() {
  const { categories, featuredPros, popularLocations, isLoading, error } = useServicesData();
  const { userLocation } = useUserLocation();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Unable to load services</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <HeroSection />

      {/* Location Prompt */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <LocationPrompt />
      </div>

      {/* Browse by Category */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Browse by Category"
            subtitle={userLocation ? `Explore treatments in ${userLocation.city}` : 'Explore treatments by type'}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <TreatmentCard key={category.id} category={category} userLocationSlug={userLocation?.slug} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Popular Cities"
            subtitle="Find beauty professionals near you"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {popularLocations.slice(0, 12).map((location) => (
              <CityCard key={location.slug} location={location} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Professionals */}
      {featuredPros.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader
              title="Featured Professionals"
              subtitle="Top-rated beauty pros"
              viewAllLink="/for-professionals"
              viewAllText="See All Pros"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredPros.slice(0, 8).map((pro) => (
                <ProCard key={pro.id} professional={pro} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-glamlink-teal to-glamlink-teal-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Are You a Beauty Professional?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join Glamlink and connect with clients looking for your services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply/get-featured"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-glamlink-teal font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Get Featured
            </Link>
            <Link
              href="/for-professionals"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServicesPage;
