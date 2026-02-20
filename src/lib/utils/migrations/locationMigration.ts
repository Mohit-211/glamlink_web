/**
 * Location Migration Utilities
 *
 * Handles both legacy (single locationData) and new (locations array) formats
 * for backward compatibility during migration to multi-location support.
 */

import { LocationData, Professional } from '@/lib/pages/for-professionals/types/professional';

/**
 * Generates a unique ID for a location
 */
export function generateLocationId(): string {
  return `loc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Normalizes a Professional's location data to always return an array of locations.
 * Handles both old (single locationData) and new (locations array) formats.
 *
 * @param professional - The professional object to normalize
 * @returns Array of LocationData, empty array if no locations
 */
export function normalizeLocations(professional: Professional | null | undefined): LocationData[] {
  if (!professional) return [];

  // If locations array exists and has items, use it
  if (professional.locations && professional.locations.length > 0) {
    // Ensure all locations have IDs
    return professional.locations.map((loc, index) => ({
      ...loc,
      id: loc.id || generateLocationId(),
      // First location is primary by default if none specified
      isPrimary: loc.isPrimary ?? (index === 0 && !professional.locations!.some(l => l.isPrimary))
    }));
  }

  // Fall back to single locationData (legacy format)
  if (professional.locationData) {
    return [{
      ...professional.locationData,
      id: professional.locationData.id || generateLocationId(),
      isPrimary: true, // Single location is always primary
      label: professional.locationData.label || professional.locationData.businessName || 'Main Location'
    }];
  }

  // No location data available
  return [];
}

/**
 * Gets the primary location from a list of locations.
 * Falls back to first location if none marked as primary.
 *
 * @param locations - Array of LocationData
 * @returns Primary LocationData or null if no locations
 */
export function getPrimaryLocation(locations: LocationData[]): LocationData | null {
  if (!locations || locations.length === 0) return null;

  // Find explicitly marked primary
  const primary = locations.find(loc => loc.isPrimary);
  if (primary) return primary;

  // Fall back to first location
  return locations[0];
}

/**
 * Sets a location as primary and unsets all others.
 *
 * @param locations - Array of LocationData
 * @param locationId - ID of the location to set as primary
 * @returns Updated array with new primary
 */
export function setPrimaryLocation(locations: LocationData[], locationId: string): LocationData[] {
  return locations.map(loc => ({
    ...loc,
    isPrimary: loc.id === locationId
  }));
}

/**
 * Adds a new location to the array with proper defaults.
 * Enforces maximum of 30 locations.
 *
 * @param locations - Existing locations array
 * @param newLocation - New location to add (id will be generated if not provided)
 * @returns Updated array with new location, or original if at max capacity
 */
export function addLocation(locations: LocationData[], newLocation: Partial<LocationData>): LocationData[] {
  const MAX_LOCATIONS = 30;

  if (locations.length >= MAX_LOCATIONS) {
    console.warn(`Cannot add location: maximum of ${MAX_LOCATIONS} locations reached`);
    return locations;
  }

  const locationWithDefaults: LocationData = {
    address: newLocation.address || '',
    lat: newLocation.lat || 0,
    lng: newLocation.lng || 0,
    ...newLocation,
    id: newLocation.id || generateLocationId(),
    // New location is only primary if it's the first one
    isPrimary: locations.length === 0 ? true : (newLocation.isPrimary ?? false)
  };

  // If new location is primary, unset others
  if (locationWithDefaults.isPrimary && locations.length > 0) {
    return [
      ...locations.map(loc => ({ ...loc, isPrimary: false })),
      locationWithDefaults
    ];
  }

  return [...locations, locationWithDefaults];
}

/**
 * Removes a location from the array by ID.
 * If primary is removed, makes the first remaining location primary.
 *
 * @param locations - Array of locations
 * @param locationId - ID of location to remove
 * @returns Updated array without the removed location
 */
export function removeLocation(locations: LocationData[], locationId: string): LocationData[] {
  const filtered = locations.filter(loc => loc.id !== locationId);

  // If we removed the primary and have remaining locations, make first one primary
  if (filtered.length > 0 && !filtered.some(loc => loc.isPrimary)) {
    filtered[0] = { ...filtered[0], isPrimary: true };
  }

  return filtered;
}

/**
 * Updates a location in the array by ID.
 *
 * @param locations - Array of locations
 * @param locationId - ID of location to update
 * @param updates - Partial updates to apply
 * @returns Updated array with modified location
 */
export function updateLocation(
  locations: LocationData[],
  locationId: string,
  updates: Partial<LocationData>
): LocationData[] {
  return locations.map(loc =>
    loc.id === locationId ? { ...loc, ...updates } : loc
  );
}

/**
 * Moves a location up or down in the array (reordering).
 *
 * @param locations - Array of locations
 * @param fromIndex - Current index of location
 * @param toIndex - Target index
 * @returns Reordered array
 */
export function moveLocation(locations: LocationData[], fromIndex: number, toIndex: number): LocationData[] {
  if (
    fromIndex < 0 ||
    fromIndex >= locations.length ||
    toIndex < 0 ||
    toIndex >= locations.length ||
    fromIndex === toIndex
  ) {
    return locations;
  }

  const result = [...locations];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Validates a LocationData object has minimum required fields.
 *
 * @param location - Location to validate
 * @returns Object with isValid and errors array
 */
export function validateLocation(location: Partial<LocationData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!location.address || location.address.trim() === '') {
    errors.push('Address is required');
  }

  if (typeof location.lat !== 'number' || isNaN(location.lat)) {
    errors.push('Valid latitude is required');
  } else if (location.lat < -90 || location.lat > 90) {
    errors.push('Latitude must be between -90 and 90');
  }

  if (typeof location.lng !== 'number' || isNaN(location.lng)) {
    errors.push('Valid longitude is required');
  } else if (location.lng < -180 || location.lng > 180) {
    errors.push('Longitude must be between -180 and 180');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Gets bounds that encompass all locations (for fitting map view).
 *
 * @param locations - Array of locations
 * @returns Bounds object with north, south, east, west, or null if no valid locations
 */
export function getLocationsBounds(locations: LocationData[]): {
  north: number;
  south: number;
  east: number;
  west: number;
} | null {
  const validLocations = locations.filter(
    loc => typeof loc.lat === 'number' && typeof loc.lng === 'number'
  );

  if (validLocations.length === 0) return null;

  let north = validLocations[0].lat;
  let south = validLocations[0].lat;
  let east = validLocations[0].lng;
  let west = validLocations[0].lng;

  for (const loc of validLocations) {
    if (loc.lat > north) north = loc.lat;
    if (loc.lat < south) south = loc.lat;
    if (loc.lng > east) east = loc.lng;
    if (loc.lng < west) west = loc.lng;
  }

  return { north, south, east, west };
}

/**
 * Filters locations by search query (matches against label, address, businessName, city).
 *
 * @param locations - Array of locations
 * @param query - Search query string
 * @returns Filtered array of matching locations
 */
export function filterLocationsByQuery(locations: LocationData[], query: string): LocationData[] {
  if (!query || query.trim() === '') return locations;

  const lowerQuery = query.toLowerCase().trim();

  return locations.filter(loc => {
    const searchFields = [
      loc.label,
      loc.address,
      loc.businessName,
      loc.city,
      loc.state,
      loc.description
    ].filter(Boolean);

    return searchFields.some(field =>
      field!.toLowerCase().includes(lowerQuery)
    );
  });
}

/**
 * Converts locations array back to legacy format for backward compatibility.
 * Returns the primary location as locationData.
 *
 * @param locations - Array of locations
 * @returns Single LocationData (primary) or undefined if no locations
 */
export function toLegacyFormat(locations: LocationData[]): LocationData | undefined {
  const primary = getPrimaryLocation(locations);
  return primary || undefined;
}

/**
 * Maximum number of locations allowed per professional.
 */
export const MAX_LOCATIONS = 30;
