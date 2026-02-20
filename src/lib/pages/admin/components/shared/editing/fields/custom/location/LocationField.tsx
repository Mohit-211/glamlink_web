"use client";

import React, { memo } from "react";
import { FieldConfig } from "@/lib/pages/admin/types";
import { LoadingSpinner } from "@/lib/components/ui";
import { useLocationField } from "./useLocationField";

interface BaseFieldProps {
  field: FieldConfig;
  value: any;
  onChange: (fieldName: string, value: any) => void;
  error?: string;
}

// Helper function to determine grid classes based on field type and layout
function getGridClasses(field: FieldConfig): string {
  // Explicit layout configuration takes precedence
  if ((field as any).layout === 'full') return 'md:col-span-2';
  if ((field as any).layout === 'double') return 'md:col-span-2';
  if ((field as any).layout === 'single') return 'md:col-span-1';

  // Default behavior: textareas and array fields span full width
  if (field.type === 'textarea' || field.type === 'array' || field.type === 'image-array') {
    return 'md:col-span-2';
  }

  // Default for all other fields: single column
  return 'md:col-span-1';
}

export const LocationField = memo(function LocationField({ field, value, onChange, error }: BaseFieldProps) {
  const {
    inputValue,
    predictions,
    showPredictions,
    isGeocoding,
    locationData,
    mapPreview,
    wrapperRef,
    handleInputChange,
    handlePredictionSelect,
    handleManualGeocode,
    setShowPredictions,
    setMapPreview,
  } = useLocationField({
    value: value || null,
    fieldName: field.name,
    onChange,
  });

  return (
    <div className={getGridClasses(field)} ref={wrapperRef}>
      {/* Field Label */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Location Input Section */}
      <div className="space-y-3">
        {/* Address Input with Autocomplete */}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Start typing an address..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={field.disabled || isGeocoding}
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
                  <div className="font-medium text-gray-900">{prediction.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Manual Geocode Button */}
        <button
          type="button"
          onClick={handleManualGeocode}
          disabled={!inputValue.trim() || isGeocoding}
          className="px-4 py-2 text-sm bg-glamlink-teal text-white rounded-md hover:bg-glamlink-teal-dark focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isGeocoding ? 'Finding Location...' : 'Use This Address'}
        </button>

        {/* Location Details Display */}
        {locationData && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 text-green-600 mt-0.5">✓</div>
              <div className="flex-1">
                <div className="font-medium text-green-900">Location Found</div>
                <div className="text-sm text-green-700">{locationData.address}</div>
                <div className="text-xs text-green-600 mt-1">
                  Coordinates: {locationData.lat.toFixed(6)}, {locationData.lng.toFixed(6)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Preview */}
        {mapPreview && locationData && (
          <div className="border rounded-md overflow-hidden">
            <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1">Location Preview</div>
            <img
              src={mapPreview}
              alt="Location preview"
              className="w-full h-48 object-cover"
              onError={() => setMapPreview('')}
            />
          </div>
        )}
      </div>

      {/* Field Error */}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}

      {/* Field Helper Text */}
      {field.helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{field.helperText}</p>
      )}
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

// Default export for wrapper import
export default LocationField;
