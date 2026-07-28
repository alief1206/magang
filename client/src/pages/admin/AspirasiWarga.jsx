import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

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
                placeholder="Cari nama pengirim atau judul laporan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {tabs.map(tab => {
              const count = tab === 'semua'
                ? aspirasiData.length
                : aspirasiData.filter(a => (a.status || '').toLowerCase() === tab).length;

              const colorName = tab === 'semua' ? 'emerald' : getStatusColorName(tab);

              const isActive = activeTab === tab;
              const activeClass = isActive
                ? `bg-${colorName}-500 text-white shadow-md shadow-${colorName}-500/20`
                : (tab === 'semua' ? 'bg-transparent text-slate-500' : `bg-${colorName}-50 text-${colorName}-600`);

              const badgeClass = isActive
                ? 'bg-white/20 px-2 py-0.5 rounded-md text-white'
                : (tab === 'semua' ? 'bg-white px-2 py-0.5 rounded-md shadow-sm text-slate-600' : `bg-${colorName}-100 px-2 py-0.5 rounded-md text-${colorName}-700`);

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all capitalize whitespace-nowrap ${activeClass}`}
                >
                  {tab} <span className={badgeClass}>{count}</span>
                </button>
              );
            })}
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

      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {detailLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Icon icon="mdi:loading" className="w-10 h-10 text-emerald-500 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold capitalize shadow-sm ${getStatusBadge(selectedItem.status)}`}>
                          {selectedItem.status || 'baru'}
                        </div>
                        {selectedItem.source === 'whatsapp' && (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            <Icon icon="mdi:whatsapp" className="w-4 h-4" /> WhatsApp
                          </div>
                        )}
                        <div className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                          {selectedItem.category}
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-[#112A46] mt-3">{selectedItem.shortTitle}</h2>
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                        <Icon icon="mdi:clock-outline" />
                        {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString('id-ID') : '-'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-colors shrink-0"
                    >
                      <Icon icon="mdi:close" className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-slate-50/30">

                    {/* User Info & Description */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-4 pb-4 border-b border-slate-50">
                        <div>
                          <p className="text-xs text-slate-400 font-medium mb-1">Pengirim</p>
                          <p className="font-semibold text-slate-700 flex items-center gap-1">
                            <Icon icon="mdi:account-circle" className="w-4 h-4 text-slate-400" /> {selectedItem.name}
                          </p>
                        </div>
                        {selectedItem.whatsappSenderPhone && (
                          <div>
                            <p className="text-xs text-slate-400 font-medium mb-1">No. WhatsApp</p>
                            <p className="font-semibold text-slate-700 flex items-center gap-1">
                              <Icon icon="mdi:phone" className="w-4 h-4 text-slate-400" /> {selectedItem.whatsappSenderPhone}
                            </p>
                          </div>
                        )}
                        {selectedItem.kelurahanName && (
                          <div>
                            <p className="text-xs text-slate-400 font-medium mb-1">Kelurahan</p>
                            <p className="font-semibold text-slate-700 flex items-center gap-1">
                              <Icon icon="mdi:map-marker" className="w-4 h-4 text-slate-400" /> {selectedItem.kelurahanName}
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium mb-2">Deskripsi Lengkap</p>
                        <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">
                          {selectedItem.description}
                        </p>
                      </div>
                    </div>

                    {/* Responses */}
                    <div>
                      <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Icon icon="mdi:forum" className="w-5 h-5 text-emerald-500" /> Tanggapan ({selectedItem.responses?.length || 0})
                      </h3>
                      <div className="space-y-4">
                        {selectedItem.responses && selectedItem.responses.length > 0 ? (
                          selectedItem.responses.map(resp => (
                            <div key={resp.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                                {resp.responderName ? resp.responderName.charAt(0).toUpperCase() : 'A'}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="font-bold text-sm text-slate-700">
                                    {resp.responderName} <span className="text-xs font-normal text-slate-400 ml-1">({resp.responderRole})</span>
                                  </p>
                                  <span className="text-xs text-slate-400">
                                    {resp.createdAt ? new Date(resp.createdAt).toLocaleString('id-ID') : ''}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 whitespace-pre-wrap">{resp.response}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                            Belum ada tanggapan.
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Actions / Footer */}
                  <div className="p-6 border-t border-slate-100 bg-white space-y-4">
                    <form onSubmit={handleAddResponse} className="flex gap-3">
                      <input
                        type="text"
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                        placeholder="Tulis tanggapan balasan..."
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <button
                        type="submit"
                        disabled={!newResponse.trim()}
                        className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl text-sm disabled:opacity-50 hover:bg-emerald-600 transition-colors flex items-center gap-2"
                      >
                        <Icon icon="mdi:send" className="w-4 h-4" /> Kirim
                      </button>
                    </form>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-sm font-medium text-slate-500">Ubah Status Laporan:</span>
                      <div className="flex items-center gap-2">
                        {updatingStatus && <Icon icon="mdi:loading" className="w-4 h-4 text-emerald-500 animate-spin" />}
                        <select
                          value={selectedItem.status || 'baru'}
                          onChange={handleChangeStatus}
                          disabled={updatingStatus}
                          className={`px-4 py-2 rounded-xl text-sm font-bold border-none cursor-pointer focus:ring-2 focus:ring-offset-2 outline-none ${getStatusBadge(selectedItem.status)}`}
                        >
                          <option value="baru" className="bg-white text-slate-700">Baru</option>
                          <option value="diproses" className="bg-white text-slate-700">Diproses</option>
                          <option value="ditanggapi" className="bg-white text-slate-700">Ditanggapi</option>
                          <option value="selesai" className="bg-white text-slate-700">Selesai</option>
                          <option value="ditolak" className="bg-white text-slate-700">Ditolak</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
