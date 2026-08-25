import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Pengumuman',
    date: '',
    description: '',
  });

  const handleOpenModal = (type) => {
    setFormData((prev) => ({ ...prev, type }));
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Berhasil membuat ${formData.type.toLowerCase()}: ${formData.title}`);
    setIsModalOpen(false);
    setFormData({ title: '', type: 'Pengumuman', date: '', description: '' });
  };

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

  const [dashboardData, setDashboardData] = useState({
    stats: {
      total: 0,
      waiting: 0,
      forwarded: 0,
      completed: 0,
    },
    recentTickets: [],
    agendas: [],
    aspirations: [],
    categoryStats: [],
    loading: true
  });

  const token = localStorage.getItem('adminToken');

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      try {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [chatsRes, aspirationsRes, statsRes, infoRes] = await Promise.all([
          fetch('http://localhost:5000/api/chats', { headers }),
          fetch('http://localhost:5000/api/aspirations', { headers }),
          fetch('http://localhost:5000/api/reports/statistics', { headers }),
          fetch('http://localhost:5000/api/informations', { headers })
        ]);

        const chatsData = chatsRes.ok ? await chatsRes.json() : { data: [] };
        const aspirationsData = aspirationsRes.ok ? await aspirationsRes.json() : { data: [] };
        const statsData = statsRes.ok ? await statsRes.json() : { data: {} };
        const infoData = infoRes.ok ? await infoRes.json() : { data: [] };

        const chats = chatsData.data || [];
        const aspirations = aspirationsData.data || [];
        const reportStats = statsData.data || {};
        const informations = infoData.data || [];

        const agendas = informations
          .filter(info => info.type === 'Agenda')
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
          .filter(a => new Date(a.eventDate) >= new Date().setHours(0,0,0,0));

        let total = reportStats.total_tickets || 0;
        let waiting = reportStats.waiting_tickets || 0;
        let forwarded = reportStats.forwarded_to_lurah || 0;
        let completed = reportStats.completed_tickets || 0;

        const combined = [];

        chats.forEach(c => {
          let chatStatusLabel = '';
          let chatStatusColor = '';
          if (c.status === 'waiting_response') {
            chatStatusLabel = 'Menunggu Respon';
            chatStatusColor = 'text-red-600 bg-red-50';
          } else if (c.status === 'answered') {
            chatStatusLabel = 'Sudah Dijawab';
            chatStatusColor = 'text-emerald-600 bg-emerald-50';
          } else if (c.status === 'closed') {
            chatStatusLabel = 'Ditutup';
            chatStatusColor = 'text-slate-600 bg-slate-50';
          } else {
            chatStatusLabel = c.status || 'Menunggu Respon';
            chatStatusColor = 'text-slate-600 bg-slate-50';
          }

          combined.push({
            id: `chat-${c.id}`,
            name: c.citizenName || 'Anonim',
            time: new Date(c.createdAt || c.lastMessageAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            date: new Date(c.createdAt || c.lastMessageAt),
            message: c.subject || 'Tanya Lurah - Pesan Baru',
            status: chatStatusLabel,
            type: 'Tanya Lurah',
            statusColor: chatStatusColor,
            avatarColor: 'bg-blue-100 text-blue-600'
          });
        });

        aspirations.forEach(a => {
          
          let aspStatusLabel = '';
          let aspStatusColor = '';
          switch ((a.status || '').toLowerCase()) {
            case 'baru':
              aspStatusLabel = 'Baru';
              aspStatusColor = 'bg-blue-100 text-blue-700';
              break;
            case 'diproses':
              aspStatusLabel = 'Diproses';
              aspStatusColor = 'bg-amber-100 text-amber-700';
              break;
            case 'ditanggapi':
              aspStatusLabel = 'Ditanggapi';
              aspStatusColor = 'bg-emerald-100 text-emerald-700';
              break;
            case 'selesai':
              aspStatusLabel = 'Selesai';
              aspStatusColor = 'bg-slate-100 text-slate-700';
              break;
            case 'ditolak':
              aspStatusLabel = 'Ditolak';
              aspStatusColor = 'bg-red-100 text-red-700';
              break;
            default:
              aspStatusLabel = a.status || 'Baru';
              aspStatusColor = 'bg-slate-100 text-slate-700';
          }

          combined.push({
            id: `asp-${a.id}`,
            name: a.name || 'Anonim',
            time: new Date(a.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            date: new Date(a.createdAt),
            message: a.shortTitle || 'Aspirasi Warga Baru',
            status: aspStatusLabel,
            type: 'Aspirasi Warga',
            statusColor: aspStatusColor,
            avatarColor: 'bg-emerald-100 text-emerald-600'
          });
        });

        combined.sort((a, b) => b.date - a.date);

        // Calculate category stats
        const categoryCounts = {};
        aspirations.forEach(a => {
           const cat = a.category || 'Lainnya';
           categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
        const categoryStats = Object.entries(categoryCounts)
           .map(([name, count]) => ({ name, count }))
           .sort((a, b) => b.count - a.count);

        setDashboardData({
          stats: { total, waiting, forwarded, completed },
          recentTickets: combined.slice(0, 5),
          agendas: agendas.slice(0, 3), // Ambil 3 agenda terdekat
          loading: false,
          aspirations: aspirations,
          categoryStats: categoryStats
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, [token]);

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
              <h3 className="text-2xl font-extrabold text-[#112A46]">
                {dashboardData.loading ? '...' : dashboardData.stats.total}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg">
            <Icon icon="mdi:trending-up" className="w-4 h-4" /> Terupdate
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
              <h3 className="text-2xl font-extrabold text-[#112A46]">
                {dashboardData.loading ? '...' : dashboardData.stats.waiting}
              </h3>
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
              <h3 className="text-2xl font-extrabold text-[#112A46]">
                {dashboardData.loading ? '...' : dashboardData.stats.forwarded}
              </h3>
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
              <h3 className="text-2xl font-extrabold text-[#112A46]">
                {dashboardData.loading ? '...' : dashboardData.stats.completed}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 w-fit px-2.5 py-1 rounded-lg">
            <Icon icon="mdi:calendar-check" className="w-4 h-4" /> Seluruh tiket
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
              {dashboardData.loading ? (
                <div className="flex justify-center py-10">
                  <Icon icon="mdi:loading" className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : dashboardData.recentTickets.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  Tidak ada tiket baru.
                </div>
              ) : (
                dashboardData.recentTickets.map((msg) => (
                  <div key={msg.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${msg.avatarColor}`}>
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-[#112A46] text-[15px] group-hover:text-blue-600 transition-colors">{msg.name}</h4>
                          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{msg.time}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{msg.type}</span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-1">{msg.message}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 sm:self-center self-start ${msg.statusColor}`}>
                      {msg.status}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <Link to="/admin/tanya-lurah" className="block text-center w-full mt-6 sm:hidden py-3 bg-blue-50 text-blue-600 font-bold rounded-xl text-sm">
              Lihat Semua Percakapan
            </Link>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="xl:col-span-1 space-y-8">
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <h3 className="text-xl font-extrabold text-[#112A46] mb-6">Aksi Cepat</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleOpenModal('Pengumuman')}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-[#F0F6FF] text-blue-700 rounded-2xl hover:bg-blue-600 hover:text-white transition-all group"
              >
                <Icon icon="mdi:bullhorn-outline" className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-center">Buat<br/>Pengumuman</span>
              </button>
              <button 
                onClick={() => handleOpenModal('Agenda')}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-[#F0FDF4] text-emerald-700 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all group"
              >
                <Icon icon="mdi:calendar-plus" className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-center">Tambah<br/>Agenda</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-3 p-4 bg-[#FFFbeb] text-amber-700 rounded-2xl hover:bg-amber-500 hover:text-white transition-all group">
                <Icon icon="mdi:account-multiple-plus-outline" className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-center">Data<br/>Warga Baru</span>
              </button>
              <button 
                onClick={() => setIsReportModalOpen(true)}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-[#F8FAFC] text-slate-600 rounded-2xl hover:bg-slate-800 hover:text-white transition-all group"
              >
                <Icon icon="mdi:file-chart-outline" className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-center">Cetak<br/>Laporan</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-[#112A46]">Agenda Terdekat</h3>
              <button className="text-slate-400 hover:text-blue-600"><Icon icon="mdi:dots-horizontal" className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-5">
              {dashboardData.loading ? (
                <div className="flex justify-center py-5">
                  <Icon icon="mdi:loading" className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : dashboardData.agendas && dashboardData.agendas.length > 0 ? (
                dashboardData.agendas.map(agenda => {
                  const eventDate = new Date(agenda.eventDate);
                  const month = eventDate.toLocaleString('id-ID', { month: 'short' });
                  const date = eventDate.getDate();
                  const isSoon = (eventDate.getTime() - new Date().getTime()) < 3 * 24 * 60 * 60 * 1000; // less than 3 days
                  const colorTheme = isSoon ? 'blue' : 'emerald';
                  
                  return (
                    <div key={agenda.id} className="flex gap-4 group cursor-pointer">
                      <div className={`w-14 h-14 rounded-2xl bg-${colorTheme}-50 border border-${colorTheme}-100 flex flex-col items-center justify-center shrink-0 group-hover:bg-${colorTheme}-600 group-hover:text-white transition-colors`}>
                        <span className={`text-xs font-bold text-${colorTheme}-600 group-hover:text-${colorTheme}-100 uppercase`}>{month}</span>
                        <span className="text-lg font-extrabold text-[#112A46] group-hover:text-white leading-none">{date}</span>
                      </div>
                      <div>
                        <h4 className={`font-bold text-[#112A46] text-[15px] mb-1 group-hover:text-${colorTheme}-600 transition-colors`}>{agenda.title}</h4>
                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                          <Icon icon="mdi:clock-outline" /> {eventDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - Selesai
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-5 text-slate-500 text-sm">Belum ada agenda terdekat.</div>
              )}
            </div>

            <Link to="/admin/agenda" className="block text-center w-full mt-6 py-3 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 font-bold rounded-xl text-sm transition-colors">
              Lihat Kalender Agenda
            </Link>
          </div>

        </motion.div>
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
                <form id="dashboard-info-form" onSubmit={handleSubmit} className="space-y-6">
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
                  form="dashboard-info-form"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-[#112A46] hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <Icon icon="mdi:check" className="w-5 h-5" /> Simpan & Publikasikan
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isReportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm no-print"
              onClick={() => setIsReportModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[550px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col print-area print:rounded-none print:shadow-none"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <h3 className="text-[22px] font-extrabold text-[#0F2942] flex items-center gap-3">
                  <Icon icon="mdi:chart-pie" className="w-7 h-7 text-blue-600" />
                  Ringkasan Laporan Aspirasi
                </h3>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors no-print"
                >
                  <Icon icon="mdi:close" className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8">
                <h4 className="text-[13px] font-extrabold text-[#0F2942] uppercase tracking-wider mb-6">Kategori Aspirasi Terbanyak</h4>
                
                <div className="space-y-5 mb-8">
                  {dashboardData.categoryStats?.length > 0 ? (
                    dashboardData.categoryStats.slice(0, 5).map((cat, idx) => (
                      <div key={idx} className="flex items-center justify-between pl-2">
                        <span className="font-medium text-[#29425A] text-[15px]">{cat.name}</span>
                        <span className="font-extrabold text-[#0F2942] text-[15px]">{cat.count} Laporan</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-500">Belum ada data aspirasi</div>
                  )}
                </div>
                
                <div className="p-4 bg-white border border-blue-100/80 rounded-2xl flex items-start gap-3">
                  <Icon icon="mdi:information-outline" className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-[14px] text-blue-600/90 font-medium leading-relaxed">
                    Data di atas dihimpun secara otomatis dari seluruh aspirasi warga yang masuk melalui sistem.
                  </p>
                </div>
              </div>

              {/* PRINT ONLY SECTION - DATA ASPIRASI */}
              <div className="hidden print:block p-8 pt-0">
                <h4 className="text-[13px] font-extrabold text-[#0F2942] uppercase tracking-wider mb-4 border-t border-slate-200 pt-6">Lampiran Data Aspirasi Warga</h4>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-2 text-[12px] font-bold text-[#29425A] uppercase">Nama</th>
                      <th className="py-2 text-[12px] font-bold text-[#29425A] uppercase">Kategori</th>
                      <th className="py-2 text-[12px] font-bold text-[#29425A] uppercase">Isi Aspirasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.aspirations?.length > 0 ? (
                      dashboardData.aspirations.map((a, idx) => (
                        <tr key={idx} className="border-b border-slate-100">
                          <td className="py-3 pr-2 text-[13px] font-semibold text-[#0F2942] align-top">{a.name || 'Anonim'}</td>
                          <td className="py-3 pr-2 text-[13px] text-[#29425A] align-top">{a.category || '-'}</td>
                          <td className="py-3 text-[13px] text-[#29425A] align-top">{a.shortTitle || a.description || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-4 text-center text-slate-500 text-sm">Tidak ada data.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-8 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 no-print">
                <Link
                  to="/admin/statistik"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-blue-600 bg-white hover:bg-slate-50 transition-colors text-center"
                >
                  Lihat Semua Statistik
                </Link>
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Icon icon="mdi:printer-outline" className="w-5 h-5" /> Cetak Laporan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}