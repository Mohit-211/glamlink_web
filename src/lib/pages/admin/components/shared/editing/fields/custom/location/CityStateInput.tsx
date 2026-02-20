'use client';

import React, { useState } from 'react';
import { US_STATES } from './constants';
import type { LocationData } from '@/lib/pages/for-professionals/types/professional';
import { geocodeAddress } from '@/lib/features/google_maps/utils/mapHelpers';

interface CityStateInputProps {
  value: LocationData | null;
  onChange: (location: LocationData) => void;
  onError?: (error: string) => void;
}

/**
 * CityStateInput - Input for city and state with geocoding
 *
 * Allows users to enter just a city and select a state, then geocodes
 * the location to get lat/lng coordinates using Google Maps JavaScript API.
 */
export default function CityStateInput({ value, onChange, onError }: CityStateInputProps) {
  const [city, setCity] = useState(value?.city || '');
  const [state, setState] = useState(value?.state || '');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  const handleSetLocation = async () => {
    if (!city.trim()) {
      setGeocodeError('Please enter a city name');
      return;
    }
    if (!state) {
      setGeocodeError('Please select a state');
      return;
    }

    setIsGeocoding(true);
    setGeocodeError(null);

    try {
      // Geocode the city/state to get coordinates using the Maps JavaScript API
      // This uses the same approach as other location components (which works)
      const address = `${city.trim()}, ${state}, USA`;
      const geocodeResult = await geocodeAddress(address);

      if (!geocodeResult || !geocodeResult.lat || !geocodeResult.lng) {
        throw new Error(`Could not find location: ${city}, ${state}`);
      }

      const { lat, lng } = geocodeResult;

      // Create the location data with city-only type
      const locationData: LocationData = {
        address: `${city.trim()}, ${state}`,
        lat,
        lng,
        city: city.trim(),
        state,
        locationType: 'city',
      };

      // Preserve existing fields if updating
      if (value) {
        locationData.id = value.id;
        locationData.isPrimary = value.isPrimary;
        locationData.label = value.label;
        locationData.businessName = value.businessName;
        locationData.phone = value.phone;
        locationData.email = value.email;
        locationData.hours = value.hours;
      }

      onChange(locationData);
      setGeocodeError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to geocode location';
      setGeocodeError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* City Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g., Las Vegas"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      </div>

      {/* State Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          State
        </label>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="">Select a state</option>
          {US_STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Set Location Button */}
      <button
        type="button"
        onClick={handleSetLocation}
        disabled={isGeocoding || !city.trim() || !state}
        className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isGeocoding ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Geocoding...
          </>
        ) : (
          'Set Location'
        )}
      </button>

      {/* Error Message */}
      {geocodeError && (
        <p className="text-sm text-red-600">{geocodeError}</p>
      )}

      {/* Success indicator */}
      {value?.lat != null && value?.lng != null && value?.locationType === 'city' && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Location set: {value.city}, {value.state}
        </div>
      )}
    </div>
  );
}
