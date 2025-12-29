import React, { useState, useEffect } from 'react';
import { supabase } from '@/api/db';
import { getCurrentUser } from '@/api/authUser';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Shield,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ManajemenUser() {
  const [viewUser, setViewUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    no_hp: '',
    full_name: '',
    kecamatan: '',
    kelurahan: '',
    role: 'user',
    password: ''
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    // ...existing code...
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, []);

  const { data: userList = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: true,
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
      const { error } = await supabase.from('users').insert([data]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setShowForm(false);
      resetForm();
      toast.success('User berhasil ditambahkan');
    },
    onError: (error) => {
      toast.error('Gagal menambah user: ' + (error.message || 'Terjadi kesalahan'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { error } = await supabase.from('users').update(data).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setShowForm(false);
      setEditingUser(null);
      resetForm();
      toast.success('Data user berhasil diperbarui');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setDeleteId(null);
      toast.success('User berhasil dihapus');
    },
  });

  const resetForm = () => {
    setFormData({
      username: '',
      no_hp: '',
      full_name: '',
      kecamatan: '',
      kelurahan: '',
      role: 'user',
      password: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      // ...existing code...
      const updateData = { ...formData };
      if (!updateData.password || updateData.password.trim() === '') {
        delete updateData.password;
      }
      updateMutation.mutate({ id: editingUser.id, data: updateData });
    } else {
      const newUserData = {
        ...formData,
        aktif: true
      };
      createMutation.mutate(newUserData);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username || '',
      no_hp: user.no_hp || '',
      full_name: user.full_name || '',
      kecamatan: user.kecamatan || '',
      kelurahan: user.kelurahan || '',
      role: user.role || 'user'
    });
    setShowForm(true);
  };

  const kecamatanOptions = [...new Set(wilayahList.map(w => w.kecamatan))];
  const kelurahanOptions = formData.kecamatan 
    ? [...new Set(wilayahList.filter(w => w.kecamatan === formData.kecamatan).map(w => w.kelurahan))]
    : [];

  const filteredUsers = userList.filter(user => {
    const matchSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.no_hp?.includes(searchTerm);
    return matchSearch;
  });

  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="p-8 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Akses Ditolak</h2>
          <p className="text-slate-600">Hanya super admin yang dapat mengakses halaman ini</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Manajemen User
          </h1>
          <p className="text-white mt-1">
            Kelola pengguna sistem
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              setEditingUser(null);
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah User
          </Button>

        </div>
      </div>

      {/* ...existing code... */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Cari nama, username, email, atau no. HP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* ...existing code... */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Total User</p>
                <p className="text-2xl font-bold text-white">{userList.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/20">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Admin</p>
                <p className="text-2xl font-bold text-white">
                  {userList.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-100">User Biasa</p>
                <p className="text-2xl font-bold text-white">
                  {userList.filter(u => u.role === 'user').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/20">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ...existing code... */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600">Tidak ada user</h3>
              <p className="text-slate-400 mt-1">User belum ditambahkan ke sistem</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-blue-600">
                            {user.full_name?.[0] || user.username?.[0] || 'U'}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-800 truncate">
                              {user.full_name || user.username}
                            </h3>
                            <Badge
                              className={
                                user.role === 'admin_kecamatan'
                                  ? 'bg-blue-100 text-blue-700'
                                  : user.role === 'admin_kelurahan'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-gray-100 text-gray-700'
                              }
                            >
                              {user.role === 'admin_kecamatan' && 'Admin Kecamatan'}
                              {user.role === 'admin_kelurahan' && 'Admin Kelurahan'}
                              {user.role !== 'admin_kecamatan' && user.role !== 'admin_kelurahan' && user.role}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                            {user.username && (
                              <span className="flex items-center gap-1">
                                <UserCheck className="w-3 h-3" />
                                {user.username}
                              </span>
                            )}
                            {user.no_hp && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {user.no_hp}
                              </span>
                            )}
                            {user.kecamatan && (
                              <span className="text-slate-400">
                                {user.kecamatan}{user.kelurahan && `, ${user.kelurahan}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewUser(user)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(user)}
                          className="text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        {user.id !== currentUser?.id && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setDeleteId(user.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                          {/* ...existing code... */}
                          <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-xl">Detail User</DialogTitle>
                              </DialogHeader>
                              {viewUser && (
                                <div className="space-y-4">
                                  <div className="flex flex-col items-center mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow mb-2">
                                      {viewUser.full_name?.[0] || viewUser.username?.[0] || 'U'}
                                    </div>
                                    <div className="text-lg font-bold text-center">{viewUser.full_name || viewUser.username}</div>
                               
                                    <Badge
                                      className={
                                        viewUser.role === 'admin_kecamatan'
                                          ? 'bg-blue-100 text-blue-700'
                                          : viewUser.role === 'admin_kelurahan'
                                          ? 'bg-emerald-100 text-emerald-700'
                                          : 'bg-gray-100 text-gray-700'
                                      }
                                    >
                                      {viewUser.role === 'admin_kecamatan' && 'Admin Kecamatan'}
                                      {viewUser.role === 'admin_kelurahan' && 'Admin Kelurahan'}
                                      {viewUser.role !== 'admin_kecamatan' && viewUser.role !== 'admin_kelurahan' && viewUser.role}
                                    </Badge>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Username</span>
                                      <span className="font-semibold">{viewUser.username || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Email</span>
                                      <span className="font-semibold">{viewUser.email || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">No. HP</span>
                                      <span className="font-semibold">{viewUser.no_hp || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Kecamatan</span>
                                      <span className="font-semibold">{viewUser.kecamatan || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Kelurahan</span>
                                      <span className="font-semibold">{viewUser.kelurahan || '-'}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ...existing code... */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingUser ? 'Edit Data User' : 'Tambah User Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-blue-700 font-bold">Nama Lengkap *</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-blue-700 font-bold">Username *</Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-blue-700 font-bold">{editingUser ? 'Password (kosongkan jika tidak diubah)' : 'Password *'}</Label>
              <Input
                type="password"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingUser ? '********' : '********'}
                required={!editingUser}
                className="tracking-widest font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-blue-700 font-bold">No. HP</Label>
              <Input
                value={formData.no_hp}
                onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-blue-700 font-bold">Kecamatan</Label>
                <Select
                  value={formData.kecamatan}
                  onValueChange={(v) => setFormData({ ...formData, kecamatan: v, kelurahan: '' })}
                >
                  <SelectTrigger className="border-2 border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-300">
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
                <Label className="text-blue-700 font-bold">Kelurahan</Label>
                <Select
                  value={formData.kelurahan}
                  onValueChange={(v) => setFormData({ ...formData, kelurahan: v })}
                >
                  <SelectTrigger className="border-2 border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-300">
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
              <Label className="text-blue-700 font-bold">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData({ ...formData, role: v })}
              >
                <SelectTrigger className="border-2 border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-300">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  // ...existing code...
                  <SelectItem value="admin_kecamatan">Admin Kecamatan</SelectItem>
                  <SelectItem value="admin_kelurahan">Admin Kelurahan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Batal
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={updateMutation.isPending || createMutation.isPending}
              >
                {(updateMutation.isPending || createMutation.isPending) ? 'Menyimpan...' : editingUser ? 'Update' : 'Tambah'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ...existing code... */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. User akan dihapus secara permanen dari sistem.
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