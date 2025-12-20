import React, { useState, useEffect } from 'react';
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
    role: 'user'
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    andrimamboro.auth.me().then(setCurrentUser);
  }, []);

  const { data: userList = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => andrimamboro.entities.User.list(),
    enabled: !!currentUser,
  });

  const { data: wilayahList = [] } = useQuery({
    queryKey: ['wilayah'],
    queryFn: () => andrimamboro.entities.Wilayah.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => andrimamboro.entities.User.create(data),
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
    mutationFn: ({ id, data }) => andrimamboro.entities.User.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setShowForm(false);
      setEditingUser(null);
      resetForm();
      toast.success('Data user berhasil diperbarui');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => andrimamboro.entities.User.delete(id),
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
      role: 'user'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: formData });
    } else {
      // Tambah password default untuk user baru
      const newUserData = {
        ...formData,
        password: 'user123', // Password default
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

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="p-8 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Akses Ditolak</h2>
          <p className="text-slate-600">Hanya admin yang dapat mengakses halaman ini</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Manajemen User
          </h1>
          <p className="text-slate-500 mt-1">
            Kelola pengguna sistem
          </p>
        </div>
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

      {/* Search */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total User</p>
                <p className="text-2xl font-bold text-slate-800">{userList.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Admin</p>
                <p className="text-2xl font-bold text-slate-800">
                  {userList.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">User Biasa</p>
                <p className="text-2xl font-bold text-slate-800">
                  {userList.filter(u => u.role === 'user').length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <div className="grid gap-4 md:grid-cols-2">
        <AnimatePresence>
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">
                          {user.full_name?.[0] || user.username?.[0] || 'U'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{user.full_name || user.username}</h3>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </div>

                  <div className="space-y-1 mb-4 text-sm text-slate-600">
                    {user.username && (
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-slate-400" />
                        <span>Username: {user.username}</span>
                      </div>
                    )}
                    {user.no_hp && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>{user.no_hp}</span>
                      </div>
                    )}
                    {user.kecamatan && (
                      <div className="text-sm text-slate-500">
                        {user.kecamatan} {user.kelurahan && `- ${user.kelurahan}`}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50"
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
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredUsers.length === 0 && (
          <Card className="border-0 shadow-md md:col-span-2">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600">Tidak ada user</h3>
              <p className="text-slate-400 mt-1">User belum ditambahkan ke sistem</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingUser ? 'Edit Data User' : 'Tambah User Baru'}
            </DialogTitle>
          </DialogHeader>
          
          {!editingUser && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Info:</strong> Untuk menambah user baru, gunakan fitur <strong>Invite User</strong> dari dashboard andrimamboro. 
                Di halaman ini Anda hanya bisa mengedit data user yang sudah ada.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Lengkap *</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Username *</Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>No. HP</Label>
              <Input
                value={formData.no_hp}
                onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kecamatan</Label>
                <Select 
                  value={formData.kecamatan} 
                  onValueChange={(v) => setFormData({ ...formData, kecamatan: v, kelurahan: '' })}
                >
                  <SelectTrigger>
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
                  <SelectTrigger>
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
              <Label>Role *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(v) => setFormData({ ...formData, role: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
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
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Menyimpan...' : editingUser ? 'Update' : 'Tambah'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
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