import React from "react";
import { nanoid } from "nanoid";
import { FieldErrors, GlamCardFormData, Location } from "../types";
import LocationCard from "./LocationCard";

interface SectionProps {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
  errors?: FieldErrors;
  clearError?: (key: string) => void;
}

const sectionClass = "space-y-6 rounded-xl border border-border bg-card p-4 sm:p-6";

const createEmptyLocation = (index: number): Location => ({
  id: nanoid(),
  label: `Location ${index + 1}`,
  location_type: index === 0 ? "exact_address" : "city_only",
  address: "",
  area: "",
  city: "",
  state: "",

  latitude: undefined,     // ✅ UPDATED
  longitude: undefined,    // ✅ UPDATED
  phone: "",
  description: "",
  isPrimary: index === 0,
  isOpen: true,
});

const LocationsSection: React.FC<SectionProps> = ({
  data,
  setData,
  errors,
  clearError,
}) => {
  const addLocation = () => {
    setData((prev) => ({
      ...prev,
      locations: [...prev?.locations, createEmptyLocation(prev.locations?.length)],
    }));
    clearError?.("locations");
  };

  const updateLocation = (id: string, updates: Partial<Location>) => {
    setData((prev) => {
      if (updates.isPrimary === true) {
        return {
          ...prev,
          locations: prev.locations?.map((loc) => ({
            ...loc,
            isPrimary: loc.id === id,
          })),
        };
      }
      return {
        ...prev,
        locations: prev.locations?.map((loc) =>
          loc.id === id ? { ...loc, ...updates } : loc
        ),
      };
    });
  };

  const removeLocation = (id: string) => {
    setData((prev) => {
      const remaining = prev.locations?.filter((l) => l.id !== id);
      if (remaining?.length > 0 && !remaining.some((l) => l.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      return { ...prev, locations: remaining };
    });
  };

  return (
    <section
      id="field-locations"
      className={`${sectionClass} ${errors?.locations ? "border-destructive" : ""}`}
    >
      <div>
        <h3 className="text-lg font-semibold">
          Business Locations <span className="text-sm font-normal text-muted-foreground">(optional)</span>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add where clients can find you. With no location, your card shows no address or map.
        </p>
      </div>
      {errors?.locations && (
        <p className="text-sm text-destructive">{errors.locations}</p>
      )}
      <div className="space-y-5">
        {data.locations?.map((loc) => (
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
        className="mt-6 w-full rounded-xl border border-dashed border-border py-3 text-sm font-semibold text-primary hover:bg-accent hover:text-secondary transition-colors"
      >
        {data.locations?.length ? "+ Add Another Location" : "+ Add a Location"}
      </button>
    </section>
  );
};

export default LocationsSection;