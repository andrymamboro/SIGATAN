import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Layout from './Layout';

// Pages
const Dashboard = React.lazy(() => import('./Pages/Dashboard'));
const DataTanah = React.lazy(() => import('./Pages/DataTanah'));
const DetailTanah = React.lazy(() => import('./Pages/DetailTanah'));
const FormTanah = React.lazy(() => import('./Pages/FormTanah'));
const PetaTanah = React.lazy(() => import('./Pages/PetaTanah'));
const Pejabat = React.lazy(() => import('./Pages/Pejabat'));
const Laporan = React.lazy(() => import('./Pages/Laporan'));
const ManajemenUser = React.lazy(() => import('./Pages/ManajemenUser'));
const BackupRestore = React.lazy(() => import('./Pages/BackupRestore'));
const Login = React.lazy(() => import('./Pages/Login'));
const Test = React.lazy(() => import('./Pages/Test'));
const Wilayah = React.lazy(() => import('./Pages/Wilayah'));
const UserProfile = React.lazy(() => import('./Pages/UserProfile'));

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
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
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
        </React.Suspense>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
