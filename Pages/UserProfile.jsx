import React, { useEffect, useState } from 'react';

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        setUser(null);
      }
    }
  }, []);


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-slate-100">
        <div className="bg-grey rounded-2xl shadow-2xl p-10 border max-w-md w-full flex flex-col items-center">
          <div className="text-5xl mb-4">🔒</div>
          <div className="text-xl font-bold mb-2 text-center text-white">Akses Ditolak</div>
          <div className="text-white text-center mb-4">Data user tidak ditemukan atau Anda belum login.<br/>Silakan login untuk mengakses halaman profil.</div>
          <a
            href="/login"
            className="mt-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Login Sekarang
          </a>
        </div>
      </div>
    );
  }

  // ...existing code...
  

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-grey-100 p-6">
      <div className="w-full max-w-lg bg-grey rounded-2xl shadow-xl p-8 border border-slate-200">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4 border border-white ">
            {user.full_name?.[0] || user.username?.[0] || 'U'}
          </div>
          <h1 className=" text-white text-2xl font-bold mb-1">{user.full_name || user.username}</h1>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold capitalize mb-2">{user.role}</span>
        </div>
        <div className="space-y-4 divide-y divide-slate-100">
          <div className="flex justify-between pt-2">
            <span className="text-white text-sm">User Name</span>
            <span className="text-white font-semibold">{user.username || '-'}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-white text-sm">Email</span>
            <span className="text-white font-semibold">{user.email || '-'}</span>
          </div>
          {user.kecamatan && (
            <div className="flex justify-between pt-2">
              <span className="text-white text-sm">Kecamatan</span>
              <span className="text-white font-semibold">{user.kecamatan}</span>
            </div>
          )}
          {user.kelurahan && (
            <div className="flex justify-between pt-2">
              <span className="text-white text-sm">Kelurahan</span>
              <span className="font-semibold">{user.kelurahan}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
