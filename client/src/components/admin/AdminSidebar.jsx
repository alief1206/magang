import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function AdminSidebar({ isSidebarOpen }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside 
      className={`fixed lg:relative z-50 inset-y-0 left-0 bg-slate-900 h-full flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
        isSidebarOpen 
          ? 'translate-x-0 w-[280px]' 
          : '-translate-x-full lg:translate-x-0 w-[280px] lg:w-0'
      }`}
    >
      <div className="w-[280px] h-full flex flex-col text-white overflow-y-auto">
        
        <div className="p-8 pt-10">
          <h1 className="text-3xl font-extrabold mb-1 text-white">ASLI</h1>
          <p className="text-sm text-slate-300 leading-snug">
            Asosiasi Lurah Indonesia<br/>Kabupaten Banyuwangi
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-6 pb-8">
          <div>
            <Link 
              to="/admin/dashboard" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${isActive('/admin/dashboard') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10'}`}
            >
              <Icon icon={isActive('/admin/dashboard') ? "mdi:home" : "mdi:home-outline"} className="w-6 h-6" />
              Dashboard
            </Link>
          </div>

          <div>
            <h3 className="px-4 text-[11px] font-bold text-slate-400 tracking-wider mb-2 uppercase">Layanan</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/admin/tanya-lurah" className="flex items-center justify-between px-4 py-3 text-slate-300 hover:bg-white/10 rounded-xl transition-all">
                  <div className="flex items-center gap-3 font-medium">
                    <Icon icon="mdi:message-outline" className="w-6 h-6" /> Tanya Lurah
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/admin/aspirasi" className="flex items-center justify-between px-4 py-3 text-slate-300 hover:bg-white/10 rounded-xl transition-all">
                  <div className="flex items-center gap-3 font-medium">
                    <Icon icon="mdi:bullhorn-outline" className="w-6 h-6" /> Aspirasi Warga
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/admin/informasi" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/10 rounded-xl transition-all font-medium">
                  <Icon icon="mdi:information-outline" className="w-6 h-6" /> Informasi Kelurahan
                </Link>
              </li>
              <li>
                <Link to="/admin/agenda" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/10 rounded-xl transition-all font-medium">
                  <Icon icon="mdi:calendar-outline" className="w-6 h-6" /> Agenda & Pengumuman
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="px-4 text-[11px] font-bold text-slate-400 tracking-wider mb-2 uppercase">Analitik</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/admin/statistik" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/10 rounded-xl transition-all font-medium">
                  <Icon icon="mdi:chart-line" className="w-6 h-6" /> Statistik & Laporan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="px-4 text-[11px] font-bold text-slate-400 tracking-wider mb-2 uppercase">Pengaturan</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/admin/pengaturan-akun" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/10 rounded-xl transition-all font-medium">
                  <Icon icon="mdi:cog-outline" className="w-6 h-6" /> Pengaturan Akun
                </Link>
              </li>
              <li>
                <Link to="/admin/manajemen-pengguna" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/10 rounded-xl transition-all font-medium">
                  <Icon icon="mdi:account-group-outline" className="w-6 h-6" /> Manajemen Pengguna
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-4">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3">
              <Icon icon="mdi:headset" className="w-8 h-8 text-slate-300" />
              <div>
                <h4 className="font-bold text-sm text-white">Butuh Bantuan?</h4>
                <p className="text-xs text-slate-400">Hubungi Super Admin</p>
              </div>
            </div>
            <Icon icon="mdi:chevron-right" className="w-5 h-5 text-slate-400" />
          </div>
        </div>

      </div>
    </aside>
  );
}