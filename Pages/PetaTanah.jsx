import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/db';
import { getCurrentUser } from '@/api/authUser';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Map, Search, Filter, MapPin } from 'lucide-react';
import TanahMap from '@/components/maps/TanahMap';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

export default function PetaTanah() {
    const navigateBack = () => {
      window.history.length > 1 ? window.history.back() : window.location.assign('/dashboard');
    };
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get('id');
  
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKecamatan, setFilterKecamatan] = useState('all');
  const [filterKelurahan, setFilterKelurahan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Ambil user gabungan dari helper
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const { data: tanahList = [], isLoading } = useQuery({
    queryKey: ['tanah-peta', user?.kecamatan, user?.kelurahan, user?.role, user?.nik],
    queryFn: async () => {
      if (!user) return [];
      let query = supabase.from('tanah').select('*');
      if (user.role === 'super_admin') {
        // ...existing code...
      } else if (user.role === 'admin_kecamatan') {
        query = query.eq('kecamatan', user.kecamatan);
      } else if (user.role === 'admin_kelurahan') {
        query = query.eq('kelurahan', user.kelurahan);
      } else if (user.role === 'member') {
        query = query.or(`nik_pemilik.eq.${user.nik},nik_penerima.eq.${user.nik}`);
      } else {
        return [];
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: wilayahList = [] } = useQuery({
    queryKey: ['wilayah'],
    queryFn: async () => {
      const { data, error } = await supabase.from('wilayah').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const kecamatanOptions = [...new Set(wilayahList.map(w => w.kecamatan))];
  const kelurahanOptions = filterKecamatan !== 'all' 
    ? [...new Set(wilayahList.filter(w => w.kecamatan === filterKecamatan).map(w => w.kelurahan))]
    : [...new Set(wilayahList.map(w => w.kelurahan))];

  const filteredTanah = tanahList.filter(tanah => {
    const matchSearch = tanah.nama_pemilik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        tanah.nama_penerima?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        tanah.lokasi?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKecamatan = filterKecamatan === 'all' || tanah.kecamatan === filterKecamatan;
    const matchKelurahan = filterKelurahan === 'all' || tanah.kelurahan === filterKelurahan;
    const matchStatus = filterStatus === 'all' || tanah.status === filterStatus;
    return matchSearch && matchKecamatan && matchKelurahan && matchStatus;
  });

  const tanahWithCoords = filteredTanah.filter(t => t.latitude && t.longitude);

  // Jika ada selectedId, cari tanah yang dipilih dan pusatkan peta ke koordinat tersebut
  const selectedTanah = selectedId 
    ? tanahWithCoords.find(t => parseInt(t.id) === parseInt(selectedId))
    : null;

  const mapCenter = selectedTanah
    ? [selectedTanah.latitude, selectedTanah.longitude]
    : (tanahWithCoords.length > 0
      ? [tanahWithCoords[0].latitude, tanahWithCoords[0].longitude]
      : [-0.8317, 119.8707]); // Default Palu Utara

  const mapZoom = selectedTanah ? 16 : 14; // Default zoom 14 jika tidak ada tanah dipilih

  return (
    <div className="space-y-6 relative">
      {/* Tombol kembali kanan atas jika dari DataTanah */}
      {selectedId && (
        <button
          onClick={navigateBack}
          className="absolute top-2 right-2 z-50 bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white px-4 py-2 rounded shadow hover:brightness-110 transition-all flex items-center gap-2"
          title="Kembali ke Data Tanah"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Kembali
        </button>
      )}
      {/* Header */}
      <div>
        
        <p className="text-slate-500 mt-1">
          Visualisasi lokasi tanah berdasarkan koordinat
        </p>
      </div>

      {/* Filters */}
      {user?.role !== 'super_admin' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Cari nama pemilik, penerima, atau lokasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterKecamatan} onValueChange={(v) => {
                  setFilterKecamatan(v);
                  setFilterKelurahan('all');
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter Kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kecamatan</SelectItem>
                    {kecamatanOptions.map(k => (
                      <SelectItem key={k} value={k}>{k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterKelurahan} onValueChange={setFilterKelurahan}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter Kelurahan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelurahan</SelectItem>
                    {kelurahanOptions.map(k => (
                      <SelectItem key={k} value={k}>{k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="Proses">Proses</SelectItem>
                    <SelectItem value="Selesai">Selesai</SelectItem>
                    <SelectItem value="Ditolak">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 px-4 py-2">
          <MapPin className="w-4 h-4 mr-2" />
          Total: {filteredTanah.length} data
        </Badge>
        <Badge variant="secondary" className="bg-green-100 text-green-700 px-4 py-2">
          Dengan Koordinat: {tanahWithCoords.length}
        </Badge>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700 px-4 py-2">
          Tanpa Koordinat: {filteredTanah.length - tanahWithCoords.length}
        </Badge>
      </div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TanahMap 
          tanahList={tanahWithCoords} 
          center={mapCenter}
          zoom={mapZoom}
          selectedId={selectedId}
        />
      </motion.div>

      {/* Legend */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <h3 className="font-semibold text-slate-700 mb-3">Keterangan Warna Marker:</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ background: '#fff', border: '2px solid #EAB308' }}></div>
              <span className="text-sm text-slate-600">Dipilih</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm text-slate-600">Dalam Proses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ background: '#EAB308' }}></div>
              <span className="text-sm text-slate-600">Selesai</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm text-slate-600">Ditolak</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}