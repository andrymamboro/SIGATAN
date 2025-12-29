import React, { useState, Suspense, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  Tooltip,
  FeatureGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw";
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


function MapPicker({
  center,
  zoom = 15,
  isPicker = false,
  selected,
  onMapClick,
  mapType = "hybrid",
  mapCenter,
  mapZoom
}) {
  // Untuk debug: data terakhir yang dikirim ke onChange
  const [lastOnChange, setLastOnChange] = useState(null);
  // Semua hook harus di atas sebelum return apapun
  const mapRef = useRef();
  const featureGroupRef = useRef();

  // Update center/zoom jika props berubah
  useEffect(() => {
    if (mapRef.current && mapCenter && Array.isArray(mapCenter)) {
      mapRef.current.setView(mapCenter, mapZoom || zoom);
    }
  }, [mapCenter, mapZoom]);
  const user = useCurrentUser();
  const { data: tanahList = [], isLoading } = useTanahList(user);
  const showTooltips = true;
  const [showMarkersState, setShowMarkersState] = useState(true);
  const [showPolygonsState, setShowPolygonsState] = useState(true);
  const [showPolylinesState, setShowPolylinesState] = useState(true);
  const [showTooltipState, setShowTooltipState] = useState(showTooltips);
  const tanahfiltered = tanahList;
  const defaultCenter = [-0.78961418, 119.89162106];
  const googleUrl = `https://mt1.google.com/vt/lyrs=${mapType === "hybrid" ? "y,h" : "y"}&x={x}&y={y}&z={z}`;
  const attribution = mapType === "hybrid" ? "Map data ©2025 Google" : "&copy; OpenStreetMap contributors";

  const [lastDraw, setLastDraw] = useState(null);
  const handleCreated = (e) => {
    // console.log('handleCreated called', e);
    window._lastDrawEvent = e;
    if (!onMapClick) {
      console.warn('onMapClick prop tidak ada!');
      return;
    }
    if (e.layerType === 'marker') {
      const { lat, lng } = e.layer.getLatLng();
      const markerData = {
        latitude: lat.toString(),
        longitude: lng.toString(),
        polygon_coords: null,
        type: 'marker',
      };
      setLastDraw({ label: 'Marker', data: markerData });
      setLastOnChange(markerData);
      onMapClick(markerData);
    } else if (e.layerType === 'polygon' || e.layerType === 'polyline') {
      let coords = e.layer.getLatLngs();
      if (Array.isArray(coords) && Array.isArray(coords[0])) {
        coords = coords[0];
      }
      const arr = coords.map(c => [Number(c.lat), Number(c.lng)]);
      let lat = null, lng = null;
      if (arr.length > 0) {
        const sum = arr.reduce((acc, [plat, plng]) => [acc[0] + plat, acc[1] + plng], [0, 0]);
        lat = sum[0] / arr.length;
        lng = sum[1] / arr.length;
      }
      const polyData = {
        latitude: lat !== null ? lat.toString() : '',
        longitude: lng !== null ? lng.toString() : '',
        polygon_coords: arr,
        type: e.layerType,
      };
      setLastDraw({ label: e.layerType === 'polygon' ? 'Polygon' : 'Polyline', data: polyData });
      setLastOnChange(polyData);
      onMapClick(polyData);
    } else {
      console.warn('handleCreated: layerType tidak dikenali', e.layerType, e);
    }
  };

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
    <>
       <div
        style={{
          width: "100%",
          height: 600,
          border: "2px solid #e2e8f0",
          borderRadius: 8,
        }}
      >
      <div className="absolute z-[1000] top-10 right-16 flex flex-row gap-2 bg-white bg-opacity-80 p-1 rounded shadow-lg" style={{marginRight: '35px', marginTop: '8px'}}>
        <Button
          className="border-2 border-white"
          size="sm"
          variant={showTooltipState ? 'default' : 'outline'}
          onClick={() => setShowTooltipState(v => !v)}
        >
          {showTooltipState ? <><Eye className="w-4 h-4 mr-1" /> Info</> : <><EyeOff className="w-4 h-4 mr-1" /> Info</>}
        </Button>
        <Button
          className="border-2 border-white"
          size="sm"
          variant={showMarkersState ? 'default' : 'outline'}
          onClick={() => setShowMarkersState(v => !v)}
        >
          {showMarkersState ? <><Eye className="w-4 h-4 mr-1" /> Marker</> : <><EyeOff className="w-4 h-4 mr-1" /> Marker</>}
        </Button>
      </div>
      <MapContainer
        center={mapCenter || center || defaultCenter}
        zoom={mapZoom || zoom}
        maxZoom={20}
        style={{ width: "100%", height: "100%", borderRadius: 8 }}
        ref={mapRef}
      >
        <TileLayer url={googleUrl} attribution={attribution} maxZoom={20} />
        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topleft"
            onCreated={handleCreated}
            featureGroup={featureGroupRef.current}
            draw={{
              marker: true,
              polyline: true,
              polygon: true,
              circle: false,
              rectangle: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
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
    
        {/* Tabel koordinat temp mappicker kanan bawah */}
        <div style={{
          position: 'absolute',
          right: 24,
          bottom: 24,
          zIndex: 9999,
          background: 'rgba(255,255,255,0.10)',
          borderRadius: 12,
          boxShadow: '0 2px 12px #0002',
          padding: 16,
          minWidth: 260,
          maxWidth: 340,
          backdropFilter: 'blur(2px)',
        }}>
          <div style={{fontWeight: 'bold', color: '#0c4a6e', marginBottom: 8, fontSize: 15}}>
            Koordinat Pusat: {lastDraw?.data?.latitude || '-'}, {lastDraw?.data?.longitude || '-'}
          </div>
          <table style={{width: '100%', background: 'transparent', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{background: 'rgba(255,255,255,0.25)'}}>
                <th style={{borderBottom: '1px solid #ddd', padding: '4px 8px', textAlign: 'center'}}>No</th>
                <th style={{borderBottom: '1px solid #ddd', padding: '4px 8px', textAlign: 'center'}}>Lat</th>
                <th style={{borderBottom: '1px solid #ddd', padding: '4px 8px', textAlign: 'center'}}>Long</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(lastDraw?.data?.polygon_coords) ? lastDraw.data.polygon_coords : (lastDraw?.data?.latitude && lastDraw?.data?.longitude ? [[Number(lastDraw.data.latitude), Number(lastDraw.data.longitude)]] : [])).map(([lat, lng], idx) => (
                <tr key={idx} style={{background: idx % 2 === 0 ? 'rgba(255,255,255,0.15)' : 'transparent'}}>
                  <td style={{padding: '4px 8px', textAlign: 'center'}}>{idx + 1}</td>
                  <td style={{padding: '4px 8px', textAlign: 'center'}}>{lat}</td>
                  <td style={{padding: '4px 8px', textAlign: 'center'}}>{lng}</td>
                </tr>
              ))}
              {(Array.isArray(lastDraw?.data?.polygon_coords) ? lastDraw.data.polygon_coords : (lastDraw?.data?.latitude && lastDraw?.data?.longitude ? [[Number(lastDraw.data.latitude), Number(lastDraw.data.longitude)]] : [])).length === 0 && (
                <tr><td colSpan={3} style={{textAlign: 'center', color: '#64748b', padding: 8}}>Belum ada koordinat</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </MapContainer>
      </div>
           
    </>
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

export default MapPicker;
