import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CivicReport } from '../../types/civic';

interface InteractiveMapProps {
  center?: [number, number];
  zoom?: number;
  reports?: CivicReport[];
  selectedReportId?: string;
  onSelectReport?: (report: CivicReport) => void;
  pickerMode?: boolean;
  selectedLocation?: { lat: number; lng: number } | null;
  onLocationSelect?: (loc: { lat: number; lng: number; addressSuggestion?: string }) => void;
  height?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  center = [37.7749, -122.4194],
  zoom = 13,
  reports = [],
  selectedReportId,
  onSelectReport,
  pickerMode = false,
  selectedLocation,
  onLocationSelect,
  height = '420px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors | CivicSync GIS'
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Handle map click in picker mode
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (pickerMode && onLocationSelect) {
        const { lat, lng } = e.latlng;
        onLocationSelect({
          lat: Number(lat.toFixed(5)),
          lng: Number(lng.toFixed(5)),
          addressSuggestion: `Approx. ${lat.toFixed(4)}° N, ${Math.abs(lng).toFixed(4)}° W (Civic Grid)`
        });
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center if props change
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center[0], center[1], zoom]);

  // Update picker marker
  useEffect(() => {
    if (!mapInstanceRef.current || !pickerMode) return;

    if (selectedLocation) {
      if (!pickerMarkerRef.current) {
        const pinIcon = L.divIcon({
          className: 'custom-picker-pin',
          html: `<div style="background-color: #176B52; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2.5px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 8px; background: #C8F169; border-radius: 50%; transform: rotate(45deg);"></div>
                 </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28]
        });
        pickerMarkerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng], { icon: pinIcon }).addTo(
          mapInstanceRef.current
        );
      } else {
        pickerMarkerRef.current.setLatLng([selectedLocation.lat, selectedLocation.lng]);
      }
    } else if (pickerMarkerRef.current) {
      pickerMarkerRef.current.remove();
      pickerMarkerRef.current = null;
    }
  }, [pickerMode, selectedLocation?.lat, selectedLocation?.lng]);

  // Update report markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || pickerMode) return;

    markersLayerRef.current.clearLayers();

    reports.forEach((rep) => {
      const isUrgent = rep.priority === 'urgent' || rep.priority === 'high';
      const isResolved = rep.status === 'resolved' || rep.status === 'closed';

      let pinColor = '#176B52'; // default green
      if (isResolved) pinColor = '#10B981'; // green
      else if (rep.status === 'awaiting_verification') pinColor = '#F59E0B'; // amber
      else if (rep.status === 'in_progress') pinColor = '#F28C45'; // orange
      else if (isUrgent) pinColor = '#EF4444'; // red

      const isSelected = rep.id === selectedReportId;

      const markerHtml = `
        <div style="
          background-color: ${pinColor};
          width: ${isSelected ? '32px' : '24px'};
          height: ${isSelected ? '32px' : '24px'};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: ${isSelected ? '3px solid #C8F169' : '2px solid #ffffff'};
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <div style="width: 6px; height: 6px; background: #ffffff; border-radius: 50%; transform: rotate(45deg);"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'civic-report-pin',
        html: markerHtml,
        iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
        iconAnchor: [isSelected ? 16 : 12, isSelected ? 32 : 24]
      });

      const marker = L.marker([rep.location.lat, rep.location.lng], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-slate-800 text-xs font-sans max-w-[220px]';
      popupContent.innerHTML = `
        <div class="font-bold text-sm text-slate-900 line-clamp-1 mb-1">${rep.title}</div>
        <div class="text-[11px] text-slate-500 mb-1 font-mono">${rep.reportNumber}</div>
        <div class="flex items-center gap-1.5 mb-1.5">
          <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 text-slate-700">${rep.categoryName}</span>
          <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
            rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }">${rep.status.replace('_', ' ')}</span>
        </div>
        <div class="text-[11px] text-slate-600 line-clamp-2 mb-2">${rep.location.address}</div>
        <button id="btn-view-${rep.id}" class="w-full py-1 px-2 text-center rounded bg-[#171A19] text-[#C8F169] font-medium text-[11px] hover:bg-black transition">
          Inspect Details &rarr;
        </button>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-view-${rep.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectReport) onSelectReport(rep);
          };
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [reports, selectedReportId, pickerMode]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-stone-800 shadow-md">
      <div ref={mapContainerRef} style={{ width: '100%', height }} className="z-10" />

      {pickerMode && (
        <div className="absolute top-3 left-12 z-[1000] bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-700 text-xs text-stone-200 shadow-lg pointer-events-none flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C8F169] animate-pulse"></span>
          <span>Click anywhere on the map to pin issue location</span>
        </div>
      )}
    </div>
  );
};
