import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export default function DashboardAdmin() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const recentMessages = [
    { id: 1, name: "Budi Santoso", time: "10:24", message: "Bagaimana cara mengurus surat domisili?", status: "Menunggu Admin", statusColor: "text-red-600 bg-red-50", avatarColor: "bg-blue-100 text-blue-600" },
    { id: 2, name: "Siti Aminah", time: "09:57", message: "Mohon informasi terkait persyaratan KTP elektronik.", status: "Perlu Lurah", statusColor: "text-amber-600 bg-amber-50", avatarColor: "bg-emerald-100 text-emerald-600" },
    { id: 3, name: "Rudi Hermawan", time: "09:34", message: "Apakah ada program bantuan UMKM tahun ini?", status: "Selesai", statusColor: "text-emerald-600 bg-emerald-50", avatarColor: "bg-purple-100 text-purple-600" },
    { id: 4, name: "Mega Putri", time: "09:15", message: "Lampu jalan di RT.02 mati, mohon ditindaklanjuti.", status: "Perlu Lurah", statusColor: "text-amber-600 bg-amber-50", avatarColor: "bg-pink-100 text-pink-600" },
    { id: 5, name: "Ahmad Fauzi", time: "09:02", message: "Minta mediasi permasalahan dengan tetangga.", status: "Menunggu Admin", statusColor: "text-red-600 bg-red-50", avatarColor: "bg-orange-100 text-orange-600" },
  ];

  return (
    <motion.div 
      className="p-4 md:p-8 max-w-[1600px] mx-auto w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-[#112A46] mb-2 tracking-tight">
          Selamat Datang, Admin Kelurahan
        </h1>
        <p className="text-slate-500 text-[15px] lg:text-base">
          Pusat kendali Anda untuk merespons warga dan mengelola informasi kelurahan hari ini.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Icon icon="mdi:message-text-outline" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 mb-0.5">Total Tiket Masuk</p>
              <h3 className="text-2xl font-extrabold text-[#112A46]">120</h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg">
            <Icon icon="mdi:trending-up" className="w-4 h-4" /> +18 hari ini
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Icon icon="mdi:alert-circle-outline" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 mb-0.5">Menunggu Admin</p>
              <h3 className="text-2xl font-extrabold text-[#112A46]">18</h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 w-fit px-2.5 py-1 rounded-lg">
            <Icon icon="mdi:clock-alert-outline" className="w-4 h-4" /> Perlu respons segera
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Icon icon="mdi:account-tie" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 mb-0.5">Diteruskan ke Lurah</p>
              <h3 className="text-2xl font-extrabold text-[#112A46]">7</h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 w-fit px-2.5 py-1 rounded-lg">
            <Icon icon="mdi:timer-sand" className="w-4 h-4" /> Menunggu tindak lanjut
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Icon icon="mdi:check-circle-outline" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 mb-0.5">Tiket Selesai</p>
              <h3 className="text-2xl font-extrabold text-[#112A46]">95</h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 w-fit px-2.5 py-1 rounded-lg">
            <Icon icon="mdi:calendar-check" className="w-4 h-4" /> Sepanjang bulan ini
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-extrabold text-[#112A46] mb-1">Butuh Respons Segera</h3>
                <p className="text-sm text-slate-500">Percakapan dan aspirasi terbaru dari warga.</p>
              </div>
              <Link to="/admin/tanya-lurah" className="hidden sm:flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors">
                Lihat Semua <Icon icon="mdi:arrow-right" className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${msg.avatarColor}`}>
                      {msg.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-[#112A46] text-[15px] group-hover:text-blue-600 transition-colors">{msg.name}</h4>
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{msg.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-1">{msg.message}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 sm:self-center self-start ${msg.statusColor}`}>
                    {msg.status}
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 sm:hidden py-3 bg-blue-50 text-blue-600 font-bold rounded-xl text-sm">
              Lihat Semua Percakapan
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="xl:col-span-1 space-y-8">
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <h3 className="text-xl font-extrabold text-[#112A46] mb-6">Aksi Cepat</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center gap-3 p-4 bg-[#F0F6FF] text-blue-700 rounded-2xl hover:bg-blue-600 hover:text-white transition-all group">
                <Icon icon="mdi:bullhorn-outline" className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-center">Buat<br/>Pengumuman</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-3 p-4 bg-[#F0FDF4] text-emerald-700 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all group">
                <Icon icon="mdi:calendar-plus" className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-center">Tambah<br/>Agenda</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-3 p-4 bg-[#FFFbeb] text-amber-700 rounded-2xl hover:bg-amber-500 hover:text-white transition-all group">
                <Icon icon="mdi:account-multiple-plus-outline" className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-center">Data<br/>Warga Baru</span>
              </button>
              <Link to="/admin/statistik" className="flex flex-col items-center justify-center gap-3 p-4 bg-[#F8FAFC] text-slate-600 rounded-2xl hover:bg-slate-800 hover:text-white transition-all group">
                <Icon icon="mdi:file-chart-outline" className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-center">Cetak<br/>Laporan</span>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-[#112A46]">Agenda Terdekat</h3>
              <button className="text-slate-400 hover:text-blue-600"><Icon icon="mdi:dots-horizontal" className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-5">
              <div className="flex gap-4 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span className="text-xs font-bold text-blue-600 group-hover:text-blue-100 uppercase">Ags</span>
                  <span className="text-lg font-extrabold text-[#112A46] group-hover:text-white leading-none">15</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#112A46] text-[15px] mb-1 group-hover:text-blue-600 transition-colors">Rapat Musrenbangdes</h4>
                  <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Icon icon="mdi:clock-outline" /> 09:00 - Selesai
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <span className="text-xs font-bold text-emerald-600 group-hover:text-emerald-100 uppercase">Ags</span>
                  <span className="text-lg font-extrabold text-[#112A46] group-hover:text-white leading-none">17</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#112A46] text-[15px] mb-1 group-hover:text-emerald-600 transition-colors">Upacara & Lomba Warga</h4>
                  <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Icon icon="mdi:clock-outline" /> 07:00 - Selesai
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 font-bold rounded-xl text-sm transition-colors">
              Lihat Kalender Agenda
            </button>
          </div>

        </motion.div>
      </div>

    </motion.div>
  );
}