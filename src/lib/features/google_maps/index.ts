/**
 * Google Maps Feature
 *
 * Main exports for the Google Maps feature module.
 */

// Types
export type {
  LocationData,
  MapOptions,
  MarkerOptions,
  InfoWindowOptions,
  MapService,
  StaticMapOptions,
  MapLoadingState,
  Coordinate,
  AddressComponents
} from './types';

// Services
export {
  googleMapsLoader,
  loadGoogleMaps
} from './services/googleMapsLoader';

import { mapService, GoogleMapsServiceImpl as MapServiceClass } from './services/mapService';

export {
  mapService,
  MapServiceClass
};

// Configuration
export {
  GOOGLE_MAPS_CONFIG,
  validateGoogleMapsConfig,
  getGoogleMapsApiKey
} from './config';

// Utilities
export {
  defaultMapStyles,
  createDefaultMapOptions,
  mapOptionsPresets,
  GLAMLINK_COLORS
} from './utils/mapOptions';

export {
  DEFAULT_MARKER_ICON,
  createBusinessMarker,
  createDefaultMarkerOptions,
  createBusinessMarkerOptions,
  markerPresets
} from './utils/markerOptions';

export {
  getDirectionsUrl,
  getSearchUrl,
  getStaticMapUrl,
  isValidCoordinate,
  calculateDistance,
  formatAddress,
  geocodeAddress,
  isWithinRadius,
  getBoundingBox,
  debounce
} from './utils/mapHelpers';

// Map loading state helper
export const getMapLoadingState = (): 'idle' | 'loading' | 'loaded' | 'error' => {
  return mapService.getLoadingState();
};