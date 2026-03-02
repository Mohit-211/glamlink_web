"use client";

import React, { useMemo, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import GlamCardLivePreview from "../glamcard/GlamCardLivePreview";

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
  professionals: ProfessionalType[]; // receive from Hero
  onSelectProfessional?: (pro: ProfessionalType) => void; // callback to Hero
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
          return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
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
            professional: pro, // keep full object
            name: pro?.name || "Business",
            address: fullAddress || "Address not available",
          };
        })
    );
  }, [professionals]);

  const center =
    allLocations.length > 0
      ? { lat: allLocations[0].lat, lng: allLocations[0].lng }
      : { lat: 20.5937, lng: 78.9629 };

  if (!isLoaded) return <p className="text-center">Loading map...</p>;

  return (
    <div className="w-full h-full flex">
      {/* Map */}
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
              onClick={() => onSelectProfessional?.(loc.professional)} // send to Hero
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