"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

interface LocationType {
  latitude?: number | string;
  longitude?: number | string;
  address?: string;
  address_line_1?: string;
  city?: string;
  state?: string;
  zip?: string;
  is_primary?: boolean;
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
  selectedProfessional?: ProfessionalType | null;
  selectedLocationIndex?: number;
}

const containerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 39.8283, lng: -98.5795 }; // geographic center of the US

const ProfessionalsMap: React.FC<ProfessionalsMapProps> = ({
  professionals = [],
  onSelectProfessional,
  selectedProfessional = null,
  selectedLocationIndex = 0,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

const mapRef = useRef<google.maps.Map | null>(null);
const clustererRef = useRef<MarkerClusterer | null>(null);
const markersRef = useRef<google.maps.Marker[]>([]);
const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
const selectedMarkerRef = useRef<google.maps.Marker | null>(null);
const fromMarkerClickRef = useRef(false); // NEW
  // Flatten professionals -> valid locations. Recomputed only when data changes.
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

  const initialCenter =
    allLocations.length > 0
      ? { lat: allLocations[0].lat, lng: allLocations[0].lng }
      : defaultCenter;

  // Build imperative markers + clusterer whenever the dataset changes.
  // Imperative markers + clustering scale to thousands of points without
  // React re-rendering a <Marker> per point.
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    clustererRef.current?.clearMarkers();
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (!allLocations.length) return;

    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow();
    }

    const markers = allLocations.map((loc) => {
      const marker = new google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
      });
  marker.addListener("click", () => {
  infoWindowRef.current?.setContent(
    `<div style="min-width:220px">
       <div style="font-weight:600">${loc.name}</div>
       <div style="font-size:13px;margin-top:4px">${loc.address}</div>
     </div>`
  );
  infoWindowRef.current?.open({ map: mapRef.current!, anchor: marker });
  fromMarkerClickRef.current = true; // NEW — is selection ka source pin-click hai
  onSelectProfessional?.(loc.professional);
});
      return marker;
    });

    markersRef.current = markers;
    clustererRef.current = new MarkerClusterer({ map: mapRef.current, markers });

    if (!selectedProfessional) {
      mapRef.current.setCenter(initialCenter);
      mapRef.current.setZoom(allLocations.length > 0 ? 11 : 4);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, allLocations]);

  // Fly to + highlight the selected professional's chosen location
useEffect(() => {
  if (!isLoaded || !mapRef.current || !selectedProfessional) return;

  const locations = selectedProfessional.locations || [];
  const loc = locations[selectedLocationIndex] || locations[0];
  if (!loc) return;

  const lat = Number(loc.latitude);
  const lng = Number(loc.longitude);
  if (isNaN(lat) || isNaN(lng)) return;

  const skipZoom = fromMarkerClickRef.current;
  fromMarkerClickRef.current = false; // reset for next time

  if (!skipZoom) {
    // Selection search se aayi hai — location screen par nahi thi, isliye zoom-in zaroori
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
  }
  // pin-click se aayi ho to zoom/pan skip — sirf highlight update hoga niche

  if (selectedMarkerRef.current) {
    selectedMarkerRef.current.setIcon(undefined as any);
    selectedMarkerRef.current.setZIndex(undefined as any);
  }

  const match = markersRef.current.find((m) => {
    const pos = m.getPosition();
    return pos && pos.lat() === lat && pos.lng() === lng;
  });

  if (match) {
    match.setIcon({
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: "#17a9b7",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
    });
    match.setZIndex(999);
    selectedMarkerRef.current = match;
  }
}, [isLoaded, selectedProfessional, selectedLocationIndex]);
  if (!isLoaded)
    return <div className="w-full h-full animate-pulse rounded-md bg-gray-200" />;

  return (
    <div className="w-full h-full flex">
      <div className="w-full h-full">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={initialCenter}
          zoom={allLocations.length > 0 ? 11 : 4}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onClick={() => infoWindowRef.current?.close()}
        />
      </div>
    </div>
  );
};

export default ProfessionalsMap;