"use client";

import { getAllStates, getCitiesByState } from "@/api/Api";
import React, { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_LIBRARIES, GOOGLE_MAPS_LOADER_ID } from "@/lib/googleMapsLoader";
import { NativeSelect } from "@/components/ui/native-select";

interface Location {
  location_type: "exact_address" | "city_only";
  address?: string;
  city?: string;
  state?: string;
  area?: string;
  label?: string;
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

// Helper: pull latitude/longitude off a city record if the API already provides them
const extractCityCoords = (cityObj: any): { latitude: number; longitude: number } | null => {
  if (!cityObj) return null;
  const latitude = cityObj.latitude ?? cityObj.lat ?? cityObj.Latitude;
  const longitude = cityObj.longitude ?? cityObj.lng ?? cityObj.Longitude;
  if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) return null;
  const latitudeNum = Number(latitude);
  const longitudeNum = Number(longitude);
  if (Number.isNaN(latitudeNum) || Number.isNaN(longitudeNum)) return null;
  return { latitude: latitudeNum, longitude: longitudeNum };
};

const LocationFormFields: React.FC<FieldsProps> = ({ location, onUpdate }) => {
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [cityCoords, setCityCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [cityCoordsLoading, setCityCoordsLoading] = useState(false);

  // Loads the Google Maps JS script (shared singleton across every
  // useJsApiLoader/useLoadScript call in the app, so this doesn't add a
  // second <script> tag if AddressLookup/ProfessionalsMap are also mounted).
  // Without this, window.google never exists here and both the city
  // geocoder below and the address Autocomplete further down silently do
  // nothing.
  const { isLoaded: isGoogleMapsLoaded } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

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

  /* Resolve latitude/longitude for the selected city:
     1) use coords already present on the city record from the API
     2) otherwise geocode "City, State" with Google Maps Geocoder */
  useEffect(() => {
    if (location.location_type !== "city_only" || !location.city || !cities.length) {
      setCityCoords(null);
      return;
    }

    const cityObj = cities.find((c: any) => c?.name === location.city);
    if (!cityObj) {
      setCityCoords(null);
      return;
    }

    const directCoords = extractCityCoords(cityObj);
    if (directCoords) {
      setCityCoords(directCoords);
      return;
    }

    // Google's script loads asynchronously — bail for now, but this effect
    // re-runs once isGoogleMapsLoaded flips true (it's a dependency below),
    // so the geocode still fires as soon as the script is ready instead of
    // silently never resolving.
    if (!isGoogleMapsLoaded || !(window as any).google?.maps?.Geocoder) {
      setCityCoords(null);
      return;
    }

    if (!geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }

    const query = [cityObj?.name, location.state].filter(Boolean).join(", ");
    if (!query) {
      setCityCoords(null);
      return;
    }

    let cancelled = false;
    setCityCoordsLoading(true);

    geocoderRef.current.geocode({ address: query }, (results, status) => {
      if (cancelled) return;
      setCityCoordsLoading(false);

      if (status === "OK" && results?.[0]?.geometry?.location) {
        const loc = results[0].geometry.location;
        setCityCoords({ latitude: loc.lat(), longitude: loc.lng() });
      } else {
        console.error("City geocode failed:", status);
        setCityCoords(null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [location.city, location.state, cities, states, location.location_type, isGoogleMapsLoaded]);

  /* Google Places Autocomplete Setup */
  useEffect(() => {
    if (location.location_type !== "exact_address") return;
    if (!addressInputRef.current) return;
    // Same async-load issue as the geocoder above — re-runs once
    // isGoogleMapsLoaded flips true instead of only checking once at mount.
    if (!isGoogleMapsLoaded || !(window as any).google?.maps?.places) return;

    // Destroy existing instance if switching types
    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
      autocompleteRef.current = null;
    }

    // Suggestions from the countries the form's states and cities cover
    const autocomplete = new google.maps.places.Autocomplete(
      addressInputRef.current,
      { types: ["geocode"], componentRestrictions: { country: ["us", "ca"] } }
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
  }, [location.location_type, onUpdate, isGoogleMapsLoaded]);

  const canConfirmExact =
    location.location_type === "exact_address" && !!location.address?.trim();

  // A city can be set even when the browser can't geocode it: the API places it after saving.
  const canSetCity =
    location.location_type === "city_only" &&
    !!location.city &&
    !!location.state &&
    !cityCoordsLoading;

  // An address picked from the suggestions brings its coordinates; a typed one is sent without
  // any, and the API geocodes it after saving.
  const handleConfirmExact = () => {
    if (!canConfirmExact) return;
    onUpdate({ isSet: true });
  };

  const handleSetCity = () => {
    if (!canSetCity) return;
    onUpdate({
      isSet: true,
      latitude: cityCoords?.latitude,
      longitude: cityCoords?.longitude,
    });
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
    setCityCoords(null);
  };

  return (
    <div className="space-y-6">
      {/* Location Type */}
      <div>
        <span className="label-glamlink">Location Type</span>
        <div className="mt-2 flex flex-wrap gap-4 sm:gap-8">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              checked={location.location_type === "exact_address"}
              onChange={() => handleTypeChange("exact_address")}
              className="accent-secondary"
            />
            Exact Address
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              checked={location.location_type === "city_only"}
              onChange={() => handleTypeChange("city_only")}
              className="accent-secondary"
            />
            City / Area Only
          </label>
        </div>
      </div>

      {/* Display Label */}
      <div>
        <label className="label-glamlink">Display Label</label>
        <input
          className="input-glamlink"
          placeholder="e.g. Downtown Studio"
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
              <label className="label-glamlink">State</label>
              <NativeSelect
                className="input-glamlink"
                value={String(location.state ?? "")}
                onChange={(e) => {
                  onUpdate({
                    state: e.target.value,
                    city: "",
                    latitude: undefined,
                    longitude: undefined,
                    isSet: false,
                  });
                }}
                disabled={statesLoading}
              >
                <option value="">
                  {statesLoading ? "Loading states..." : "Select state"}
                </option>
                {states.map((state: any) => (
                  <option key={state.id} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </NativeSelect>
            </div>

            {/* CITY */}
            <div>
              <label className="label-glamlink">City</label>
              <NativeSelect
                className="input-glamlink"
                value={location?.city ?? ""}
                onChange={(e) =>
                  onUpdate({ city: e.target.value, latitude: undefined, longitude: undefined, isSet: false })
                }
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
                  <option key={city?.id} value={city?.name}>
                    {city?.name}
                  </option>
                ))}
              </NativeSelect>
              {location.city && cityCoordsLoading && (
                <p className="mt-1 text-xs text-muted-foreground/80">Resolving coordinates…</p>
              )}
              {location.city && !cityCoordsLoading && !cityCoords && (
                <p className="mt-1 text-xs text-muted-foreground">
                  We&apos;ll place this city on the map after you save.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!canSetCity}
              className="btn-primary w-full disabled:opacity-50"
              onClick={handleSetCity}
            >
              {citiesLoading || cityCoordsLoading ? "Loading..." : "Set Location"}
            </button>
            {location.isSet && (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                ✓
              </span>
            )}
          </div>
        </div>
      )}

      {/* EXACT ADDRESS */}
      {location.location_type === "exact_address" && (
        <div>
          <label className="label-glamlink">Address</label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <input
                ref={addressInputRef}
                className="input-glamlink"
                value={location.address ?? ""}
                // Typing replaces a picked suggestion, so its coordinates no longer apply.
                // (Picking a suggestion sets the input's value directly, which fires no onChange.)
                onChange={(e) =>
                  onUpdate({ address: e.target.value, latitude: undefined, longitude: undefined, isSet: false })
                }
                placeholder="Start typing an address..."
              />
            </div>
            <div className="flex flex-shrink-0 items-center gap-3">
              <button
                type="button"
                disabled={!canConfirmExact}
                className="btn-primary flex-1 sm:flex-none sm:min-w-[120px] disabled:opacity-50"
                onClick={handleConfirmExact}
              >
                Confirm
              </button>
              {location.isSet && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                  ✓
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationFormFields;