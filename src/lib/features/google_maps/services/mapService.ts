/**
 * Google Maps Service
 *
 * Core Google Maps functionality for creating and managing maps, markers, and info windows.
 */

import type {
  MapOptions,
  MarkerOptions,
  InfoWindowOptions,
  LocationData,
  MapService,
  GoogleMap,
  GoogleMarker,
  GoogleAdvancedMarker,
  GoogleInfoWindow
} from '../types';
import { createDefaultMapOptions } from '../utils/mapOptions';
import { createBusinessMarkerOptions } from '../utils/markerOptions';
import { getDirectionsUrl, formatAddress } from '../utils/mapHelpers';
import { googleMapsLoader } from './googleMapsLoader';

class GoogleMapsServiceImpl implements MapService {
  private mapsLoaded = false;
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  /**
   * Initialize the service by loading Google Maps
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    this.initialized = true;

    try {
      await googleMapsLoader.load();
      this.mapsLoaded = true;
    } catch (error) {
      console.error('Failed to initialize Google Maps service:', error);
      throw error;
    }
  }

  /**
   * Ensure Google Maps is loaded before performing operations
   */
  private async ensureMapsLoaded(): Promise<void> {
    if (!this.mapsLoaded) {
      await this.initialize();
    }
    if (!(window as any).google?.maps?.Map) {
      throw new Error('Google Maps Map constructor not available');
    }
  }

  /**
   * Initialize a Google Map instance
   */
  async initializeMap(
    container: HTMLElement,
    options: MapOptions = {}
  ): Promise<GoogleMap> {
    await this.ensureMapsLoaded();

    const mapOptions = createDefaultMapOptions(options);

    console.log('Map options being passed:', mapOptions);
    console.log('Container element:', container);

    // Validate required properties
    if (!container) {
      throw new Error('Container element is required');
    }

    if (!mapOptions.center || !('lat' in mapOptions.center && 'lng' in mapOptions.center)) {
      throw new Error('Map center coordinates are required');
    }

    if (typeof mapOptions.center.lat !== 'number' || typeof mapOptions.center.lng !== 'number') {
      throw new Error('Map center coordinates must be numbers');
    }

    try {
      const map = new (window as any).google.maps.Map(container, mapOptions);
      return map;
    } catch (error) {
      console.error('Failed to initialize map:', error);
      console.error('Map options that caused error:', JSON.stringify(mapOptions, null, 2));
      console.error('Container element:', container);
      console.error('Google Maps constructor:', (window as any).google.maps.Map);
      throw new Error('Map initialization failed');
    }
  }

  /**
   * Create an advanced marker with business location styling (recommended)
   */
  createAdvancedMarker(options: any = {}): GoogleAdvancedMarker {
    const googleMaps = (window as any).google?.maps;
    if (!googleMaps?.marker) {
      console.warn('Advanced marker not available, falling back to legacy marker');
      return this.createMarker(options) as GoogleAdvancedMarker;
    }

    try {
      const marker = new googleMaps.marker.AdvancedMarkerElement(options);
      return marker;
    } catch (error) {
      console.error('Failed to create advanced marker:', error);
      throw new Error('Advanced marker creation failed');
    }
  }

  /**
   * Create a marker with business location styling (legacy fallback)
   */
  createMarker(options: MarkerOptions = {}): GoogleMarker {
    const googleMaps = (window as any).google?.maps;
    if (!googleMaps) {
      throw new Error('Google Maps not loaded');
    }

    try {
      const marker = new googleMaps.Marker(options);
      return marker;
    } catch (error) {
      console.error('Failed to create marker:', error);
      throw new Error('Marker creation failed');
    }
  }

  /**
   * Create a business marker for a location using advanced marker (recommended)
   */
  createBusinessAdvancedMarker(
    location: LocationData,
    map?: GoogleMap,
    overrides: any = {}
  ): GoogleAdvancedMarker {
    // Use label first, then businessName, then fallback to 'Location'
    const markerLabel = location.label || location.businessName || 'Location';

    // Create HTML element for advanced marker content
    const contentElement = this.createAdvancedMarkerContent(markerLabel);

    const markerOptions = {
      position: { lat: location.lat, lng: location.lng },
      map: map || null,
      title: markerLabel,
      gmpClickable: true,
      content: contentElement,
      ...overrides
    };

    return this.createAdvancedMarker(markerOptions);
  }

  /**
   * Create a business marker for a location (legacy)
   */
  createBusinessMarker(
    location: LocationData,
    map?: GoogleMap,
    overrides: MarkerOptions = {}
  ): GoogleMarker {
    const markerOptions = createBusinessMarkerOptions(location, {
      ...overrides
    });

    // Set map separately to avoid type issues
    if (map) {
      (markerOptions as any).map = map;
    }

    return this.createMarker(markerOptions);
  }

  /**
   * Create an info window
   */
  createInfoWindow(options: InfoWindowOptions = {}): GoogleInfoWindow {
    const googleMaps = (window as any).google?.maps;
    if (!googleMaps) {
      throw new Error('Google Maps not loaded');
    }

    try {
      const infoWindow = new googleMaps.InfoWindow(options);
      return infoWindow;
    } catch (error) {
      console.error('Failed to create info window:', error);
      throw new Error('Info window creation failed');
    }
  }

  /**
   * Create an info window for business location
   */
  createBusinessInfoWindow(location: LocationData): GoogleInfoWindow {
    const content = this.generateBusinessInfoWindowContent(location);

    return this.createInfoWindow({
      content
    } as InfoWindowOptions);
  }

  /**
   * Generate HTML content for business info window
   */
  private generateBusinessInfoWindowContent(location: LocationData): string {
    const businessName = location.businessName || 'Business Location';
    const address = formatAddress(location);

    return `
      <div class="p-3 max-w-xs">
        <h3 class="font-semibold text-gray-900 mb-2">
          ${businessName}
        </h3>
        <p class="text-sm text-gray-600 mb-2">
          ${address}
        </p>
        ${location.phone ? `
          <p class="text-xs text-gray-500 mb-1">
            📞 ${location.phone}
          </p>
        ` : ''}
        <div class="mt-3 pt-3 border-t border-gray-200">
          <a
            href="${getDirectionsUrl(location)}"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Get Directions →
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Add marker with info window to map (using advanced marker)
   */
  addMarkerWithInfoWindow(
    map: GoogleMap,
    location: LocationData,
    options: {
      autoOpen?: boolean;
      markerOverrides?: MarkerOptions;
      infoWindowOverrides?: InfoWindowOptions;
      useAdvancedMarker?: boolean;
    } = {}
  ): { marker: GoogleMarker | GoogleAdvancedMarker; infoWindow: GoogleInfoWindow } {
    const {
      autoOpen = false,
      markerOverrides = {},
      infoWindowOverrides = {},
      useAdvancedMarker = true
    } = options;

    // Create marker (try advanced first, fallback to legacy)
    let marker: GoogleMarker | GoogleAdvancedMarker;
    try {
      marker = this.createBusinessAdvancedMarker(location, map, markerOverrides);
    } catch (error) {
      console.warn('Advanced marker failed, using legacy marker:', error);
      marker = this.createBusinessMarker(location, map, markerOverrides);
    }

    // Create info window
    const infoWindow = this.createBusinessInfoWindow(location);

    // Apply overrides to info window
    if (infoWindowOverrides.content) {
      infoWindow.setContent(infoWindowOverrides.content as string);
    }

    // Add click listener to open info window
    if ('addEventListener' in marker) {
      // Advanced marker
      (marker as GoogleAdvancedMarker).addEventListener('gmp-click', () => {
        infoWindow.open(map, marker as any);
      });
    } else {
      // Legacy marker
      (marker as GoogleMarker).addListener('click', () => {
        infoWindow.open(map, marker as any);
      });
    }

    // Auto-open if requested
    if (autoOpen) {
      infoWindow.open(map, marker as any);
    }

    return { marker, infoWindow };
  }

  /**
   * Get directions URL for a location
   */
  getDirectionsUrl(location: LocationData): string {
    return getDirectionsUrl(location);
  }

  /**
   * Get static map URL for fallback display
   */
  getStaticMapUrl(location: LocationData): string {
    // If Google Maps isn't loaded, return a basic URL
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return '';

    return `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=600x400&markers=color:0x22B8C8|${location.lat},${location.lng}&key=${apiKey}`;
  }

  /**
   * Generate static map URL using current configuration
   */
  private generateStaticMapUrl(location: LocationData): string {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return '';

    const center = `${location.lat},${location.lng}`;
    const markers = `color:0x22B8C8|${center}`;

    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=15&size=600x400&markers=${markers}&key=${apiKey}`;
  }

  /**
   * Pan map to a location with optional animation
   */
  panToLocation(map: GoogleMap, location: LocationData, zoom?: number): void {
    const position = { lat: location.lat, lng: location.lng };

    if (zoom !== undefined) {
      map.setZoom(zoom);
    }

    map.panTo(position);
  }

  /**
   * Fit map to show multiple markers
   */
  fitMapToMarkers(map: GoogleMap, markers: (GoogleMarker | GoogleAdvancedMarker)[]): void {
    if (markers.length === 0) return;

    const googleMaps = (window as any).google?.maps;
    if (!googleMaps?.LatLngBounds) return;

    const bounds = new googleMaps.LatLngBounds();

    markers.forEach(marker => {
      const position = 'getPosition' in marker ? (marker as any).getPosition?.() : marker.position;
      if (position) {
        bounds.extend(position);
      }
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
    }
  }

  /**
   * Clear all markers from a map
   */
  clearMarkers(markers: (GoogleMarker | GoogleAdvancedMarker)[]): void {
    markers.forEach(marker => {
      if ('setMap' in marker && typeof (marker as any).setMap === 'function') {
        (marker as any).setMap(null);
      } else if (marker.map) {
        marker.map = null;
      }
    });
  }

  /**
   * Check if Google Maps is available
   */
  isAvailable(): boolean {
    return typeof window !== 'undefined' &&
           this.mapsLoaded &&
           !!(window as any).google?.maps?.Map;
  }

  /**
   * Get current loading state
   */
  getLoadingState(): 'idle' | 'loading' | 'loaded' | 'error' {
    return googleMapsLoader.getLoadingState();
  }

  /**
   * Create SVG icon for advanced markers
   */
  createDefaultAdvancedMarkerIcon(): string {
    const svg = `
      <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16C0 22.283 0 32 16 48C32 32 32 22.283 32 16C32 7.163 24.837 0 16 0Z" fill="#22B8C8"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
        <circle cx="16" cy="16" r="3" fill="#22B8C8"/>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Create HTML element for advanced marker content
   */
  private createAdvancedMarkerContent(labelText: string): HTMLElement {
    const initial = labelText && labelText.length > 0 ? labelText.charAt(0).toUpperCase() : 'L';

    // Create a div element
    const container = document.createElement('div');
    container.style.width = '32px';
    container.style.height = '48px';
    container.style.position = 'relative';

    try {
      // Create the SVG element
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '32');
      svg.setAttribute('height', '48');
      svg.setAttribute('viewBox', '0 0 32 48');
      svg.style.display = 'block';

      // Create the pin shape
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M16 0C7.163 0 0 7.163 0 16C0 22.283 0 32 16 48C32 32 32 22.283 32 16C32 7.163 24.837 0 16 0Z');
      path.setAttribute('fill', '#22B8C8');
      svg.appendChild(path);

      // Create the inner circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '16');
      circle.setAttribute('cy', '16');
      circle.setAttribute('r', '6');
      circle.setAttribute('fill', 'white');
      svg.appendChild(circle);

      // Create the text element
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '16');
      text.setAttribute('y', '20');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#22B8C8');
      text.setAttribute('font-family', 'Arial, sans-serif');
      text.setAttribute('font-size', '10');
      text.setAttribute('font-weight', 'bold');
      text.textContent = initial;
      svg.appendChild(text);

      container.appendChild(svg);
    } catch (error) {
      console.error('Error creating marker content:', error);
      // Fallback: simple div with styling
      container.innerHTML = `
        <div style="
          width: 32px;
          height: 32px;
          background: #22B8C8;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            transform: rotate(45deg);
            color: white;
            font-size: 12px;
            font-weight: bold;
          ">${initial}</span>
        </div>
      `;
    }

    return container;
  }

  /**
   * Create business SVG marker with initial
   */
  createBusinessMarkerSVG(businessName: string): string {
    const initial = businessName.charAt(0).toUpperCase();
    const svg = `
      <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16C0 22.283 0 32 16 48C32 32 32 22.283 32 16C32 7.163 24.837 0 16 0Z" fill="#22B8C8"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
        <text x="16" y="20" text-anchor="middle" fill="#22B8C8" font-family="Arial, sans-serif" font-size="10" font-weight="bold">${initial}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
}

// Export singleton instance
export const mapService = new GoogleMapsServiceImpl();

// Export class for testing or custom instances
export { GoogleMapsServiceImpl };