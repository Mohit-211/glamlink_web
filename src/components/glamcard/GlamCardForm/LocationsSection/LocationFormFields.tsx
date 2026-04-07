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
  "min-w-[120px] rounded-lg px-5 py-2.5 text-sm font-medium text-white transition";

const LocationFormFields: React.FC<FieldsProps> = ({
  location,
  onUpdate,
}) => {
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef =
    useRef<google.maps.places.Autocomplete | null>(null);

  // ✅ NEW STATE
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // =============================
  // 📌 Load States
  // =============================
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await getAllStates();
        setStates(res?.data || res || []);
      } catch (err) {
        console.error("State fetch error", err);
      }
    };
    fetchStates();
  }, []);

  // =============================
  // 📌 Load Cities when State changes
  // =============================
  useEffect(() => {
    if (!location.state) return;

    const fetchCities = async () => {
      try {
        const res = await getCitiesByState(location.state);
        console.log(res,"res")
        setCities(res?.data?.all_city );
      } catch (err) {
        console.error("City fetch error", err);
      }
    };

    fetchCities();
  }, [location.state]);
console.log(cities,"===>")
  // =============================
  // 📌 Google Autocomplete
  // =============================
  useEffect(() => {
    if (location.location_type !== "exact_address") return;
    if (!addressInputRef.current) return;
    if (!(window as any).google?.maps?.places) return;
    if (autocompleteRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(
      addressInputRef.current,
      { types: ["geocode"] }
    );

    autocomplete.setFields([
      "formatted_address",
      "geometry",
      "name",
    ]);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;

      const fullAddress =
        place.formatted_address || place.name || "";

      onUpdate({
        address: fullAddress,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        isSet: true,
      });

      if (addressInputRef.current) {
        addressInputRef.current.value = fullAddress;
      }
    });

    autocompleteRef.current = autocomplete;

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [location.location_type]);

  const canConfirmExact =
    location.location_type === "exact_address" &&
    !!location.address?.trim();

  const canSetCity =
    location.location_type === "city_only" &&
    !!location.city &&
    !!location.state;

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

  const handleTypeChange = (
    newType: "exact_address" | "city_only"
  ) => {
    onUpdate({
      location_type: newType,
      address: "",
      city: "",
      state: "",
      latitude: undefined,
      longitude: undefined,
      isSet: false,
    });
    setCities([]); // ✅ reset cities
  };

  const WORD_LIMIT = 50;
  const getWordCount = (text: string) =>
    text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      {/* Location Type */}
      <div>
        <span className={labelClass}>Location Type</span>
        <div className="flex gap-8 mt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              checked={
                location.location_type === "exact_address"
              }
              onChange={() =>
                handleTypeChange("exact_address")
              }
            />
            Exact Address
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              checked={
                location.location_type === "city_only"
              }
              onChange={() =>
                handleTypeChange("city_only")
              }
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
          onChange={(e) =>
            onUpdate({ label: e.target.value })
          }
        />
      </div>

      {/* =============================
          📌 CITY / STATE (API BASED)
      ============================= */}
      {location.location_type === "city_only" && (
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            {/* STATE */}
            <div>
              <label className={labelClass}>State</label>
              <select
                className={inputClass}
                value={location.state ?? ""}
                onChange={(e) => {
                  onUpdate({
                    state: e.target.value,
                    city: "",
                  });
                }}
              >
                <option value="">Select state</option>
                {states.map((state: any) => (
                  <option
                    key={state.id}
                    value={state.id}
                  >
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
                onChange={(e) =>
                  onUpdate({ city: e.target.value })
                }
                disabled={!location.state}
              >
                <option value="">Select city</option>
                {cities?.map((city: any) => (
                  <option key={city?.id} value={city?.name}>
                    {city?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            disabled={!canSetCity}
            className={`w-full ${buttonClass} ${
              canSetCity
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={handleSetCity}
          >
            Set Location
          </button>
        </div>
      )}

      {/* =============================
          📌 EXACT ADDRESS
      ============================= */}
      {location.location_type === "exact_address" && (
        <div>
          <label className={labelClass}>Address</label>
          <div className="flex gap-3">
            <input
              ref={addressInputRef}
              className={inputClass}
              value={location.address ?? ""}
              onChange={(e) =>
                onUpdate({ address: e.target.value })
              }
            />
            <button
              type="button"
              disabled={!canConfirmExact}
              className={`${buttonClass} ${
                canConfirmExact
                  ? "bg-gray-600"
                  : "bg-gray-300"
              }`}
              onClick={handleConfirmExact}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationFormFields;