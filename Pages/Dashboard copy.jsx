import React, { useState, useEffect, Suspense, lazy } from "react";
const StatsCard = React.lazy(() => import("@/components/dashboard/StatsCard"));
// Map/leaflet component removed
import { Eye, EyeOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/api/db";
import { getCurrentUser } from "@/api/authUser";
const Badge = React.lazy(() => import('@/components/ui/badge').then(m => ({ default: m.Badge })));
const Card = lazy(() => import('@/components/ui/card').then(m => ({ default: m.Card })));
const CardContent = lazy(() => import('@/components/ui/card').then(m => ({ default: m.CardContent })));
import {
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
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white mt-1">
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
        <Suspense fallback={<div>Memuat statistik...</div>}>
          <div className="flex flex-row gap-4 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-x-visible">
            <StatsCard
              title="Total"
              value={stats.total}
              icon={FileText}
              color="green"
              subtext="Dokumen"
            />
            <StatsCard
              title="Proses"
              value={stats.proses}
              icon={Clock}
              color="blue"
              subtext="verifikasi"
            />
            <StatsCard
              title="Selesai"
              value={stats.selesai}
              icon={CheckCircle}
              color="yellow"
              subtext="Terverifikasi"
            />
            <StatsCard
              title="Ditolak"
              value={stats.ditolak}
              icon={XCircle}
              color="red"
              subtext="Perlu revisi"
            />
          </div>
        </Suspense>
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
              <Suspense fallback={<div>Memuat peta...</div>}>
                {/* Komponen peta telah dihapus */}
              </Suspense>
            </CardContent>
          </div>
        </Card>
      </motion.div>

      
    </div>
  );
}
