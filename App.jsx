import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Layout from './Layout';

// Pages
import Dashboard from './Pages/Dashboard';
import DataTanah from './Pages/DataTanah';
import DetailTanah from './Pages/DetailTanah';
import FormTanah from './Pages/FormTanah';
import PetaTanah from './Pages/PetaTanah';
import Pejabat from './Pages/Pejabat';
import Laporan from './Pages/Laporan';
import ManajemenUser from './Pages/ManajemenUser';
import BackupRestore from './Pages/BackupRestore';
import Login from './Pages/Login';
import Test from './Pages/Test';
import Wilayah from './Pages/Wilayah';
import UserProfile from './Pages/UserProfile';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          {/* Test route */}
          <Route path="/test" element={<Test />} />
          
          {/* Login route without layout */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes with layout */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<Layout currentPageName="Dashboard"><Dashboard /></Layout>} />
          <Route path="/datatanah" element={<Layout currentPageName="Data Tanah"><DataTanah /></Layout>} />
          <Route path="/formtanah" element={<Layout currentPageName="Form Tanah"><FormTanah /></Layout>} />
          <Route path="/detailtanah" element={<Layout currentPageName="Detail Tanah"><DetailTanah /></Layout>} />
          <Route path="/petatanah" element={<Layout currentPageName="Peta Tanah"><PetaTanah /></Layout>} />
          <Route path="/pejabat" element={<Layout currentPageName="Pejabat"><Pejabat /></Layout>} />
          <Route path="/laporan" element={<Layout currentPageName="Laporan"><Laporan /></Layout>} />
          <Route path="/manajemenuser" element={<Layout currentPageName="Manajemen User"><ManajemenUser /></Layout>} />
          <Route path="/backuprestore" element={<Layout currentPageName="Backup & Restore"><BackupRestore /></Layout>} />
          <Route path="/wilayah" element={<Layout currentPageName="Wilayah"><Wilayah /></Layout>} />
           <Route path="/profil" element={<Layout currentPageName="Profil Pengguna"><UserProfile /></Layout>} />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
