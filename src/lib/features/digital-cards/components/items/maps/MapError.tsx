"use client";

import { MapPin } from "lucide-react";
import { LocationData } from "@/lib/pages/for-professionals/types/professional";

interface MapErrorProps {
  location: LocationData;
  mapError: string;
  height?: string;
  className?: string;
  showDirections?: boolean;
  getOSMapUrl: () => string;
  handleDirectionsClick: () => void;
}

export default function MapError({
  location,
  mapError,
  height = "400px",
  className = "",
  showDirections = true,
  getOSMapUrl,
  handleDirectionsClick,
}: MapErrorProps) {
  return (
    <div className={`google-maps-display ${className}`}>
      <div className="bg-gray-100 rounded-lg overflow-hidden h-64 md:h-80 lg:h-96 xl:h-[400px] relative">
        {/* Try OpenStreetMap fallback first */}
        <iframe
          src={getOSMapUrl()}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          className="absolute inset-0"
          title="Location map"
          onError={(e) => {
            // If OpenStreetMap fails, show fallback image
            const target = e.target as HTMLIFrameElement;
            target.style.display = 'none';
            const fallbackDiv = target.parentElement?.querySelector('.map-fallback');
            if (fallbackDiv) {
              fallbackDiv.classList.remove('hidden');
            }
          }}
        />

        {/* Fallback when both Google Maps and OpenStreetMap fail */}
        <div className="map-fallback hidden absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center p-4">
            <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm mb-2">
              {location.address || 'Location map'}
            </p>
            <p className="text-gray-500 text-xs">
              {process.env.NODE_ENV === 'development' ?
                `Map error: ${mapError}` :
                'Map temporarily unavailable'
              }
            </p>
            {showDirections && (
              <button
                onClick={handleDirectionsClick}
                className="mt-3 text-xs text-glamlink-teal hover:text-glamlink-teal-dark underline"
              >
                Get directions 
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
