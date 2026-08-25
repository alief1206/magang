import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

const getAspirationImageUrl = (item) => {
  if (!item) return null;
  const path = item.imageUrl || item.compressedImagePath || item.imagePath;
  if (!path) return null;
  return path.startsWith('http') ? path : `http://localhost:5000${path}`;
};

export default function AspirasiWarga() {
  const [activeTab, setActiveTab] = useState('semua');
  const [aspirasiData, setAspirasiData] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newResponse, setNewResponse] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (token) fetchAspirasi();
  }, [token]);

  const getHeaders = () => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const fetchAspirasi = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/aspirations', { headers: getHeaders() });
      if (!res.ok) throw new Error('Gagal memuat data');
      const data = await res.json();
      setAspirasiData(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAspirasiDetail = async (id) => {
    try {
      setDetailLoading(true);
      const res = await fetch(`http://localhost:5000/api/aspirations/${id}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Gagal memuat detail');
      const data = await res.json();
      setSelectedItem(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAddResponse = async (e) => {
    e.preventDefault();
    if (!newResponse.trim() || !selectedItem) return;

    try {
      const res = await fetch(`http://localhost:5000/api/aspirations/${selectedItem.id}/responses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ response: newResponse })
      });
      if (!res.ok) throw new Error('Gagal menambah tanggapan');
      setNewResponse('');
      fetchAspirasiDetail(selectedItem.id);
    } catch (err) {
      console.error(err);
      alert('Gagal menambah tanggapan.');
    }
  };

  const handleChangeStatus = async (e) => {
    if (!selectedItem) return;
    const newStatus = e.target.value;
    
    try {
      setUpdatingStatus(true);
      const res = await fetch(`http://localhost:5000/api/aspirations/${selectedItem.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Gagal mengubah status');
      fetchAspirasiDetail(selectedItem.id);
      fetchAspirasi(); // refresh list
    } catch (err) {
      console.error(err);
      alert('Gagal mengubah status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem || !window.confirm('Apakah Anda yakin ingin menghapus aspirasi ini?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/aspirations/${selectedItem.id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Gagal menghapus aspirasi');
      setSelectedItem(null);
      fetchAspirasi();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus aspirasi.');
    }
  };

  const tabs = ['semua', 'baru', 'diproses', 'ditanggapi', 'selesai', 'ditolak'];

  const getStatusColorName = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'baru': return 'blue';
      case 'diproses': return 'amber';
      case 'ditanggapi': return 'emerald';
      case 'selesai': return 'slate';
      case 'ditolak': return 'red';
      default: return 'slate';
    }
  };

  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'baru': return 'bg-blue-100 text-blue-700';
      case 'diproses': return 'bg-amber-100 text-amber-700';
      case 'ditanggapi': return 'bg-emerald-100 text-emerald-700';
      case 'selesai': return 'bg-slate-100 text-slate-700';
      case 'ditolak': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityBadge = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'tinggi': return 'bg-red-100 text-red-700';
      case 'sedang': return 'bg-amber-100 text-amber-700';
      case 'rendah': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredData = aspirasiData.filter(a => {
    const matchesTab = activeTab === 'semua' || (a.status || '').toLowerCase() === activeTab;
    const searchLower = search.toLowerCase();
    const matchesSearch = (a.name || '').toLowerCase().includes(searchLower) ||
                          (a.shortTitle || '').toLowerCase().includes(searchLower);
    return matchesTab && matchesSearch;
  });

  if (!token) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Silakan login terlebih dahulu.
      </div>
    );
  }

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
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Icon icon="mdi:loading" className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              Tidak ada data yang ditemukan.
            </div>
          ) : (
            filteredData.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={item.id}
                onClick={() => { setSelectedItem(item); fetchAspirasiDetail(item.id); }}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer gap-4"
              >
                <div className="flex items-center gap-4">
                  {getAspirationImageUrl(item) ? (
                    <img src={getAspirationImageUrl(item)} alt={item.shortTitle} className="w-24 h-16 object-cover rounded-xl shrink-0 bg-slate-100" />
                  ) : (
                    <div className="w-24 h-16 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                      <Icon icon="mdi:image-off-outline" className="w-6 h-6 text-slate-300" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-[#112A46] text-[15px] mb-1">{item.shortTitle}</h4>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                      {item.whatsappSenderPhone ? (
                         <span className="flex items-center gap-1"><Icon icon="logos:whatsapp-icon" className="w-3.5 h-3.5" /> {item.whatsappSenderPhone}</span>
                      ) : (
                         <span className="flex items-center gap-1"><Icon icon="mdi:cellphone" className="w-3.5 h-3.5" /> -</span>
                      )}
                      <span className="flex items-center gap-1"><Icon icon="mdi:account" className="w-4 h-4" /> {item.name || 'Anonim'}</span>
                      {item.kelurahanName && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px] font-bold">
                          <Icon icon="mdi:map-marker" className="w-3.5 h-3.5 text-blue-500" /> {item.kelurahanName}
                        </span>
                      )}
                      {item.source === 'whatsapp' && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-[10px] font-bold"><Icon icon="mdi:whatsapp" /> WA</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className={`px-6 py-2 rounded-full text-xs font-bold capitalize ${getStatusBadge(item.status)}`}>
                    {item.status || 'baru'}
                  </div>
                  {item.priority && (
                    <div className={`px-4 py-1 rounded-full text-[10px] font-bold capitalize border ${getPriorityBadge(item.priority).replace('bg-', 'border-').replace('text-', 'text-')}`}>
                      Prioritas: {item.priority}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
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
                        {selectedItem.priority && (
                          <div className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getPriorityBadge(selectedItem.priority)}`}>
                            {selectedItem.priority}
                          </div>
                        )}
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
                            <Icon icon="mdi:account-circle" className="w-4 h-4 text-slate-400" /> {selectedItem.name || 'Anonim'}
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
                      <div className="mb-4">
                         <p className="text-xs text-slate-400 font-medium mb-1">Alamat Lengkap</p>
                         <p className="text-slate-600 font-medium text-sm">
                           {selectedItem.address || '-'}
                         </p>
                      </div>
                      {getAspirationImageUrl(selectedItem) && (
                        <div className="mb-4">
                           <p className="text-xs text-slate-400 font-medium mb-2">Lampiran Foto</p>
                           <a href={getAspirationImageUrl(selectedItem)} target="_blank" rel="noopener noreferrer">
                             <img src={getAspirationImageUrl(selectedItem)} alt="Lampiran" className="max-w-full rounded-xl max-h-64 object-contain bg-slate-100 border border-slate-200" />
                           </a>
                        </div>
                      )}
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
                      <div className="flex items-center gap-4">
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
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl text-sm transition-colors"
                      >
                        <Icon icon="mdi:trash-can-outline" className="w-4 h-4" /> Hapus
                      </button>
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
