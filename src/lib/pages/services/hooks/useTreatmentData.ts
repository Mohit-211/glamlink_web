'use client';

/**
 * useTreatmentData Hook
 *
 * Fetches and aggregates data for a specific treatment page:
 * - Treatment content (from config)
 * - Professionals offering this treatment (from API)
 * - Location/city stats for this treatment
 * - Related treatments
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Professional, LocationCardData, TreatmentCategoryInfo } from '../types';
import type { TreatmentContent } from '../config';
import {
  isValidTreatmentSlug,
  getTreatmentContent,
  getCategoryForTreatment,
  getRelatedTreatmentContent,
  POPULAR_CITIES,
} from '../config';

// =============================================================================
// TYPES
// =============================================================================

export interface TreatmentStats {
  proCount: number;
  reviewCount: number;
  avgPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
}

export interface UseTreatmentDataReturn {
  // Data
  treatment: TreatmentContent | null;
  category: TreatmentCategoryInfo | null;
  pros: Professional[];
  featuredPros: Professional[];
  stats: TreatmentStats;
  cityStats: LocationCardData[];
  relatedTreatments: TreatmentContent[];

  // State
  isLoading: boolean;
  error: string | null;
  isValidSlug: boolean;

  // Actions
  refetch: () => Promise<void>;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if a professional offers a specific treatment
 * Matches against services array, specialty string, or title
 */
function proOffersTreatment(pro: Professional, treatmentSlug: string, treatmentName: string): boolean {
  const normalizedSlug = treatmentSlug.toLowerCase();
  const normalizedName = treatmentName.toLowerCase();

  // Check services array
  if (pro.services && Array.isArray(pro.services)) {
    const hasService = pro.services.some((service) => {
      const serviceName = typeof service === 'string' ? service : service.name;
      const normalized = serviceName?.toLowerCase() || '';
      return (
        normalized.includes(normalizedSlug) ||
        normalized.includes(normalizedName) ||
        normalizedSlug.includes(normalized.replace(/\s+/g, '-')) ||
        normalizedName.includes(normalized)
      );
    });
    if (hasService) return true;
  }

  // Check specialty
  if (pro.specialty) {
    const specialtyLower = pro.specialty.toLowerCase();
    if (
      specialtyLower.includes(normalizedSlug) ||
      specialtyLower.includes(normalizedName) ||
      normalizedSlug.includes(specialtyLower.replace(/\s+/g, '-'))
    ) {
      return true;
    }
  }

  // Check title
  if (pro.title) {
    const titleLower = pro.title.toLowerCase();
    if (
      titleLower.includes(normalizedSlug) ||
      titleLower.includes(normalizedName)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Extract city stats from filtered professionals
 */
function extractCityStatsFromPros(professionals: Professional[]): LocationCardData[] {
  const cityMap = new Map<string, LocationCardData>();

  for (const pro of professionals) {
    let city = pro.locationData?.city || '';
    let state = pro.locationData?.state || '';

    // Fall back to parsing location string
    if (!city && pro.location) {
      const parts = pro.location.split(',').map((s) => s.trim());
      if (parts.length >= 2) {
        city = parts[0];
        state = parts[1];
      } else {
        city = parts[0];
      }
    }

    if (!city) continue;

    const slug = city.toLowerCase().replace(/\s+/g, '-');
    const key = `${slug}-${state.toLowerCase()}`;

    if (cityMap.has(key)) {
      const existing = cityMap.get(key)!;
      existing.proCount += 1;
    } else {
      cityMap.set(key, {
        slug,
        city,
        state,
        proCount: 1,
      });
    }
  }

  // Sort by count descending
  return Array.from(cityMap.values()).sort((a, b) => b.proCount - a.proCount);
}

/**
 * Merge popular cities with actual pro counts for this treatment
 */
function mergeWithPopularCities(
  cityStats: LocationCardData[],
  popularCities: typeof POPULAR_CITIES
): LocationCardData[] {
  const result: LocationCardData[] = [];
  const addedSlugs = new Set<string>();

  // First add cities with pros offering this treatment (prioritize actual data)
  for (const city of cityStats.slice(0, 8)) {
    result.push(city);
    addedSlugs.add(city.slug);
  }

  // Then add popular cities that weren't already added
  for (const city of popularCities) {
    if (!addedSlugs.has(city.slug) && result.length < 12) {
      const existing = cityStats.find(
        (c) => c.slug === city.slug || c.city.toLowerCase() === city.city.toLowerCase()
      );
      result.push({
        slug: city.slug,
        city: city.city,
        state: city.state,
        proCount: existing?.proCount || 0,
        image: city.image,
      });
      addedSlugs.add(city.slug);
    }
  }

  return result;
}

/**
 * Calculate stats from filtered professionals
 */
function calculateStats(pros: Professional[], treatment: TreatmentContent | null): TreatmentStats {
  const proCount = pros.length;

  // Sum up reviews
  const reviewCount = pros.reduce((sum, pro) => sum + (pro.reviewCount || 0), 0);

  // Use treatment config price range or calculate from pros
  const priceMin = treatment?.priceRange.min || 0;
  const priceMax = treatment?.priceRange.max || 0;
  const avgPrice = priceMin && priceMax ? Math.round((priceMin + priceMax) / 2) : 0;

  return {
    proCount,
    reviewCount,
    avgPrice,
    priceRange: {
      min: priceMin,
      max: priceMax,
    },
  };
}

/**
 * Get featured professionals for this treatment
 */
function getFeaturedPros(pros: Professional[], limit = 8): Professional[] {
  // First get featured pros
  const featured = pros.filter((p) => p.featured);

  if (featured.length >= limit) {
    return featured.slice(0, limit);
  }

  // Fill with highest rated
  const remaining = pros
    .filter((p) => !p.featured)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return [...featured, ...remaining].slice(0, limit);
}

// =============================================================================
// HOOK
// =============================================================================

export function useTreatmentData(treatmentSlug: string): UseTreatmentDataReturn {
  const [allPros, setAllPros] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate slug
  const isValidSlug = isValidTreatmentSlug(treatmentSlug);

  // Get treatment content from config
  const treatment = useMemo(() => {
    if (!isValidSlug) return null;
    return getTreatmentContent(treatmentSlug) || null;
  }, [treatmentSlug, isValidSlug]);

  // Get category info
  const category = useMemo(() => {
    if (!isValidSlug) return null;
    return getCategoryForTreatment(treatmentSlug) || null;
  }, [treatmentSlug, isValidSlug]);

  // Fetch professionals from API
  const fetchData = useCallback(async () => {
    if (!isValidSlug) {
      setIsLoading(false);
      setError('Invalid treatment');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/professionals', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch professionals');
      }

      const result = await response.json();
      const apiData: Professional[] = result.data || [];

      setAllPros(apiData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching treatment data:', err);
      setError(errorMessage);
      setAllPros([]);
    } finally {
      setIsLoading(false);
    }
  }, [isValidSlug]);

  // Fetch on mount or when slug changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter professionals offering this treatment
  const filteredPros = useMemo(() => {
    if (!treatment) return [];
    return allPros.filter((pro) => proOffersTreatment(pro, treatmentSlug, treatment.name));
  }, [allPros, treatmentSlug, treatment]);

  // Memoized computed values
  const featuredPros = useMemo(() => getFeaturedPros(filteredPros, 8), [filteredPros]);

  const stats = useMemo(() => calculateStats(filteredPros, treatment), [filteredPros, treatment]);

  const extractedCityStats = useMemo(() => extractCityStatsFromPros(filteredPros), [filteredPros]);

  const cityStats = useMemo(
    () => mergeWithPopularCities(extractedCityStats, POPULAR_CITIES),
    [extractedCityStats]
  );

  const relatedTreatments = useMemo(() => {
    if (!treatment) return [];
    return getRelatedTreatmentContent(treatment.relatedTreatments);
  }, [treatment]);

  return {
    treatment,
    category,
    pros: filteredPros,
    featuredPros,
    stats,
    cityStats,
    relatedTreatments,
    isLoading,
    error,
    isValidSlug,
    refetch: fetchData,
  };
}
