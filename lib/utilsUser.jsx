import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/db';
import { getCurrentUser } from '@/api/authUser';

// Ambil user aktif
export function useCurrentUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  return user;
}

// Ambil data tanah sesuai role user
export function useTanahList(user) {
  return useQuery({
    queryKey: ['tanah-peta', user?.kecamatan, user?.kelurahan, user?.role, user?.nik],
    queryFn: async () => {
      if (!user) return [];
      let query = supabase.from('tanah').select('*');
      if (user.role === 'super_admin') {
        // ...tambahkan logic super_admin jika ada...
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
}

// Ambil data wilayah
export function useWilayahList() {
  return useQuery({
    queryKey: ['wilayah'],
    queryFn: async () => {
      const { data, error } = await supabase.from('wilayah').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    },
  });
}