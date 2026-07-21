import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminHeader({ toggleSidebar }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // MENGUBAH DATA STATIS MENJADI STATE AGAR BISA DIINTERAKSI
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Laporan Baru Masuk", desc: "Budi Santoso melaporkan jalan berlubang.", time: "5 menit lalu", unread: true },
    { id: 2, title: "Tanya Lurah", desc: "Pesan baru dari Siti Aminah menunggu balasan.", time: "1 jam lalu", unread: true },
    { id: 3, title: "Tiket Selesai", desc: "Laporan #1029 telah ditutup oleh Lurah.", time: "Kemarin", unread: false },
  ]);
  
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearchFocused(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate('/admin/login');
  };

  // FUNGSI UNTUK MENSIMULASIKAN BACK-END: TANDAI DIBACA
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  // FUNGSI UNTUK MENSIMULASIKAN PENCARIAN SAAT ENTER DITEKAN
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      alert(`Mencari data global untuk: "${searchQuery}"\n(Nantinya ini akan pindah ke halaman hasil pencarian)`);
      setSearchFocused(false); // Tutup dropdown
    }
  };

  // Menghitung jumlah notifikasi yang belum dibaca
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 z-20 shrink-0">
      
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors flex items-center justify-center">
          <Icon icon="mdi:menu" className="w-7 h-7" />
        </button>
        
        {/* KOLOM PENCARIAN GLOBAL */}
        <div className="hidden md:block relative w-[300px] lg:w-[400px]" ref={searchRef}>
          <Icon icon="mdi:magnify" className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${searchFocused ? 'text-blue-500' : 'text-slate-400'}`} />
          <input 
            type="text" 
            placeholder="Ketik lalu tekan Enter..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onKeyDown={handleSearchSubmit}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
          
          <AnimatePresence>
            {searchFocused && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                className="absolute left-0 top-full mt-2 w-full bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50"
              >
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {searchQuery ? 'Tekan Enter Untuk Mencari' : 'Pencarian Terakhir'}
                  </p>
                  {!searchQuery ? (
                    <>
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-left">
                        <Icon icon="mdi:history" className="w-5 h-5 text-slate-400" /> Budi Santoso
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-left">
                        <Icon icon="mdi:history" className="w-5 h-5 text-slate-400" /> Tiket #TANYA-2405
                      </button>
                    </>
                  ) : (
                    <div className="px-3 py-4 text-center text-sm text-slate-500 font-medium">
                      Mencari: <strong className="text-blue-600">"{searchQuery}"</strong>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        {/* AREA NOTIFIKASI */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2 rounded-xl transition-colors ${isNotifOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
          >
            <Icon icon="mdi:bell-outline" className="w-6 h-6" />
            {/* Titik merah hanya muncul jika unreadCount > 0 */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50"
              >
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <h4 className="font-bold text-[#112A46]">Notifikasi {unreadCount > 0 && `(${unreadCount})`}</h4>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      Tandai semua dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${notif.unread ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 transition-colors ${notif.unread ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                        <div>
                          <h5 className={`text-sm ${notif.unread ? 'font-bold text-[#112A46]' : 'font-semibold text-slate-700'}`}>{notif.title}</h5>
                          <p className="text-[13px] text-slate-500 mt-0.5 leading-relaxed">{notif.desc}</p>
                          <span className="text-xs font-medium text-slate-400 mt-1.5 block">{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-slate-100 text-center">
                  <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Lihat Semua Notifikasi</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AREA PROFIL */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 cursor-pointer select-none p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden border border-blue-200 flex items-center justify-center shrink-0">
               <Icon icon="mdi:account" className="w-6 h-6 text-blue-600"/>
            </div>
            <div className="hidden md:block text-right">
              <h4 className="text-sm font-bold text-slate-800">Admin Kelurahan</h4>
              <p className="text-xs text-slate-500">Kelurahan Kepatihan</p>
            </div>
            <motion.div animate={{ rotate: isProfileOpen ? 180 : 0 }}>
              <Icon icon="mdi:chevron-down" className="w-5 h-5 text-slate-400" />
            </motion.div>
          </div>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-slate-100 md:hidden">
                  <h4 className="text-sm font-bold text-slate-800">Admin Kelurahan</h4>
                  <p className="text-xs text-slate-500">Kelurahan Kepatihan</p>
                </div>
                <div className="p-2 space-y-1">
                  <Link 
                    to="/admin/pengaturan-akun" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <Icon icon="mdi:cog-outline" className="w-5 h-5" /> Pengaturan Akun
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Icon icon="mdi:logout" className="w-5 h-5" /> Keluar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
    </header>
  );
}