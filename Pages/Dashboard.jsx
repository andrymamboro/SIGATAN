import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/api/db";
import { getCurrentUser } from "@/api/authUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Map,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import StatsCard from "@/components/dashboard/StatsCard";
import TanahMap from "@/components/maps/TanahMap";
import { Eye, EyeOff } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showMarkers, setShowMarkers] = useState(true);

  useEffect(() => {
    // Ambil user gabungan dari helper
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // Untuk super admin: tidak ada filter sama sekali, ambil semua data tanah
  // Untuk admin: ambil semua data tanah
  // Untuk admin_kecamatan: filter kecamatan saja
  // Untuk user biasa: filter kecamatan & kelurahan
  const isSuperAdmin = user?.role === "super_admin";
  const isAdmin = user?.role === "admin";
  const isAdminKecamatan = user?.role === "admin_kecamatan";
  const tanahQueryEnabled = Boolean(user && (isSuperAdmin || isAdmin || isAdminKecamatan || (user.kecamatan && user.kelurahan)));
  const { data: tanahList = [], isLoading } = useQuery({
    queryKey: [
      "tanah",
      isSuperAdmin ? "all" : isAdminKecamatan ? user?.kecamatan : user?.kecamatan,
      isAdminKecamatan ? undefined : user?.kelurahan
    ],
    queryFn: async () => {
      if (!user) return [];
      let query = supabase.from("tanah").select("*");
      if (isAdminKecamatan) {
        // Filter hanya kecamatan
        if (!user.kecamatan) return [];
        query = query.eq("kecamatan", user.kecamatan);
      } else if (!isSuperAdmin && !isAdmin) {
        // Jika kecamatan/kelurahan kosong, return []
        if (!user.kecamatan || !user.kelurahan) return [];
        query = query.match({
          kecamatan: user.kecamatan,
          kelurahan: user.kelurahan,
        });
      }
      // admin dan super_admin: tidak ada filter
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: tanahQueryEnabled,
  });

  const stats = {
    total: tanahList.length,
    proses: tanahList.filter((t) => t.status === "Proses").length,
    selesai: tanahList.filter((t) => t.status === "Selesai").length,
    ditolak: tanahList.filter((t) => t.status === "Ditolak").length,
  };

  const recentTanah = tanahList.slice(0, 5);

  const mapCenter =
    tanahList.length > 0 && tanahList[0].latitude
      ? [tanahList[0].latitude, tanahList[0].longitude]
      : [-0.8317, 119.8707]; // Default Palu Utara

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Selamat datang, {user?.full_name || "User"}
          </p>
        </div>
        {/* Badge lokasi hanya untuk user biasa/admin, super admin tidak tampil */}
        {(!isSuperAdmin) && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {user?.kecamatan || "-"}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-700"
            >
              {user?.kelurahan || "-"}
            </Badge>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {!user ? (
        <div className="text-center text-slate-500 py-8">Memuat data user...</div>
      ) : !tanahQueryEnabled ? (
        <div className="text-center text-slate-500 py-8">
          {isSuperAdmin || isAdmin
            ? "Memuat data..."
            : "Silakan pilih kecamatan dan kelurahan pada profil Anda untuk melihat data tanah."}
        </div>
      ) : isLoading ? (
        <div className="text-center text-slate-500 py-8">Memuat data tanah...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Data Tanah"
            value={stats.total}
            icon={FileText}
            color="green"
            subtext="Keseluruhan data"
          />
          <StatsCard
            title="Dalam Proses"
            value={stats.proses}
            icon={Clock}
            color="blue"
            subtext="Menunggu verifikasi"
          />
          <StatsCard
            title="Selesai"
            value={stats.selesai}
            icon={CheckCircle}
            color="yellow"
            subtext="Telah terverifikasi"
          />
          <StatsCard
            title="Ditolak"
            value={stats.ditolak}
            icon={XCircle}
            color="red"
            subtext="Perlu revisi"
          />
        </div>
      )}

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg overflow-hidden mt-0">
          <div className="relative">
            {/* Tombol show/hide marker di dalam map, pojok kanan atas, berdampingan dengan zoom */}
            <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000, display: 'flex', flexDirection: 'row', gap: 8 }}>
              <button
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium border shadow ${showMarkers ? 'bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setShowMarkers((v) => !v)}
                title={showMarkers ? 'Sembunyikan Marker' : 'Tampilkan Marker'}
                style={{ minWidth: 40 }}
              >
                {showMarkers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <CardContent className="p-0 bg-gradient-to-br from-teal-50 to-emerald-50">
              <TanahMap tanahList={tanahList} center={mapCenter} zoom={13} showMarkers={showMarkers} />
            </CardContent>
          </div>
        </Card>
      </motion.div>

      {/* Recent Data */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5" />
                Data Tanah Terbaru
              </CardTitle>
              <Link
                to={createPageUrl("DataTanah")}
                className="text-sm text-white/90 hover:text-white flex items-center gap-1 transition-colors"
              >
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                      Nama Pemilik / Pihak Pertama
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                      Penerima / Pihak Kedua
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                      Luas
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">
                      Lokasi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTanah.map((tanah) => (
                    <tr
                      key={tanah.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Link
                          to={createPageUrl("DetailTanah") + `?id=${tanah.id}`}
                          className="font-medium text-slate-800 hover:text-blue-600"
                        >
                          {tanah.nama_pemilik}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {tanah.nama_penerima}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {tanah.luas_meter % 1 === 0
                          ? Math.floor(tanah.luas_meter)
                          : tanah.luas_meter.toString().replace(".", ",")}{" "}
                        m²
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            tanah.status === "Selesai"
                              ? "default"
                              : tanah.status === "Ditolak"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            tanah.status === "Selesai"
                              ? "bg-yellow-100 text-yellow-700"
                              : tanah.status === "Ditolak"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        >
                          {tanah.status || "Proses"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {tanah.latitude && tanah.longitude ? (
                          <Link
                            to={createPageUrl("PetaTanah") + `?id=${tanah.id}`}
                            className="inline-block"
                          >
                            <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors cursor-pointer border border-teal-300">
                              <Map className="w-3 h-3 mr-1" />
                              Lihat Peta
                            </Badge>
                          </Link>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-400 border border-slate-200">
                            Tidak Ada Koordinat
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                  {recentTanah.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-slate-500"
                      >
                        Belum ada data tanah
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div> */}
    </div>
  );
}
