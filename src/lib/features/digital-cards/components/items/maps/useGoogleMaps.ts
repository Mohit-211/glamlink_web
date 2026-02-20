"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { LocationData } from "@/lib/pages/for-professionals/types/professional";
import { mapService } from "@/lib/features/google_maps";
import type { GoogleMap, GoogleMarker, GoogleAdvancedMarker } from "@/lib/features/google_maps/types";

export interface UseGoogleMapsReturn {
  // State
  mapRef: React.RefObject<HTMLDivElement | null>;
  mapError: string | null;
  isLoading: boolean;
  isInfoWindowOpen: boolean;

  // Location data
  location: LocationData;

  // Event handlers
  handleDirectionsClick: () => void;
  handleMapClick: () => void;

  // URL generators
  getDirectionsUrl: () => string;
  getOSMapUrl: () => string;
  getStaticMapUrl: () => string;
}

export function useGoogleMaps(
  locationData?: LocationData,
  zoom: number = 15,
  showInfo: boolean = true,
  clickMapForDirections: boolean = true
): UseGoogleMapsReturn {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<GoogleMap | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);

  // Fallback coordinates if no location data is provided
  const fallbackLocation: LocationData = {
    lat: 36.1699, // Las Vegas
    lng: -115.1398,
    address: "Las Vegas, NV",
    city: "Las Vegas",
    state: "NV",
    zipCode: "89101",
    businessName: "Business Location",
    phone: undefined,
    email: undefined,
    hours: undefined,
    googleMapsUrl: undefined,
    description: undefined,
  };

  const location = locationData || fallbackLocation;

  // Get directions URL
  const getDirectionsUrl = () => {
    const query = encodeURIComponent(location.address || `${location.lat},${location.lng}`);
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  };

  // Generate static map image URL for fallback
  const getStaticMapUrl = () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return "";

    const center = `${location.lat},${location.lng}`;
    const markers = `color:0x22B8C8|${center}`;

    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=600x400&markers=${markers}&key=${apiKey}`;
  };

  // Generate OpenStreetMap fallback URL (no API key required)
  const getOSMapUrl = () => {
    const { lat, lng } = location;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
  };

  // Handle directions click
  const handleDirectionsClick = useCallback(() => {
    const directionsUrl = getDirectionsUrl();
    window.open(directionsUrl, "_blank", "noopener,noreferrer");
  }, []);

  // Handle map click for directions
  const handleMapClick = useCallback(() => {
    if (clickMapForDirections) {
      handleDirectionsClick();
    }
  }, [clickMapForDirections, handleDirectionsClick]);

  // Generate InfoWindow HTML content
  const getInfoWindowContent = useCallback(() => {
    const directionsUrl = getDirectionsUrl();
    const name = location.businessName || 'Location';

    return `
      <div style="padding: 15px; min-width: 200px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
        <h4 style="font-weight: 600; margin: 0 0 4px 0; font-size: 14px; color: #111827;">${name}</h4>
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
  }, [location]);

  // Initialize map when component mounts and location is available
  useEffect(() => {
    // Add a delay to ensure the modal DOM is fully rendered
    const timer = setTimeout(() => {
      if (!mapRef.current || !location) return;

      const initializeMap = async () => {
        try {
          setIsLoading(true);
          setMapError(null);

          // Initialize map using the map service
          const map = await mapService.initializeMap(mapRef.current!, {
            center: { lat: location.lat, lng: location.lng },
            zoom,
            scrollWheel: true,
            draggable: true
          });

          mapInstanceRef.current = map;

          // Create marker
          let marker;
          try {
            marker = mapService.createBusinessAdvancedMarker(location, map);
          } catch (error) {
            console.warn('Advanced marker failed, using legacy marker:', error);
            marker = mapService.createBusinessMarker(location, map);
          }

          // Handler to open InfoWindow above marker
          const handleMarkerClick = () => {
            // Create InfoWindow if it doesn't exist
            if (!infoWindowRef.current) {
              infoWindowRef.current = new google.maps.InfoWindow({
                pixelOffset: new google.maps.Size(0, -15), // Move popup higher above marker
                disableAutoPan: false,
              });
            }

            // Set content and open above the clicked marker
            infoWindowRef.current.setContent(getInfoWindowContent());
            infoWindowRef.current.setOptions({
              pixelOffset: new google.maps.Size(0, -15),
            });

            // Open InfoWindow
            if ('position' in marker && marker.position) {
              infoWindowRef.current.setPosition(marker.position as google.maps.LatLng | google.maps.LatLngLiteral);
              infoWindowRef.current.open(map as unknown as google.maps.Map);
            } else {
              infoWindowRef.current.open(map as unknown as google.maps.Map, marker as unknown as google.maps.Marker);
            }

            // Track that InfoWindow is open
            setIsInfoWindowOpen(true);

            // Listen for close event
            google.maps.event.addListenerOnce(infoWindowRef.current, 'closeclick', () => {
              setIsInfoWindowOpen(false);
            });
          };

          // Add click handler for InfoWindow (instead of directions)
          if (marker) {
            if ('addEventListener' in marker) {
              (marker as any).addEventListener('click', handleMarkerClick);
            } else {
              (marker as any).addListener('click', handleMarkerClick);
            }
          }

          setIsLoading(false);
        } catch (error) {
          console.error("Error initializing Google Maps:", error);
          const errorMessage = error instanceof Error ? error.message : "Failed to load Google Maps";
          setMapError(errorMessage);
          setIsLoading(false);
        }
      };

      initializeMap();
    }, 500); // 500ms delay to ensure modal DOM is ready

    return () => {
      clearTimeout(timer);
      // Cleanup InfoWindow on unmount
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
    };
  }, [location, showInfo, zoom, getInfoWindowContent]);

  return {
    mapRef,
    mapError,
    isLoading,
    isInfoWindowOpen,
    location,
    handleDirectionsClick,
    handleMapClick,
    getDirectionsUrl,
    getOSMapUrl,
    getStaticMapUrl,
  };
}
