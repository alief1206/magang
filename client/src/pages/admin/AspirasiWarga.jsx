import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export default function AspirasiWarga() {
  const [activeTab, setActiveTab] = useState('semua');
  
  const aspirasiData = [
    { id: 1, title: "Laporan Jalan Berlubang", phone: "+62 812345678", name: "Dimas Setya", status: "Diterima", image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=150&h=100" },
    { id: 2, title: "Permohonan Mediasi Tetangga", phone: "+62 812345678", name: "Udin", status: "Diterima", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=150&h=100" },
    { id: 3, title: "Lampu Jalan Mati", phone: "+62 812345678", name: "Awaludin", status: "Diterima", image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&q=80&w=150&h=100" },
    { id: 4, title: "Parkir Liar", phone: "+62 812345678", name: "Komarudin", status: "Diterima", image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=150&h=100" },
    { id: 5, title: "Sampah Menumpuk", phone: "+62 812345678", name: "Jamaludin", status: "Diterima", image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=150&h=100" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#112A46] mb-2">Aspirasi Warga</h1>
        <p className="text-slate-500">Kelola daftar laporan dan aspirasi warga kelurahan.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col flex-1 overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full">
              <Icon icon="mdi:magnify" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari nama, nomor tiket, atau pesan..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
            <button className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors shrink-0">
              <Icon icon="mdi:menu" className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            <button onClick={() => setActiveTab('semua')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'semua' ? 'bg-slate-100 text-[#112A46]' : 'bg-transparent text-slate-500'}`}>
              Semua <span className="bg-white px-2 py-0.5 rounded-md shadow-sm">7</span>
            </button>
            <button onClick={() => setActiveTab('diterima')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'diterima' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-emerald-50 text-emerald-600'}`}>
              Diterima <span className={activeTab === 'diterima' ? 'bg-white/20 px-2 py-0.5 rounded-md' : 'bg-emerald-100 px-2 py-0.5 rounded-md'}>7</span>
            </button>
            <button onClick={() => setActiveTab('ditolak')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'ditolak' ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'bg-red-50 text-red-500'}`}>
              Ditolak <span className={activeTab === 'ditolak' ? 'bg-white/20 px-2 py-0.5 rounded-md' : 'bg-red-100 px-2 py-0.5 rounded-md'}>0</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {aspirasiData.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={item.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer gap-4"
            >
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.title} className="w-24 h-16 object-cover rounded-xl shrink-0" />
                <div>
                  <h4 className="font-bold text-[#112A46] text-[15px] mb-1">{item.title}</h4>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Icon icon="logos:whatsapp-icon" className="w-3.5 h-3.5" /> {item.phone}</span>
                    <span className="flex items-center gap-1"><Icon icon="mdi:account" className="w-4 h-4" /> {item.name}</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-2 rounded-full bg-emerald-500 text-white text-xs font-bold sm:mr-2 self-start sm:self-center">
                {item.status}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}