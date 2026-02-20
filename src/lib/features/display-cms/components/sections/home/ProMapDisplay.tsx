'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import { mapService } from '@/lib/features/google_maps';
import type { GoogleMap, GoogleMarker, GoogleAdvancedMarker } from '@/lib/features/google_maps/types';

interface Coordinate {
  lat: number;
  lng: number;
}

interface ProMapDisplayProps {
  professionals: Professional[];
  onMarkerClick: (pro: Professional) => void;
  selectedPro: Professional | null;
  /** Center point for location-based search (zooms map to this location) */
  searchCenter?: Coordinate | null;
}

interface MarkerData {
  marker: GoogleMarker | GoogleAdvancedMarker;
  professional: Professional;
}

export default function ProMapDisplay({
  professionals,
  onMarkerClick,
  selectedPro,
  searchCenter,
}: ProMapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<GoogleMap | null>(null);
  const markersRef = useRef<MarkerData[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // Default center (Las Vegas) - will be adjusted to fit all markers
  const defaultCenter = { lat: 36.1699, lng: -115.1398 };

  // Get primary location from professional
  const getProLocation = (pro: Professional) => {
    // Check for locationData first (standard field)
    if (pro.locationData?.lat && pro.locationData?.lng) {
      return {
        lat: pro.locationData.lat,
        lng: pro.locationData.lng,
        address: pro.locationData.address || pro.location || '',
        businessName: pro.name || 'Professional',
      };
    }
    // Check locations array (multi-location)
    if (pro.locations && pro.locations.length > 0) {
      const primary = pro.locations.find((loc) => loc.isPrimary) || pro.locations[0];
      return {
        lat: primary.lat,
        lng: primary.lng,
        address: primary.address || pro.location || '',
        businessName: primary.businessName || pro.name || 'Professional',
      };
    }
    return null;
  };

  // Generate InfoWindow HTML content
  const getInfoWindowContent = useCallback(
    (pro: Professional) => {
      const location = getProLocation(pro);
      const directionsUrl = location
        ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            location.address || `${location.lat},${location.lng}`
          )}`
        : '#';

      return `
      <div style="padding: 12px; min-width: 180px; max-width: 260px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          ${
            pro.profileImage
              ? `<img src="${pro.profileImage}" alt="${pro.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />`
              : `<div style="width: 40px; height: 40px; border-radius: 50%; background: #22B8C8; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${(
                  pro.name || 'P'
                )
                  .charAt(0)
                  .toUpperCase()}</div>`
          }
          <div>
            <h4 style="font-weight: 600; margin: 0; font-size: 14px; color: #111827;">${
              pro.name || 'Professional'
            }</h4>
            <p style="margin: 0; color: #6B7280; font-size: 12px;">${pro.specialty || pro.title || ''}</p>
          </div>
        </div>
        ${location?.address ? `<p style="margin: 0 0 10px 0; color: #4B5563; font-size: 12px; line-height: 1.4;">${location.address}</p>` : ''}
        ${
          location
            ? `<a href="${directionsUrl}" target="_blank" rel="noopener noreferrer"
            style="display: inline-block; padding: 8px 12px; background: #f3f4f6; color: #374151; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500;">
            Directions
          </a>`
            : ''
        }
      </div>
    `;
    },
    []
  );

  // Create marker for a professional
  const createMarkerForPro = useCallback(
    (map: GoogleMap, pro: Professional, isSelected: boolean): GoogleMarker | GoogleAdvancedMarker | null => {
      const location = getProLocation(pro);
      if (!location) return null;

      const handleMarkerClick = (marker: GoogleMarker | GoogleAdvancedMarker) => {
        // Close existing InfoWindow
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }

        // Create InfoWindow if it doesn't exist
        if (!infoWindowRef.current) {
          infoWindowRef.current = new google.maps.InfoWindow({
            pixelOffset: new google.maps.Size(0, -15),
            disableAutoPan: false,
          });
        }

        // Set content and open
        infoWindowRef.current.setContent(getInfoWindowContent(pro));

        if ('position' in marker && marker.position) {
          infoWindowRef.current.setPosition(marker.position as google.maps.LatLng | google.maps.LatLngLiteral);
          infoWindowRef.current.open(map as unknown as google.maps.Map);
        } else {
          infoWindowRef.current.open(map as unknown as google.maps.Map, marker as unknown as google.maps.Marker);
        }

        // Also call the external handler
        onMarkerClick(pro);
      };

      try {
        // Create custom marker content with professional's initial
        const initial = (pro.name || 'P').charAt(0).toUpperCase();
        const markerColor = isSelected ? '#8B5CF6' : '#22B8C8'; // Purple for selected, teal for others

        const contentElement = createCustomMarkerElement(initial, markerColor, isSelected);

        const markerOptions = {
          position: { lat: location.lat, lng: location.lng },
          map: map || null,
          title: pro.name || 'Professional',
          gmpClickable: true,
          content: contentElement,
          zIndex: isSelected ? 100 : 50,
        };

        const marker = mapService.createAdvancedMarker(markerOptions);

        // Add click handler
        if ('addEventListener' in marker) {
          marker.addEventListener('click', () => handleMarkerClick(marker));
        } else {
          (marker as any).addListener('click', () => handleMarkerClick(marker));
        }

        return marker;
      } catch (error) {
        console.warn('Failed to create advanced marker, using legacy:', error);
        try {
          const marker = mapService.createMarker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: pro.name || 'Professional',
          });
          (marker as any).addListener('click', () => handleMarkerClick(marker));
          return marker;
        } catch (legacyError) {
          console.error('Failed to create marker:', legacyError);
          return null;
        }
      }
    },
    [getInfoWindowContent, onMarkerClick]
  );

  // Create custom marker element
  const createCustomMarkerElement = (initial: string, color: string, isSelected: boolean): HTMLElement => {
    const container = document.createElement('div');
    container.style.width = isSelected ? '40px' : '32px';
    container.style.height = isSelected ? '56px' : '48px';
    container.style.position = 'relative';
    container.style.transition = 'all 0.2s ease';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', isSelected ? '40' : '32');
    svg.setAttribute('height', isSelected ? '56' : '48');
    svg.setAttribute('viewBox', '0 0 32 48');
    svg.style.display = 'block';
    svg.style.filter = isSelected ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))';

    // Create the pin shape
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M16 0C7.163 0 0 7.163 0 16C0 22.283 0 32 16 48C32 32 32 22.283 32 16C32 7.163 24.837 0 16 0Z');
    path.setAttribute('fill', color);
    svg.appendChild(path);

    // Create the inner circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '16');
    circle.setAttribute('cy', '16');
    circle.setAttribute('r', isSelected ? '8' : '6');
    circle.setAttribute('fill', 'white');
    svg.appendChild(circle);

    // Create the text element
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '16');
    text.setAttribute('y', isSelected ? '21' : '20');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', color);
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.setAttribute('font-size', isSelected ? '12' : '10');
    text.setAttribute('font-weight', 'bold');
    text.textContent = initial;
    svg.appendChild(text);

    container.appendChild(svg);
    return container;
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        setMapError(null);

        // Calculate center based on search center, professionals, or use default
        let center = defaultCenter;
        let initialZoom = 10;
        const prosWithLocation = professionals.filter((p) => getProLocation(p) !== null);

        // If we have a search center, use it and zoom in closer
        if (searchCenter) {
          center = searchCenter;
          initialZoom = 11; // Zoom closer when searching a specific location
        } else if (prosWithLocation.length > 0) {
          const locations = prosWithLocation.map((p) => getProLocation(p)!);
          const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
          const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
          center = { lat: avgLat, lng: avgLng };
        }

        // Initialize map
        const map = await mapService.initializeMap(mapRef.current!, {
          center,
          zoom: initialZoom,
          scrollWheel: true,
          draggable: true,
        });

        mapInstanceRef.current = map;

        // Clear existing markers
        if (markersRef.current.length > 0) {
          mapService.clearMarkers(markersRef.current.map((m) => m.marker));
          markersRef.current = [];
        }

        // Create markers for all professionals
        prosWithLocation.forEach((pro) => {
          const isSelected = selectedPro?.id === pro.id;
          const marker = createMarkerForPro(map, pro, isSelected);

          if (marker) {
            markersRef.current.push({ marker, professional: pro });
          }
        });

        // Handle map centering and zoom
        if (searchCenter) {
          // When a center is provided (default Las Vegas or user-searched location),
          // stay centered there - don't fit to markers
          map.setCenter(searchCenter);
          // Use appropriate zoom based on whether markers are nearby
          if (markersRef.current.length === 0) {
            // No markers - zoom out to show the search area
            map.setZoom(10);
          } else {
            // Keep the initial zoom level (11) to show the area
            map.setZoom(11);
          }
        } else if (markersRef.current.length > 1) {
          // No center provided - fit to show all markers
          const allMarkers = markersRef.current.map((m) => m.marker);
          mapService.fitMapToMarkers(map, allMarkers);
        } else if (markersRef.current.length === 1) {
          // Single marker - center on it
          const singleLoc = getProLocation(markersRef.current[0].professional);
          if (singleLoc) {
            map.setCenter({ lat: singleLoc.lat, lng: singleLoc.lng });
            map.setZoom(14);
          }
        }

        // Set up global callback for InfoWindow button
        (window as any).__proMapSelectPro = (proId: string) => {
          const pro = professionals.find((p) => p.id === proId);
          if (pro) {
            onMarkerClick(pro);
            // Close InfoWindow
            if (infoWindowRef.current) {
              infoWindowRef.current.close();
            }
          }
        };

        // Open InfoWindow for selected professional (if one is selected from dropdown)
        if (selectedPro) {
          const selectedMarkerData = markersRef.current.find(
            (m) => m.professional.id === selectedPro.id
          );
          if (selectedMarkerData) {
            // Close existing InfoWindow
            if (infoWindowRef.current) {
              infoWindowRef.current.close();
            }

            // Create InfoWindow if it doesn't exist
            if (!infoWindowRef.current) {
              infoWindowRef.current = new google.maps.InfoWindow({
                pixelOffset: new google.maps.Size(0, -15),
                disableAutoPan: false,
              });
            }

            // Set content and open
            infoWindowRef.current.setContent(getInfoWindowContent(selectedPro));
            const marker = selectedMarkerData.marker;
            if ('position' in marker && marker.position) {
              infoWindowRef.current.setPosition(marker.position as google.maps.LatLng | google.maps.LatLngLiteral);
              infoWindowRef.current.open(map as unknown as google.maps.Map);
            } else {
              infoWindowRef.current.open(map as unknown as google.maps.Map, marker as unknown as google.maps.Marker);
            }
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Pro Map:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load Google Maps';
        setMapError(errorMessage);
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      // Cleanup InfoWindow
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
      // Cleanup markers
      if (markersRef.current.length > 0) {
        mapService.clearMarkers(markersRef.current.map((m) => m.marker));
        markersRef.current = [];
      }
      // Cleanup global callback
      delete (window as any).__proMapSelectPro;
    };
    // NOTE: selectedPro is intentionally excluded from deps - we access it via closure inside setTimeout
    // This effect runs when searchCenter changes (e.g., from dropdown selection) but not when clicking markers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionals, searchCenter, createMarkerForPro, onMarkerClick, getInfoWindowContent]);

  // Update marker styling when selectedPro changes (without changing map view)
  useEffect(() => {
    if (!mapInstanceRef.current || markersRef.current.length === 0) return;

    // Rebuild markers with updated selection state
    const map = mapInstanceRef.current;
    const prosWithLocation = professionals.filter((p) => getProLocation(p) !== null);

    // Clear existing markers
    mapService.clearMarkers(markersRef.current.map((m) => m.marker));
    markersRef.current = [];

    // Recreate markers with updated selection
    prosWithLocation.forEach((pro) => {
      const isSelected = selectedPro?.id === pro.id;
      const marker = createMarkerForPro(map, pro, isSelected);

      if (marker) {
        markersRef.current.push({ marker, professional: pro });
      }
    });

    // Show InfoWindow for selected professional (when selected from dropdown)
    if (selectedPro) {
      const selectedMarkerData = markersRef.current.find(
        (m) => m.professional.id === selectedPro.id
      );
      if (selectedMarkerData) {
        // Close existing InfoWindow
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }

        // Create InfoWindow if it doesn't exist
        if (!infoWindowRef.current) {
          infoWindowRef.current = new google.maps.InfoWindow({
            pixelOffset: new google.maps.Size(0, -15),
            disableAutoPan: false,
          });
        }

        // Set content and open
        infoWindowRef.current.setContent(getInfoWindowContent(selectedPro));
        const marker = selectedMarkerData.marker;
        if ('position' in marker && marker.position) {
          infoWindowRef.current.setPosition(marker.position as google.maps.LatLng | google.maps.LatLngLiteral);
          infoWindowRef.current.open(map as unknown as google.maps.Map);
        } else {
          infoWindowRef.current.open(map as unknown as google.maps.Map, marker as unknown as google.maps.Marker);
        }
      }
    } else {
      // Close InfoWindow when no professional is selected
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    }

    // NOTE: Do NOT pan to selected professional - user wants to maintain their map view
    // when clicking markers. They can manually pan if needed.
  }, [selectedPro, professionals, createMarkerForPro, getInfoWindowContent]);

  // Error state
  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-700 font-medium mb-2">Map failed to load</p>
          <p className="text-gray-500 text-sm">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-glamlink-teal border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Legend */}
      {!isLoading && professionals.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-glamlink-teal" />
              <span className="text-gray-600">{professionals.length} pros</span>
            </div>
            {selectedPro && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-purple-500" />
                <span className="text-gray-600">Selected</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No professionals message - show as overlay when searching a location with no results */}
      {!isLoading && professionals.length === 0 && searchCenter && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5 text-gray-400" />
            <p className="text-sm font-medium">No professionals found within 20 miles</p>
          </div>
        </div>
      )}

      {/* No professionals message - show full overlay only when no search center */}
      {!isLoading && professionals.length === 0 && !searchCenter && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center p-6">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No professionals found in this area</p>
          </div>
        </div>
      )}
    </div>
  );
}
