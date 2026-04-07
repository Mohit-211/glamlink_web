import React from "react";
import { Star, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Location } from "./types";

interface Props {
  loc: Location;
  index: number;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  removeLocation: (id: string) => void;
  setPrimary: (id: string) => void;
  children: React.ReactNode;
}

const LocationItem: React.FC<Props> = ({
  loc,
  index,
  updateLocation,
  removeLocation,
  setPrimary,
  children,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-start justify-between bg-gray-50 px-4 py-3">
        <div className="flex gap-3">
          <span className="text-sm font-semibold text-gray-500">
            #{index + 1}
          </span>

          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{loc.label || "Location"}</p>

              {loc.isPrimary && (
                <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                  ⭐ Primary
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500">
              {loc.address?.trim() || "No address set"}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* EXPAND / COLLAPSE */}
          <button
            type="button"
            onClick={() => updateLocation(loc.id, { isOpen: !loc.isOpen })}
          >
            {loc.isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {/* SET PRIMARY */}
          <button
            type="button"
            onClick={() => setPrimary(loc.id)}
            title="Set Primary"
          >
            <Star
              size={18}
              className={
                loc.isPrimary
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400"
              }
            />
          </button>

          {/* DELETE */}
          <button
            type="button"
            onClick={() => removeLocation(loc.id)}
            title="Delete"
          >
            <Trash2 size={18} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* BODY */}
      {loc.isOpen && (
        <div className="space-y-6 p-5">
          {children}
        </div>
      )}
    </div>
  );
};

export default LocationItem;
