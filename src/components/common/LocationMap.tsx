"use client";

import { useEffect, useRef } from "react";

interface Props {
  lat: number;
  lng: number;
}

export default function LocationMap({ lat, lng }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!(window as any).google?.maps || !mapRef.current) return;

    const position = { lat, lng };

    if (!mapInstance.current) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: position,
        zoom: 15,
        disableDefaultUI: true,
      });

      markerInstance.current = new google.maps.Marker({
        position,
        map: mapInstance.current,
      });
    } else {
      mapInstance.current.setCenter(position);
      markerInstance.current?.setPosition(position);
    }
  }, [lat, lng]);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg border"
      style={{ height: 200 }}
    />
  );
}
