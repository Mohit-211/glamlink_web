"use client";

import React from "react";
import { Professional } from "@/lib/pages/for-professionals/types/professional";
import { useMultiLocationMaps } from "./useMultiLocationMaps";
import LocationSearch from "./LocationSearch";
import MapError from "./MapError";
import { Loader2, MapPin } from "lucide-react";

interface MultiLocationMapsDisplayProps {
  professional: Professional;
  height?: string;
  className?: string;
  showSearch?: boolean;
  showDirections?: boolean;
  showInfo?: boolean;
  zoom?: number;
  showAddressOverlay?: boolean;
}

export default function MultiLocationMapsDisplay({
  professional,
  height = "400px",
  className = "",
  showSearch = true,
  showDirections = true,
  showInfo = true,
  zoom = 15,
  showAddressOverlay = true,
}: MultiLocationMapsDisplayProps) {
  const {
    mapRef,
    isLoading,
    mapError,
    selectedLocation,
    locations,
    primaryLocation,
    isMultiLocation,
    searchQuery,
    setSearchQuery,
    filteredLocations,
    selectLocation,
    showAllLocations,
    handleDirectionsClick,
    getOSMapUrl,
  } = useMultiLocationMaps(professional, zoom, showInfo);

  // No locations available
  if (locations.length === 0) {
    return (
      <div className={`multi-location-maps-display ${className}`}>
        <div
          className="bg-gray-100 rounded-lg flex items-center justify-center"
          style={{ height }}
        >
          <div className="text-center text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No location information available</p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`multi-location-maps-display ${className}`}>
        <div
          className="bg-gray-100 rounded-lg flex items-center justify-center"
          style={{ height }}
        >
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-glamlink-teal animate-spin mx-auto mb-3" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (mapError && selectedLocation) {
    return (
      <MapError
        location={selectedLocation}
        mapError={mapError}
        height={height}
        className={className}
        showDirections={showDirections}
        getOSMapUrl={() => getOSMapUrl(selectedLocation)}
        handleDirectionsClick={() => handleDirectionsClick(selectedLocation)}
      />
    );
  }

  return (
    <div
      className={`multi-location-maps-display ${className}`}
      data-locations={JSON.stringify(locations)}
      data-primary-lat={primaryLocation?.lat}
      data-primary-lng={primaryLocation?.lng}
      data-primary-address={primaryLocation?.address}
    >
      {/* Search Bar (only for multi-location) */}
      {showSearch && isMultiLocation && (
        <div className="mb-3">
          <LocationSearch
            locations={locations}
            filteredLocations={filteredLocations}
            selectedLocation={selectedLocation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onLocationSelect={selectLocation}
            onShowAll={showAllLocations}
          />
        </div>
      )}

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden shadow-md">
        {/* Map */}
        <div
          ref={mapRef}
          className="w-full"
          style={{ height }}
        />

        {/* Location Count Badge (multi-location) */}
        {isMultiLocation && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md">
            <span className="text-xs font-medium text-gray-700">
              {locations.length} locations
            </span>
          </div>
        )}

        {/* Show All Locations Button (multi-location) */}
        {isMultiLocation && selectedLocation && (
          <button
            type="button"
            onClick={showAllLocations}
            className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md hover:bg-white transition-colors text-sm font-medium text-gray-700"
          >
            <MapPin className="w-4 h-4 text-glamlink-teal" />
            Show All
          </button>
        )}
      </div>
    </div>
  );
}
