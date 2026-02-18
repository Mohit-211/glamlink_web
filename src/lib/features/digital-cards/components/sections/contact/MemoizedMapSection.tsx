"use client";

import React, { memo, useMemo } from "react";
import GoogleMapsDisplay from "../../items/maps";
import MultiLocationMapsDisplay from "../../items/maps/MultiLocationMapsDisplay";
import { Professional, LocationData } from "@/lib/pages/for-professionals/types/professional";
import { normalizeLocations } from "@/lib/utils/migrations/locationMigration";

interface MemoizedMapSectionProps {
  professional: Professional;
  showAddressOverlay?: boolean;
  showAddressBelowMap?: boolean;
  height?: string;
}

/**
 * Memoized map section that only re-renders when locations actually change.
 * This prevents the map from re-initializing on every form keystroke.
 */
function MapSection({
  professional,
  showAddressOverlay = true,
  showAddressBelowMap = false,
  height = '400px',
}: MemoizedMapSectionProps) {
  const locations = useMemo(() => normalizeLocations(professional), [professional]);

  // Check if there are locations with valid coordinates
  const hasValidLocations = useMemo(() => {
    return locations.some(loc =>
      loc.lat !== undefined &&
      loc.lng !== undefined &&
      loc.lat !== 0 &&
      loc.lng !== 0 &&
      !isNaN(loc.lat) &&
      !isNaN(loc.lng)
    );
  }, [locations]);

  // Don't render map if no valid locations
  if (!hasValidLocations) {
    return null;
  }

  const isMultiLocation = locations.length > 1;

  return (
    <>
      {isMultiLocation ? (
        <MultiLocationMapsDisplay
          professional={professional}
          height={height}
          showSearch={true}
          showDirections={true}
          showInfo={true}
          showAddressOverlay={showAddressOverlay}
          zoom={14}
        />
      ) : (
        <GoogleMapsDisplay
          locationData={locations[0]}
          height={height}
          showDirections={false}
          showInfo={true}
          showAddressOverlay={showAddressOverlay}
          showAddressBelowMap={showAddressBelowMap}
          clickMapForDirections={true}
          zoom={16}
        />
      )}
    </>
  );
}

/**
 * Custom comparison function that checks if locations have actually changed.
 * Returns true if props are equal (don't re-render), false if they differ (re-render).
 */
function areLocationsEqual(
  prevProps: MemoizedMapSectionProps,
  nextProps: MemoizedMapSectionProps
): boolean {
  // Compare overlay settings
  if (prevProps.showAddressOverlay !== nextProps.showAddressOverlay) return false;
  if (prevProps.showAddressBelowMap !== nextProps.showAddressBelowMap) return false;
  if (prevProps.height !== nextProps.height) return false;

  // Get locations from both props
  const prevLocations = prevProps.professional.locations ||
    (prevProps.professional.locationData ? [prevProps.professional.locationData] : []);
  const nextLocations = nextProps.professional.locations ||
    (nextProps.professional.locationData ? [nextProps.professional.locationData] : []);

  // Compare location counts
  if (prevLocations.length !== nextLocations.length) return false;

  // Compare each location's key properties
  for (let i = 0; i < prevLocations.length; i++) {
    const prev = prevLocations[i];
    const next = nextLocations[i];

    // Compare essential location properties
    if (prev.lat !== next.lat) return false;
    if (prev.lng !== next.lng) return false;
    if (prev.address !== next.address) return false;
    if (prev.isPrimary !== next.isPrimary) return false;
    if (prev.businessName !== next.businessName) return false;
    if (prev.label !== next.label) return false;
  }

  // Locations are the same - don't re-render
  return true;
}

export default memo(MapSection, areLocationsEqual);
