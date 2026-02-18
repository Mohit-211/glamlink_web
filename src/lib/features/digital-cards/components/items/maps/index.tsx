"use client";

import { LocationData } from "@/lib/pages/for-professionals/types/professional";
import { useGoogleMaps } from "./useGoogleMaps";
import MapsDisplay from "./MapsDisplay";
import MapError from "./MapError";
import { Loader2 } from "lucide-react";

interface GoogleMapsDisplayProps {
  locationData?: LocationData;
  height?: string;
  className?: string;
  showDirections?: boolean;
  showInfo?: boolean;
  zoom?: number;
  showAddressOverlay?: boolean;
  showAddressBelowMap?: boolean;
  clickMapForDirections?: boolean;
}

export default function GoogleMapsDisplay({
  locationData,
  height = "400px",
  className = "",
  showDirections = true,
  showInfo = true,
  zoom = 15,
  showAddressOverlay = true,
  showAddressBelowMap = false,
  clickMapForDirections = true,
}: GoogleMapsDisplayProps) {
  // Custom hook for all map logic
  const {
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
  } = useGoogleMaps(locationData, zoom, showInfo, clickMapForDirections);

  // Render loading state
  if (isLoading) {
    return (
      <div className={`google-maps-display ${className}`}>
        <div className="bg-gray-100 rounded-lg flex items-center justify-center h-64 md:h-80 lg:h-96 xl:h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-glamlink-teal animate-spin mx-auto mb-3" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (mapError) {
    return (
      <MapError
        location={location}
        mapError={mapError}
        height={height}
        className={className}
        showDirections={showDirections}
        getOSMapUrl={getOSMapUrl}
        handleDirectionsClick={handleDirectionsClick}
      />
    );
  }

  // Render success state
  return (
    <MapsDisplay
      mapRef={mapRef}
      location={location}
      height={height}
      className={className}
      showAddressOverlay={showAddressOverlay}
      showAddressBelowMap={showAddressBelowMap}
      showInfo={showInfo}
      showDirections={showDirections}
      handleDirectionsClick={handleDirectionsClick}
      isInfoWindowOpen={isInfoWindowOpen}
    />
  );
}
