import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek user di localStorage (hasil login)
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      setLoading(false);
      return;
    }
    try {
      const userObj = JSON.parse(userStr);
      setUser(userObj);
      setLoading(false);
    } catch (e) {
      localStorage.removeItem('user');
      navigate('/login');
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />
      <Sidebar 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        user={user}
        onLogout={handleLogout}
      />
      <main 
        className={cn(
          "transition-all duration-300 min-h-screen",
          collapsed ? "lg:ml-20" : "lg:ml-72"
        )}
      >
        <div className="p-4 md:p-6 lg:p-8 pt-16 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
