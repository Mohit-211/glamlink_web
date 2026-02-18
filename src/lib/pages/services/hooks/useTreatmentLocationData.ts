'use client';

/**
 * useTreatmentLocationData Hook
 *
 * Fetches and aggregates data for a treatment + location page:
 * - Treatment content (from config)
 * - Professionals offering this treatment IN this location (from API)
 * - Nearby cities with this treatment
 * - Related treatments in this location
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

export interface LocationInfo {
  slug: string;
  city: string;
  state: string;
}

export interface TreatmentLocationStats {
  localProCount: number;
  localReviewCount: number;
  avgPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  nationalProCount: number; // Total pros nationwide offering this treatment
}

export interface UseTreatmentLocationDataReturn {
  // Data
  treatment: TreatmentContent | null;
  category: TreatmentCategoryInfo | null;
  location: LocationInfo | null;
  localPros: Professional[];
  featuredLocalPros: Professional[];
  stats: TreatmentLocationStats;
  nearbyCities: LocationCardData[];
  relatedTreatments: TreatmentContent[];

  // State
  isLoading: boolean;
  error: string | null;
  isValidTreatment: boolean;
  isValidLocation: boolean;

  // Actions
  refetch: () => Promise<void>;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Parse location slug to LocationInfo
 * Tries to match against POPULAR_CITIES first, then creates from slug
 */
function parseLocationSlug(locationSlug: string): LocationInfo | null {
  if (!locationSlug) return null;

  const normalized = locationSlug.toLowerCase();

  // Try to find in popular cities
  const popularMatch = POPULAR_CITIES.find((c) => c.slug === normalized);
  if (popularMatch) {
    return {
      slug: popularMatch.slug,
      city: popularMatch.city,
      state: popularMatch.state,
    };
  }

  // Create from slug (e.g., "san-francisco" -> "San Francisco")
  const cityName = normalized
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    slug: normalized,
    city: cityName,
    state: '', // Unknown state for non-popular cities
  };
}

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
 * Check if a professional is in a specific location
 */
function proIsInLocation(pro: Professional, locationSlug: string, cityName: string): boolean {
  const normalizedSlug = locationSlug.toLowerCase();
  const normalizedCity = cityName.toLowerCase();

  // Check locationData
  if (pro.locationData?.city) {
    const proCity = pro.locationData.city.toLowerCase();
    const proCitySlug = proCity.replace(/\s+/g, '-');

    if (proCity === normalizedCity || proCitySlug === normalizedSlug) {
      return true;
    }
  }

  // Check location string
  if (pro.location) {
    const locationLower = pro.location.toLowerCase();
    const parts = locationLower.split(',').map((s) => s.trim());
    const proCity = parts[0];
    const proCitySlug = proCity?.replace(/\s+/g, '-');

    if (proCity === normalizedCity || proCitySlug === normalizedSlug) {
      return true;
    }
  }

  return false;
}

/**
 * Get nearby cities based on same state or popular cities
 */
function getNearbyCities(
  allPros: Professional[],
  treatment: TreatmentContent,
  currentLocation: LocationInfo,
  treatmentSlug: string
): LocationCardData[] {
  const cityMap = new Map<string, LocationCardData>();

  // Filter pros by treatment
  const treatmentPros = allPros.filter((pro) =>
    proOffersTreatment(pro, treatmentSlug, treatment.name)
  );

  // Count pros by city
  for (const pro of treatmentPros) {
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

    // Skip current location
    if (slug === currentLocation.slug) continue;

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

  // Sort by count and take top 6
  const nearbyCities = Array.from(cityMap.values())
    .sort((a, b) => b.proCount - a.proCount)
    .slice(0, 6);

  // If not enough cities with pros, add popular cities
  if (nearbyCities.length < 6) {
    const addedSlugs = new Set(nearbyCities.map((c) => c.slug));
    addedSlugs.add(currentLocation.slug); // Don't include current

    for (const city of POPULAR_CITIES) {
      if (!addedSlugs.has(city.slug) && nearbyCities.length < 6) {
        // Find if any pros in this city
        const count = treatmentPros.filter((p) =>
          proIsInLocation(p, city.slug, city.city)
        ).length;

        nearbyCities.push({
          slug: city.slug,
          city: city.city,
          state: city.state,
          proCount: count,
        });
        addedSlugs.add(city.slug);
      }
    }
  }

  return nearbyCities;
}

/**
 * Calculate stats from local professionals
 */
function calculateStats(
  localPros: Professional[],
  allTreatmentPros: Professional[],
  treatment: TreatmentContent | null
): TreatmentLocationStats {
  const localProCount = localPros.length;
  const nationalProCount = allTreatmentPros.length;

  // Sum up reviews from local pros
  const localReviewCount = localPros.reduce((sum, pro) => sum + (pro.reviewCount || 0), 0);

  // Use treatment config price range or calculate from pros
  const priceMin = treatment?.priceRange.min || 0;
  const priceMax = treatment?.priceRange.max || 0;
  const avgPrice = priceMin && priceMax ? Math.round((priceMin + priceMax) / 2) : 0;

  return {
    localProCount,
    localReviewCount,
    avgPrice,
    priceRange: {
      min: priceMin,
      max: priceMax,
    },
    nationalProCount,
  };
}

/**
 * Get featured professionals for this treatment in this location
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

export function useTreatmentLocationData(
  treatmentSlug: string,
  locationSlug: string
): UseTreatmentLocationDataReturn {
  const [allPros, setAllPros] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate treatment slug
  const isValidTreatment = isValidTreatmentSlug(treatmentSlug);

  // Parse and validate location
  const location = useMemo(() => parseLocationSlug(locationSlug), [locationSlug]);
  const isValidLocation = location !== null && location.slug.length > 0;

  // Get treatment content from config
  const treatment = useMemo(() => {
    if (!isValidTreatment) return null;
    return getTreatmentContent(treatmentSlug) || null;
  }, [treatmentSlug, isValidTreatment]);

  // Get category info
  const category = useMemo(() => {
    if (!isValidTreatment) return null;
    return getCategoryForTreatment(treatmentSlug) || null;
  }, [treatmentSlug, isValidTreatment]);

  // Fetch professionals from API
  const fetchData = useCallback(async () => {
    if (!isValidTreatment) {
      setIsLoading(false);
      setError('Invalid treatment');
      return;
    }

    if (!isValidLocation) {
      setIsLoading(false);
      setError('Invalid location');
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
      console.error('Error fetching treatment location data:', err);
      setError(errorMessage);
      setAllPros([]);
    } finally {
      setIsLoading(false);
    }
  }, [isValidTreatment, isValidLocation]);

  // Fetch on mount or when slugs change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter professionals offering this treatment (nationwide)
  const treatmentPros = useMemo(() => {
    if (!treatment) return [];
    return allPros.filter((pro) => proOffersTreatment(pro, treatmentSlug, treatment.name));
  }, [allPros, treatmentSlug, treatment]);

  // Filter professionals in this location
  const localPros = useMemo(() => {
    if (!location) return [];
    return treatmentPros.filter((pro) =>
      proIsInLocation(pro, location.slug, location.city)
    );
  }, [treatmentPros, location]);

  // Memoized computed values
  const featuredLocalPros = useMemo(() => getFeaturedPros(localPros, 8), [localPros]);

  const stats = useMemo(
    () => calculateStats(localPros, treatmentPros, treatment),
    [localPros, treatmentPros, treatment]
  );

  const nearbyCities = useMemo(() => {
    if (!treatment || !location) return [];
    return getNearbyCities(allPros, treatment, location, treatmentSlug);
  }, [allPros, treatment, location, treatmentSlug]);

  const relatedTreatments = useMemo(() => {
    if (!treatment) return [];
    return getRelatedTreatmentContent(treatment.relatedTreatments);
  }, [treatment]);

  return {
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
    refetch: fetchData,
  };
}
