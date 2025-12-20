// Contoh: ambil data dari tabel 'Tanah'
// const { data, error } = await supabase.from('Tanah').select('*');
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/api/db';
import { getCurrentUser } from '@/api/authUser';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import TanahForm from '@/components/forms/TanahForm';
import { toast } from 'sonner';

export default function FormTanah() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tanahId = searchParams.get('id');
  const [user, setUser] = useState(null);
  
  const queryClient = useQueryClient();

  useEffect(() => {
    // Ambil user dari localStorage (hasil login)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const { data: tanahList = [] } = useQuery({
    queryKey: ['tanah'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tanah').select('*');
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

  const editingTanah = tanahId ? tanahList.find(t => String(t.id) === String(tanahId)) : null;

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Buat payload hanya field yang valid
      const payload = {
        ...data,
        created_by: user?.username || user?.full_name || null,
      };
      const { error } = await supabase.from('tanah').insert([payload]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tanah']);
      toast.success('Data tanah berhasil ditambahkan');
      navigate('/datatanah');
    },
    onError: (error) => {
      toast.error('Gagal menyimpan data: ' + (error.message || error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      // Pastikan id tidak dikirim ke payload
      const { id: _id, ...dataWithoutId } = data || {};
      const payload = {
        ...dataWithoutId,
        updated_by: user?.username || user?.full_name || null,
      };
      const { error } = await supabase.from('tanah').update(payload).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tanah']);
      toast.success('Data tanah berhasil diperbarui');
      navigate('/datatanah');
    },
    onError: (error) => {
      toast.error('Gagal update data: ' + (error.message || error));
    },
  });

  const handleSubmit = (data) => {
    if (editingTanah) {
      updateMutation.mutate({ id: editingTanah.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {editingTanah ? 'Edit Data Tanah' : 'Tambah Data Tanah Baru'}
          </h1>
          <p className="text-slate-500 mt-1">
            {editingTanah ? 'Perbarui informasi data tanah' : 'Tambahkan data tanah baru ke sistem'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/datatanah')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>

      {/* Form */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <TanahForm 
            tanah={editingTanah}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
            wilayahList={wilayahList}
            allTanahData={tanahList}
          />
        </CardContent>
      </Card>
    </div>
  );
}
