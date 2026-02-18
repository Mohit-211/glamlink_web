/**
 * Google Maps Configuration
 *
 * Central configuration for Google Maps API settings and environment variables.
 */

// API Configuration
export const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  version: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_VERSION || "weekly",
  libraries: ["places", "marker"] as const,

  // Default settings
  defaultZoom: 15,
  defaultCenter: {
    lat: 40.7128, // New York City
    lng: -74.0060
  },

  // Static map settings
  staticMapSize: {
    width: 600,
    height: 400
  }
};

// Environment validation
export const validateGoogleMapsConfig = (): boolean => {
  const { apiKey } = GOOGLE_MAPS_CONFIG;

  if (!apiKey) {
    console.warn('Google Maps API key not found in environment variables');
    return false;
  }

  return true;
};

// Get API key with validation
export const getGoogleMapsApiKey = (): string => {
  const { apiKey } = GOOGLE_MAPS_CONFIG;

  if (!apiKey) {
    throw new Error('Google Maps API key not configured. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.');
  }

  return apiKey;
};

export default GOOGLE_MAPS_CONFIG;