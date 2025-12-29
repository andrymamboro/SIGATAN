// Contoh: ambil data dari tabel 'Tanah'
// const { data, error } = await supabase.from('Tanah').select('*');

import { useState, useEffect, lazy, Suspense } from 'react';
const Card = lazy(() => import('@/components/ui/card').then(m => ({ default: m.Card })));
const CardContent = lazy(() => import('@/components/ui/card').then(m => ({ default: m.CardContent })));
const Button = lazy(() => import('@/components/ui/button').then(m => ({ default: m.Button })));
const TanahForm = lazy(() => import('@/components/forms/TanahForm'));

import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/api/db';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function FormTanah() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tanahId = searchParams.get('id');
  const [user, setUser] = useState(undefined); // undefined: loading, null: not logged in
  
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


  const {
    data: tanahList = [],
    isLoading: tanahLoading,
    isFetching: tanahFetching
  } = useQuery({
    queryKey: ['tanah'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tanah').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: user !== undefined && !!user,
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

  if (user === undefined) {
    // User is still loading
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span className="text-white">Memuat user...</span>
      </div>
    );
  }
  if ((tanahId && tanahLoading) || (tanahId && !editingTanah && !tanahLoading && tanahList.length > 0)) {
    // Show loading if fetching tanah for edit, or if id is present but not found yet
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span className="text-white">Memuat data tanah...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-1xl font-bold text-white">
            {editingTanah ? 'Edit Data Tanah' : 'Tambah Data Tanah Baru'}
          </h1>
          <p className="text-white text-sm mt-0">
            {editingTanah ? 'Perbarui informasi data tanah' : 'Tambahkan data tanah baru ke sistem'}
          </p>
        </div>
         <Suspense fallback={<span>...</span>}>
           <Button
            className="text-white"
             variant="outline"
             onClick={() => navigate('/datatanah')}
           >
             <ArrowLeft className="w-4 h-4 mr-2" />
             Kembali
           </Button>
         </Suspense>
      </div>

      {/* Form */}
       <Suspense fallback={<div>Memuat form...</div>}>
         <Card className="border-0 shadow-md">
           <CardContent className="p-6">
             <TanahForm 
               tanah={editingTanah}
               onSubmit={handleSubmit}
               isLoading={createMutation.isPending || updateMutation.isPending}
               wilayahList={wilayahList}
               allTanahData={tanahList}
               mapCenter={editingTanah && editingTanah.latitude && editingTanah.longitude ? [editingTanah.latitude, editingTanah.longitude] : undefined}
               mapZoom={editingTanah ? 18 : undefined}
             />
           </CardContent>
         </Card>
       </Suspense>
    </div>
  );
}
