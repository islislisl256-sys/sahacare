'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CheckCircle2, Loader2 } from 'lucide-react';

// Fix leaflet default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
  onLocationSelect: (address: string) => void;
  onClose: () => void;
}

// Sub-component to handle map clicks
function LocationMarker({ position, setPosition, setAddressName, setLoading }: any) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      setLoading(true);
      
      try {
        // Reverse geocoding using Nominatim
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        const data = await res.json();
        if (data && data.display_name) {
          // Simplify address for readability
          const addressParts = [];
          if (data.address.road) addressParts.push(data.address.road);
          if (data.address.suburb) addressParts.push(data.address.suburb);
          if (data.address.city || data.address.town || data.address.village) {
            addressParts.push(data.address.city || data.address.town || data.address.village);
          } else if (data.address.state) {
            addressParts.push(data.address.state);
          }
          
          const finalAddress = addressParts.length > 0 ? addressParts.join('، ') : data.display_name;
          setAddressName(finalAddress);
        } else {
          setAddressName("موقع محدد على الخريطة");
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        setAddressName("موقع محدد (خطأ في الاتصال)");
      } finally {
        setLoading(false);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function MapPicker({ onLocationSelect, onClose }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [addressName, setAddressName] = useState<string>("قم بالنقر على الخريطة لتحديد موقعك");
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden relative border border-gray-200 dark:border-slate-700 shadow-inner flex flex-col">
      <div className="flex-1 w-full relative z-0">
        <MapContainer center={[36.7538, 3.0588]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={position} 
            setPosition={setPosition} 
            setAddressName={setAddressName} 
            setLoading={setLoading}
          />
        </MapContainer>
      </div>
      
      {/* Overlay UI */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-3 px-4 z-10 pointer-events-none">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 max-w-[90%] text-center pointer-events-auto flex items-center justify-center gap-2 min-h-[44px]">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
          ) : (
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{addressName}</p>
          )}
        </div>
        
        <button
          type="button"
          disabled={!position || loading}
          onClick={(e) => { 
            e.preventDefault();
            e.stopPropagation();
            onLocationSelect(addressName);
            onClose();
          }}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-colors text-sm flex items-center gap-2 pointer-events-auto"
        >
          <CheckCircle2 className="w-5 h-5" /> تأكيد الموقع
        </button>
      </div>
    </div>
  );
}
