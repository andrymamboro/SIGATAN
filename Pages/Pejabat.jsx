import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/db';
import { getCurrentUser } from '@/api/authUser';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Users, 
  Plus, 
  Search, 
  Pencil, 
  Trash2,
  UserCheck,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const JABATAN_OPTIONS = [
  'Camat',
  'Lurah',
  'Kasi Pemerintahan',
  'Staf Administrasi Kecamatan'
];

export default function Pejabat() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJabatan, setFilterJabatan] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPejabat, setEditingPejabat] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    kecamatan: '',
    kelurahan: '',
    nama: '',
    jabatan: '',
    nip: '',
    selaku: '',
    aktif: true
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    // ...existing code...
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: userApp } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', authUser.id)
          .single();
        setUser(userApp);
      }
    };
    getUser();
  }, []);

  const { data: pejabatList = [], isLoading } = useQuery({
    queryKey: ['pejabat'],
    queryFn: async () => {
      const { data, error } = await supabase.from('pejabat').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: wilayahList = [] } = useQuery({
    queryKey: ['wilayah'],
    queryFn: async () => {
      const { data, error } = await supabase.from('wilayah').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from('pejabat').insert([data]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pejabat']);
      setShowForm(false);
      resetForm();
      toast.success('Data pejabat berhasil ditambahkan');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { error } = await supabase.from('pejabat').update(data).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pejabat']);
      setShowForm(false);
      setEditingPejabat(null);
      resetForm();
      toast.success('Data pejabat berhasil diperbarui');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('pejabat').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pejabat']);
      setDeleteId(null);
      toast.success('Data pejabat berhasil dihapus');
    },
  });

  const resetForm = () => {
    setFormData({
      kecamatan: '',
      kelurahan: '',
      nama: '',
      jabatan: '',
      nip: '',
      selaku: '',
      aktif: true
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPejabat) {
      updateMutation.mutate({ id: editingPejabat.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (pejabat) => {
    setEditingPejabat(pejabat);
    setFormData({
      kecamatan: pejabat.kecamatan || '',
      kelurahan: pejabat.kelurahan || '',
      nama: pejabat.nama || '',
      jabatan: pejabat.jabatan || '',
      nip: pejabat.nip || '',
      selaku: pejabat.selaku || '',
      aktif: pejabat.aktif !== false
    });
    setShowForm(true);
  };

  const kecamatanOptions = [...new Set(wilayahList.map(w => w.kecamatan))];
  const kelurahanOptions = formData.kecamatan 
    ? [...new Set(wilayahList.filter(w => w.kecamatan === formData.kecamatan).map(w => w.kelurahan))]
    : [];

  const filteredPejabat = pejabatList.filter(pejabat => {
    const matchSearch = pejabat.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        pejabat.nip?.includes(searchTerm) ||
                        pejabat.kecamatan?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJabatan = filterJabatan === 'all' || pejabat.jabatan === filterJabatan;
    return matchSearch && matchJabatan;
  });

  const jabatanColors = {
    'Camat': 'bg-purple-100 text-purple-700',
    'Lurah': 'bg-blue-100 text-blue-700',
    'Kasi Pemerintahan': 'bg-emerald-100 text-emerald-700',
    'Staf Administrasi Kecamatan': 'bg-orange-100 text-orange-700'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-white" />
            Data Pejabat
          </h1>
          <p className="text-white mt-1">
            Kelola data pejabat penanda tangan
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingPejabat(null);
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-900 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pejabat
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md bg-transparent">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Cari nama, NIP, atau kecamatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-white-500 text-white placeholder-white"
              />
            </div>
            <Select value={filterJabatan} onValueChange={setFilterJabatan}>
              <SelectTrigger className="w-full md:w-64 border-2 border-white-500 text-white">
                <SelectValue placeholder="Filter Jabatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jabatan</SelectItem>
                {JABATAN_OPTIONS.map(j => (
                  <SelectItem key={j} value={j}>{j}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          {filteredPejabat.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600">Belum ada data pejabat</h3>
              <p className="text-slate-400 mt-1">Klik tombol "Tambah Pejabat" untuk menambahkan data baru</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-700 border-b-2 border-blue-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Nama & NIP
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Jabatan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Wilayah
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Selaku
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  <AnimatePresence>
                    {filteredPejabat.map((pejabat, index) => (
                      <motion.tr
                        key={pejabat.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.03 }}
                        className={`hover:bg-slate-50 transition-colors duration-150 ${index % 2 === 1 ? 'bg-gray-300' : 'bg-white'}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                              <span className="text-white text-sm font-bold">
                                {pejabat.nama?.charAt(0).toUpperCase() || 'P'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{pejabat.nama}</p>
                              <p className="text-xs text-slate-500">NIP: {pejabat.nip || '-'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={jabatanColors[pejabat.jabatan] || 'bg-slate-100 text-slate-700'}>
                            {pejabat.jabatan}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <Building className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-slate-600">
                              <p className="font-medium">{pejabat.kecamatan}</p>
                              {pejabat.kelurahan && (
                                <p className="text-slate-500">{pejabat.kelurahan}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {pejabat.selaku || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Badge className={pejabat.aktif !== false 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-red-100 text-red-700 border-red-200'
                          }>
                            {pejabat.aktif !== false ? 'Aktif' : 'Non-aktif'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEdit(pejabat)}
                              className="text-blue-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setDeleteId(pejabat.id)}
                              className="text-red-600 hover:text-green-700 hover:bg-blue-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg bg-gray-100">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingPejabat ? 'Edit Data Pejabat' : 'Tambah Pejabat Baru'}
            </DialogTitle>          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kecamatan *</Label>
                <Select 
                  value={formData.kecamatan} 
                  onValueChange={(v) => setFormData({ ...formData, kecamatan: v, kelurahan: '' })}
                >
                  <SelectTrigger className="border-2 border-blue-500">
                    <SelectValue placeholder="Pilih Kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {kecamatanOptions.map(k => (
                      <SelectItem key={k} value={k}>{k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kelurahan</Label>
                <Select 
                  value={formData.kelurahan} 
                  onValueChange={(v) => setFormData({ ...formData, kelurahan: v })}
                >
                  <SelectTrigger className="border-2 border-blue-500">
                    <SelectValue placeholder="Pilih Kelurahan" />
                  </SelectTrigger>
                  <SelectContent>
                    {kelurahanOptions.map(k => (
                      <SelectItem key={k} value={k}>{k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="">Nama Pejabat *</Label>
              <Input
                className=""
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Jabatan *</Label>
              <Select
                
                value={formData.jabatan} 
                onValueChange={(v) => setFormData({ ...formData, jabatan: v })}
              >
                <SelectTrigger className= "border-2 border-blue-500">
                  <SelectValue placeholder="Pilih Jabatan" />
                </SelectTrigger >
                <SelectContent>
                  {JABATAN_OPTIONS.map(j => (
                    <SelectItem key={j} value={j}>{j}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>NIP</Label>
              <Input
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                placeholder="Nomor Induk Pegawai"
              />
            </div>

            <div className="space-y-2">
              <Label>Selaku</Label>
              <Input
                value={formData.selaku}
                onChange={(e) => setFormData({ ...formData, selaku: e.target.value })}
                placeholder="Contoh: Pengelola Data Pertanahan"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Batal
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Pejabat?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pejabat akan dihapus secara permanen.
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
    </div>
  );
}