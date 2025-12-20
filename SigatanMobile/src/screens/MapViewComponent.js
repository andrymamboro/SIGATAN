import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker, Polygon, Polyline } from "react-native-maps";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";

// State untuk polyline drawing dipindahkan ke dalam komponen

export default function MapViewComponent(props) {
  // State untuk semua data tanah
  const [allTanah, setAllTanah] = useState([]);
  // State untuk polyline drawing
  const [drawMode, setDrawMode] = useState(false);
  const [polylinePoints, setPolylinePoints] = useState([]);
  const [tappedIdx, setTappedIdx] = useState(null);

  // Ambil dari props langsung atau dari route.params
  const latitude = props.latitude ?? props.route?.params?.latitude;
  const longitude = props.longitude ?? props.route?.params?.longitude;
  const polygonCoords =
    props.polygonCoords ?? props.route?.params?.polygonCoords;
  const status = props.status ?? props.route?.params?.status;

  // Parse polygonCoords if available
  let parsedPolygon = null;
  if (polygonCoords && Array.isArray(polygonCoords)) {
    parsedPolygon = polygonCoords;
  } else if (polygonCoords && typeof polygonCoords === "string") {
    try {
      parsedPolygon = JSON.parse(polygonCoords);
    } catch (e) {
      parsedPolygon = null;
    }
  }

  const [mapType, setMapType] = useState("hybrid");
  const [deviceLocation, setDeviceLocation] = useState(null);
  const mapRef = useRef(null);

  // Modal state

  // Input koordinat dihapus

  // Fungsi untuk refresh lokasi device
  const refreshDeviceLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({});
      setDeviceLocation(location.coords);
      if (mapRef.current && location.coords) {
        mapRef.current.animateToRegion(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: -1.0001,
            longitudeDelta: -1.0001,
          },
          100
        );
      }
    }
  };

  useEffect(() => {
    (async () => {
    
      // Ambil semua data tanah dari database
      try {
        const { supabase } = require("../api/supabaseClient");
        let { data, error } = await supabase.from("tanah").select("*");
        if (!error && Array.isArray(data)) {
          setAllTanah(data);
        }
      } catch (e) {
        // Error fetch
      }
    })();
  }, [parsedPolygon, polygonCoords]);

  // Warna status
  // Polygon/Polyline drawing logic dihapus

  // Fokus ke tanah terpilih saat load, lalu matikan auto-center
  const [hasCentered, setHasCentered] = useState(false);
  React.useEffect(() => {
    if (!hasCentered && props.route?.params?.id && mapRef.current) {
      const selected = allTanah.find(
        (t) => String(t.id) === String(props.route.params.id)
      );
      if (selected && selected.latitude && selected.longitude) {
        mapRef.current.animateToRegion(
          {
            latitude: parseFloat(selected.latitude),
            longitude: parseFloat(selected.longitude),
            latitudeDelta: 0.0015,
            longitudeDelta: 0.0015,
          },
          500
        );
        setHasCentered(true);
      }
    }
  }, [props.route?.params?.id, allTanah, hasCentered]);

  const isNoCoord =
    (!latitude || !longitude) &&
    (!parsedPolygon ||
      !Array.isArray(parsedPolygon) ||
      parsedPolygon.length === 0);

  // Semua fungsi simpan polygon dihapus, hanya tombol UI yang tersisa

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {isNoCoord && (
        <View style={styles.error}>
          <Text>Koordinat tidak tersedia</Text>
        </View>
      )}
      {/* Modal Input Koordinat dihapus */}
      <View style={{ flex: 1, position: "relative" }}>
        {/* Navigasi vertikal kiri atas */}
        <View
          style={{
            position: "absolute",
            top: 20,
            left: 10,
            zIndex: 30,
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <TouchableOpacity
            style={styles.navBtn}
            onPress={refreshDeviceLocation}
          >
            <MaterialIcons name="my-location" size={24} color="green" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => {
              if (mapRef.current) {
                if (
                  parsedPolygon &&
                  Array.isArray(parsedPolygon) &&
                  parsedPolygon.length > 0 &&
                  parsedPolygon[0].length === 2
                ) {
                  mapRef.current.animateToRegion(
                    {
                      latitude: parseFloat(parsedPolygon[0][0]),
                      longitude: parseFloat(parsedPolygon[0][1]),
                      latitudeDelta: 0.0015,
                      longitudeDelta: 0.0015,
                    },
                    500
                  );
                } else if (latitude && longitude) {
                  mapRef.current.animateToRegion(
                    {
                      latitude: parseFloat(latitude),
                      longitude: parseFloat(longitude),
                      latitudeDelta: 0.0015,
                      longitudeDelta: 0.0015,
                    },
                    500
                  );
                }
              }
            }}
          >
            <MaterialIcons name="home" size={24} color="#1976d2" />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.navBtn} onPress={centerToMain}>
            <MaterialIcons name="location-on" size={24} color="#1976d2" />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => {
              if (mapRef.current && mapRef.current.__lastRegion) {
                mapRef.current.animateToRegion(
                  {
                    ...mapRef.current.__lastRegion,
                    latitudeDelta:
                      mapRef.current.__lastRegion.latitudeDelta / 2,
                    longitudeDelta:
                      mapRef.current.__lastRegion.longitudeDelta / 2,
                  },
                  300
                );
              }
            }}
          >
            <MaterialIcons name="zoom-in" size={24} color="#1976d2" />
          </TouchableOpacity>
          <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
            {/* Tombol Setting mapType, icon saja, di atas pencil */}
            <TouchableOpacity
              style={[styles.navBtn, { backgroundColor: "#fff" }]}
              onPress={() =>
                setMapType(mapType === "hybrid" ? "standard" : "hybrid")
              }
            >
              <MaterialIcons name="settings" size={22} color="#1976d2" />
            </TouchableOpacity>
            {/* Tombol Pencil (edit) untuk aktifkan drawing polyline */}
            <TouchableOpacity
              style={[
                styles.navBtn,
                {
                  marginTop: 6,
                  backgroundColor: drawMode ? "#1976d2" : "#fff",
                },
              ]}
              onPress={() => {
                if (drawMode) setPolylinePoints([]);
                setDrawMode((d) => !d);
              }}
            >
              <MaterialIcons
                name={drawMode ? "cancel" : "edit"}
                size={24}
                color={drawMode ? "#fff" : "#1976d2"}
              />
            </TouchableOpacity>
            {/* Tombol Undo hanya tampil saat drawMode aktif */}
            {drawMode && (
              <TouchableOpacity
                style={[
                  styles.navBtn,
                  { marginTop: 6, backgroundColor: "#fff" },
                ]}
                onPress={() => {
                  if (polylinePoints.length > 0) {
                    setPolylinePoints((points) => points.slice(0, -1));
                  }
                }}
                disabled={polylinePoints.length === 0}
              >
                <MaterialIcons
                  name="undo"
                  size={22}
                  color={polylinePoints.length === 0 ? "#ccc" : "#1976d2"}
                />
              </TouchableOpacity>
            )}
            {/* Tombol Selesai (check) hanya tampil saat drawMode aktif */}
            {drawMode && (
              <TouchableOpacity
                style={[
                  styles.navBtn,
                  {
                    marginTop: 6,
                    backgroundColor: "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
                onPress={() => {
                  if (polylinePoints.length > 2) {
                    const first = polylinePoints[0];
                    const last = polylinePoints[polylinePoints.length - 1];
                    // Jika belum tertutup, tambahkan titik awal ke akhir
                    if (
                      first.latitude !== last.latitude ||
                      first.longitude !== last.longitude
                    ) {
                      setPolylinePoints((points) => [...points, first]);
                    }
                  }
                }}
              >
                <MaterialIcons name="check" size={22} color="#1976d2" />
              </TouchableOpacity>
            )}
            {/* Tombol Simpan hanya tampil saat drawMode aktif */}
            {drawMode && (
              <TouchableOpacity
                style={[
                  styles.navBtn,
                  {
                    marginTop: 6,
                    backgroundColor: "#1976d2",
                    flexDirection: "row",
                    alignItems: "center",
                  },
                ]}
                onPress={async () => {
                  if (!props.route?.params?.id || polylinePoints.length < 2)
                    return;
                  const { supabase } = require("../api/supabaseClient");
                  // Simpan polyline ke database
                  const arr = polylinePoints.map((p) => [
                    p.latitude,
                    p.longitude,
                  ]);
                  // Hitung titik tengah polyline
                  let centerLat = null,
                    centerLng = null;
                  if (arr.length > 0) {
                    let sumLat = 0,
                      sumLng = 0;
                    arr.forEach(([lat, lng]) => {
                      sumLat += parseFloat(lat);
                      sumLng += parseFloat(lng);
                    });
                    centerLat = sumLat / arr.length;
                    centerLng = sumLng / arr.length;
                  }
                  await supabase
                    .from("tanah")
                    .update({
                      polygon_coords: JSON.stringify(arr),
                      latitude: centerLat,
                      longitude: centerLng,
                      location_type: "polyline",
                    })
                    .eq("id", props.route.params.id);
                  alert("Polyline berhasil disimpan!");
                  setDrawMode(false);
                  setPolylinePoints([]);
                }}
              >
                <MaterialIcons name="save" size={22} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          mapType={mapType}
          initialRegion={
            Array.isArray(parsedPolygon) &&
            parsedPolygon.length > 0 &&
            parsedPolygon[0].length === 2
              ? {
                  latitude: parseFloat(parsedPolygon[0][0]),
                  longitude: parseFloat(parsedPolygon[0][1]),
                  latitudeDelta: 0.0015,
                  longitudeDelta: 0.0015,
                }
              : latitude && longitude
              ? {
                  latitude: parseFloat(latitude),
                  longitude: parseFloat(longitude),
                  latitudeDelta: 0.0015,
                  longitudeDelta: 0.0015,
                }
              : {
                  latitude: -0.784443, // Palu Utara
                  longitude: 119.877159,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
          }
          onMapReady={() => {
            // Matikan auto-center setelah map sudah siap
          }}
          onPress={(e) => {
            if (drawMode) {
              const coord = e.nativeEvent.coordinate;
              setPolylinePoints((points) => [...points, coord]);
            }
          }}
        >
          {/* Polyline hasil drawing user */}
          {drawMode && polylinePoints.length > 0 && (
            <>
              {polylinePoints.length > 1 && (
                <Polyline
                  coordinates={polylinePoints}
                  strokeColor="#1976d2"
                  strokeWidth={3}
                />
              )}
              {polylinePoints.map((point, idx) => (
                <Marker
                  key={`draw-point-${idx}`}
                  coordinate={point}
                  onPress={() => setTappedIdx(idx)}
                >
                  <MaterialIcons name="location-on" size={28} color="#EAB308" />
                </Marker>
              ))}
            </>
          )}
          {/* Tampilkan semua marker tanah dari database */}
          {Array.isArray(allTanah) &&
            allTanah.map((tanah, idx) => {
              // Parse polygon
              let tanahPolygon = null;
              if (tanah.polygon_coords && Array.isArray(tanah.polygon_coords)) {
                tanahPolygon = tanah.polygon_coords;
              } else if (
                tanah.polygon_coords &&
                typeof tanah.polygon_coords === "string"
              ) {
                try {
                  tanahPolygon = JSON.parse(tanah.polygon_coords);
                } catch (e) {
                  tanahPolygon = null;
                }
              }
              // Marker utama (centroid)
              const lat = tanah.latitude;
              const lng = tanah.longitude;
              // Cek apakah ini tanah terpilih (dari props.route?.params?.id)
              const isSelected =
                props.route?.params?.id &&
                String(tanah.id) === String(props.route.params.id);
              return (
                <React.Fragment key={tanah.id || idx}>
                  {lat && lng && (
                    <Marker
                      coordinate={{
                        latitude: parseFloat(lat),
                        longitude: parseFloat(lng),
                      }}
                    >
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: isSelected ? "#ef4444" : "#22c55e",
                          borderWidth: 3,
                          borderColor: "#fff",
                          justifyContent: "center",
                          alignItems: "center",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 2,
                        }}
                      />
                    </Marker>
                  )}
                  {/* Polygon jika ada */}
                  {Array.isArray(tanahPolygon) && tanahPolygon.length > 1 && (
                    <Polygon
                      coordinates={tanahPolygon.map(([plat, plng]) => ({
                        latitude: parseFloat(plat),
                        longitude: parseFloat(plng),
                      }))}
                      strokeColor="#a21caf"
                      fillColor="rgba(162,28,175,0.15)"
                      strokeWidth={2}
                    />
                  )}
                  {/* Polyline jika ada dan bukan polygon tertutup */}
                  {Array.isArray(tanahPolygon) &&
                    tanahPolygon.length > 1 &&
                    tanahPolygon[0] &&
                    tanahPolygon[0].length === 2 && (
                      <Polyline
                        coordinates={tanahPolygon.map(([plat, plng]) => ({
                          latitude: parseFloat(plat),
                          longitude: parseFloat(plng),
                        }))}
                        strokeColor="#1976d2"
                        strokeWidth={2}
                      />
                    )}
                </React.Fragment>
              );
            })}

          {/* Tampilkan semua koordinat polygon/polyline jika ada */}
          {Array.isArray(parsedPolygon) && parsedPolygon.length > 1 && (
            <Polygon
              coordinates={parsedPolygon.map(([lat, lng]) => ({
                latitude: parseFloat(lat),
                longitude: parseFloat(lng),
              }))}
              strokeColor="#a21caf"
              fillColor="rgba(162,28,175,0.15)"
              strokeWidth={2}
            />
          )}
          {/* Jika ingin tampilkan polyline juga, misal untuk garis belum tertutup */}
          {Array.isArray(parsedPolygon) &&
            parsedPolygon.length > 1 &&
            parsedPolygon[0] &&
            parsedPolygon[0].length === 2 && (
              <Polyline
                coordinates={parsedPolygon.map(([lat, lng]) => ({
                  latitude: parseFloat(lat),
                  longitude: parseFloat(lng),
                }))}
                strokeColor="#1976d2"
                strokeWidth={2}
              />
            )}
          {deviceLocation && (
            <Marker
              coordinate={{
                latitude: deviceLocation.latitude,
                longitude: deviceLocation.longitude,
              }}
              title="Lokasi Anda"
            >
              <MaterialIcons name="my-location" size={30} color="#22c55e" />
            </Marker>
          )}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  error: {
    padding: 16,
    alignItems: "center",
  },
  navBtn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sateliteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    minWidth: 40,
    alignItems: "center",
    zIndex: 10,
  },
  focusBtn: {
    position: "absolute",
    top: 48,
    right: 10,
    backgroundColor: "#1976d2",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
    zIndex: 10,
  },
  toggleBtnText: {
    color: "#1976d2",
    fontWeight: "bold",
    fontSize: 11,
    letterSpacing: 0.1,
  },
  tanahBtn: {
    position: "absolute",
    top: 86,
    right: 10,
    backgroundColor: "#388e3c",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
    zIndex: 10,
  },
});
