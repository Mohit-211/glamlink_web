'use client';

/**
 * useServicesData Hook
 *
 * Fetches and aggregates data for the services page:
 * - Treatment categories (from config)
 * - Featured professionals (from API)
 * - Location data with pro counts (derived from professionals)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Professional, TreatmentCategoryInfo, LocationCardData } from '../types';
import { TREATMENT_CATEGORIES, POPULAR_CITIES } from '../config';

// =============================================================================
// TYPES
// =============================================================================

export interface UseServicesDataReturn {
  // Data
  categories: TreatmentCategoryInfo[];
  featuredPros: Professional[];
  popularLocations: LocationCardData[];
  allPros: Professional[];

  // State
  isLoading: boolean;
  error: string | null;

  // Actions
  refetch: () => Promise<void>;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extract unique locations from professionals with pro counts
 */
function extractLocationsFromPros(professionals: Professional[]): LocationCardData[] {
  const locationMap = new Map<string, LocationCardData>();

  for (const pro of professionals) {
    // Try to get city from locationData first, then fall back to location string
    let city = pro.locationData?.city || '';
    let state = pro.locationData?.state || '';

    // Fall back to parsing location string if no locationData
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

    // Create a slug from city name
    const slug = city.toLowerCase().replace(/\s+/g, '-');
    const key = `${slug}-${state.toLowerCase()}`;

    if (locationMap.has(key)) {
      const existing = locationMap.get(key)!;
      existing.proCount += 1;
    } else {
      locationMap.set(key, {
        slug,
        city,
        state,
        proCount: 1,
      });
    }
  }

  // Sort by pro count descending
  return Array.from(locationMap.values()).sort((a, b) => b.proCount - a.proCount);
}

/**
 * Get featured professionals
 */
function getFeaturedPros(professionals: Professional[], limit = 8): Professional[] {
  // First try to get professionals marked as featured
  const featured = professionals.filter((p) => p.featured);

  if (featured.length >= limit) {
    return featured.slice(0, limit);
  }

  // If not enough featured, add by rating/order
  const remaining = professionals
    .filter((p) => !p.featured)
    .sort((a, b) => {
      // Sort by rating first, then by order
      const ratingDiff = (b.rating || 0) - (a.rating || 0);
      if (ratingDiff !== 0) return ratingDiff;
      return (a.order ?? Infinity) - (b.order ?? Infinity);
    });

  return [...featured, ...remaining].slice(0, limit);
}

/**
 * Merge popular cities config with actual pro counts
 */
function mergePopularCitiesWithCounts(
  popularCities: typeof POPULAR_CITIES,
  locationData: LocationCardData[]
): LocationCardData[] {
  return popularCities.map((city) => {
    const matchingLocation = locationData.find(
      (loc) => loc.slug === city.slug || loc.city.toLowerCase() === city.city.toLowerCase()
    );

    return {
      slug: city.slug,
      city: city.city,
      state: city.state,
      proCount: matchingLocation?.proCount || 0,
      image: city.image,
    };
  });
}

// =============================================================================
// HOOK
// =============================================================================

export function useServicesData(): UseServicesDataReturn {
  const [allPros, setAllPros] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch professionals from API
  const fetchData = useCallback(async () => {
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
      console.error('Error fetching services data:', err);
      setError(errorMessage);
      setAllPros([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized computed values
  const featuredPros = useMemo(() => getFeaturedPros(allPros, 8), [allPros]);

  const extractedLocations = useMemo(() => extractLocationsFromPros(allPros), [allPros]);

  const popularLocations = useMemo(
    () => mergePopularCitiesWithCounts(POPULAR_CITIES, extractedLocations),
    [extractedLocations]
  );

  return {
    categories: TREATMENT_CATEGORIES,
    featuredPros,
    popularLocations,
    allPros,
    isLoading,
    error,
    refetch: fetchData,
  };
}
