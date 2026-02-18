"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { LocationData } from "@/lib/pages/for-professionals/types/professional";
import { mapService } from "@/lib/features/google_maps";
import type { GoogleMap, GoogleMarker, GoogleAdvancedMarker } from "@/lib/features/google_maps/types";
import {
  normalizeLocations,
  getPrimaryLocation,
  filterLocationsByQuery,
  getLocationsBounds,
} from "@/lib/utils/migrations/locationMigration";
import type { Professional } from "@/lib/pages/for-professionals/types/professional";

interface MarkerData {
  marker: GoogleMarker | GoogleAdvancedMarker;
  location: LocationData;
  isPrimary: boolean;
}

export interface UseMultiLocationMapsReturn {
  // Refs
  mapRef: React.RefObject<HTMLDivElement | null>;

  // State
  isLoading: boolean;
  mapError: string | null;
  selectedLocation: LocationData | null;
  isInfoWindowOpen: boolean;

  // Data
  locations: LocationData[];
  primaryLocation: LocationData | null;
  isMultiLocation: boolean;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredLocations: LocationData[];

  // Actions
  selectLocation: (location: LocationData) => void;
  showAllLocations: () => void;
  handleDirectionsClick: (location?: LocationData) => void;

  // URL generators
  getDirectionsUrl: (location: LocationData) => string;
  getOSMapUrl: (location: LocationData) => string;
}

export function useMultiLocationMaps(
  professional: Professional | null,
  zoom: number = 15,
  showInfo: boolean = true
): UseMultiLocationMapsReturn {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<GoogleMap | null>(null);
  const markersRef = useRef<MarkerData[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);

  // Normalize locations from professional data
  const locations = useMemo(() => {
    return normalizeLocations(professional);
  }, [professional]);

  // Get primary location
  const primaryLocation = useMemo(() => {
    return getPrimaryLocation(locations);
  }, [locations]);

  // Check if multi-location
  const isMultiLocation = locations.length > 1;

  // Filter locations by search query
  const filteredLocations = useMemo(() => {
    return filterLocationsByQuery(locations, searchQuery);
  }, [locations, searchQuery]);

  // Get directions URL
  const getDirectionsUrl = useCallback((location: LocationData) => {
    const query = encodeURIComponent(location.address || `${location.lat},${location.lng}`);
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  }, []);

  // Generate InfoWindow HTML content
  const getInfoWindowContent = useCallback((location: LocationData) => {
    const directionsUrl = getDirectionsUrl(location);
    const name = location.label || location.businessName || 'Location';
    const primaryBadge = location.isPrimary
      ? '<span style="color: #EAB308; margin-right: 4px;">★</span>'
      : '';

    return `
      <div style="padding: 15px; min-width: 200px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          ${primaryBadge}
          <h4 style="font-weight: 600; margin: 0; font-size: 14px; color: #111827;">${name}</h4>
        </div>
        <p style="margin: 0 0 10px 0; color: #4B5563; font-size: 13px; line-height: 1.4;">${location.address || ''}</p>
        <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer"
           style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: #22B8C8; color: white; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
          Get Directions
        </a>
      </div>
    `;
  }, [getDirectionsUrl]);

  // Get OpenStreetMap fallback URL
  const getOSMapUrl = useCallback((location: LocationData) => {
    const { lat, lng } = location;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;
  }, []);

  // Handle directions click
  const handleDirectionsClick = useCallback((location?: LocationData) => {
    const targetLocation = location || selectedLocation || primaryLocation;
    if (targetLocation) {
      const directionsUrl = getDirectionsUrl(targetLocation);
      window.open(directionsUrl, "_blank", "noopener,noreferrer");
    }
  }, [selectedLocation, primaryLocation, getDirectionsUrl]);

  // Create marker for a location
  const createMarkerForLocation = useCallback((
    map: GoogleMap,
    location: LocationData,
    isPrimary: boolean
  ): GoogleMarker | GoogleAdvancedMarker | null => {
    // Handler to open InfoWindow above marker
    const handleMarkerClick = (marker: GoogleMarker | GoogleAdvancedMarker) => {
      setSelectedLocation(location);

      // Create InfoWindow if it doesn't exist
      if (!infoWindowRef.current) {
        infoWindowRef.current = new google.maps.InfoWindow({
          pixelOffset: new google.maps.Size(0, -15), // Move popup higher above marker
          disableAutoPan: false,
        });
      }

      // Set content and open above the clicked marker
      infoWindowRef.current.setContent(getInfoWindowContent(location));
      infoWindowRef.current.setOptions({
        pixelOffset: new google.maps.Size(0, -15), // Ensure offset is applied
      });

      // For AdvancedMarkerElement, we need to get the position differently
      if ('position' in marker && marker.position) {
        infoWindowRef.current.setPosition(marker.position as google.maps.LatLng | google.maps.LatLngLiteral);
        infoWindowRef.current.open(map as unknown as google.maps.Map);
      } else {
        // Legacy marker
        infoWindowRef.current.open(map as unknown as google.maps.Map, marker as unknown as google.maps.Marker);
      }

      // Track that InfoWindow is open
      setIsInfoWindowOpen(true);

      // Listen for close event
      google.maps.event.addListenerOnce(infoWindowRef.current, 'closeclick', () => {
        setIsInfoWindowOpen(false);
      });
    };

    try {
      // Create marker with different styling for primary
      const marker = mapService.createBusinessAdvancedMarker(location, map, {
        zIndex: isPrimary ? 100 : 50  // Primary marker on top
      });

      // Add click handler for selection and InfoWindow
      if ('addEventListener' in marker) {
        marker.addEventListener('click', () => handleMarkerClick(marker));
      } else {
        (marker as any).addListener('click', () => handleMarkerClick(marker));
      }

      return marker;
    } catch (error) {
      console.warn('Failed to create advanced marker, using legacy:', error);
      try {
        const marker = mapService.createBusinessMarker(location, map);
        (marker as any).addListener('click', () => handleMarkerClick(marker));
        return marker;
      } catch (legacyError) {
        console.error('Failed to create marker:', legacyError);
        return null;
      }
    }
  }, [getInfoWindowContent]);

  // Select a location (pan to it)
  const selectLocation = useCallback((location: LocationData) => {
    setSelectedLocation(location);

    if (mapInstanceRef.current) {
      mapService.panToLocation(mapInstanceRef.current, location, zoom);
    }
  }, [zoom]);

  // Show all locations (fit bounds)
  const showAllLocations = useCallback(() => {
    setSelectedLocation(null);
    setIsInfoWindowOpen(false);

    // Close any open InfoWindow
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    if (mapInstanceRef.current && markersRef.current.length > 0) {
      const allMarkers = markersRef.current.map(m => m.marker);
      mapService.fitMapToMarkers(mapInstanceRef.current, allMarkers);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        setMapError(null);

        // Determine initial center (primary location or first location)
        const initialLocation = primaryLocation || locations[0];

        // Initialize map
        const map = await mapService.initializeMap(mapRef.current!, {
          center: { lat: initialLocation.lat, lng: initialLocation.lng },
          zoom: isMultiLocation ? 12 : zoom, // Zoom out for multi-location
          scrollWheel: true,
          draggable: true
        });

        mapInstanceRef.current = map;

        // Clear existing markers
        if (markersRef.current.length > 0) {
          mapService.clearMarkers(markersRef.current.map(m => m.marker));
          markersRef.current = [];
        }

        // Create markers for all locations
        locations.forEach(location => {
          const isPrimary = location.isPrimary || location.id === primaryLocation?.id;
          const marker = createMarkerForLocation(map, location, isPrimary);

          if (marker) {
            markersRef.current.push({
              marker,
              location,
              isPrimary
            });
          }
        });

        // If multi-location, fit bounds to show all markers
        if (isMultiLocation && markersRef.current.length > 1) {
          const allMarkers = markersRef.current.map(m => m.marker);
          mapService.fitMapToMarkers(map, allMarkers);
        }

        // Set initial selected location to primary
        setSelectedLocation(primaryLocation || locations[0]);

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing multi-location map:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to load Google Maps";
        setMapError(errorMessage);
        setIsLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      // Cleanup InfoWindow on unmount
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
      // Cleanup markers on unmount
      if (markersRef.current.length > 0) {
        mapService.clearMarkers(markersRef.current.map(m => m.marker));
        markersRef.current = [];
      }
    };
  }, [locations, primaryLocation, isMultiLocation, zoom, createMarkerForLocation]);

  return {
    // Refs
    mapRef,

    // State
    isLoading,
    mapError,
    selectedLocation,
    isInfoWindowOpen,

    // Data
    locations,
    primaryLocation,
    isMultiLocation,

    // Search
    searchQuery,
    setSearchQuery,
    filteredLocations,

    // Actions
    selectLocation,
    showAllLocations,
    handleDirectionsClick,

    // URL generators
    getDirectionsUrl,
    getOSMapUrl,
  };
}
