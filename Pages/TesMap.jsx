

import React, { useRef } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

function TesMap() {
  const mapRef = useRef();
  const featureGroupRef = useRef();
  const defaultCenter = [-0.78961418, 119.89162106];
  const googleUrl = "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}";
  const attribution = "Map data ©2025 Google";

  const handleCreated = (e) => {
    // e.layer adalah layer yang baru digambar
    // Anda bisa akses geojson: e.layer.toGeoJSON()
    // Contoh: console.log(e.layer.toGeoJSON());
  };

  return (
    <div
      style={{
        width: "100%",
        height: 600,
        border: "2px solid #e2e8f0",
        borderRadius: 8,
        position: 'relative',
        zIndex: 10,
      }}
    >
      <MapContainer
        center={defaultCenter}
        zoom={10}
        maxZoom={20}
        style={{ width: "100%", height: "100%", borderRadius: 8, zIndex: 20, position: 'relative' }}
        ref={mapRef}
      >
        <TileLayer url={googleUrl} attribution={attribution} maxZoom={20} />
        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            featureGroup={featureGroupRef.current}
            draw={{
              polygon: true,
              polyline: true,
              rectangle: true,
              circle: false,
              marker: true,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}

export default TesMap;
  