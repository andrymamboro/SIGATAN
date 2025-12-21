import React, { useEffect, useState, useRef } from "react";
import MainLayout from "../components/MainLayout";
import MapView, { Marker, Polygon } from "react-native-maps";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../api/supabaseClient";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

export default function AllTanahMapView({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [mapType, setMapType] = useState("satellite");
  const mapRef = useRef(null);

  useEffect(() => {
    fetchData();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let location = await Location.getCurrentPositionAsync({});
      setDeviceLocation(location.coords);
    })();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("tanah").select("*");
    setData(data?.filter((t) => t.latitude && t.longitude) || []);
    setLoading(false);
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#1976d2"
        style={{ marginTop: 40 }}
      />
    );

  return (
    <MainLayout navigation={navigation}>
      <View style={{ flex: 1 }}>
        <View style={{ position: "relative" }}>
          <MapView
            ref={mapRef}
            style={styles.map}
            mapType={mapType}
            initialRegion={{
              latitude: data.length ? parseFloat(data[0].latitude) : -2.2,
              longitude: data.length ? parseFloat(data[0].longitude) : 119.5,
              latitudeDelta: 0.2,
              longitudeDelta: 0.2,
            }}
          >
            {data.map((tanah, idx) => {
              // Cek apakah ada polygon_coords dan valid
              let polygonCoords = null;
              if (tanah.polygon_coords) {
                try {
                  polygonCoords =
                    typeof tanah.polygon_coords === "string"
                      ? JSON.parse(tanah.polygon_coords)
                      : tanah.polygon_coords;
                  // Validasi array koordinat
                  if (!Array.isArray(polygonCoords) || polygonCoords.length < 3)
                    polygonCoords = null;
                } catch (_) {
                  polygonCoords = null;
                }
              }
              if (polygonCoords) {
                return (
                  <Polygon
                    key={tanah.id || idx}
                    coordinates={polygonCoords.map(([lat, lng]) => ({
                      latitude: parseFloat(lat),
                      longitude: parseFloat(lng),
                    }))}
                    strokeColor={
                      tanah.status === "Selesai"
                        ? "#fb923c" // orange-400
                        : tanah.status === "Ditolak"
                        ? "#c1001f"
                        : "#3b82f6"
                    }
                    fillColor={
                      tanah.status === "Selesai"
                        ? "rgba(251,146,60,0)" // orange-400 background
                        : tanah.status === "Ditolak"
                        ? "rgba(193,0,31,0.18)"
                        : "rgba(59,130,246,0.18)"
                    }
                    strokeWidth={1.5}
                  />
                );
              } else {
                return (
                  <Marker
                    key={tanah.id || idx}
                    coordinate={{
                      latitude: parseFloat(tanah.latitude),
                      longitude: parseFloat(tanah.longitude),
                    }}
                    title={tanah.nama_pemilik || "Tanah"}
                    description={`Status: ${tanah.status || "Proses"}`}
                  >
                    <MaterialIcons
                      name="location-on"
                      size={36}
                      color={
                        tanah.status === "Selesai"
                          ? "#fb923c"
                          : tanah.status === "Ditolak"
                          ? "#c1001f"
                          : "#3b82f6"
                      }
                    />
                  </Marker>
                );
              }
            })}
            {deviceLocation && (
              <Marker
                coordinate={{
                  latitude: deviceLocation.latitude,
                  longitude: deviceLocation.longitude,
                }}
                title="Lokasi Anda"
              >
                <Text style={{ fontSize: 32 }}>🧍‍♂️</Text>
              </Marker>
            )}
          </MapView>
          <TouchableOpacity
            style={styles.sateliteBtn}
            onPress={() =>
              setMapType(mapType === "standard" ? "satellite" : "standard")
            }
          >
            <Text style={styles.toggleBtnText}>
              {mapType === "standard" ? "Satelit" : "Peta Biasa"}
            </Text>
          </TouchableOpacity>
          {deviceLocation && (
            <>
              <TouchableOpacity
                style={styles.focusBtn}
                onPress={() => {
                  mapRef.current?.animateToRegion(
                    {
                      latitude: deviceLocation.latitude,
                      longitude: deviceLocation.longitude,
                      latitudeDelta: 0.02,
                      longitudeDelta: 0.02,
                    },
                    500
                  );
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 13, fontWeight: "bold" }}
                >
                  <Text style={{ fontSize: 16 }}>🎯</Text> Pengukur
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sateliteBtnBelow}
                onPress={() =>
                  setMapType(mapType === "standard" ? "satellite" : "standard")
                }
              >
                <Text style={styles.toggleBtnText}>
                  {mapType === "standard" ? "Satelit" : "Peta Biasa"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        {/* Keterangan status marker */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <MaterialIcons name="location-on" size={22} color="#3b82f6" />
            <Text style={styles.legendText}>Proses</Text>
          </View>
          <View style={styles.legendItem}>
            <MaterialIcons name="location-on" size={22} color="#EAB308" />
            <Text style={styles.legendText}>Selesai</Text>
          </View>
          <View style={styles.legendItem}>
            <MaterialIcons name="location-on" size={22} color="#c1001f" />
            <Text style={styles.legendText}>Ditolak</Text>
          </View>
        </View>
        {/* Background nav bawah agar konsisten dengan halaman lain */}
        <View style={styles.bottomNavBg} />
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  bottomNavBg: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
    backgroundColor: "#222",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    zIndex: 1,
  },
  map: {
    width: "100%",
    height: Dimensions.get("window").height * 0.8,
    borderRadius: 12,
  },
  sateliteBtn: {
    // tidak dipakai lagi, gunakan sateliteBtnBelow
  },
  sateliteBtnBelow: {
    position: "absolute",
    right: 24,
    top: 50,
    backgroundColor: "#fff",
    paddingVertical: 2,
    paddingHorizontal: 14,
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
  // sateliteDirectBtn dihapus, gunakan sateliteBtn saja
  focusBtn: {
    position: "absolute",
    top: 76,
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
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 18,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  legendText: {
    marginLeft: 4,
    fontSize: 13,
    color: "#FFF",
    fontWeight: "bold",
  },
});
