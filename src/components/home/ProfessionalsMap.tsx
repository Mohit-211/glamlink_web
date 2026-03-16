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
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Flatten all locations
  const allLocations = useMemo(() => {
    return professionals.flatMap((pro) =>
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

  // Set center to first location, or undefined if none
  const center =
    allLocations.length > 0
      ? { lat: allLocations[0].lat, lng: allLocations[0].lng }
      : undefined;

  if (!isLoaded) return <p className="text-center">Loading map...</p>;
  if (!center) return <p className="text-center">No locations available</p>;

  return (
    <div className="w-full h-full flex">
      <div className="w-full h-full">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={11}
        >
          {allLocations.map((loc, index) => (
            <Marker
              key={index}
              position={{ lat: loc.lat, lng: loc.lng }}
              onMouseOver={() => setHoveredIndex(index)}
              onMouseOut={() => setHoveredIndex(null)}
              onClick={() => onSelectProfessional?.(loc.professional)}
            >
              {hoveredIndex === index && (
                <InfoWindow
                  position={{ lat: loc.lat, lng: loc.lng }}
                  onCloseClick={() => setHoveredIndex(null)}
                >
                  <div style={{ minWidth: "220px" }}>
                    <div style={{ fontWeight: 600 }}>{loc.name}</div>
                    <div style={{ fontSize: "13px", marginTop: "4px" }}>
                      {loc.address}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default ProfessionalsMap;
