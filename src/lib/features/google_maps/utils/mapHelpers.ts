/**
 * Map Helper Functions
 *
 * Utility functions for Google Maps operations.
 */

import type { LocationData, StaticMapOptions, Coordinate } from '../types';
import { GOOGLE_MAPS_CONFIG } from '../config';
import { googleMapsLoader } from '../services/googleMapsLoader';

/**
 * Generate Google Maps directions URL for a location
 */
export const getDirectionsUrl = (location: LocationData): string => {
  const query = encodeURIComponent(location.address || `${location.lat},${location.lng}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
};

/**
 * Generate Google Maps search URL for a location
 */
export const getSearchUrl = (location: LocationData): string => {
  const query = encodeURIComponent(location.address || `${location.lat},${location.lng}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

/**
 * Generate static map URL
 */
export const getStaticMapUrl = (
  location: LocationData,
  options: StaticMapOptions = {}
): string => {
  const {
    width = 600,
    height = 400,
    zoom = 15,
    markers = `color:0x22B8C8|${location.lat},${location.lng}`,
    style = []
  } = options;

  const center = `${location.lat},${location.lng}`;
  const size = `${width}x${height}`;

  // Build URL parameters
  const params = new URLSearchParams({
    center,
    zoom: zoom.toString(),
    size,
    markers,
    key: GOOGLE_MAPS_CONFIG.apiKey || ''
  });

  // Add style parameters if provided
  if (style.length > 0) {
    params.append('style', style.join('|'));
  }

  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
};

/**
 * Validate coordinates
 */
export const isValidCoordinate = (coord: Coordinate): boolean => {
  return (
    typeof coord.lat === 'number' &&
    typeof coord.lng === 'number' &&
    coord.lat >= -90 &&
    coord.lat <= 90 &&
    coord.lng >= -180 &&
    coord.lng <= 180
  );
};

/**
 * Calculate distance between two coordinates (in kilometers)
 */
export const calculateDistance = (
  from: Coordinate,
  to: Coordinate
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLng = (to.lng - from.lng) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Format address for display
 */
export const formatAddress = (location: LocationData): string => {
  const parts = [location.address];

  if (location.city && location.state) {
    parts.push(`${location.city}, ${location.state}`);
  } else if (location.city) {
    parts.push(location.city);
  } else if (location.state) {
    parts.push(location.state);
  }

  if (location.zipCode) {
    parts.push(location.zipCode);
  }

  return parts.filter(Boolean).join(', ');
};

/**
 * Create location object from address string using Google Maps Geocoding API
 */
export const geocodeAddress = async (address: string): Promise<LocationData | null> => {
  if (!address || address.trim().length === 0) {
    return null;
  }

  try {
    // Wait for Google Maps to be loaded
    await googleMapsLoader.load();

    const googleMaps = (window as any).google?.maps;
    if (!googleMaps) {
      console.warn('Google Maps not loaded');
      return createSimpleLocationData(address);
    }

    const geocoder = new googleMaps.Geocoder();

    return new Promise<LocationData | null>((resolve) => {
      geocoder.geocode({ address: address.trim() }, (results: any, status: any) => {
        if (status === 'OK' && results && results.length > 0) {
          const result = results[0];
          const location = result.geometry.location;

          // Extract address components
          const addressComponents = result.address_components;
          let city = '';
          let state = '';
          let zipCode = '';

          addressComponents.forEach((component: any) => {
            const types = component.types;

            if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.short_name;
            } else if (types.includes('postal_code')) {
              zipCode = component.long_name;
            }
          });

          const locationData: LocationData = {
            address: result.formatted_address,
            lat: location.lat(),
            lng: location.lng(),
            city: city || undefined,
            state: state || undefined,
            zipCode: zipCode || undefined,
            description: `Business location: ${result.formatted_address}`
          };

          resolve(locationData);
        } else {
          console.warn('Geocoding failed:', status);
          resolve(createSimpleLocationData(address));
        }
      });
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return createSimpleLocationData(address);
  }
};

/**
 * Create a simple location data object as fallback
 */
function createSimpleLocationData(address: string): LocationData {
  // Parse basic info from address string
  const parts = address.split(',').map(p => p.trim());
  const city = parts.length > 1 ? parts[parts.length - 2] : undefined;
  const state = parts.length > 1 ? parts[parts.length - 1].split(' ')[0] : undefined;

  return {
    address: address,
    lat: 36.1699, // Default to Las Vegas
    lng: -115.1398,
    city: city,
    state: state,
    description: `Business location: ${address}`
  };
}

/**
 * Get place predictions using Google Places API
 */
export const getPlacePredictions = async (input: string): Promise<any[]> => {
  if (!input || input.trim().length < 2) {
    return [];
  }

  try {
    await googleMapsLoader.load();

    const googleMaps = (window as any).google?.maps;
    if (!googleMaps?.places) {
      console.warn('Google Places library not loaded');
      return [];
    }

    const autocompleteService = new googleMaps.places.AutocompleteService();

    return new Promise<any[]>((resolve) => {
      autocompleteService.getPlacePredictions(
        {
          input: input.trim(),
          componentRestrictions: { country: 'us' }, // Restrict to US addresses
          types: ['address'] // Focus on addresses rather than establishments
        },
        (predictions: any, status: any) => {
          if (status === 'OK' && predictions) {
            resolve(predictions);
          } else {
            console.warn('Place predictions failed:', status);
            resolve([]);
          }
        }
      );
    });
  } catch (error) {
    console.error('Place predictions error:', error);
    return [];
  }
};

/**
 * Get place details from place ID
 */
export const getPlaceDetails = async (placeId: string): Promise<LocationData | null> => {
  if (!placeId) {
    return null;
  }

  try {
    await googleMapsLoader.load();

    const googleMaps = (window as any).google?.maps;
    if (!googleMaps?.places) {
      console.warn('Google Places library not loaded');
      return null;
    }

    const placesService = new googleMaps.places.PlacesService(document.createElement('div'));

    return new Promise<LocationData | null>((resolve) => {
      placesService.getDetails(
        {
          placeId: placeId,
          fields: ['formatted_address', 'geometry', 'address_components']
        },
        (result: any, status: any) => {
          if (status === 'OK' && result) {
            const location = result.geometry?.location;
            if (!location) {
              resolve(null);
              return;
            }

            // Extract address components
            const addressComponents = result.address_components || [];
            let city = '';
            let state = '';
            let zipCode = '';

            addressComponents.forEach((component: any) => {
              const types = component.types;

              if (types.includes('locality')) {
                city = component.long_name;
              } else if (types.includes('administrative_area_level_1')) {
                state = component.short_name;
              } else if (types.includes('postal_code')) {
                zipCode = component.long_name;
              }
            });

            const locationData: LocationData = {
              address: result.formatted_address || '',
              lat: location.lat(),
              lng: location.lng(),
              city: city || undefined,
              state: state || undefined,
              zipCode: zipCode || undefined,
              description: `Business location: ${result.formatted_address}`
            };

            resolve(locationData);
          } else {
            console.warn('Place details failed:', status);
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Place details error:', error);
    return null;
  }
};

/**
 * Check if a location is within a certain radius of another location
 */
export const isWithinRadius = (
  center: Coordinate,
  point: Coordinate,
  radiusKm: number
): boolean => {
  const distance = calculateDistance(center, point);
  return distance <= radiusKm;
};

/**
 * Get a bounding box around a center point
 */
export const getBoundingBox = (
  center: Coordinate,
  radiusKm: number
): { northeast: Coordinate; southwest: Coordinate } => {
  // Approximate calculation (1 degree ≈ 111 km)
  const latOffset = radiusKm / 111;
  const lngOffset = radiusKm / (111 * Math.cos(center.lat * Math.PI / 180));

  return {
    northeast: {
      lat: center.lat + latOffset,
      lng: center.lng + lngOffset
    },
    southwest: {
      lat: center.lat - latOffset,
      lng: center.lng - lngOffset
    }
  };
};

/**
 * Debounce function for map interactions
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default {
  getDirectionsUrl,
  getSearchUrl,
  getStaticMapUrl,
  isValidCoordinate,
  calculateDistance,
  formatAddress,
  geocodeAddress,
  getPlacePredictions,
  getPlaceDetails,
  isWithinRadius,
  getBoundingBox,
  debounce
};