import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";

const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
  height: "300px",
  width: "100%",
};

interface AddressLookupProps {
  address?: string;
  latitude?: number;   // ✅ using latitude
  lng?: number;
  onAddressChange: (
    address: string,
    latitude?: number,
    lng?: number
  ) => void;
}

const AddressLookup: React.FC<AddressLookupProps> = ({
  address,
  latitude,
  lng,
  onAddressChange,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    libraries,
  });

  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  // 🔥 IMPORTANT: Google requires { lat, lng }
  const [markerPosition, setMarkerPosition] = useState<
    google.maps.LatLngLiteral | undefined
  >(
    latitude && lng
      ? { lat: latitude, lng: lng }
      : undefined
  );

  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(
    latitude && lng
      ? { lat: latitude, lng: lng }
      : { lat: 20.5937, lng: 78.9629 } // India default
  );

  const [currentAddress, setCurrentAddress] = useState(address || "");

  // ✅ Sync if props change
  useEffect(() => {
    if (latitude && lng) {
      setMarkerPosition({ lat: latitude, lng });
      setMapCenter({ lat: latitude, lng });
    }
  }, [latitude, lng]);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results[0]) {
        const formattedAddress = data.results[0].formatted_address;
        setCurrentAddress(formattedAddress);

        // 🔥 convert back to latitude
        onAddressChange(formattedAddress, lat, lng);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lngValue = event.latLng.lng();

    setMarkerPosition({ lat, lng: lngValue });
    setMapCenter({ lat, lng: lngValue });

    fetchAddress(lat, lngValue);
  }, []);

  const onPlacesChanged = () => {
    if (!searchBoxRef.current) return;

    const places = searchBoxRef.current.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lngValue = place.geometry.location.lng();

    setMarkerPosition({ lat, lng: lngValue });
    setMapCenter({ lat, lng: lngValue });

    fetchAddress(lat, lngValue);
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="my-4">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={13}
        onClick={onMapClick}
      >
        <StandaloneSearchBox
          onLoad={(ref) => (searchBoxRef.current = ref)}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Search location"
            className="absolute left-1/2 top-3 -translate-x-1/2 w-64 rounded-md border bg-white px-3 py-2 shadow-md"
          />
        </StandaloneSearchBox>

        {markerPosition && (
          <Marker position={markerPosition}>
            <InfoWindow position={markerPosition}>
              <div>
                <p className="text-sm">{currentAddress}</p>
              </div>
            </InfoWindow>
          </Marker>
        )}
      </GoogleMap>
    </div>
  );
};

export default AddressLookup;