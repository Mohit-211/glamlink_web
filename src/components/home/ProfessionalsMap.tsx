"use client";

import React, { useMemo, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

interface LocationType {
  latitude?: number | string;
  longitude?: number | string;
  address?: string;
  address_line_1?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface ProfessionalType {
  id: string;
  name: string;
  business_name?: string;
  specialty?: string;
  locations?: LocationType[];
  [key: string]: any;
}

interface ProfessionalsMapProps {
  professionals: ProfessionalType[];
  onSelectProfessional?: (pro: ProfessionalType) => void;
}

const ProfessionalsMap: React.FC<ProfessionalsMapProps> = ({
  professionals = [],
  onSelectProfessional,
}) => {
const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Flatten all locations
  const allLocations = useMemo(() => {
    return professionals?.flatMap((pro) =>
      (pro.locations || [])
        .filter((loc) => {
          const lat = Number(loc?.latitude);
          const lng = Number(loc?.longitude);
          return !isNaN(lat) && !isNaN(lng);
        })
        .map((loc) => {
          const lat = Number(loc.latitude);
          const lng = Number(loc.longitude);

          const fullAddress =
            loc.address ||
            [loc.address_line_1, loc.city, loc.state, loc.zip]
              .filter(Boolean)
              .join(", ");

          return {
            lat,
            lng,
            professional: pro,
            name: pro?.name || "Business",
            address: fullAddress || "Address not available",
          };
        })
    );
  }, [professionals]);

  // Default center (used until location data arrives), then recenter on first location
  const defaultCenter = { lat: 39.8283, lng: -98.5795 }; // geographic center of the US
  const center =
    allLocations.length > 0
      ? { lat: allLocations[0].lat, lng: allLocations[0].lng }
      : defaultCenter;

  if (!isLoaded)
    return (
      <div className="w-full h-full animate-pulse rounded-md bg-gray-200" />
    );

  return (
    <div className="w-full h-full flex">
      <div className="w-full h-full">

        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={allLocations.length > 0 ? 11 : 4}
          onClick={() => setActiveIndex(null)} // close on map click
        >
          {allLocations.map((loc, index) => (
            <Marker
              key={index}
              position={{ lat: loc.lat, lng: loc.lng }}
              onClick={() => {
                setActiveIndex(index === activeIndex ? null : index);
                onSelectProfessional?.(loc.professional);
              }}
            />
          ))}

          {/* Single InfoWindow outside markers — no remount on hover */}
          {activeIndex !== null && (
            <InfoWindow
              position={{
                lat: allLocations[activeIndex].lat,
                lng: allLocations[activeIndex].lng,
              }}
              onCloseClick={() => setActiveIndex(null)}
            >
              <div style={{ minWidth: "220px" }}>
                <div style={{ fontWeight: 600 }}>
                  {allLocations[activeIndex].name}
                </div>
                <div style={{ fontSize: "13px", marginTop: "4px" }}>
                  {allLocations[activeIndex].address}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

      </div>
    </div>
  );
};

export default ProfessionalsMap;
