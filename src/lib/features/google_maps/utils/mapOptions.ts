/**
 * Map Options Configuration
 *
 * Default map styling and options for Google Maps.
 */

import type { MapOptions, MapStyleFeature } from '../types';

// Glamlink brand colors for map styling
export const GLAMLINK_COLORS = {
  primary: '#22B8C8',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  light: '#F5F5F5',
  medium: '#9CA3AF',
  dark: '#1F2937'
};

// Default map styling matching glamlink brand
export const defaultMapStyles: MapStyleFeature[] = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e9e9e9" }, { lightness: 17 }]
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }, { lightness: 20 }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }, { lightness: 17 }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }]
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }, { lightness: 18 }]
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }, { lightness: 16 }]
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }, { lightness: 21 }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#dedede" }, { lightness: 21 }]
  }
];

// Default map options
export const createDefaultMapOptions = (overrides: Partial<MapOptions> = {}): MapOptions => {
  return {
    zoom: 15,
    mapTypeControl: false,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
    scrollWheel: true,
    draggable: true,
    styles: defaultMapStyles,
    mapId: 'DEMO_MAP_ID', // REQUIRED for AdvancedMarkerElement
    ...overrides
  };
};

// Map options for different contexts
export const mapOptionsPresets = {
  // For business location display
  business: createDefaultMapOptions({
    zoom: 16,
    scrollWheel: false,
    draggable: true
  }),

  // For directions view
  directions: createDefaultMapOptions({
    zoom: 14,
    mapTypeControl: true
  }),

  // For embedded displays
  embedded: createDefaultMapOptions({
    zoom: 15,
    scrollWheel: false,
    draggable: false,
    zoomControl: false,
    fullscreenControl: false,
    streetViewControl: false
  })
};

export default {
  defaultMapStyles,
  createDefaultMapOptions,
  mapOptionsPresets,
  GLAMLINK_COLORS
};