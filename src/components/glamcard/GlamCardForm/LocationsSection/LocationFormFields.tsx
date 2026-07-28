"use client";

import { getAllStates, getCitiesByState } from "@/api/Api";
import React, { useEffect, useRef, useState } from "react";

interface Location {
  location_type: "exact_address" | "city_only";
  address?: string;
  city?: string;
  state?: string;
  area?: string;
  label?: string;
  business_name?: string;
  phone?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  isSet?: boolean;
}

interface FieldsProps {
  location: Location;
  onUpdate: (updates: Partial<Location>) => void;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200";

const labelClass = "text-sm font-medium text-gray-700 block mb-1.5";

const buttonClass =
  "min-w-[120px] rounded-lg bg-[#23AEB8] px-5 py-2.5 text-sm font-medium text-white transition";

// Helper: Convert state name/abbreviation to numeric ID
const findStateId = (stateValue: string | undefined, statesArray: any[]): string | undefined => {
  if (!stateValue || !statesArray.length) return undefined;
  if (!isNaN(Number(stateValue))) return String(stateValue);

  const found = statesArray.find(
    (s: any) =>
      s.name?.toLowerCase() === stateValue.toLowerCase() ||
      s.abbreviation?.toLowerCase() === stateValue.toLowerCase()
  );

  return found ? String(found.id) : undefined;
};

const LocationFormFields: React.FC<FieldsProps> = ({ location, onUpdate }) => {
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  /* Load States */
  useEffect(() => {
    const fetchStates = async () => {
      setStatesLoading(true);
      try {
        const res = await getAllStates();
        const statesArray = res?.data?.all_state || res?.all_state || res || [];
        setStates(statesArray);
      } catch (err) {
        console.error("State fetch error:", err);
        setStates([]);
      } finally {
        setStatesLoading(false);
      }
    };
    fetchStates();
  }, []);

  /* Load Cities when State changes */
  useEffect(() => {
    const rawState = location.state;
    if (!rawState) {
      setCities([]);
      return;
    }

    const stateId = findStateId(String(rawState), states);
    if (!stateId) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setCitiesLoading(true);
      try {
        const res = await getCitiesByState(stateId);
        setCities(res?.data?.all_city || res?.all_city || []);
      } catch (err) {
        console.error("City fetch error:", err);
        setCities([]);
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, [location.state, states]);

  /* Google Places Autocomplete Setup */
  useEffect(() => {
    if (location.location_type !== "exact_address") return;
    if (!addressInputRef.current) return;
    if (!(window as any).google?.maps?.places) return;

    // Destroy existing instance if switching types
    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
      autocompleteRef.current = null;
    }

    const autocomplete = new google.maps.places.Autocomplete(
      addressInputRef.current,
      { types: ["geocode"] }
    );

    autocomplete.setFields(["formatted_address", "geometry", "name"]);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;

      const fullAddress = place.formatted_address || place.name || "";

      onUpdate({
        address: fullAddress,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        isSet: true,
      });
    });

    autocompleteRef.current = autocomplete;

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [location.location_type, onUpdate]);

  const canConfirmExact =
    location.location_type === "exact_address" && !!location.address?.trim();

  const canSetCity =
    location.location_type === "city_only" && !!location.city && !!location.state;

  const handleConfirmExact = () => {
    if (!canConfirmExact) return;

    if (!location.latitude || !location.longitude) {
      onUpdate({
        isSet: true,
        latitude: 36.1699,
        longitude: -115.1398,
      });
    } else {
      onUpdate({ isSet: true });
    }
  };

  const handleSetCity = () => {
    if (!canSetCity) return;
    onUpdate({ isSet: true });
  };

  const handleTypeChange = (newType: "exact_address" | "city_only") => {
    onUpdate({
      location_type: newType,
      address: "",
      city: "",
      state: "",
      latitude: undefined,
      longitude: undefined,
      isSet: false,
    });
    setCities([]);
  };

  return (
    <div className="space-y-6">
      {/* Location Type */}
      <div>
        <span className={labelClass}>Location Type</span>
        <div className="mt-2 flex gap-8">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              checked={location.location_type === "exact_address"}
              onChange={() => handleTypeChange("exact_address")}
            />
            Exact Address
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              checked={location.location_type === "city_only"}
              onChange={() => handleTypeChange("city_only")}
            />
            City / Area Only
          </label>
        </div>
      </div>

      {/* Display Label */}
      <div>
        <label className={labelClass}>Display Label</label>
        <input
          className={inputClass}
          value={location.label ?? ""}
          onChange={(e) => onUpdate({ label: e.target.value })}
        />
      </div>

      {/* CITY / STATE */}
      {location.location_type === "city_only" && (
        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            {/* STATE */}
            <div>
              <label className={labelClass}>State</label>
              <select
                className={inputClass}
                value={String(location.state ?? "")}
                onChange={(e) => {
                  onUpdate({
                    state: e.target.value,
                    city: "",
                  });
                }}
                disabled={statesLoading}
              >
                <option value="">
                  {statesLoading ? "Loading states..." : "Select state"}
                </option>
                {states.map((state: any) => (
                  <option key={state.id} value={String(state.id)}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CITY */}
            <div>
              <label className={labelClass}>City</label>
              <select
                className={inputClass}
                value={location?.city ?? ""}
                onChange={(e) => onUpdate({ city: e.target.value })}
                disabled={!location.state || citiesLoading}
              >
                <option value="">
                  {citiesLoading
                    ? "Loading cities..."
                    : !location.state
                    ? "Select state first"
                    : "Select city"}
                </option>
                {cities?.map((city: any) => (
                  <option key={city?.id} value={String(city?.id)}>
                    {city?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!canSetCity || citiesLoading}
              className={`w-full ${
                canSetCity && !citiesLoading
                  ? "bg-[#23AEB8] text-white hover:bg-[#1f9ba3]"
                  : "cursor-not-allowed bg-gray-300 text-white"
              } ${buttonClass}`}
              onClick={handleSetCity}
            >
              Set Location
            </button>
            {location.isSet && (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                ✓
              </span>
            )}
          </div>
        </div>
      )}

      {/* EXACT ADDRESS */}
      {location.location_type === "exact_address" && (
        <div>
          <label className={labelClass}>Address</label>
          <div className="flex items-center gap-3">
            <input
              ref={addressInputRef}
              className={inputClass}
              value={location.address ?? ""}
              onChange={(e) => onUpdate({ address: e.target.value })}
              placeholder="Start typing an address..."
            />
            <button
              type="button"
              disabled={!canConfirmExact}
              className={`${buttonClass} ${
                canConfirmExact
                  ? "bg-[#23AEB8] hover:bg-[#1F9CA5]"
                  : "cursor-not-allowed bg-gray-300"
              }`}
              onClick={handleConfirmExact}
            >
              Confirm
            </button>
            {location.isSet && (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                ✓
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationFormFields;