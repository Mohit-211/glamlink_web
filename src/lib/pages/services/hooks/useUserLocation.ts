'use client';

/**
 * useUserLocation Hook
 *
 * Handles user location detection for the services module.
 * Uses browser Geolocation API and reverse geocoding to detect user's city.
 * Stores location in localStorage for persistence across sessions.
 */

import { useState, useEffect, useCallback } from 'react';
import { POPULAR_CITIES } from '../config/treatments';

// =============================================================================
// TYPES
// =============================================================================

export interface UserLocation {
  city: string;      // Display name: "Las Vegas"
  state: string;     // State code: "NV"
  slug: string;      // URL slug: "las-vegas"
}

export interface UseUserLocationReturn {
  // State
  userLocation: UserLocation | null;
  isLoading: boolean;
  hasAsked: boolean;              // Has user been prompted?
  hasPermission: boolean | null;  // null = not asked, true/false = answered
  error: string | null;

  // Actions
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
  setManualLocation: (city: string, state: string) => void;
  dismissPrompt: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const STORAGE_KEY = 'glamlink_user_location';
const PROMPT_DISMISSED_KEY = 'glamlink_location_prompt_dismissed';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create a URL-friendly slug from city name
 */
function createCitySlug(city: string): string {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Find a matching city from POPULAR_CITIES or create a new entry
 */
function findOrCreateCity(city: string, state: string): UserLocation {
  // Try to match with popular cities (case-insensitive)
  const normalizedCity = city.toLowerCase().trim();
  const matchedCity = POPULAR_CITIES.find(
    (c) => c.city.toLowerCase() === normalizedCity
  );

  if (matchedCity) {
    return {
      city: matchedCity.city,
      state: matchedCity.state,
      slug: matchedCity.slug,
    };
  }

  // Create new entry for cities not in our list
  return {
    city: city.trim(),
    state: state.toUpperCase().trim(),
    slug: createCitySlug(city),
  };
}

/**
 * Reverse geocode coordinates to get city and state
 * Uses free OpenStreetMap Nominatim API
 */
async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<{ city: string; state: string } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en',
          'User-Agent': 'Glamlink Beauty Marketplace',
        },
      }
    );

    if (!response.ok) {
      console.error('Reverse geocoding failed:', response.status);
      return null;
    }

    const data = await response.json();
    const address = data.address;

    if (!address) {
      return null;
    }

    // Extract city name (try multiple fields)
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      null;

    // Extract state
    const state = address.state || address.region || null;

    if (!city) {
      console.warn('Could not determine city from geocoding response:', address);
      return null;
    }

    // Convert full state name to abbreviation for US states
    const stateAbbr = getStateAbbreviation(state) || state || '';

    return { city, state: stateAbbr };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Convert US state name to abbreviation
 */
function getStateAbbreviation(stateName: string | null): string | null {
  if (!stateName) return null;

  const stateMap: Record<string, string> = {
    'alabama': 'AL',
    'alaska': 'AK',
    'arizona': 'AZ',
    'arkansas': 'AR',
    'california': 'CA',
    'colorado': 'CO',
    'connecticut': 'CT',
    'delaware': 'DE',
    'florida': 'FL',
    'georgia': 'GA',
    'hawaii': 'HI',
    'idaho': 'ID',
    'illinois': 'IL',
    'indiana': 'IN',
    'iowa': 'IA',
    'kansas': 'KS',
    'kentucky': 'KY',
    'louisiana': 'LA',
    'maine': 'ME',
    'maryland': 'MD',
    'massachusetts': 'MA',
    'michigan': 'MI',
    'minnesota': 'MN',
    'mississippi': 'MS',
    'missouri': 'MO',
    'montana': 'MT',
    'nebraska': 'NE',
    'nevada': 'NV',
    'new hampshire': 'NH',
    'new jersey': 'NJ',
    'new mexico': 'NM',
    'new york': 'NY',
    'north carolina': 'NC',
    'north dakota': 'ND',
    'ohio': 'OH',
    'oklahoma': 'OK',
    'oregon': 'OR',
    'pennsylvania': 'PA',
    'rhode island': 'RI',
    'south carolina': 'SC',
    'south dakota': 'SD',
    'tennessee': 'TN',
    'texas': 'TX',
    'utah': 'UT',
    'vermont': 'VT',
    'virginia': 'VA',
    'washington': 'WA',
    'west virginia': 'WV',
    'wisconsin': 'WI',
    'wyoming': 'WY',
    'district of columbia': 'DC',
  };

  const normalized = stateName.toLowerCase().trim();
  return stateMap[normalized] || null;
}

// =============================================================================
// HOOK
// =============================================================================

export function useUserLocation(): UseUserLocationReturn {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load saved location from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const location = JSON.parse(saved) as UserLocation;
        setUserLocation(location);
        setHasPermission(true);
      }

      const dismissed = localStorage.getItem(PROMPT_DISMISSED_KEY);
      if (dismissed === 'true') {
        setHasAsked(true);
        if (!saved) {
          setHasPermission(false);
        }
      }
    } catch (e) {
      console.error('Error loading saved location:', e);
    }
  }, []);

  /**
   * Request user's location via browser Geolocation API
   */
  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setHasAsked(true);

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        setHasPermission(false);
        localStorage.setItem(PROMPT_DISMISSED_KEY, 'true');
        return;
      }

      // Request location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get city
      const geocoded = await reverseGeocode(latitude, longitude);

      if (!geocoded) {
        setError('Could not determine your city');
        setHasPermission(false);
        localStorage.setItem(PROMPT_DISMISSED_KEY, 'true');
        return;
      }

      // Create location object
      const location = findOrCreateCity(geocoded.city, geocoded.state);

      // Save to state and localStorage
      setUserLocation(location);
      setHasPermission(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      localStorage.removeItem(PROMPT_DISMISSED_KEY);
    } catch (err) {
      console.error('Location request error:', err);

      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location unavailable');
            break;
          case err.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('Could not get your location');
        }
      } else {
        setError('Could not get your location');
      }

      setHasPermission(false);
      localStorage.setItem(PROMPT_DISMISSED_KEY, 'true');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear saved location
   */
  const clearLocation = useCallback(() => {
    setUserLocation(null);
    setHasPermission(null);
    setHasAsked(false);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROMPT_DISMISSED_KEY);
  }, []);

  /**
   * Manually set location (for city selection)
   */
  const setManualLocation = useCallback((city: string, state: string) => {
    const location = findOrCreateCity(city, state);
    setUserLocation(location);
    setHasPermission(true);
    setHasAsked(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    localStorage.removeItem(PROMPT_DISMISSED_KEY);
  }, []);

  /**
   * Dismiss the location prompt without sharing location
   */
  const dismissPrompt = useCallback(() => {
    setHasAsked(true);
    setHasPermission(false);
    localStorage.setItem(PROMPT_DISMISSED_KEY, 'true');
  }, []);

  return {
    userLocation,
    isLoading,
    hasAsked,
    hasPermission,
    error,
    requestLocation,
    clearLocation,
    setManualLocation,
    dismissPrompt,
  };
}
