/**
 * Location Types for Services Module
 *
 * Defines the structure for locations/cities where services are offered.
 */

// =============================================================================
// LOCATION
// =============================================================================

export interface Location {
  id: string;
  slug: string;
  city: string;
  state: string;
  stateFullName: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  neighborhoods: string[];
  nearbyCities: string[];
  timezone?: string;
  proCount?: number;
  seoMeta?: {
    title: string;
    description: string;
  };
}

// =============================================================================
// LOCATION CARD (for display)
// =============================================================================

export interface LocationCardData {
  slug: string;
  city: string;
  state: string;
  proCount: number;
  image?: string;
}

// =============================================================================
// POPULAR CITIES CONFIG
// =============================================================================

export interface PopularCity {
  slug: string;
  city: string;
  state: string;
  image?: string;
}
