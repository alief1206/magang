import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export default function TanyaLurah() {
  const [activeTab, setActiveTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'semua', label: 'Semua', count: 120 },
    { id: 'menunggu_admin', label: 'Menunggu Admin', count: 10 },
    { id: 'perlu_lurah', label: 'Perlu Lurah', count: 7 },
    { id: 'selesai', label: 'Selesai', count: 95 },
  ];

  const messages = [
    { id: 1, name: "Budi Santoso", time: "10:24", preview: "Bagaimana cara mengurus surat domisili?", status: "Menunggu Admin", statusId: "menunggu_admin", avatar: "bg-blue-100 text-blue-600" },
    { id: 2, name: "Dewi Lestari", time: "09:15", preview: "Minta mediasi permasalahan dengan tetangga.", status: "Menunggu Admin", statusId: "menunggu_admin", avatar: "bg-emerald-100 text-emerald-600" },
    { id: 3, name: "Ahmad Fauzi", time: "08:22", preview: "Saya masih belum paham tentang persyaratan KK baru.", status: "Menunggu Admin", statusId: "menunggu_admin", avatar: "bg-amber-100 text-amber-600" },
    { id: 4, name: "Dinda Sari", time: "Kemarin", preview: "Apakah ada program bantuan UMKM tahun ini?", status: "Perlu Lurah", statusId: "perlu_lurah", avatar: "bg-purple-100 text-purple-600" },
    { id: 5, name: "Rudi Hermawan", time: "Kemarin", preview: "Mohon informasi terkait persyaratan KTP elektronik.", status: "Perlu Lurah", statusId: "perlu_lurah", avatar: "bg-pink-100 text-pink-600" },
    { id: 6, name: "Joko Tole", time: "Kemarin", preview: "Mohon informasi terkait dokumen penceraian.", status: "Perlu Lurah", statusId: "perlu_lurah", avatar: "bg-orange-100 text-orange-600" },
  ];

  const filteredMessages = messages.filter(msg => {
    const matchesTab = activeTab === 'semua' || msg.statusId === activeTab;
    const matchesSearch = msg.name.toLowerCase().includes(searchQuery.toLowerCase()) || msg.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Menunggu Admin': return 'text-red-600 bg-red-50 border-red-100';
      case 'Perlu Lurah': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Selesai': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col h-full">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#112A46] mb-2">Tanya Lurah</h1>
        <p className="text-slate-500">Kelola dan balas pertanyaan warga dengan cepat.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col flex-1 overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:max-w-md">
              <Icon icon="mdi:magnify" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari nama, nomor tiket, atau pesan..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors font-medium text-sm shrink-0">
              <Icon icon="mdi:filter-variant" className="w-5 h-5" /> Filter Lanjutan
            </button>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#112A46] text-white shadow-md' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-3">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={msg.id} 
                className="group flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${msg.avatar}`}>
                    {msg.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-extrabold text-[#112A46] text-[16px] group-hover:text-blue-600 transition-colors truncate">{msg.name}</h4>
                      <span className="text-xs font-medium text-slate-400">{msg.time}</span>
                    </div>
                    <p className="text-[14px] text-slate-600 truncate">{msg.preview}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 shrink-0 pl-16 md:pl-0">
                  <div className={`px-4 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap ${getStatusStyle(msg.status)}`}>
                    {msg.status}
                  </div>
                  <Icon icon="mdi:chevron-right" className="w-6 h-6 text-slate-300 group-hover:text-blue-500 transition-colors hidden md:block" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Icon icon="mdi:inbox-outline" className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-[#112A46] mb-1">Tidak ada pesan</h3>
              <p className="text-slate-500 text-sm">Coba ubah filter atau kata kunci pencarian.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white text-sm text-slate-500">
          <p>Menampilkan 1 - {filteredMessages.length} dari total percakapan</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"><Icon icon="mdi:chevron-left" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-blue-500 bg-blue-50 text-blue-600 font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"><Icon icon="mdi:chevron-right" /></button>
          </div>
        </div>

      </div>
    </div>
  );
}