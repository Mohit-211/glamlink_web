/**
 * Google Maps TypeScript Type Definitions
 *
 * This file provides type definitions for the Google Maps JavaScript API
 * to ensure type safety across the application.
 */

// Basic Map interfaces (avoiding google namespace conflicts)
export interface GoogleMap {
  setCenter: (latlng: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  panTo: (latlng: { lat: number; lng: number }) => void;
  fitBounds: (bounds: any) => void;
  addListener: (event: string, handler: Function) => any;
}

export interface GoogleMarker {
  position: { lat: number; lng: number } | null;
  map: GoogleMap | null;
  title: string | undefined;
  setMap: (map: GoogleMap | null) => void;
  addListener: (event: string, handler: Function) => void;
}

export interface GoogleAdvancedMarker extends GoogleMarker {
  gmpClickable: boolean;
  content: HTMLElement | string | null | undefined;
  addEventListener: (type: string, handler: (event: any) => void) => void;
  removeEventListener: (type: string, handler: (event: any) => void) => void;
  position: { lat: number; lng: number } | null;
  map: GoogleMap | null;
}

export interface GoogleInfoWindow {
  open: (map: GoogleMap, anchor?: any) => void;
  close: () => void;
  setContent: (content: string | Node) => void;
}

// Map configuration interfaces
export interface MapOptions {
  center?: { lat: number; lng: number };
  zoom?: number;
  scrollWheel?: boolean;
  draggable?: boolean;
  styles?: any[];
  mapTypeControl?: boolean;
  streetViewControl?: boolean;
  fullscreenControl?: boolean;
  zoomControl?: boolean;
  gestureHandling?: string;
  mapTypeId?: string;
  mapId?: string; // REQUIRED for AdvancedMarkerElement
}

export interface MarkerOptions {
  position?: { lat: number; lng: number };
  map?: GoogleMap;
  title?: string;
  icon?: any;
  animation?: any;
  clickable?: boolean;
  draggable?: boolean;
}

export interface InfoWindowOptions {
  content?: string | Node;
  maxWidth?: number;
}

// Enhanced LocationData interface with all Google Maps related properties
export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  businessName?: string;
  phone?: string;
  email?: string;
  hours?: string | string[];  // Array of business hours (e.g., ["Mon-Fri: 9am-5pm", "Sat: 10am-2pm"]) - also accepts legacy string format
  googleMapsUrl?: string;
  description?: string;

  // Multi-location support fields
  id?: string;           // Unique identifier for each location
  isPrimary?: boolean;   // Marks the primary/default location
  label?: string;        // Display label (e.g., "Main Office", "Downtown Studio")
}

// Map service interface
export interface MapService {
  initializeMap(container: HTMLElement, options?: MapOptions): Promise<GoogleMap>;
  createMarker(options: MarkerOptions): GoogleMarker;
  createInfoWindow(options: InfoWindowOptions): GoogleInfoWindow;
  getDirectionsUrl(location: LocationData): string;
  getStaticMapUrl(location: LocationData, options?: StaticMapOptions): string;
}

export interface StaticMapOptions {
  width?: number;
  height?: number;
  zoom?: number;
  markers?: string;
  style?: string[];
}

// Google Maps loader interface
export interface GoogleMapsLoaderOptions {
  apiKey?: string;
  version?: string;
  libraries?: string[];
}

// Loading states
export type MapLoadingState = 'idle' | 'loading' | 'loaded' | 'error';

// Map styling interfaces
export interface MapStyleFeature {
  featureType: string;
  elementType: string;
  stylers: Array<{ [key: string]: any }>;
}

// Event handlers
export type MapClickHandler = (event: any) => void;
export type MarkerClickHandler = () => void;

// Utility interfaces
export interface Coordinate {
  lat: number;
  lng: number;
}

export interface AddressComponents {
  street_number?: string;
  route?: string;
  locality?: string;
  administrative_area_level_1?: string;
  administrative_area_level_2?: string;
  country?: string;
  postal_code?: string;
}

export default {};