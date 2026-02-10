import React from "react";
import { nanoid } from "nanoid";
import { GlamCardFormData, Location } from "../types";
import LocationCard from "./LocationCard";

interface SectionProps {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}

const sectionClass = "space-y-6 rounded-xl border border-gray-200 bg-white p-6";

const createEmptyLocation = (index: number): Location => ({
  id: nanoid(),                                 // ← FIXED: was missing
  label: `Location ${index + 1}`,
  location_type: index === 0 ? "exact_address" : "city_only",
  address: "",
  area: "",
  city: "",
  state: "",
  // lat: undefined,
  // lng: undefined,
  // isSet: false,
  business_name: "",
  phone: "",
  description: "",
  isPrimary: index === 0,
  isOpen: true,
});

const LocationsSection: React.FC<SectionProps> = ({ data, setData }) => {
  const addLocation = () => {
    setData((prev) => ({
      ...prev,
      locations: [...prev.locations, createEmptyLocation(prev.locations.length)],
    }));
  };

  const updateLocation = (id: string, updates: Partial<Location>) => {
    setData((prev) => {
      if (updates.isPrimary === true) {
        return {
          ...prev,
          locations: prev.locations.map((loc) => ({
            ...loc,
            isPrimary: loc.id === id,
          })),
        };
      }
      return {
        ...prev,
        locations: prev.locations.map((loc) =>
          loc.id === id ? { ...loc, ...updates } : loc
        ),
      };
    });
  };

  const removeLocation = (id: string) => {
    setData((prev) => {
      const remaining = prev.locations.filter((l) => l.id !== id);
      if (remaining.length > 0 && !remaining.some((l) => l.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      return { ...prev, locations: remaining };
    });
  };

  return (
    <section className={sectionClass}>
      <h3 className="text-lg font-semibold">Business Locations *</h3>
      <div className="space-y-5">
        {data.locations.map((loc) => (
          <LocationCard
            key={loc.id}
            location={loc}
            onUpdate={(updates) => updateLocation(loc.id, updates)}
            onRemove={() => removeLocation(loc.id)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={addLocation}
        className="mt-6 w-full rounded-lg border border-dashed border-gray-400 py-3 text-sm font-medium text-gray-600 hover:border-gray-500 hover:text-gray-800 transition-colors"
      >
        + Add Another Location
      </button>
    </section>
  );
};

export default LocationsSection;