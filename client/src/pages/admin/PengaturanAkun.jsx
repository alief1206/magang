import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PengaturanAkun() {
  const [activeTab, setActiveTab] = useState('profil');
  const [formData, setFormData] = useState({
    nama: '',
    instansi: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('adminUser') || '{}');
      if (u) {
        setFormData({
          nama: u.name || (u.role === 'lurah' ? `Lurah ${u.kelurahanName || ''}` : `Admin ${u.kelurahanName || ''}`),
          instansi: u.kelurahanName ? `Kelurahan ${u.kelurahanName}` : (u.role === 'lurah' ? 'Kelurahan' : 'Admin Kelurahan'),
          email: u.email ? (u.email.includes('@') ? u.email : `${u.email}@banyuwangikab.go.id`) : '',
          phone: u.phone || '081234567890',
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      const u = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const updated = {
        ...u,
        name: formData.nama,
        email: formData.email,
        phone: formData.phone,
      };
      localStorage.setItem('adminUser', JSON.stringify(updated));
      alert('Informasi profil berhasil diperbarui!');
    } catch (err) {
      console.error(err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      className="p-4 md:p-8 w-full min-h-full flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#112A46] mb-2">Pengaturan</h1>
        <p className="text-slate-500 text-[15px]">Kelola informasi profil, preferensi, dan keamanan akun Anda.</p>
      </div>

      {/* Layout 2 Kolom (Sidebar Kiri & Konten Kanan) */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* Kolom Kiri: Navigasi Menu */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="flex lg:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
            <button 
              onClick={() => setActiveTab('profil')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap lg:w-full text-left ${
                activeTab === 'profil' 
                  ? 'bg-[#112A46] text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-[#112A46]'
              }`}
            >
              <Icon icon="mdi:account-outline" className="w-5 h-5" /> Profil Admin
            </button>
            <button 
              onClick={() => setActiveTab('keamanan')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap lg:w-full text-left ${
                activeTab === 'keamanan' 
                  ? 'bg-[#112A46] text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-[#112A46]'
              }`}
            >
              <Icon icon="mdi:shield-check-outline" className="w-5 h-5" /> Keamanan & Sandi
            </button>
            <button 
              onClick={() => setActiveTab('notifikasi')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap lg:w-full text-left ${
                activeTab === 'notifikasi' 
                  ? 'bg-[#112A46] text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-[#112A46]'
              }`}
            >
              <Icon icon="mdi:bell-outline" className="w-5 h-5" /> Preferensi Notifikasi
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Area Konten Form */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
          <AnimatePresence mode="wait">
            
            {activeTab === 'profil' && (
              <motion.div 
                key="profil"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-6 md:p-10 space-y-10"
              >
                {/* Bagian Foto Profil */}
                <div>
                  <h3 className="text-lg font-extrabold text-[#112A46] mb-1">Foto Profil</h3>
                  <p className="text-sm text-slate-500 mb-6">Gambar ini akan ditampilkan kepada warga saat Anda membalas pesan.</p>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                        <Icon icon="mdi:account" className="w-12 h-12" />
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icon icon="mdi:camera-outline" className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-5 py-2.5 bg-blue-50 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-100 transition-colors shadow-sm">
                        Unggah Foto Baru
                      </button>
                      <button className="px-5 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 font-bold text-sm rounded-xl transition-colors">
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Bagian Informasi Dasar */}
                <div>
                  <h3 className="text-lg font-extrabold text-[#112A46] mb-6">Informasi Dasar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="block text-sm font-bold text-[#112A46] mb-2.5">Nama Lengkap</label>
                      <input 
                        type="text" 
                        value={formData.nama} 
                        onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))} 
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#112A46] mb-2.5">Instansi / Unit Kerja</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={formData.instansi} 
                          disabled 
                          className="w-full pl-10 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed" 
                        />
                        <Icon icon="mdi:domain" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#112A46] mb-2.5">Email Dinas</label>
                      <div className="relative">
                        <input 
                          type="email" 
                          value={formData.email} 
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} 
                          className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        />
                        <Icon icon="mdi:email-outline" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#112A46] mb-2.5">Nomor WhatsApp</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={formData.phone} 
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} 
                          className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        />
                        <Icon icon="mdi:phone-outline" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleSaveProfile}
                    className="px-8 py-3.5 bg-[#112A46] hover:bg-blue-900 text-white font-bold rounded-xl shadow-md shadow-[#112A46]/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Icon icon="mdi:content-save-outline" className="w-5 h-5" /> Simpan Perubahan
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'keamanan' && (
              <motion.div 
                key="keamanan"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-6 md:p-10 space-y-10"
              >
                <div>
                  <h3 className="text-lg font-extrabold text-[#112A46] mb-1">Ubah Kata Sandi</h3>
                  <p className="text-sm text-slate-500 mb-8">Pastikan akun Anda menggunakan kata sandi panjang dan acak agar tetap aman.</p>
                  
                  <div className="max-w-xl space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-[#112A46] mb-2.5">Kata Sandi Saat Ini</label>
                      <div className="relative">
                        <input type="password" placeholder="Masukkan kata sandi lama" className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                          <Icon icon="mdi:eye-outline" className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <hr className="border-slate-100" />

                    <div>
                      <label className="block text-sm font-bold text-[#112A46] mb-2.5">Kata Sandi Baru</label>
                      <div className="relative">
                        <input type="password" placeholder="Sandi baru" className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                          <Icon icon="mdi:eye-outline" className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="mt-3 flex flex-col gap-1.5 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1.5 text-emerald-600"><Icon icon="mdi:check-circle" /> Minimal 8 karakter</span>
                        <span className="flex items-center gap-1.5 text-slate-400"><Icon icon="mdi:circle-outline" /> Mengandung angka atau simbol</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#112A46] mb-2.5">Konfirmasi Kata Sandi Baru</label>
                      <div className="relative">
                        <input type="password" placeholder="Ulangi sandi baru" className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                          <Icon icon="mdi:eye-outline" className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-start">
                  <button className="px-8 py-3.5 bg-[#112A46] hover:bg-blue-900 text-white font-bold rounded-xl shadow-md shadow-[#112A46]/20 transition-all active:scale-95">
                    Perbarui Kata Sandi
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifikasi' && (
              <motion.div 
                key="notifikasi"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[400px] text-center"
              >
                <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                  <Icon icon="mdi:bell-cog-outline" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-[#112A46] mb-2">Preferensi Notifikasi</h3>
                <p className="text-slate-500 max-w-sm">Pengaturan notifikasi email dan pop-up sedang dalam pengembangan.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}