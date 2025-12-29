import React, { useState, Suspense } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTanahList, useCurrentUser } from "@/lib/utilsUser";
import { getColors } from "./utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Eye, EyeOff } from "lucide-react";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function TanahMap({ zoom = 10, mapType = "hybrid", onMapClick, selected, isPicker, center }) {
  const user = useCurrentUser();
  const { data: tanahList = [], isLoading } = useTanahList(user);
  const showTooltips = true;
  // Filter tanah hanya
  const tanahfiltered = tanahList;
  const [showMarkersState, setShowMarkersState] = useState(true);
  const [showPolygonsState, setShowPolygonsState] = useState(true);
  const [showPolylinesState, setShowPolylinesState] = useState(true);
  const [showTooltipState, setShowTooltipState] = useState(showTooltips);

  // Titik tengah default Palu Utara (koordinat pusat kecamatan, bisa diganti jika ada data lebih akurat)
  const defaultCenter = [-0.78961418, 119.89162106];
  const googleUrl = `https://mt1.google.com/vt/lyrs=${mapType === "hybrid" ? "y,h" : "y"
    }&x={x}&y={y}&z={z}`;
  const attribution =
    mapType === "hybrid"
      ? "Map data ©2025 Google"
      : "&copy; OpenStreetMap contributors";

  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Memuat data tanah...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: 600,
        border: "2px solid #e2e8f0",
        borderRadius: 8,
      }}
    >
      <div className="absolute z-[1000] top-20 right-4 flex flex-col-3 gap-2 bg-white bg-opacity-80 p-2 rounded shadow-lg">
      <Button
        className="border border-2 border-white"
        size="sm"
        variant={showTooltipState ? 'default' : 'outline'}
        onClick={() => setShowTooltipState(v => !v)}
      >
        {showTooltipState ? <><Eye className="w-4 h-4 mr-1" /> Info</> : <><EyeOff className="w-4 h-4 mr-1" /> Info</>}
      </Button>
      <Button
        className="border border-2 border-white"
        size="sm"
        variant={showMarkersState ? 'default' : 'outline'}
        onClick={() => setShowMarkersState(v => !v)}
      >
        {showMarkersState ? <><Eye className="w-4 h-4 mr-1" /> Marker</> : <><EyeOff className="w-4 h-4 mr-1" /> Marker</>}
      </Button>
      {/* <Button
        className="border border-2 border-white"
        size="sm"
        variant={showPolygonsState || showPolylinesState ? 'default' : 'outline'}
        onClick={() => {
          setShowPolygonsState(v => !v);
          setShowPolylinesState(v => !v);
        }}
      >
        {(showPolygonsState || showPolylinesState)
          ? <><Eye className="w-4 h-4 mr-1" /> Bidang</>
          : <><EyeOff className="w-4 h-4 mr-1" /> Bidang</>}
      </Button> */}
          </div>
      <MapContainer
        center={center || defaultCenter}
        zoom={zoom}
        maxZoom={20}
        style={{ width: "100%", height: "100%", borderRadius: 8 }}
        whenCreated={map => {
          if (onMapClick) {
            map.on('click', onMapClick);
          }
        }}
      >
        <TileLayer url={googleUrl} attribution={attribution} maxZoom={20} />
        {/* Jika mode picker, tampilkan marker pada lokasi yang dipilih */}
        {isPicker && selected && selected.latitude && selected.longitude && (
          <Marker position={[selected.latitude, selected.longitude]}>
            <Popup>Lokasi dipilih: {selected.latitude}, {selected.longitude}</Popup>
          </Marker>
        )}
        {tanahfiltered.map((tanah, idx) => {
          const urlParams = new URLSearchParams(window.location.search);
              const tanahId = urlParams.get('id');
              const isSelected =  parseInt(tanah.id) === parseInt(tanahId);
          // Marker
          const marker =
            tanah.latitude && tanah.longitude && showMarkersState ? (
              
              <Marker
                key={`marker-${idx}`}
                position={[tanah.latitude, tanah.longitude]}
              >
                <Popup>
                <TanahPopupContent tanah={tanah} />
                </Popup>

                {showTooltipState && (
                  <Tooltip
                    direction="top"
                    offset={[0, -10]}
                    permanent>
                    <span
                      style={{
                        background: isSelected ? '#f97316' : '#fff', // orange untuk terpilih, putih untuk lain
                        color: isSelected ? '#fff' : '#000',
                        fontWeight: 'bold',
                        borderRadius: 6,
                        border: '2px solid #fff',
                        boxShadow: '0 2px 8px #0002',
                        padding: '2px 8px',
                        display: 'inline-block',
                        // zIndex: isSelected ? 9999 : 1,
                      }}
                    >
                      {tanah.nama_pemilik}
                    </span>
                  </Tooltip>
                )}

              </Marker>
            ) : null;

          // Polygon
          
          let polygonCoords = tanah.polygon_coords;
          if (polygonCoords && typeof polygonCoords === "string") {
            try {
              polygonCoords = JSON.parse(polygonCoords);
            } catch {
              polygonCoords = null;
            }
          }
          const { color, borderColor } = getColors(
            tanah.status,

          );
          const polygon =
            polygonCoords &&
              Array.isArray(polygonCoords) &&
              polygonCoords.length > 2 ? (
              <Polygon
                key={`polygon-${idx}`}
                positions={polygonCoords}
                pathOptions={{
                  color: borderColor,
                  fillColor: color,

                }}
              >
                <Popup>
                  <div>
                    <b>Koordinat Polygon:</b>
                    <pre style={{ fontSize: 12, margin: 0 }}>
                      {JSON.stringify(polygonCoords, null, 2)}
                    </pre>
                  </div>
                </Popup>
              </Polygon>
            ) : null;

          // Polyline
          let polylineCoords = tanah.polyline_coords;
          if (polylineCoords && typeof polylineCoords === "string") {
            try {
              polylineCoords = JSON.parse(polylineCoords);
            } catch {
              polylineCoords = null;
            }
          }
          const polyline =
            polylineCoords &&
              Array.isArray(polylineCoords) &&
              polylineCoords.length > 1 ? (
              <Polyline
                key={`polyline-${idx}`}
                positions={polygonCoords}
                color={color.borderColor}
                fillColor={color.color}
                fillOpacity={0.5}
              >
                <Popup>
                  <div>
                    <b>Koordinat Polyline:</b>
                    <pre style={{ fontSize: 12, margin: 0 }}>
                      {JSON.stringify(polylineCoords, null, 2)}
                    </pre>
                  </div>
                </Popup>
              </Polyline>
            ) : null;

          return (
            <React.Fragment key={idx}>
              {marker}
              {polygon}
              {polyline}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}

function TanahPopupContent({ tanah }) {
  const displayLuas = tanah.luas_meter % 1 === 0
    ? Math.floor(tanah.luas_meter)
    : tanah.luas_meter.toString().replace('.', ',');

  return (
    <Suspense fallback={<div>Memuat detail...</div>}>
      <div className="min-w-[220px] max-w-[260px] bg-white rounded-xl shadow-lg p-4 text-center space-y-3 border border-gray-200">
        <p className="font-bold text-slate-800 text-base mb-1">
          {tanah.nama_pemilik}
          {tanah.nama_penerima && <span className="block text-xs font-normal text-slate-500">Penerima: {tanah.nama_penerima}</span>}
        </p>
        <div className="bg-blue-50 py-1 rounded border border-blue-100 font-semibold text-blue-700 text-sm">
          {displayLuas} m²
        </div>
        <div className="flex justify-center py-1">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://www.google.com/maps?q=${tanah.latitude},${tanah.longitude}`)}`}
            alt="QR"
            className="w-16 h-16 border rounded shadow"
          />
        </div>
        <Badge variant={tanah.status === 'Selesai' ? 'default' : tanah.status === 'Ditolak' ? 'destructive' : 'secondary'}>
          {tanah.status || 'Proses'}
        </Badge>
        <Link to={`${createPageUrl('DetailTanah')}?id=${tanah.id}`} className="block mt-2">
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
            <Eye className="w-4 h-4 mr-2" /> Detail
          </Button>
        </Link>
      </div>
    </Suspense>
  );
}
