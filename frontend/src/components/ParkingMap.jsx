import React, { useState } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 };

export default function ParkingMap({
  lots = [],
  userLocation,
  onSelectLot,
}) {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [activeLotId, setActiveLotId] = useState(null);

  if (!API_KEY) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
        Google Maps API key missing. Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to show the map.
      </div>
    );
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
  });

  if (loadError) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
        Unable to load Google Maps. Check your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="p-4 text-sm text-gray-500">Loading map…</div>;
  }

  const center =
    userLocation ||
    (lots.length > 0
      ? { lat: lots[0].lat, lng: lots[0].lng }
      : DEFAULT_CENTER);

  const handleMarkerClick = (lot) => {
    setActiveLotId(lot.id);
    onSelectLot?.(lot);
  };

  const handleDirections = (lot) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lot.lat},${lot.lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={userLocation ? 13 : 12}
      center={userLocation || center}
      options={{ streetViewControl: false, mapTypeControl: false }}
    >
      {userLocation && (
        <Marker
          position={userLocation}
          label={{
            text: "You",
            color: "#1d4ed8",
            fontWeight: "bold",
          }}
        />
      )}

      {lots.map((lot) => (
        <Marker
          key={lot.id}
          position={{ lat: lot.lat, lng: lot.lng }}
          onClick={() => handleMarkerClick(lot)}
        >
          {activeLotId === lot.id && (
            <InfoWindow onCloseClick={() => setActiveLotId(null)}>
              <div className="text-sm">
                <h4 className="font-semibold text-gray-800 mb-1">{lot.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{lot.address}</p>
                <p className="text-xs text-gray-600 mb-1">
                  Available: <strong>{lot.availableSlots}</strong> / {lot.totalSlots}
                </p>
                <p className="text-xs text-gray-600 mb-3">${lot.pricePerHour}/hr</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDirections(lot)}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Directions
                  </button>
                  <button
                    onClick={() => onSelectLot?.(lot, { openDetail: true })}
                    className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
}

