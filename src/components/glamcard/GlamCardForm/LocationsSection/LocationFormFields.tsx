import React, { useEffect, useRef } from "react";

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
  latitude?: number;     // ✅ UPDATED
  longitude?: number;    // ✅ UPDATED
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

  useEffect(() => {
    if (location.location_type !== "exact_address") return;
    if (!addressInputRef.current) return;
    if (typeof window === "undefined") return;
    if (!(window as any).google?.maps?.places) return;
    if (autocompleteRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(
      addressInputRef.current,
      {
        types: ["geocode"],
      }
    );

    autocomplete.setFields(["formatted_address", "geometry", "name"]);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;

      const fullAddress =
        place.formatted_address || place.name || "";

      onUpdate({
        address: fullAddress,
        latitude: place.geometry.location.lat(),      // ✅ UPDATED
        longitude: place.geometry.location.lng(),     // ✅ UPDATED
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
  }, [location.location_type, onUpdate]);

  const canConfirmExact =
    location.location_type === "exact_address" &&
    !!location.address?.trim();

  const canSetCity =
    location.location_type === "city_only" &&
    !!location.city?.trim() &&
    !!location.state?.trim();

  const handleConfirmExact = () => {
    if (!canConfirmExact) return;

    // Fallback demo coordinates
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
      area: "",
      latitude: undefined,     // ✅ UPDATED
      longitude: undefined,    // ✅ UPDATED
      isSet: false,
    });
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
              name="location-type"
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
              name="location-type"
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
          placeholder="e.g. Main Studio, Downtown Location"
        />
      </div>

      {/* Exact Address */}
      {location.location_type === "exact_address" && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Address</label>
            <div className="flex gap-3">
              <input
                ref={addressInputRef}
                className={inputClass}
                value={location.address ?? ""}
                onChange={(e) =>
                  onUpdate({
                    address: e.target.value,
                  })
                }
                placeholder="Start typing address..."
              />
              <button
                type="button"
                disabled={!canConfirmExact}
                className={`${buttonClass} ${
                  canConfirmExact
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                onClick={handleConfirmExact}
              >
                Confirm
              </button>
            </div>
          </div>

          {location.isSet &&
            location.latitude &&
            location.longitude && (
              <div className="rounded-lg bg-green-50 p-4 text-sm">
                <p className="font-medium text-green-800">
                  Location Confirmed
                </p>
                <p className="mt-1 text-green-700">
                  {location.address}
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Lat: {location.latitude.toFixed(5)} •
                  Lng: {location.longitude.toFixed(5)}
                </p>
              </div>
            )}
        </div>
      )}

      {/* City Only */}
      {location.location_type === "city_only" && (
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>City</label>
              <input
                className={inputClass}
                value={location.city ?? ""}
                onChange={(e) =>
                  onUpdate({ city: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <select
                className={inputClass}
                value={location.state ?? ""}
                onChange={(e) =>
                  onUpdate({ state: e.target.value })
                }
              >
                <option value="">
                  Select state
                </option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="NV">Nevada</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="TX">Texas</option>
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

          {location.isSet &&
            location.city &&
            location.state && (
              <div className="rounded-lg bg-green-50 p-4 text-sm">
                <p className="font-medium text-green-800">
                  Location Set
                </p>
                <p className="mt-1 text-green-700">
                  {location.city.trim()},{" "}
                  {location.state.trim()}
                </p>
              </div>
            )}
        </div>
      )}

      {/* Shared Fields */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>
            Business Name (optional)
          </label>
          <input
            className={inputClass}
            value={location.business_name ?? ""}
            onChange={(e) =>
              onUpdate({
                business_name: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className={labelClass}>
            Phone (optional)
          </label>
          <input
            className={inputClass}
            value={location.phone ?? ""}
            onChange={(e) =>
              onUpdate({
                phone: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>
          Notes / Description (optional)
        </label>
        <textarea
          rows={3}
          className={inputClass}
          value={location.description ?? ""}
          placeholder="Additional info, parking notes, etc."
          onChange={(e) => {
            const value = e.target.value;
            if (getWordCount(value) <= WORD_LIMIT) {
              onUpdate({ description: value });
            }
          }}
        />
        <p className="mt-1 text-right text-xs text-gray-500">
          {getWordCount(location.description ?? "")} / 50 words
        </p>
      </div>
    </div>
  );
};

export default LocationFormFields;