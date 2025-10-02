"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import { LeafletMouseEvent } from "leaflet";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapPicker({ value, onChange }: {
  value: { lat: number, lng: number } | null,
  onChange: (coords: { lat: number, lng: number }) => void
}) {
  const [position, setPosition] = useState(value || { lat: 25.2048, lng: 55.2708 }); // Default: Dubai
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  function LocationMarker() {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        setPosition(e.latlng);
        onChange(e.latlng);
      },
    });
    return position ? <Marker position={position} /> : null;
  }

  if (!isClient) {
    return (
      <div className="w-full h-64 rounded-lg overflow-hidden border border-neutral-700 mb-2 flex items-center justify-center bg-neutral-800">
        <div className="text-neutral-400">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-neutral-700 mb-2">
      <MapContainer center={position} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
} 