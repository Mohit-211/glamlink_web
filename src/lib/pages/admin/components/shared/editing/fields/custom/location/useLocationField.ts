"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { LocationData } from "@/lib/pages/for-professionals/types/professional";
import { getPlacePredictions, getPlaceDetails, geocodeAddress } from "@/lib/features/google_maps/utils/mapHelpers";

interface UseLocationFieldProps {
  value: LocationData | null;
  fieldName: string;
  onChange: (fieldName: string, value: any) => void;
}

export interface UseLocationFieldReturn {
  // State
  inputValue: string;
  predictions: any[];
  showPredictions: boolean;
  isGeocoding: boolean;
  locationData: LocationData | null;
  mapPreview: string;
  wrapperRef: React.RefObject<HTMLDivElement | null>;

  // Handlers
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePredictionSelect: (prediction: any) => Promise<void>;
  handleManualGeocode: () => Promise<void>;
  setShowPredictions: (show: boolean) => void;
  setMapPreview: (url: string) => void;
}

export function useLocationField({
  value,
  fieldName,
  onChange,
}: UseLocationFieldProps): UseLocationFieldReturn {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(value || null);
  const [mapPreview, setMapPreview] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Update map preview
  const updateMapPreview = useCallback((location: LocationData) => {
    if (location.lat && location.lng) {
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=400x200&markers=color:0x22B8C8%7C${location.lat},${location.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      setMapPreview(mapUrl);
    }
  }, []);

  // Initialize input value from location data
  useEffect(() => {
    if (value?.address && value.address !== locationData?.address) {
      setLocationData(value);
      setInputValue(value.address);
      updateMapPreview(value);
    }
  }, [value?.address, locationData?.address, updateMapPreview]);

  // Debounced search for predictions
  const debouncedSearch = useCallback(
    async (searchTerm: string) => {
      if (searchTerm.length < 2) {
        setPredictions([]);
        return;
      }

      try {
        const results = await getPlacePredictions(searchTerm);
        setPredictions(results);
      } catch (error) {
        console.error('Error getting predictions:', error);
        setPredictions([]);
      }
    },
    []
  );

  // Handle input change with predictions
  const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowPredictions(true);

    // Debounced search
    const timeoutId = setTimeout(() => {
      debouncedSearch(newValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [debouncedSearch]);

  // Handle prediction selection
  const handlePredictionSelect = useCallback(async (prediction: any) => {
    setInputValue(prediction.description);
    setShowPredictions(false);
    setIsGeocoding(true);

    try {
      const locationResult = await getPlaceDetails(prediction.place_id);
      if (locationResult) {
        setLocationData(locationResult);
        onChange(fieldName, locationResult);
        updateMapPreview(locationResult);
      }
    } catch (error) {
      console.error('Error getting place details:', error);
    } finally {
      setIsGeocoding(false);
    }
  }, [fieldName, onChange, updateMapPreview]);

  // Handle manual address geocoding
  const handleManualGeocode = useCallback(async () => {
    if (!inputValue.trim()) return;

    setIsGeocoding(true);
    try {
      const locationResult = await geocodeAddress(inputValue);
      if (locationResult) {
        setLocationData(locationResult);
        onChange(fieldName, locationResult);
        updateMapPreview(locationResult);
        setPredictions([]);
      } else {
        console.warn('Geocoding failed for address:', inputValue);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    } finally {
      setIsGeocoding(false);
      setShowPredictions(false);
    }
  }, [inputValue, fieldName, onChange, updateMapPreview]);

  // Handle click outside to close predictions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowPredictions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    // State
    inputValue,
    predictions,
    showPredictions,
    isGeocoding,
    locationData,
    mapPreview,
    wrapperRef,

    // Handlers
    handleInputChange,
    handlePredictionSelect,
    handleManualGeocode,
    setShowPredictions,
    setMapPreview,
  };
}
