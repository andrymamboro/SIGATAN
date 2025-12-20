import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  LayoutDashboard, 
  Map, 
  FileText, 
  Users, 
  ClipboardList,
  LogOut,
  ChevronLeft,
  Menu,
  Home,
  Flag,
  UserCircle,
  BookOpen,
  Globe,
  UserCog
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Custom SVG icon for Tanah (Field)
const TanahIcon = (props) => (
  <svg width="22" height="22" viewBox="0 0 32 32" fill="none" {...props}>
    <rect x="4" y="20" width="24" height="8" fill="#a3e635" stroke="#65a30d" strokeWidth="2"/>
    <rect x="8" y="12" width="16" height="8" fill="#fde68a" stroke="#f59e42" strokeWidth="2"/>
    <rect x="12" y="6" width="8" height="6" fill="#fbbf24" stroke="#b45309" strokeWidth="2"/>
  </svg>
);
// Custom SVG icon for Map/Globe
const GlobeIcon = (props) => (
  <svg width="22" height="22" viewBox="0 0 32 32" fill="none" {...props}>
    <rect x="4" y="8" width="8" height="20" fill="#fbbf24" stroke="#b45309" strokeWidth="2"/>
    <rect x="12" y="4" width="8" height="24" fill="#2563eb" stroke="#1e40af" strokeWidth="2"/>
    <rect x="20" y="8" width="8" height="20" fill="#22c55e" stroke="#166534" strokeWidth="2"/>
  </svg>
);
const menuItems = [
  { name: 'Dashboard', icon: (props) => <LayoutDashboard {...props} color="#38bdf8" />, page: 'Dashboard' },
  { name: 'Peta Tanah', icon: (props) => <Flag {...props} color="#f59e42" />, page: 'PetaTanah' },
  { name: 'Data Tanah', icon: (props) => <TanahIcon {...props} />, page: 'DataTanah' },
  { name: 'Pejabat', icon: (props) => <UserCircle {...props} color="#fbbf24" />, page: 'Pejabat' },
  { name: 'Laporan', icon: (props) => <BookOpen {...props} color="#a3e635" />, page: 'Laporan' },
  { name: 'Wilayah', icon: (props) => <GlobeIcon {...props} />, page: 'Wilayah' },
  { name: 'Profil', icon: (props) => <Users {...props} color="#818cf8" />, page: 'Profil' },
  { name: 'Manajemen User', icon: (props) => <UserCog {...props} color="#f87171" />, page: 'ManajemenUser', superAdminOnly: true },
];

export default function Sidebar({ collapsed, setCollapsed, user, onLogout }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white transition-all duration-300 shadow-2xl",
          collapsed ? "w-0 lg:w-20" : "w-72"
        )}
      >
        <div className={cn("flex flex-col h-full", collapsed && "hidden lg:flex")}>
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-blue-800/50">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img 
                  src="/Components/img/logo app.png" 
                  alt="Logo" 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-white">SIGATAN</h1>
                  <p className="text-xs text-slate-400">Sistem Informasi Geospasial Pertanahan</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <ChevronLeft className={cn("w-5 h-5 transition-transform", collapsed && "rotate-180")} />
            </Button>
          </div>

          {/* User info */}
          {!collapsed && user && (
            <div className="p-4 border-b border-blue-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold">{user.full_name?.[0] || 'U'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.full_name || user?.username}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.kecamatan && user?.kelurahan}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              if (item.superAdminOnly && user?.role !== 'super_admin') return null;
              const isActive = location.pathname.includes(item.page);
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50" 
                      : "text-slate-300 hover:bg-blue-700/30 hover:text-white"
                  )}
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-white/10 to-blue-900/30 shadow-inner">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                  </span>
                  {!collapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-blue-800/50">
            <Button
              variant="ghost"
              onClick={onLogout}
              className={cn(
                "w-full text-slate-300 hover:text-white hover:bg-red-600/30 transition-all duration-200",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span className="ml-3">Keluar</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(false)}
        className="fixed top-4 left-4 z-40 lg:hidden bg-blue-900 text-white hover:bg-blue-800 shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </Button>
    </>
  );
}