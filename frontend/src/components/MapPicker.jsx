import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.209 };

export default function MapPicker({
  onSelect,
  center = DEFAULT_CENTER,
  zoom = 12,
  height = "400px",
}) {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [markerPos, setMarkerPos] = useState(null);

  if (!API_KEY) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
        Missing Google Maps API key. Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to
        your environment to enable location selection.
      </div>
    );
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
  });

  const handleClick = (e) => {
    const pos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setMarkerPos(pos);
    onSelect?.(pos);
  };

  if (loadError) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
        Failed to load Google Maps. Please verify your API key.
      </div>
    );
  }

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={{ ...containerStyle, height }}
      center={markerPos || center}
      zoom={zoom}
      onClick={handleClick}
    >
      {markerPos && <Marker position={markerPos} />}
    </GoogleMap>
  );
}
