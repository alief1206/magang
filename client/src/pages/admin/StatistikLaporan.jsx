import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

export default function StatistikLaporan() {
  const [filter, setFilter] = useState('7 hari terakhir');
  const [stats, setStats] = useState({
    total_tickets: 0,
    waiting_tickets: 0,
    forwarded_to_lurah: 0,
    completed_tickets: 0
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

  React.useEffect(() => {
    fetchStats();
    const intervalId = setInterval(fetchStats, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const lineData = stats.weekly_stats || [];
  const pieData = stats.aspiration_categories || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100">
          <p className="font-bold text-[#112A46] mb-3 border-b border-slate-100 pb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6 mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-slate-600">{entry.name}</span>
              </div>
              <span className="font-bold text-[#112A46]">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="p-4 md:p-8 max-w-[1600px] mx-auto w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#112A46] mb-2 tracking-tight">
            Statistik & Laporan
          </h1>
          <p className="text-slate-500 text-[15px] lg:text-base">
            Analisis data interaksi warga dan performa layanan kelurahan.
          </p>
        </div>
        <div className="w-full sm:w-auto flex items-center gap-3 shrink-0">
          <div className="relative w-full">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 text-slate-700 font-bold py-3 pl-5 pr-12 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-sm transition-all"
            >
              <option>7 hari terakhir</option>
              <option>30 hari terakhir</option>
              <option>Bulan ini</option>
            </select>
            <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Percakapan Masuk', count: stats.total_tickets, trend: 'Real-time', icon: 'mdi:message-text-outline', color: 'blue' },
          { title: 'Menunggu Admin', count: stats.waiting_tickets, trend: 'Real-time', icon: 'mdi:clock-alert-outline', color: 'red' },
          { title: 'Diteruskan ke Lurah', count: stats.forwarded_to_lurah, trend: 'Real-time', icon: 'mdi:account-tie', color: 'amber' },
          { title: 'Percakapan Selesai', count: stats.completed_tickets, trend: 'Real-time', icon: 'mdi:check-circle-outline', color: 'emerald' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-500 flex items-center justify-center shrink-0`}>
              <Icon icon={stat.icon} className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 mb-1">{stat.title}</p>
              <div className="flex items-end gap-3">
                <h3 className="text-2xl font-extrabold text-[#112A46] leading-none">{stat.count}</h3>
                <span className={`text-[11px] font-bold text-${stat.color}-500 mb-0.5`}>{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h3 className="text-xl font-extrabold text-[#112A46]">Statistik Mingguan</h3>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 text-slate-600"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Percakapan Masuk</div>
              <div className="flex items-center gap-2 text-slate-600"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Diteruskan ke Lurah</div>
              <div className="flex items-center gap-2 text-slate-600"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Selesai</div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '5 5' }} />
                <Line type="monotone" name="Percakapan Masuk" dataKey="masuk" stroke="#3B82F6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#3B82F6' }} />
                <Line type="monotone" name="Diteruskan ke Lurah" dataKey="lurah" stroke="#F59E0B" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#F59E0B' }} />
                <Line type="monotone" name="Selesai" dataKey="selesai" stroke="#10B981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="xl:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 md:p-8 flex flex-col">
          <h3 className="text-xl font-extrabold text-[#112A46] mb-8">Kategori Aspirasi Terbanyak</h3>
          
          <div className="flex-1 flex flex-col justify-center relative">
            <div className="h-[220px] w-full relative mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontWeight: 'bold', color: '#112A46' }}
                    itemStyle={{ color: '#64748b', fontWeight: '500' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="block text-3xl font-black text-[#112A46]">{stats.total_tickets}</span>
                  <span className="text-xs font-bold text-slate-400">Total Tiket</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 w-full px-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-[#112A46] transition-colors">{item.name}</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#112A46]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <Link to="/admin/aspirasi" className="w-full mt-8 py-3.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 group">
            Lihat semua aspirasi <Icon icon="mdi:arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
      
    </motion.div>
  );
}