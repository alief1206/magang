import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function InformasiKelurahan() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Pengumuman',
    date: '',
    description: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [stats, setStats] = useState({
    total_conversations: 0,
    resolved_by_ai: 0,
    forwarded_to_admin: 0,
    forwarded_to_lurah: 0,
    pending_lurah: 0,
    pending_admin: 0
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:5000/api/reports/statistics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInformations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:5000/api/informations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setInformations(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchInformations();
    fetchStats();
    
    // Polling setiap 5 detik
    const intervalId = setInterval(() => {
      fetchInformations();
      fetchStats();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:5000/api/informations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          eventDate: formData.date || null,
          description: formData.description
        })
      });
      const result = await res.json();
      if (result.success) {
        alert(`Berhasil membuat informasi: ${formData.title}`);
        setIsModalOpen(false);
        setFormData({ title: '', type: 'Pengumuman', date: '', description: '' });
        fetchInformations();
      } else {
        alert(result.message || 'Gagal menyimpan informasi');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const [informations, setInformations] = useState([]);

  const getTypeColor = (type) => {
    if (type === 'Agenda') return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (type === 'Program') return 'text-orange-600 bg-orange-50 border-orange-100';
    return 'text-blue-600 bg-blue-50 border-blue-100';
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#112A46] mb-2">Informasi Kelurahan</h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#112A46]">Informasi Masuk</h2>
        <div className="relative">
          <select className="appearance-none bg-white border border-slate-200 text-slate-700 font-medium py-2 pl-4 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm">
            <option>7 hari terakhir</option>
            <option>30 hari terakhir</option>
          </select>
          <Icon icon="mdi:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-2">Total Percakapan</p>
          <h3 className="text-3xl font-extrabold text-[#112A46] mb-2">{stats.total_conversations}</h3>
          <p className="text-xs font-semibold text-emerald-500">Real-time update</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-2">Diselesaikan AI</p>
          <h3 className="text-3xl font-extrabold text-[#112A46] mb-2">{stats.resolved_by_ai}</h3>
          <p className="text-xs font-semibold text-slate-500">Placeholder metrik</p>
        </div>
        <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-2">Diteruskan ke Admin</p>
          <h3 className="text-3xl font-extrabold text-[#112A46] mb-2">{stats.forwarded_to_admin}</h3>
          <p className="text-xs font-semibold text-slate-500">Dari total percakapan</p>
        </div>
        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-2">Diteruskan ke Lurah</p>
          <h3 className="text-3xl font-extrabold text-[#112A46] mb-2">{stats.forwarded_to_lurah}</h3>
          <p className="text-xs font-semibold text-slate-500">Dari total percakapan</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {['Semua', 'Agenda', 'Pengumuman', 'Program'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all border ${activeTab === tab.toLowerCase() ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {tab}
            </button>
          ))}
          <button 
            onClick={() => navigate('/admin/tanya-lurah?tab=perlu_lurah')}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white border border-slate-200 text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors"
          >
            Perlu Lurah 
            {stats.pending_lurah > 0 && (
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-md text-red-600 font-extrabold">{stats.pending_lurah}</span>
            )}
          </button>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#112A46] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shrink-0">
          <Icon icon="mdi:plus" className="w-5 h-5" /> Buat Informasi
        </button>
      </div>

      <div className="space-y-3">
        {informations
          .filter(item => activeTab === 'semua' || (item.type && item.type.toLowerCase() === activeTab))
          .map((item, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={item.id} 
            className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <img src={item.imageUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=150&h=100"} alt={item.title} className="w-20 h-14 object-cover rounded-xl shrink-0" />
              <div>
                <h4 className="font-bold text-[#112A46] text-sm md:text-[15px] mb-1">{item.title}</h4>
                <p className="text-xs font-medium text-slate-500">
                  {item.eventDate 
                    ? new Date(item.eventDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) 
                    : new Date(item.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full border text-xs font-bold sm:mr-4 ${getTypeColor(item.type)}`}>
              {item.type}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
                <h3 className="text-xl font-extrabold text-[#112A46] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Icon icon="mdi:bullhorn-outline" className="w-5 h-5" />
                  </div>
                  Buat Informasi Baru
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Icon icon="mdi:close" className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <form id="info-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Informasi</label>
                      <div className="relative">
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-medium py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
                        >
                          <option value="Pengumuman">Pengumuman</option>
                          <option value="Agenda">Agenda Kelurahan</option>
                          <option value="Program">Program Kelurahan</option>
                        </select>
                        <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal (Opsional)</label>
                      <div className="relative">
                        <Icon icon="mdi:calendar-outline" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-medium py-3 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Judul Informasi</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Masukkan judul informasi..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-medium py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Isi Keterangan</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Tuliskan detail informasi, pengumuman, atau agenda di sini..."
                      rows={5}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-medium py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Unggah Gambar (Opsional)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer group">
                      <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Icon icon="mdi:cloud-upload-outline" className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-600">Klik untuk unggah atau seret file</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG atau WEBP (Maks. 2MB)</p>
                    </div>
                  </div>
                </form>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  form="info-form"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-[#112A46] hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <Icon icon="mdi:check" className="w-5 h-5" /> Simpan & Publikasikan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}