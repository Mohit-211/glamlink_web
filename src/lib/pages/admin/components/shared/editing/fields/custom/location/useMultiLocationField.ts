"use client";

import { useState, useCallback, useMemo } from "react";
import { LocationData } from "@/lib/pages/for-professionals/types/professional";
import {
  generateLocationId,
  getPrimaryLocation,
  addLocation,
  removeLocation,
  updateLocation,
  moveLocation,
  setPrimaryLocation,
  MAX_LOCATIONS,
} from "@/lib/utils/migrations/locationMigration";

interface UseMultiLocationFieldProps {
  value: LocationData[] | null;
  fieldName: string;
  onChange: (fieldName: string, value: LocationData[]) => void;
}

export interface UseMultiLocationFieldReturn {
  // Data
  locations: LocationData[];
  primaryLocation: LocationData | null;

  // Editing state
  editingIndex: number | null;
  expandedIndex: number | null;

  // Capacity
  canAddMore: boolean;
  locationCount: number;
  maxLocations: number;

  // Actions
  handleAddLocation: (location: Partial<LocationData>) => void;
  handleRemoveLocation: (index: number) => void;
  handleUpdateLocation: (index: number, updates: Partial<LocationData>) => void;
  handleSetPrimary: (index: number) => void;
  handleMoveUp: (index: number) => void;
  handleMoveDown: (index: number) => void;

  // UI State actions
  setEditingIndex: (index: number | null) => void;
  setExpandedIndex: (index: number | null) => void;
  toggleExpanded: (index: number) => void;
}

export function useMultiLocationField({
  value,
  fieldName,
  onChange,
}: UseMultiLocationFieldProps): UseMultiLocationFieldReturn {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Normalize locations array (ensure all have IDs)
  const locations = useMemo(() => {
    if (!value || !Array.isArray(value)) return [];
    return value.map((loc, index) => ({
      ...loc,
      id: loc.id || generateLocationId(),
      // First location is primary by default if none specified
      isPrimary: loc.isPrimary ?? (index === 0 && !value.some(l => l.isPrimary))
    }));
  }, [value]);

  // Get primary location
  const primaryLocation = useMemo(() => {
    return getPrimaryLocation(locations);
  }, [locations]);

  // Capacity check
  const canAddMore = locations.length < MAX_LOCATIONS;
  const locationCount = locations.length;

  // Add a new location
  const handleAddLocation = useCallback((location: Partial<LocationData>) => {
    const newLocations = addLocation(locations, location);
    onChange(fieldName, newLocations);
    // Expand the new location for editing
    setExpandedIndex(newLocations.length - 1);
  }, [locations, fieldName, onChange]);

  // Remove a location
  const handleRemoveLocation = useCallback((index: number) => {
    if (index < 0 || index >= locations.length) return;
    const newLocations = removeLocation(locations, locations[index].id!);
    onChange(fieldName, newLocations);

    // Clear editing/expanded state if removed
    if (editingIndex === index) setEditingIndex(null);
    if (expandedIndex === index) setExpandedIndex(null);
    else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  }, [locations, fieldName, onChange, editingIndex, expandedIndex]);

  // Update a location
  const handleUpdateLocation = useCallback((index: number, updates: Partial<LocationData>) => {
    if (index < 0 || index >= locations.length) return;
    const newLocations = updateLocation(locations, locations[index].id!, updates);
    onChange(fieldName, newLocations);
  }, [locations, fieldName, onChange]);

  // Set a location as primary
  const handleSetPrimary = useCallback((index: number) => {
    if (index < 0 || index >= locations.length) return;
    const newLocations = setPrimaryLocation(locations, locations[index].id!);
    onChange(fieldName, newLocations);
  }, [locations, fieldName, onChange]);

  // Move location up in order
  const handleMoveUp = useCallback((index: number) => {
    if (index <= 0) return;
    const newLocations = moveLocation(locations, index, index - 1);
    onChange(fieldName, newLocations);
    // Update expanded index to follow the item
    if (expandedIndex === index) setExpandedIndex(index - 1);
    else if (expandedIndex === index - 1) setExpandedIndex(index);
  }, [locations, fieldName, onChange, expandedIndex]);

  // Move location down in order
  const handleMoveDown = useCallback((index: number) => {
    if (index >= locations.length - 1) return;
    const newLocations = moveLocation(locations, index, index + 1);
    onChange(fieldName, newLocations);
    // Update expanded index to follow the item
    if (expandedIndex === index) setExpandedIndex(index + 1);
    else if (expandedIndex === index + 1) setExpandedIndex(index);
  }, [locations, fieldName, onChange, expandedIndex]);

  // Toggle expansion of a location item
  const toggleExpanded = useCallback((index: number) => {
    setExpandedIndex(prev => prev === index ? null : index);
  }, []);

  return {
    // Data
    locations,
    primaryLocation,

    // Editing state
    editingIndex,
    expandedIndex,

    // Capacity
    canAddMore,
    locationCount,
    maxLocations: MAX_LOCATIONS,

    // Actions
    handleAddLocation,
    handleRemoveLocation,
    handleUpdateLocation,
    handleSetPrimary,
    handleMoveUp,
    handleMoveDown,

    // UI State actions
    setEditingIndex,
    setExpandedIndex,
    toggleExpanded,
  };
}
