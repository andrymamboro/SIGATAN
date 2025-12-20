// Contoh: ambil data dari tabel 'Tanah'
// const { data, error } = await supabase.from('Tanah').select('*');
import React, { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  Trash2,
  MapPin,
  User,
  QrCode,
  Printer,
  Map
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function DataTanah() {
  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  const [qrTanah, setQrTanah] = useState(null);
  const navigate = useNavigate();

  // Reset page to 1 when search/filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterStatus]);


  // Query tanahList from supabase
  const { data: tanahList = [], isLoading, error: tanahError } = useQuery({
    queryKey: ['tanah', user?.kecamatan, user?.kelurahan, user?.role, user?.nik],
    queryFn: async () => {
      if (!user) return [];
      let query = supabase.from('tanah').select('*');
      if (user.role === 'super_admin') {
        // Tidak ada filter
      } else if (user.role === 'admin_kecamatan') {
        query = query.eq('kecamatan', user.kecamatan);
      } else if (user.role === 'admin_kelurahan') {
        query = query.eq('kelurahan', user.kelurahan);
      } else if (user.role === 'member') {
        query = query.or(`nik_pemilik.eq.${user.nik},nik_penerima.eq.${user.nik}`);
      } else {
        // fallback: tidak ada data
        return [];
      }
      query = query.order('created_date', { ascending: false });
      const { data, error } = await query;
      if (error) {
        console.error('Supabase tanah error:', error);
        throw new Error(error.message);
      }
      return data || [];
    },
    enabled: !!user,
  });

  // Filtered tanah and pagination logic must be after tanahList declaration
  const filteredTanah = tanahList.filter(tanah => {
    const matchSearch = tanah.nama_pemilik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        tanah.nama_penerima?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        tanah.nik_pemilik?.includes(searchTerm) ||
                        tanah.lokasi?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || tanah.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filteredTanah.length / pageSize);
  const paginatedTanah = filteredTanah.slice((page - 1) * pageSize, page * pageSize);

  const queryClient = useQueryClient();

  useEffect(() => {
    // Ambil user aplikasi berdasarkan auth_id Supabase Auth
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: userApp } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', authUser.id)
          .single();
        // Gabungkan data user dari auth dan tabel users
        setUser({
          ...authUser,
          ...userApp
        });
      }
    };
    getUser();
  }, []);

  // useEffect reset searchTerm & filterStatus dihapus agar input search/filter bisa digunakan

  // ...existing code...

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('tanah').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tanah']);
      setDeleteId(null);
      toast.success('Data tanah berhasil dihapus');
    },
    onError: (error) => {
      toast.error('Gagal menghapus data: ' + (error.message || error));
    },
  });

  const handleSubmit = (data) => {
    if (editingTanah) {
      updateMutation.mutate({ id: editingTanah.id, data });
    } else {
      createMutation.mutate({
        ...data,
        kecamatan: data.kecamatan || user?.kecamatan,
        kelurahan: data.kelurahan || user?.kelurahan,
      });
    }
  };

  // ...existing code...

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Data Tanah
          </h1>
          <p className="text-slate-500 mt-1">
            Kelola data tanah dan dokumen pertanahan
          </p>
        </div>
        <Button 
          onClick={() => navigate('/formtanah')}
          className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow hover:brightness-110"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Data
        </Button>
      </div>

      {/* Keterangan warna marker */}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 rounded-full" style={{ background: '#EAB308', border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.15)' }}></span>
          <span className="text-sm text-slate-700 font-medium">Selesai</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 rounded-full" style={{ background: '#3b82f6', border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.15)' }}></span>
          <span className="text-sm text-slate-700 font-medium">Proses</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 rounded-full" style={{ background: '#ef4444', border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.15)' }}></span>
          <span className="text-sm text-slate-700 font-medium">Ditolak</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Cari nama, NIK, atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
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

      {/* Data Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12 text-slate-500 text-lg">Memuat data...</div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {paginatedTanah.map((tanah, index) => (
              <motion.div
                key={tanah.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            {tanah.nama_pemilik}
                          </h3>
                          <p className="text-sm text-slate-500">NIK: {tanah.nik_pemilik}</p>
                        </div>
                        <Badge 
                          className={
                            tanah.status === 'Selesai' ? 'bg-yellow-100 text-yellow-700' :
                            tanah.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }
                        >
                          {tanah.status || 'Proses'}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {tanah.lokasi}
                        </div>
                        <div>Luas: {tanah.luas_meter % 1 === 0 ? Math.floor(tanah.luas_meter) : tanah.luas_meter.toString().replace('.', ',')} m²</div>
                        <div>Kelurahan: {tanah.kelurahan}</div>
                      </div>

                      {tanah.nama_penerima && (
                        <div className ="text-sm text-slate-600"><strong>
                          <span className="font-medium">Penerima:</span> {tanah.nama_penerima} 
                          {tanah.transaksi && <span className="text-slate-400 ml-2">({tanah.transaksi})</span>}</strong>
                        </div>
                      )}

                      {/* Tampilkan location_type jika ada */}
                      {tanah.location_type && (
                        <div className="text-xs text-slate-400">Tipe Lokasi: {tanah.location_type}</div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link to={createPageUrl('DetailTanah') + `?id=${tanah.id}`}>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                          <Eye className="w-4 h-4 mr-1" />
                          Detail
                        </Button>
                      </Link>
                      <Link to={createPageUrl('PetaTanah') + `?id=${tanah.id}`}>
                        <Button variant="outline" size="sm" className={tanah.latitude && tanah.longitude ? "text-teal-600 border-teal-200 hover:bg-teal-50" : "text-slate-400 border-slate-200"} disabled={!tanah.latitude || !tanah.longitude}>
                          <Map className="w-4 h-4 mr-1" />
                          Peta
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/formtanah?id=${tanah.id}`)}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const valueStr = `${tanah.nama_pemilik} → ${tanah.nama_penerima} (${tanah.transaksi || 'Transaksi'})`;
                          navigate(`/laporan?tanah=${encodeURIComponent(valueStr)}`);
                        }}
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setQrTanah(tanah)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setDeleteId(tanah.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTanah.length === 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600">Belum ada data tanah</h3>
              <p className="text-slate-400 mt-1">Klik tombol "Tambah Data" untuk menambahkan data baru</p>
            </CardContent>
          </Card>
        )}
      </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white disabled:opacity-50"
          >
            &lt;
          </Button>
          <span className="text-sm text-slate-700">Halaman {page} dari {totalPages}</span>
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white disabled:opacity-50"
          >
            &gt;
          </Button>
        </div>
      )}

      {/* Error Handling */}
      {tanahError && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          Gagal memuat data tanah: {tanahError.message}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Tanah?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data tanah akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* QR Code Modal */}
      <Dialog open={!!qrTanah} onOpenChange={() => setQrTanah(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">QR Code Lokasi Tanah</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 p-4">
            <div className="text-center space-y-1">
              <p className="font-medium text-slate-800">
                {qrTanah?.nama_pemilik}
                {qrTanah?.nama_penerima && (
                  <> diserahkan kepada {qrTanah?.nama_penerima}</>
                )}
                {qrTanah?.atas_nama && (
                  <> / {qrTanah?.atas_nama}</>
                )}
              </p>
              <p className="text-sm text-slate-500">{(qrTanah?.luas_meter || 0) % 1 === 0 ? Math.floor(qrTanah?.luas_meter || 0) : (qrTanah?.luas_meter || 0).toString().replace('.', ',')} m²</p>
              <p className="text-xs text-slate-400">
                {qrTanah?.latitude}, {qrTanah?.longitude}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-slate-200">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`https://www.google.com/maps?q=${qrTanah?.latitude},${qrTanah?.longitude}`)}`}
                alt="QR Code"
                className="w-64 h-64"
              />
            </div>
            <p className="text-xs text-center text-slate-500">
              Scan QR code untuk melihat lokasi di Google Maps
            </p>
            <Button 
              onClick={() => {
                const googleMapsUrl = `https://www.google.com/maps?q=${qrTanah?.latitude},${qrTanah?.longitude}`;
                window.open(googleMapsUrl, '_blank');
              }}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Buka di Google Maps
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}