import React from 'react';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/api/authUser'; // pastikan path benar
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/db'; // pastikan path benar
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Users, FileText, BarChart2, User2Icon, Users2, UsersRound } from 'lucide-react';


export default function Dashboard() {


  const [user, setUser] = useState(null);
  useEffect(() => {
    // Ambil user gabungan dari helper
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // Query total pengguna
  const { data: userCount = 0 } = useQuery({
    queryKey: ['user-count'],
    queryFn: async () => {
      const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  // Query total data tanah
  const { data: tanahCount = 0 } = useQuery({
    queryKey: ['tanah-count'],
    queryFn: async () => {
      const { count } = await supabase.from('tanah').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  // Query total laporan bulan ini
  const { data: laporanCount = 0 } = useQuery({
    queryKey: ['laporan-count'],
    queryFn: async () => {
      const firstDay = new Date();
      firstDay.setDate(1);
      firstDay.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from('laporan')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDay.toISOString());
      return count || 0;
    }
  });

  // Query total wilayah
  const { data: wilayahCount = 0 } = useQuery({
    queryKey: ['wilayah-count'],
    queryFn: async () => {
      const { count } = await supabase.from('wilayah').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
         <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src="/Components/img/logo app.png" alt="Logo" className="h-14 w-auto" /> {/* tambahkan baris ini */}
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">SIGATAN Dashboard</h1>
              <p className="text-gray-600">Sistem Informasi Geospasial Pertanahan.</p>
              <p className="text-blue-500" ><User2Icon className="w-4 h-4 inline-block mr-1" />
              {(user && user.full_name ? ` ${user.full_name}` : '') + (user && user.role ? ` (${user.role})` : '')} 
              </p>
            </div>
          </div>          <Button asChild className="mt-4 md:mt-0">
            <Link to="/PetaTanah">
              <Map className="w-5 h-5 mr-2" /> Lihat Peta Tanah
            </Link>
          </Button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Users className="w-5 h-5" /> Pengguna
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
              <div className="text-xs text-gray-500">Total Pengguna</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <FileText className="w-5 h-5" /> Data Tanah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tanahCount}</div>
              <div className="text-xs text-gray-500">Total Data Tanah</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <BarChart2 className="w-5 h-5" /> Laporan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{laporanCount}</div>
              <div className="text-xs text-gray-500">Laporan Bulan Ini</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Map className="w-5 h-5" /> Wilayah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wilayahCount}</div>
              <div className="text-xs text-gray-500">Total Wilayah</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/DataTanah">
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Data Tanah
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600">Kelola dan lihat data pertanahan.</div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/Laporan">
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5" /> Laporan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600">Buat dan unduh laporan pertanahan.</div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/ManajemenUser">
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" /> Manajemen User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600">Kelola akun dan hak akses pengguna.</div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}