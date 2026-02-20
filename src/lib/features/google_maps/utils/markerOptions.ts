/**
 * Marker Options Configuration
 *
 * Default marker styling and animations for Google Maps.
 */

import type { MarkerOptions, LocationData } from '../types';
import { GLAMLINK_COLORS } from './mapOptions';

// Default marker icon URL (you can replace with custom marker)
export const DEFAULT_MARKER_ICON = {
  url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMiA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDBDNy4xNjMgMCAwIDcuMTYzIDAgMTZDMCAyMi4yODMgMCAzMiAxNiA0OEMzMiAzMiAyMi4yODMgMzIgMTZDMzIgNy4xNjMgMjQuODM3IDAgMTYgMFoiIGZpbGw9IiMyMkI4QzgiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iNiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
  scaledSize: { width: 32, height: 48 },
  anchor: { x: 16, y: 48 }
};

// Create custom SVG marker with business name initial
export const createBusinessMarker = (businessName: string): string => {
  const initial = businessName.charAt(0).toUpperCase();
  const svg = `
    <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16C0 22.283 0 32 16 48C32 32 32 22.283 32 16C32 7.163 24.837 0 16 0Z" fill="${GLAMLINK_COLORS.primary}"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
      <text x="16" y="20" text-anchor="middle" fill="${GLAMLINK_COLORS.primary}" font-family="Arial, sans-serif" font-size="10" font-weight="bold">${initial}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Default marker options
export const createDefaultMarkerOptions = (overrides: Partial<MarkerOptions> = {}): MarkerOptions => {
  return {
    icon: DEFAULT_MARKER_ICON,
    title: 'Business Location',
    ...overrides
  };
};

// Create marker options for business location
export const createBusinessMarkerOptions = (
  location: LocationData,
  overrides: Partial<MarkerOptions> = {}
): MarkerOptions => {
  const businessName = location.businessName || 'Business';
  const customIcon = location.businessName
    ? {
        url: createBusinessMarker(businessName),
        scaledSize: { width: 32, height: 48 },
        anchor: { x: 16, y: 48 }
      }
    : DEFAULT_MARKER_ICON;

  return createDefaultMarkerOptions({
    position: { lat: location.lat, lng: location.lng },
    title: businessName,
    icon: customIcon,
    ...overrides
  });
};

// Marker presets for different types
export const markerPresets = {
  // Business location
  business: (location: LocationData) => createBusinessMarkerOptions(location),

  // Service location
  service: (location: LocationData, serviceName?: string) => createBusinessMarkerOptions(location, {
    title: serviceName || 'Service Location',
    icon: {
      url: createBusinessMarker(serviceName || 'Service'),
      scaledSize: { width: 28, height: 42 },
      anchor: { x: 14, y: 42 }
    }
  }),

  // Current location (user's location)
  current: (position: { lat: number; lng: number }) => createDefaultMarkerOptions({
    position,
    title: 'Your Location',
    icon: {
      path: 'M 0,-8 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0 z', // SVG circle path
      scale: 1,
      fillColor: GLAMLINK_COLORS.secondary,
      fillOpacity: 0.8,
      strokeColor: 'white',
      strokeWidth: 2
    }
  })
};

export default {
  DEFAULT_MARKER_ICON,
  createBusinessMarker,
  createDefaultMarkerOptions,
  createBusinessMarkerOptions,
  markerPresets
};