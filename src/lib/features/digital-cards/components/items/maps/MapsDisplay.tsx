"use client";

import { MapPin, ExternalLink, Navigation } from "lucide-react";
import { LocationData } from "@/lib/pages/for-professionals/types/professional";

interface MapsDisplayProps {
  mapRef: React.RefObject<HTMLDivElement | null>;
  location: LocationData;
  height?: string;
  className?: string;
  showAddressOverlay?: boolean;
  showAddressBelowMap?: boolean;
  showInfo?: boolean;
  showDirections?: boolean;
  handleDirectionsClick: () => void;
  isInfoWindowOpen?: boolean;
}

export default function MapsDisplay({
  mapRef,
  location,
  height = "400px",
  className = "",
  showAddressOverlay = true,
  showAddressBelowMap = false,
  showInfo = true,
  showDirections = true,
  handleDirectionsClick,
  isInfoWindowOpen = false,
}: MapsDisplayProps) {
  return (
    <div
      className={`google-maps-display ${className}`}
      data-lat={location.lat}
      data-lng={location.lng}
      data-address={location.address}
    >
      {/* Location Information Above Map - Always shown on mobile */}
      {showInfo && location && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg md:hidden">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {location.businessName || "Business Location"}
              </h3>
              <p className="text-sm text-gray-600">
                {location.address}
              </p>
            </div>
            <MapPin className="w-5 h-5 text-glamlink-teal flex-shrink-0" />
          </div>

          {location.phone && (
            <p className="text-sm text-gray-600 mb-3">
              <strong>Phone:</strong> {location.phone}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {showDirections && (
              <button
                onClick={handleDirectionsClick}
                className="btn-primary btn-sm flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </button>
            )}

            {location.googleMapsUrl && (
              <a
                href={location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary btn-sm flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View on Maps
              </a>
            )}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="bg-gray-100 rounded-lg overflow-hidden relative h-64 md:h-80 lg:h-96 xl:h-[400px]">
        <div
          ref={mapRef}
          className="w-full h-full"
          data-lat={location.lat}
          data-lng={location.lng}
          data-address={location.address}
        />

        {/* Address Overlay - Hidden on mobile, shown on md and up, hidden when InfoWindow is open */}
        {showAddressOverlay && location && !isInfoWindowOpen && (
          <div className="hidden md:block absolute top-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-glamlink-teal flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {location.businessName || "Business Location"}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {location.address}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
