"use client";

import React, { memo, useState, useCallback } from "react";
import { FieldConfig } from "@/lib/pages/admin/types";
import { LocationData } from "@/lib/pages/for-professionals/types/professional";
import { useMultiLocationField } from "./useMultiLocationField";
import { useLocationField } from "./useLocationField";
import { useFormContext } from "@/lib/pages/admin/components/shared/editing/form/FormProvider";
import { LoadingSpinner } from "@/lib/components/ui";
import {
  PlusIcon,
  ChevronUpIcon,
  DeleteIcon,
  StarIcon,
} from "@/lib/pages/admin/components/shared/common";
import CityStateInput from "./CityStateInput";

/**
 * Formats a phone number string to (XXX)-XXX-XXXX format
 * Only allows digits, max 10 digits
 */
function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  // Limit to 10 digits
  const limitedDigits = digits.slice(0, 10);

  // Format based on length
  if (limitedDigits.length === 0) {
    return '';
  } else if (limitedDigits.length <= 3) {
    return `(${limitedDigits}`;
  } else if (limitedDigits.length <= 6) {
    return `(${limitedDigits.slice(0, 3)})-${limitedDigits.slice(3)}`;
  } else {
    return `(${limitedDigits.slice(0, 3)})-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
  }
}

/**
 * Extracts only digits from formatted phone number
 */
function extractDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10);
}

interface MultiLocationFieldProps {
  field: FieldConfig;
  value: LocationData[] | null;
  onChange: (fieldName: string, value: LocationData[]) => void;
  error?: string;
}

// Single location editor with inline editing
function LocationEditor({
  location,
  index,
  isExpanded,
  isPrimary,
  canMoveUp,
  canMoveDown,
  onUpdate,
  onRemove,
  onSetPrimary,
  onMoveUp,
  onMoveDown,
  onToggleExpand,
  defaultBusinessName,
  defaultPhone,
}: {
  location: LocationData;
  index: number;
  isExpanded: boolean;
  isPrimary: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onUpdate: (updates: Partial<LocationData>) => void;
  onRemove: () => void;
  onSetPrimary: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleExpand: () => void;
  defaultBusinessName?: string;
  defaultPhone?: string;
}) {
  // Local state for label only (address managed by hook)
  const [label, setLabel] = useState(location.label || "");

  // Location type state - 'exact' (full address) or 'city' (city/state only)
  const [locationType, setLocationType] = useState<'exact' | 'city'>(
    location.locationType || 'exact'
  );

  // Handle location type change
  const handleLocationTypeChange = (newType: 'exact' | 'city') => {
    setLocationType(newType);
    onUpdate({ locationType: newType });
  };

  // Use the location field hook for geocoding - use its inputValue and handleInputChange directly
  const {
    inputValue,
    predictions,
    showPredictions,
    isGeocoding,
    handleInputChange,
    handlePredictionSelect,
    handleManualGeocode,
    setShowPredictions,
    wrapperRef,
  } = useLocationField({
    value: location,
    fieldName: `location_${index}`,
    onChange: (_, newLocation) => {
      if (newLocation) {
        onUpdate(newLocation);
      }
    },
  });

  // Handle label change
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    onUpdate({ label: newLabel });
  };

  // Handle manual geocode click
  const handleGeocode = async () => {
    if (!inputValue.trim()) return;
    await handleManualGeocode();
  };

  // Track if we've already pre-filled defaults for this location
  const hasPrefilledRef = React.useRef(false);

  // Pre-fill defaults on first expand if empty
  React.useEffect(() => {
    // Only pre-fill once when first expanded and not already filled
    if (isExpanded && !hasPrefilledRef.current) {
      hasPrefilledRef.current = true;

      const updates: Partial<LocationData> = {};

      if (!location.businessName && defaultBusinessName) {
        updates.businessName = defaultBusinessName;
      }
      if (!location.phone && defaultPhone) {
        updates.phone = defaultPhone;
      }

      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        onUpdate(updates);
      }
    }
  }, [isExpanded, location.businessName, location.phone, defaultBusinessName, defaultPhone, onUpdate]);


  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Header Row - Always visible */}
      <div
        className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-50 ${
          isPrimary ? "bg-yellow-50" : ""
        }`}
        onClick={onToggleExpand}
      >
        {/* Location Number & Primary Badge */}
        <div className="flex items-center gap-2 min-w-[80px]">
          <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
          {isPrimary && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              <StarIcon className="w-3 h-3 fill-current" />
              Primary
            </span>
          )}
        </div>

        {/* Location Info */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">
            {location.label || location.businessName || `Location ${index + 1}`}
          </div>
          <div className="text-sm text-gray-500 truncate">
            {location.address || "No address set"}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {/* Move Up */}
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Move Down */}
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Set Primary */}
          {!isPrimary && (
            <button
              type="button"
              onClick={onSetPrimary}
              className="p-1.5 text-gray-400 hover:text-yellow-500"
              title="Set as primary location"
            >
              <StarIcon className="w-4 h-4" />
            </button>
          )}

          {/* Delete */}
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-gray-400 hover:text-red-500"
            title="Remove location"
          >
            <DeleteIcon className="w-4 h-4" />
          </button>

          {/* Expand/Collapse */}
          <button
            type="button"
            onClick={onToggleExpand}
            className="p-1.5 text-gray-400 hover:text-gray-600"
          >
            <ChevronUpIcon
              className={`w-4 h-4 transition-transform ${isExpanded ? "" : "rotate-180"}`}
            />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-4 bg-gray-50" ref={wrapperRef}>
          {/* Location Type Selector */}
          <div className="flex items-center gap-6 p-3 bg-white border border-gray-200 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Location Type:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`locationType_${location.id || 'new'}`}
                value="exact"
                checked={locationType === 'exact'}
                onChange={() => handleLocationTypeChange('exact')}
                className="h-4 w-4 text-glamlink-teal focus:ring-glamlink-teal border-gray-300"
              />
              <span className="text-sm text-gray-600">Exact Address</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`locationType_${location.id || 'new'}`}
                value="city"
                checked={locationType === 'city'}
                onChange={() => handleLocationTypeChange('city')}
                className="h-4 w-4 text-glamlink-teal focus:ring-glamlink-teal border-gray-300"
              />
              <span className="text-sm text-gray-600">City Only</span>
            </label>
          </div>

          {/* Label Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Label
            </label>
            <input
              type="text"
              value={label}
              onChange={handleLabelChange}
              placeholder="e.g., Main Office, Downtown Studio"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
            />
            <p className="text-xs text-gray-500 mt-1">
              A friendly name for this location
            </p>
          </div>

          {/* Conditional Address Input - Exact Address or City/State */}
          {locationType === 'city' ? (
            /* City/State Input for "City Only" mode */
            <CityStateInput
              value={location}
              onChange={(newLocation) => onUpdate(newLocation)}
              onError={(error) => console.error('CityStateInput error:', error)}
            />
          ) : (
            /* Address Input with Autocomplete for "Exact Address" mode */
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Start typing an address..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
                  onFocus={() => inputValue.length >= 2 && setShowPredictions(true)}
                />

                {/* Loading Spinner */}
                {isGeocoding && (
                  <div className="absolute right-3 top-2.5">
                    <LoadingSpinner />
                  </div>
                )}

                {/* Autocomplete Predictions */}
                {showPredictions && predictions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {predictions.map((prediction) => (
                      <button
                        key={prediction.place_id}
                        type="button"
                        onClick={() => handlePredictionSelect(prediction)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-sm"
                      >
                        <div className="font-medium text-gray-900">
                          {prediction.description}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleGeocode}
                disabled={!inputValue.trim() || isGeocoding}
                className="px-4 py-2 text-sm bg-glamlink-teal text-white rounded-md hover:bg-glamlink-teal-dark focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {isGeocoding ? "Finding..." : "Use Address"}
              </button>
            </div>
          </div>
          )}

          {/* Location Details Display */}
          {location.address && location.lat != null && location.lng != null && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 text-green-600 mt-0.5">✓</div>
                <div className="flex-1">
                  <div className="font-medium text-green-900">Location Set</div>
                  <div className="text-sm text-green-700">{location.address}</div>
                  <div className="text-xs text-green-600 mt-1">
                    Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map Preview */}
          {location.address && location.lat != null && location.lng != null && (
            <div className="border rounded-md overflow-hidden">
              <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1">
                Location Preview
              </div>
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=400x150&markers=color:0x22B8C8%7C${location.lat},${location.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                alt="Location preview"
                className="w-full h-36 object-cover"
              />
            </div>
          )}

          {/* Additional Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={location.businessName || ""}
                onChange={(e) => onUpdate({ businessName: e.target.value })}
                placeholder="Business name at this location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formatPhoneNumber(location.phone || "")}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    onUpdate({ phone: formatted });
                  }}
                  onKeyDown={(e) => {
                    // Allow: backspace, delete, tab, escape, enter, and navigation keys
                    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
                    if (allowedKeys.includes(e.key)) return;
                    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                    if (e.ctrlKey || e.metaKey) return;
                    // Block non-digit characters
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault();
                      return;
                    }
                    // Block if already at 10 digits
                    const currentDigits = extractDigits(location.phone || '');
                    if (currentDigits.length >= 10) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="(555)-555-5555"
                  className="w-full px-3 py-2 pr-14 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal text-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className={`text-xs ${extractDigits(location.phone || '').length === 10 ? 'text-green-500' : 'text-gray-400'}`}>
                    {extractDigits(location.phone || '').length}/10
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={location.description || ""}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Additional details about this location..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal text-sm resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export const MultiLocationField = memo(function MultiLocationField({
  field,
  value,
  onChange,
  error,
}: MultiLocationFieldProps) {
  const {
    locations,
    expandedIndex,
    canAddMore,
    locationCount,
    maxLocations,
    handleAddLocation,
    handleRemoveLocation,
    handleUpdateLocation,
    handleSetPrimary,
    handleMoveUp,
    handleMoveDown,
    toggleExpanded,
  } = useMultiLocationField({
    value: value || [],
    fieldName: field.name,
    onChange,
  });

  // Get defaults from form context (professional data)
  const { getFieldValue } = useFormContext();
  const defaultBusinessName = getFieldValue("business_name") as string | undefined;
  const defaultPhone = getFieldValue("phone") as string | undefined;

  // Handle adding a new empty location
  const handleAddNew = useCallback(() => {
    handleAddLocation({
      address: "",
      lat: 0,
      lng: 0,
      label: `Location ${locationCount + 1}`,
    });
  }, [handleAddLocation, locationCount]);

  return (
    <div className="md:col-span-2">
      {/* Field Label */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
        <span className="ml-2 text-xs text-gray-500 font-normal">
          ({locationCount} of {maxLocations})
        </span>
      </label>

      {/* Locations List */}
      <div className="space-y-2">
        {locations.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No locations added yet</p>
            <p className="text-xs text-gray-400">Click the button below to add your first location</p>
          </div>
        ) : (
          locations.map((location, index) => (
            <LocationEditor
              key={location.id || index}
              location={location}
              index={index}
              isExpanded={expandedIndex === index}
              isPrimary={!!location.isPrimary}
              canMoveUp={index > 0}
              canMoveDown={index < locations.length - 1}
              onUpdate={(updates) => handleUpdateLocation(index, updates)}
              onRemove={() => handleRemoveLocation(index)}
              onSetPrimary={() => handleSetPrimary(index)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onToggleExpand={() => toggleExpanded(index)}
              defaultBusinessName={defaultBusinessName}
              defaultPhone={defaultPhone}
            />
          ))
        )}
      </div>

      {/* Add Location Button */}
      <button
        type="button"
        onClick={handleAddNew}
        disabled={!canAddMore}
        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-glamlink-teal hover:text-glamlink-teal disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        Add Location
        {!canAddMore && (
          <span className="text-xs text-gray-400">(Maximum reached)</span>
        )}
      </button>

      {/* Field Error */}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {/* Helper Text */}
      {field.helperText && !error && (
        <p className="text-sm text-gray-500 mt-2">{field.helperText}</p>
      )}

      {/* Tips */}
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <svg
            className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xs text-blue-700">
            <strong>Tip:</strong> The primary location (marked with a star) will be
            shown by default on your digital business card. Users can search and
            filter to find other locations.
          </p>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.error === nextProps.error &&
    prevProps.field.disabled === nextProps.field.disabled &&
    prevProps.field.required === nextProps.field.required
  );
});

export default MultiLocationField;
