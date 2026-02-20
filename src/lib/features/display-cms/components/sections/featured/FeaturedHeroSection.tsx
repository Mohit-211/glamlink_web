"use client";

import type { FeaturedHeroSection as FeaturedHeroSectionType } from '@/lib/pages/admin/components/content-settings/content/sections/featured/types';
import { isFeaturedHeroSection } from '@/lib/pages/admin/components/content-settings/content/sections/featured/types';

interface FeaturedHeroSectionProps {
  section: FeaturedHeroSectionType | any;
}

/**
 * Featured Hero Section
 *
 * Simple hero with title, subtitle, and "Apply Now" CTA that scrolls to form
 * Matches legacy design with gradient background
 */
export function FeaturedHeroSection({ section }: FeaturedHeroSectionProps) {
  if (!isFeaturedHeroSection(section)) {
    return null;
  }

  const { content } = section;

  const handleApplyNow = () => {
    const formElement = document.getElementById('get-featured-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-b from-glamlink-teal/10 to-white pt-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {content.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {content.subtitle}
          </p>
          <button
            onClick={handleApplyNow}
            className="px-8 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
          >
            {content.ctaText}
          </button>
        </div>
      </div>
    </div>
  );
}
