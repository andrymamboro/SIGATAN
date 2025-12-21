import React, { useState, useRef, useEffect } from 'react';
import { LeafletContext } from './LeafletContext';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, Polygon, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import { createCircleIcon, getPolygonColors } from './utils';
import 'leaflet-draw';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Navigation, Search, Loader2, Pencil, Map as MapIcon, Globe, Eye, EyeOff, Shapes, ShapesIcon } from 'lucide-react';
import { toast } from 'sonner';

// Fix for Leaflet pointer event warning
if (typeof window !== 'undefined' && L.DomEvent) {
  // Patch Leaflet to handle missing pointer events
  const originalRemove = L.DomEvent.removePointerListener;
  L.DomEvent.removePointerListener = function(obj, type, handler) {
    const pointerEvents = {
      pointerdown: true,
      pointermove: true,
      pointerup: true,
      pointercancel: true,
      pointerenter: true,
      pointerleave: true,
      pointerover: true,
      pointerout: true
    };
    
    if (!pointerEvents[type]) {
      // Silently ignore invalid pointer events instead of warning
      return;
    }
    
    return originalRemove.call(this, obj, type, handler);
  };
}

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Hapus custom flagIcon, gunakan createCircleIcon dari utils.js

function LocationMarker({ position, setPosition, mode }) {
  const markerRef = useRef(null);

  const map = useMapEvents({
    click(e) {
      if (mode === 'marker') {
        setPosition([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  useEffect(() => {
    if (position && mode === 'marker') {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map, mode]);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const pos = marker.getLatLng();
        setPosition([pos.lat, pos.lng]);
      }
    },
  };

  // Gunakan icon yang sama dengan TanahMap
  return position ? (
    <Marker
      draggable={mode === 'marker'}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={createCircleIcon('Ungu', 20)}
    />
  ) : null;
}

function DrawControl({ onPolygonComplete, polygonCoords, mode }) {
  const map = useMap();
  const drawnItemsRef = useRef(new L.FeatureGroup());

  useEffect(() => {
    if (mode !== 'polygon') return;

    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItems);

    // Load existing polygon if provided
    if (polygonCoords && polygonCoords.length > 0) {
      const polygon = L.polygon(polygonCoords, {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.3,
        weight: 1
      });
      drawnItems.addLayer(polygon);
    }

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: {
          allowIntersection: false,
          shapeOptions: {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.3,
            weight: 1
          }
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems,
        remove: true
      }
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);
      const coords = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
      onPolygonComplete(coords);
    });

    map.on(L.Draw.Event.EDITED, (e) => {
      const layers = e.layers;
      layers.eachLayer((layer) => {
        const coords = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
        onPolygonComplete(coords);
      });
    });

    map.on(L.Draw.Event.DELETED, () => {
      onPolygonComplete(null);
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
      map.off(L.Draw.Event.CREATED);
      map.off(L.Draw.Event.EDITED);
      map.off(L.Draw.Event.DELETED);
    };
  }, [map, mode, onPolygonComplete]);

  return null;
}

export default function MapPicker({ initialPosition = [-0.7861746, 119.8689641], initialPolygon = null, initialMode = 'marker', existingTanahData = [], onSelectLocation, onClose }) {
  // Example value for context, you can expand as needed
  const leafletContextValue = { initialPosition, initialPolygon, initialMode };
  const [position, setPosition] = useState(initialPosition);
  const [mapType, setMapType] = useState('satellite');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState(initialMode);
  const [polygonCoords, setPolygonCoords] = useState(initialPolygon);
  const [editingPointIndex, setEditingPointIndex] = useState(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showPolygons, setShowPolygons] = useState(true);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          setLoading(false);
          toast.success('Lokasi berhasil didapatkan');
        },
        (error) => {
          setLoading(false);
          toast.error('Gagal mendapatkan lokasi. Pastikan GPS aktif dan izinkan akses lokasi.');
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLoading(false);
      toast.error('Browser tidak mendukung geolokasi');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const newPos = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setPosition(newPos);
        toast.success('Lokasi ditemukan');
      } else {
        toast.error('Lokasi tidak ditemukan');
      }
    } catch (error) {
      toast.error('Gagal mencari lokasi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (mode === 'marker') {
      onSelectLocation({
        latitude: position[0],
        longitude: position[1],
        type: 'marker'
      });
    } else if (mode === 'polygon' && polygonCoords) {
      // Calculate center of polygon
      const latSum = polygonCoords.reduce((sum, coord) => sum + coord[0], 0);
      const lngSum = polygonCoords.reduce((sum, coord) => sum + coord[1], 0);
      const centerLat = latSum / polygonCoords.length;
      const centerLng = lngSum / polygonCoords.length;
      
      onSelectLocation({
        latitude: centerLat,
        longitude: centerLng,
        type: 'polygon',
        polygon: polygonCoords
      });
    } else {
      toast.error('Silakan gambar polygon terlebih dahulu');
      return;
    }
    onClose();
  };

  const tileLayers = {
    satellite: {
      // Google Hybrid (unofficial, for demo/educational use only)
      url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      attribution: 'Map data ©2025 Google, Imagery ©2025 TerraMetrics',
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: 'Map data ©2025 Google, Imagery ©2025 TerraMetrics',
    },
  };

  function FloatingControls() {
    const isSatellite = mapType === 'satellite';
    return (
      <div style={{ position: 'absolute', top: 12, left: 56, zIndex: 1000, display: 'flex', flexDirection: 'row', gap: 8 }}>
        {/* Map type toggle button */}
              {/* Mode toggle button (marker/polygon) */}
        
        <Button
          onClick={getCurrentLocation}
          disabled={loading}
          className={`h-8 px-2 ${loading ? 'bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white' : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white'}`}
          title="Gunakan Lokasi GPS Saya"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
        </Button>
        {/* Drawing mode trigger button (existing) */}
        
        {/* Tambahan 2 tombol */}
        <Button
          className={`h-8 px-2 ${showMarkers ? 'bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white' : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-gray-700'}`}
          title={showMarkers ? 'Sembunyikan Marker' : 'Tampilkan Marker'}
          onClick={() => setShowMarkers(v => !v)}
        >
          {showMarkers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
        
        <button
          type="button"
          onClick={() => setMode(mode === 'marker' ? 'polygon' : 'marker')}
          className={mode === 'marker'
            ? 'bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white border border-blue-900 rounded w-8 h-8 flex items-center justify-center shadow transition-colors duration-200'
            : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white border border-blue-700 rounded w-8 h-8 flex items-center justify-center shadow transition-colors duration-200'}
          title={mode === 'marker' ? 'Ganti ke mode gambar Petak' : 'Ganti ke Marker'}
        >
          {mode === 'marker' ? (
            <Pencil style={{ width: 14, height: 14 }} />
          ) : (
            <MapPin style={{ width: 14, height: 14 }} />
          )}
        </button>
      </div>
    );
  }

  return (
    <LeafletContext.Provider value={leafletContextValue}>
      <>
        <div className="space-y-4">


      {/* Map */}
      <Card className="overflow-hidden" style={{ position: 'relative' }}>
        <FloatingControls />
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: '550px', width: '100%' }}
        >
          <TileLayer
            url={tileLayers[mapType].url}
            attribution={tileLayers[mapType].attribution}
          />
          {/* Marker klik/tap selalu tampil */}
          <LocationMarker position={position} setPosition={setPosition} mode={mode} />
          <DrawControl 
            mode={mode}
            onPolygonComplete={setPolygonCoords}
            polygonCoords={polygonCoords}
          />
          {showPolygons && polygonCoords && Array.isArray(polygonCoords) && polygonCoords.length >= 3 && mode === 'polygon' && (
            <Polygon
              positions={polygonCoords}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.3,
                weight: 2
              }}
            />
          )}
          {/* Show existing tanah data */}
          {existingTanahData.map((tanah) => {
            if (!tanah.latitude || !tanah.longitude) return null;
            let { color } = getPolygonColors(tanah.status, false);
            if (tanah.status === 'Selesai') color = '#f97316'; // orange
            const positionDb = [tanah.latitude, tanah.longitude];
            // Parse polygon/polyline coords if string
            let coords = null;
            if ((tanah.location_type === 'polygon' || tanah.location_type === 'polyline') && tanah.polygon_coords) {
              try {
                coords = typeof tanah.polygon_coords === 'string'
                  ? JSON.parse(tanah.polygon_coords)
                  : tanah.polygon_coords;
                if (!Array.isArray(coords) || coords.length < 2) {
                  coords = null;
                }
              } catch (e) {
                coords = null;
              }
            }
            return (
              <React.Fragment key={tanah.id}>
                {/* Polygon jika titik >= 3, Polyline jika titik >= 2 dan < 3 */}
                {coords && coords.length >= 3 ? (
                  <Polygon
                    positions={coords}
                    pathOptions={{
                      color: color,
                      fillColor: color,
                      fillOpacity: 0.2,
                      weight: 2,
                    }}
                  />
                ) : coords && coords.length === 2 ? (
                  <Polyline
                    positions={coords}
                    pathOptions={{
                      color: color,
                      weight: 2,
                    }}
                  />
                ) : null}
                {/* Marker database hanya tampil jika showMarkers aktif */}
                {showMarkers && (
                  <Marker
                    position={positionDb}
                    icon={createCircleIcon(tanah.status || 'Selesai', 20)}
                  />
                )}
              </React.Fragment>
            );
          })}
        </MapContainer>
      </Card>

      {/* Coordinates Display */}
      {mode === 'marker' && (
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-slate-600">Latitude</Label>
              <Input
                value={position[0].toFixed(7)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) setPosition([val, position[1]]);
                }}
                type="number"
                step="0.0000001"
              />
            </div>
            <div>
              <Label className="text-sm text-slate-600">Longitude</Label>
              <Input
                value={position[1].toFixed(7)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) setPosition([position[0], val]);
                }}
                type="number"
                step="0.0000001"
              />
            </div>
          </div>
        </Card>
      )}

      {mode === 'polygon' && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm text-slate-600">
              Koordinat Polygon {polygonCoords ? `(${polygonCoords.length} titik)` : ''}
            </Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const newCoords = polygonCoords || [];
                newCoords.push([position[0], position[1]]);
                setPolygonCoords([...newCoords]);
              }}
            >
              + Tambah Titik
            </Button>
          </div>
          
          {polygonCoords && polygonCoords.length > 0 ? (
            <div className="max-h-48 overflow-y-auto" style={{ gap: '0.375rem', display: 'flex', flexDirection: 'column' }}>
              {polygonCoords.map((coord, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                  <span className="text-xs font-semibold text-slate-500 w-6">{idx + 1}.</span>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      step="0.000001"
                      value={coord[0]}
                      onChange={(e) => {
                        const newCoords = [...polygonCoords];
                        newCoords[idx][0] = parseFloat(e.target.value) || 0;
                        setPolygonCoords(newCoords);
                      }}
                      className="h-8 text-xs"
                      placeholder="Latitude"
                    />
                    <Input
                      type="number"
                      step="0.000001"
                      value={coord[1]}
                      onChange={(e) => {
                        const newCoords = [...polygonCoords];
                        newCoords[idx][1] = parseFloat(e.target.value) || 0;
                        setPolygonCoords(newCoords);
                      }}
                      className="h-8 text-xs"
                      placeholder="Longitude"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const newCoords = polygonCoords.filter((_, i) => i !== idx);
                      setPolygonCoords(newCoords.length > 0 ? newCoords : null);
                    }}
                    className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-slate-400">
              Belum ada titik polygon. Gambar di peta atau tambah manual.
            </div>
          )}
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pr-4">
        <Button variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button 
          onClick={handleConfirm}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Pilih Lokasi Ini
        </Button>
        {/* Instructions */}
      </div>
      </div>
      </>
    </LeafletContext.Provider>
  );
}