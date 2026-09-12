import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Navigation, Clock, Truck, LocateFixed, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MapViewProps {
  pickupLocation?: string;
  deliveryLocation?: string;
  distanceKm?: number;
  eta?: string;
  estimatedCost?: number;
  isCalculating?: boolean;
  errorMessage?: string | null;
  onSelectTransporterClick?: () => void;
  showTransporterBtn?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  pickupLocation = 'My Farm Gate, Rajkot',
  deliveryLocation = 'Naroda Warehouse, Ahmedabad',
  distanceKm = 215,
  eta = '3h 55m',
  estimatedCost = 3870,
  isCalculating = false,
  errorMessage = null,
  onSelectTransporterClick,
  showTransporterBtn = false
}) => {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Coordinate lookup helper for Leaflet mapping
  const getCoordinates = (locationName: string): [number, number] => {
    const loc = (locationName || '').toLowerCase();
    if (loc.includes('surat')) return [21.1702, 72.8311];
    if (loc.includes('vadodara') || loc.includes('baroda')) return [22.3072, 73.1812];
    if (loc.includes('junagadh')) return [21.5222, 70.4579];
    if (loc.includes('jamnagar')) return [22.4707, 70.0577];
    if (loc.includes('bhavnagar')) return [21.7645, 72.1519];
    if (loc.includes('mumbai')) return [19.0760, 72.8777];
    if (loc.includes('delhi')) return [28.7041, 77.1025];
    if (loc.includes('gondal')) return [21.9619, 70.7923];
    if (loc.includes('gandhinagar')) return [23.2156, 72.6369];
    if (loc.includes('naroda') || loc.includes('ahmedabad')) return [23.0225, 72.5714];
    // Default Rajkot Farm
    return [22.3039, 70.8022];
  };

  const pickupCoords = getCoordinates(pickupLocation);
  const deliveryCoords = getCoordinates(deliveryLocation);
  const midCoords: [number, number] = [
    (pickupCoords[0] + deliveryCoords[0]) / 2,
    (pickupCoords[1] + deliveryCoords[1]) / 2
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clear previous map instance completely on location change
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    if (errorMessage) return;

    // Create new Leaflet Map Instance
    const map = L.map(mapContainerRef.current, {
      center: midCoords,
      zoom: 8,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Add OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    // Custom Icon Creators
    const farmPickupIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="background: #143601; color: white; border: 3px solid #aad576; border-radius: 9999px; padding: 6px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    const buyerDeliveryIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="background: #2563eb; color: white; border: 3px solid white; border-radius: 9999px; padding: 6px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    const transporterIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="background: #538d22; color: white; border: 3px solid white; border-radius: 9999px; padding: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    // Add Markers to Map
    const farmMarker = L.marker(pickupCoords, { icon: farmPickupIcon }).addTo(map);
    farmMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px;">
        <strong style="color: #143601;">📍 Pickup Location</strong>
        <p style="margin: 4px 0 0 0; font-size: 12px;">${pickupLocation}</p>
      </div>
    `);

    const buyerMarker = L.marker(deliveryCoords, { icon: buyerDeliveryIcon }).addTo(map);
    buyerMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px;">
        <strong style="color: #2563eb;">📍 Delivery Destination</strong>
        <p style="margin: 4px 0 0 0; font-size: 12px;">${deliveryLocation}</p>
      </div>
    `);

    const transMarker = L.marker(midCoords, { icon: transporterIcon }).addTo(map);
    transMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px;">
        <strong style="color: #538d22;">🚚 Live Logistics Route</strong>
        <p style="margin: 4px 0 0 0; font-size: 12px;">Distance: ${distanceKm} km</p>
      </div>
    `);

    // Draw Polyline Route
    const polyline = L.polyline([pickupCoords, midCoords, deliveryCoords], {
      color: '#538d22',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8'
    }).addTo(map);

    // Fit Map Bounds dynamically
    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [pickupLocation, deliveryLocation, distanceKm, errorMessage]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(midCoords, 8, { duration: 1 });
    }
  };

  const handlePan = (direction: 'north' | 'south' | 'east' | 'west') => {
    if (!mapInstanceRef.current) return;
    const offset = 0.4; // Degrees pan offset
    const center = mapInstanceRef.current.getCenter();
    let newLat = center.lat;
    let newLng = center.lng;

    if (direction === 'north') newLat += offset;
    if (direction === 'south') newLat -= offset;
    if (direction === 'east') newLng += offset;
    if (direction === 'west') newLng -= offset;

    mapInstanceRef.current.panTo([newLat, newLng], { animate: true });
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg border border-[#e2ebd9] overflow-hidden transition-all animate-plant-grow">
      
      {/* Top Map Header Stats */}
      <div className="p-4 sm:p-5 bg-[#f4f8f0] border-b border-[#e2ebd9] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#143601] text-white">
            <Navigation className="w-5 h-5 text-[#aad576]" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#143601]">Live Logistics & Route Map</h3>
            <p className="text-xs text-[#245501] font-medium truncate max-w-xs">
              {pickupLocation} → {deliveryLocation}
            </p>
          </div>
        </div>

        {errorMessage ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-[#143601] bg-white px-3 py-1.5 rounded-xl border border-[#e2ebd9] shadow-2xs">
              <Navigation className="w-4 h-4 text-[#538d22]" /> {distanceKm} km
            </span>
            <span className="flex items-center gap-1 text-[#143601] bg-white px-3 py-1.5 rounded-xl border border-[#e2ebd9] shadow-2xs">
              <Clock className="w-4 h-4 text-amber-600" /> {eta} ETA
            </span>
            <span className="flex items-center gap-1 text-[#143601] bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-300 font-extrabold">
              Freight: ₹{estimatedCost.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Real Interactive Leaflet Container */}
      <div className="relative w-full h-72 sm:h-96 bg-[#f4f8f0] z-0">
        {isCalculating && (
          <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-xs flex items-center justify-center space-x-2">
            <Navigation className="w-6 h-6 text-[#538d22] animate-spin" />
            <span className="text-xs font-extrabold text-[#143601]">{t('routeRecalculating')}</span>
          </div>
        )}

        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Map Pan & Zoom Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-[#e2ebd9] items-center">
          
          {/* Pan Navigation D-Pad */}
          <div className="flex flex-col items-center bg-[#f4f8f0] p-1 rounded-xl border border-[#e2ebd9]">
            <button
              onClick={() => handlePan('north')}
              className="p-1 rounded hover:bg-white text-[#143601] transition-colors"
              title="Pan North ↑"
            >
              <span className="text-xs font-black">▲</span>
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePan('west')}
                className="p-1 rounded hover:bg-white text-[#143601] transition-colors"
                title="Pan West ◄"
              >
                <span className="text-xs font-black">◄</span>
              </button>
              <button
                onClick={handleResetView}
                className="p-1 rounded hover:bg-white text-[#538d22] transition-colors"
                title="Recenter Map"
              >
                <LocateFixed className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handlePan('east')}
                className="p-1 rounded hover:bg-white text-[#143601] transition-colors"
                title="Pan East ►"
              >
                <span className="text-xs font-black">►</span>
              </button>
            </div>
            <button
              onClick={() => handlePan('south')}
              className="p-1 rounded hover:bg-white text-[#143601] transition-colors"
              title="Pan South ▼"
            >
              <span className="text-xs font-black">▼</span>
            </button>
          </div>

          <div className="w-full h-px bg-[#e2ebd9]" />

          {/* Zoom Buttons */}
          <button
            onClick={handleZoomIn}
            className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-[#143601] hover:bg-[#f4f8f0]"
            title="Zoom In (+)"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-[#143601] hover:bg-[#f4f8f0]"
            title="Zoom Out (-)"
          >
            -
          </button>
        </div>

        {/* Floating Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg border border-[#e2ebd9] text-[11px] font-bold text-[#143601] flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#143601] inline-block" /> 📍 Pickup
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> 📍 Destination
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#538d22] inline-block" /> 🚚 Corridor
          </span>
        </div>
      </div>

      {/* Bottom CTA */}
      {showTransporterBtn && onSelectTransporterClick && (
        <div className="p-4 bg-white border-t border-[#e2ebd9] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-[#538d22] uppercase tracking-wider block">Estimated Logistics Freight</span>
            <p className="text-lg font-black text-[#143601]">₹{estimatedCost.toLocaleString()}</p>
          </div>
          <button
            onClick={onSelectTransporterClick}
            className="px-4 py-2.5 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white text-xs font-extrabold shadow flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4 text-[#aad576]" />
            <span>Find Verified Trucks</span>
          </button>
        </div>
      )}

    </div>
  );
};
