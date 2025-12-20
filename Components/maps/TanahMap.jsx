import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup, useMap } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Shapes, ShapesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { createCircleIcon } from './utils';
import { getPolygonColors } from './utils';
import { createPageUrl } from '@/utils';

function MapController({ center, zoom }) {
  const map = useMap();
  // Hanya recenter jika center/zoom berubah, bukan saat showMarkers berubah
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
    // eslint-disable-next-line
  }, [JSON.stringify(center), zoom, map]);
  return null;
}

function TanahMap({ tanahList, center, zoom, selectedId, mapType = 'hybrid', showMarkers = true, showPolygons = true }) {
  const mapCenter = center || [0.7929194, 119.8875111];
  const mapZoom = zoom || 20;
  const processedTanahList = tanahList.map(tanah => {
    if (tanah.polygon_coords && typeof tanah.polygon_coords === 'string') {
      try {
        return { ...tanah, polygon_coords: JSON.parse(tanah.polygon_coords) };
      } catch (e) {
        console.error('Failed to parse polygon_coords for tanah', tanah.id, e);
        return { ...tanah, polygon_coords: null };
      }
    }
    return tanah;
  });
  let tileLayer;
  if (mapType === 'street') {
    tileLayer = {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors',
    };
  } else if (mapType === 'hybrid') {
    tileLayer = {
      url: 'https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}',
      attribution: 'Map data ©2025 Google, Imagery ©2025 TerraMetrics',
    };
  } else {
    tileLayer = {
      url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      attribution: 'Map data ©2025 Google, Imagery ©2025 TerraMetrics',
    };
  }
  return (
    <Card className="overflow-hidden rounded-xl shadow-lg">
      <div className="relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '500px', width: '100%' }}
          className="z-0"
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />
          {processedTanahList.map((tanah) => {
            if (!tanah.latitude || !tanah.longitude) return null;
            const isSelected = selectedId && parseInt(tanah.id) === parseInt(selectedId);
            const { color, borderColor } = getPolygonColors(tanah.status, isSelected);
            const position = [tanah.latitude, tanah.longitude];
            const hasPolygon = tanah.polygon_coords && Array.isArray(tanah.polygon_coords) && tanah.polygon_coords.length > 2;
            let elements = [];
            if (showPolygons && hasPolygon) {
              elements.push(
                <Polygon
                  key={tanah.id}
                  positions={tanah.polygon_coords}
                  pathOptions={{
                    color: borderColor,
                    fillColor: color,
                    fillOpacity: 0.3,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="min-w-[250px] p-2">
                      <div className="text-center space-y-2">
                        <p className="font-medium text-slate-800">
                          {tanah.nama_pemilik}
                          {tanah.nama_penerima && (
                            <> diserahkan kepada {tanah.nama_penerima}</>
                          )}
                          {tanah.atas_nama && (
                            <> / {tanah.atas_nama}</>
                          )}
                        </p>
                        <p className="text-sm text-slate-500">
                          {tanah.luas_meter % 1 === 0 ? Math.floor(tanah.luas_meter) : tanah.luas_meter.toString().replace('.', ',')} m²
                        </p>
                        <p className="text-xs text-slate-400">
                          {tanah.latitude}, {tanah.longitude}
                        </p>
                        <div className="flex justify-center py-2">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://www.google.com/maps?q=${tanah.latitude},${tanah.longitude}`)}`}
                            alt="QR Code"
                            className="w-32 h-32 border-2 border-slate-200 rounded"
                          />
                        </div>
                        <Badge variant={tanah.status === 'Selesai' ? 'default' : tanah.status === 'Ditolak' ? 'destructive' : 'secondary'}>
                          {tanah.status || 'Proses'}
                        </Badge>
                      </div>
                      <Link to={createPageUrl('DetailTanah') + `?id=${tanah.id}`}>
                        <Button size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Detail
                        </Button>
                      </Link>
                    </div>
                  </Popup>
                </Polygon>
              );
            }
            // Marker SELALU tampil jika tidak ada poligon, atau jika showMarkers aktif
            if (!hasPolygon || showMarkers) {
              elements.push(
                <Marker
                  key={tanah.id + '-marker'}
                  position={position}
                  icon={createCircleIcon(tanah.status, mapZoom)}
                >
                  <Popup>
                    <div className="min-w-[250px] p-2">
                      <div className="text-center space-y-2">
                        <p className="font-medium text-slate-800">
                          {tanah.nama_pemilik}
                          {tanah.nama_penerima && (
                            <> diserahkan kepada {tanah.nama_penerima}</>
                          )}
                          {tanah.atas_nama && (
                            <> / {tanah.atas_nama}</>
                          )}
                        </p>
                        <p className="text-sm text-slate-500">
                          {tanah.luas_meter % 1 === 0 ? Math.floor(tanah.luas_meter) : tanah.luas_meter.toString().replace('.', ',')} m²
                        </p>
                        <p className="text-xs text-slate-400">
                          {tanah.latitude}, {tanah.longitude}
                        </p>
                        <div className="flex justify-center py-2">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://www.google.com/maps?q=${tanah.latitude},${tanah.longitude}`)}`}
                            alt="QR Code"
                            className="w-32 h-32 border-2 border-slate-200 rounded"
                          />
                        </div>
                        <Badge variant={tanah.status === 'Selesai' ? 'default' : tanah.status === 'Ditolak' ? 'destructive' : 'secondary'}>
                          {tanah.status || 'Proses'}
                        </Badge>
                        <Link to={createPageUrl('DetailTanah') + `?id=${tanah.id}`}>
                          <Button size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                            <Eye className="w-4 h-4 mr-2" />
                            Lihat Detail
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return elements.length > 0 ? elements : null;
          })}
        </MapContainer>
      </div>
    </Card>
  );
}

export default TanahMap;
