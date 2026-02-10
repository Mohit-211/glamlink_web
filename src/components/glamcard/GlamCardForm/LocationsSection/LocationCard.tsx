import React from "react";
import LocationFormFields from "./LocationFormFields";
import { Location } from "../types";

interface CardProps {
  location: Location;
  onUpdate: (updates: Partial<Location>) => void;
  onRemove: () => void;
}

const LocationCard: React.FC<CardProps> = ({ location, onUpdate, onRemove }) => {
  const isPrimary = location.isPrimary;

  const handleMakePrimary = () => {
    onUpdate({ isPrimary: true });
  };

  const handleToggle = () => {
    onUpdate({ isOpen: !location.isOpen });
  };

  // Fixed summary
  const locationSummary =
    location.location_type === "city_only"
      ? [location.area, location.city, location.state]
          .filter(Boolean)
          .join(", ") || "City / Area not set"
      : location.address || [location.city, location.state].filter(Boolean).join(", ") || "Not configured";

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div
        className={`flex items-center justify-between px-5 py-3.5 border-b ${
          isPrimary
            ? "bg-yellow-50/80 border-yellow-200"
            : "bg-gray-50/70 border-gray-200"
        }`}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-medium text-gray-900">
              {location.label || "Location"}
            </span>
            {isPrimary && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-200 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.158c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.54 1.118l-3.368-2.447a1 1 0 00-1.175 0l-3.368 2.447c-.784.57-1.838-.197-1.54-1.118l1.286-3.95a1 1 0 00-.364-1.118L2.98 9.377c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.286-3.95z" />
                </svg>
                Primary
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-gray-600">{locationSummary}</p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {!isPrimary && (
            <button
              type="button"
              onClick={handleMakePrimary}
              className="flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 transition-colors"
              title="Set as primary location"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.158c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.54 1.118l-3.368-2.447a1 1 0 00-1.175 0l-3.368 2.447c-.784.57-1.838-.197-1.54-1.118l1.286-3.95a1 1 0 00-.364-1.118L2.98 9.377c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.951-.69l1.286-3.95z" />
              </svg>
              <span className="hidden sm:inline">Make primary</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 transition-colors"
            title="Remove location"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">Remove</span>
          </button>

          <button
            type="button"
            onClick={handleToggle}
            className="text-xl leading-none text-gray-600 hover:text-gray-900"
            aria-label={location.isOpen ? "Collapse" : "Expand"}
          >
            {location.isOpen ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {location.isOpen && (
        <div className="p-6">
          <LocationFormFields location={location} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
};

export default LocationCard;