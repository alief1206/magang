import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

import kantorLurah from '../assets/images/kantor-lurah.png'; 
import rapat from '../assets/images/rapat.png';
import karakter from '../assets/images/karakter.png'; 
import banyuwangiSehat from '../assets/images/banyuwangi-sehat.png'; 
import { useState, useEffect } from 'react';
import { formatInformasiByCategory } from '../data/mockInformasi';

export default function Beranda() {
  const [informations, setInformations] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchInfo = () => {
      fetch('http://localhost:5000/api/informations')
        .then(res => res.json())
        .then(data => {
          if (data.data) {
            const mapped = data.data.map(item => ({
              id: item.id,
              kelurahanId: item.kelurahanId,
              kategori: item.type === 'Agenda' ? 'Agenda Kegiatan' : (item.type === 'Program' ? 'Program Kegiatan' : 'Pengumuman'),
              name: item.title,
              headerIcon: item.type === 'Agenda' ? 'mdi:calendar-month' : (item.type === 'Program' ? 'mdi:hospital-box-outline' : 'mdi:bullhorn'),
              desc: item.description,
              date: item.eventDate ? new Date(item.eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-',
              time: item.eventDate ? new Date(item.eventDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB - Selesai' : '-',
              loc: 'Balai Kelurahan',
              target: 'Terbuka untuk umum'
            }));
            setInformations(mapped);
            setCategories(formatInformasiByCategory(mapped));
          }
        })
        .catch(err => console.error("Gagal mengambil informasi:", err));
    };

    fetchInfo();
    const interval = setInterval(fetchInfo, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col overflow-x-hidden">
      <section className="relative w-full pt-12 pb-24 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F253F] to-[#112A46] z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/4 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[60px] translate-y-1/4 -translate-x-1/4"></div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center relative z-30">
          <div className="lg:w-5/12 flex flex-col items-start text-left mb-12 lg:mb-0 mt-6 lg:mt-0 w-full">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-white/5 backdrop-blur-md text-white font-medium text-[13px] mb-6 shadow-sm">
              <Icon icon="mdi:sparkles" className="text-emerald-400 w-4 h-4" /> Ruang Aspirasi untuk Warga
            </div>
            
            <h1 className="text-4xl lg:text-[48px] font-extrabold leading-[1.2] mb-6 tracking-wide drop-shadow-sm pb-1">
              <span className="text-white">Melayani dengan Hati,</span><br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] to-[#06b6d4]">
                Membangun dengan Aksi.
              </span>
            </h1>
            
            <p className="text-slate-200 text-lg lg:text-[17px] leading-relaxed mb-10 max-w-lg">
              ASLI hadir sebagai jembatan komunikasi antara masyarakat dan lurah melalui pelayanan digital yang cepat, mudah, dan responsif.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                to="/tanya-pelayanan" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#112A46] font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 hover:shadow-lg active:bg-blue-100 active:scale-95 transition-all duration-200 shadow-md"
              >
                <Icon icon="mdi:chat-processing-outline" className="w-10 h-10" /> TANYA LURAH SEKARANG
              </Link>
              <Link 
                to="/lapor-pengaduan" 
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/40 text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 active:bg-white/20 active:scale-95 transition-all duration-200"
              >
                <Icon icon="mdi:bullhorn-outline" className="w-10 h-10" /> LAPOR PENGADUAN
              </Link>
            </div>
          </div>
          <div className="lg:w-7/12 relative flex justify-center lg:justify-end h-full mt-10 lg:mt-0 w-full">
            <div className="relative w-full max-w-[600px] lg:max-w-[800px] flex items-end justify-center ml-auto transform translate-y-8 lg:translate-y-16">
              <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[85%] h-[20px] lg:h-[30px] bg-black/30 blur-[15px] lg:blur-[20px] rounded-[100%] z-0"></div>

              <img 
                src={kantorLurah} 
                alt="Kantor Lurah" 
                className="w-full h-auto object-contain relative z-10 drop-shadow-[0_20px_25px_rgba(0,0,0,0.25)]"
              />
              <div className="absolute -bottom-6 lg:-bottom-12 right-2 lg:-right-2 w-[45%] lg:w-[50%] h-[15px] lg:h-[20px] bg-black/40 blur-[12px] rounded-[100%] z-[15]"></div>
              <img 
                src={karakter} 
                alt="Karakter Lurah" 
                className="absolute -bottom-8 lg:-bottom-14 right-0 lg:-right-6 w-[55%] lg:w-[58%] h-auto object-contain z-[20]"
              />

            </div>
          </div>

        </div>
      </section>
      <main className="flex-1 w-full bg-white rounded-t-[3rem] lg:rounded-t-[4rem] -mt-16 lg:-mt-24 relative z-20 pt-32 lg:pt-48 pb-20 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] border-t border-slate-100">
        <section className="max-w-[1440px] mx-auto px-6 lg:px-10 mb-28 flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-5/12">
             <div className="w-full aspect-[4/3] bg-slate-100 rounded-[2rem] overflow-hidden shadow-lg border border-slate-200 flex items-center justify-center group">
                <img src={rapat} alt="Mengenal ASLI" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
             </div>
          </div>
          <div className="lg:w-7/12">
            <h2 className="text-[32px] lg:text-[40px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#112A46] to-blue-600 mb-6 pb-1">
              Mengenal ASLI
            </h2>
            <p className="text-slate-600 text-[17px] leading-relaxed mb-12">
              ASLI (Asosiasi Lurah Indonesia) Kabupaten Banyuwangi merupakan wadah kolaborasi para lurah untuk menghadirkan pelayanan publik yang lebih dekat dengan masyarakat melalui pemanfaatan teknologi digital.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Icon icon="mdi:heart" className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-[#112A46] text-[15px] mb-1">Responsif</h4>
                <p className="text-[13.5px] text-slate-500 px-2">Tanggap terhadap kebutuhan warga</p>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Icon icon="mdi:account-group" className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-[#112A46] text-[15px] mb-1">Kolaboratif</h4>
                <p className="text-[13.5px] text-slate-500 px-2">Bersinergi untuk Banyuwangi</p>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Icon icon="mdi:shield-check" className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-[#112A46] text-[15px] mb-1">Transparan</h4>
                <p className="text-[13.5px] text-slate-500 px-2">Pelayanan terbuka dan terpercaya</p>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                  <Icon icon="mdi:leaf" className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-[#112A46] text-[15px] mb-1">Adaptif</h4>
                <p className="text-[13.5px] text-slate-500 px-2">Terus berinovasi mengikuti zaman</p>
              </div>
            </div>
          </div>
        </section>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-10 mb-28 text-center">
          <h3 className="text-2xl lg:text-3xl font-extrabold text-[#112A46] mb-4">Cara Mudah Menggunakan Layanan</h3>
          <p className="text-slate-500 text-[16px] mb-12 max-w-2xl mx-auto">
            Tiga langkah sederhana untuk terhubung dengan Lurah dan mendapatkan informasi atau layanan yang Anda butuhkan secara cepat.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 text-left relative overflow-hidden">
              <div className="absolute -right-4 -top-8 text-[120px] font-black text-slate-50 opacity-80 group-hover:text-blue-50 transition-colors duration-300 pointer-events-none">1</div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#112A46] to-[#1A3D63] text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-6 shadow-lg relative z-10">1</div>
              <h4 className="font-extrabold text-[#112A46] text-lg mb-2 relative z-10">Sampaikan Pertanyaan</h4>
              <p className="text-[15px] text-slate-500 leading-relaxed relative z-10">Pilih layanan atau tuliskan keluhan dan pertanyaan sesuai kebutuhan administrasi Anda.</p>
            </div>

            <div className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 text-left relative overflow-hidden">
              <div className="absolute -right-4 -top-8 text-[120px] font-black text-slate-50 opacity-80 group-hover:text-blue-50 transition-colors duration-300 pointer-events-none">2</div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#112A46] to-[#1A3D63] text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-6 shadow-lg relative z-10">2</div>
              <h4 className="font-extrabold text-[#112A46] text-lg mb-2 relative z-10">ASLI Membantu</h4>
              <p className="text-[15px] text-slate-500 leading-relaxed relative z-10">Sistem pintar kami akan memberikan jawaban otomatis berdasarkan basis data informasi resmi.</p>
            </div>

            <div className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 text-left relative overflow-hidden">
              <div className="absolute -right-4 -top-8 text-[120px] font-black text-slate-50 opacity-80 group-hover:text-emerald-50 transition-colors duration-300 pointer-events-none">3</div>
              <div className="w-14 h-14 bg-[#10B981] text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-6 shadow-lg relative z-10">3</div>
              <h4 className="font-extrabold text-[#112A46] text-lg mb-2 relative z-10">Jika Perlu Bantuan</h4>
              <p className="text-[15px] text-slate-500 leading-relaxed relative z-10">Pertanyaan yang kompleks akan diteruskan kepada Admin Kelurahan untuk tindak lanjut personal.</p>
            </div>
          </div>
        </section>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-10">
           <div className="bg-gradient-to-br from-[#F0F4F8] to-[#e4edf5] rounded-[2rem] p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between border border-blue-100 shadow-sm relative overflow-hidden">
             
             <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/40 rounded-full blur-3xl pointer-events-none"></div>

             <div className="md:w-1/2 mb-8 md:mb-0 relative z-10">
               <h3 className="text-3xl lg:text-3xl font-extrabold text-[#112A46] mb-4">Mari Hidup Sehat bersama ASLI</h3>
               <p className="text-slate-600 mb-8 leading-relaxed max-w-md">
                 Edukasi kesehatan untuk mewujudkan masyarakat Banyuwangi yang lebih sehat, aktif, dan berkualitas setiap harinya.
               </p>
               <button className="px-8 py-3.5 bg-white border border-slate-200 shadow-sm text-[#112A46] font-bold rounded-xl flex items-center gap-2 hover:bg-slate-50 active:scale-95 active:bg-slate-100 transition-all duration-200 text-[15px]">
                  <Icon icon="mdi:cloud-search-outline" className="w-10 h-10 text-blue-600"/> Jelajahi Informasi Kesehatan
               </button>
             </div>
             <div className="md:w-1/2 flex justify-end relative z-10">
                <div className="w-full max-w-[420px] aspect-[16/9] rounded-2xl border border-white/60 overflow-hidden shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img src={banyuwangiSehat} alt="Banyuwangi Sehat" className="w-full h-full object-cover" />
                </div>
             </div>
           </div>
         </section>
         
         <section className="max-w-[1440px] mx-auto px-6 lg:px-10 mb-28">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-[#112A46] mb-4">Informasi Kelurahan Terkini</h3>
            <p className="text-slate-500 text-[16px] max-w-2xl mx-auto">
              Berita, agenda, dan pengumuman terbaru langsung dari kelurahan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                <h4 className="font-extrabold text-[#112A46] text-xl mb-4 border-b border-slate-100 pb-3">{cat.title}</h4>
                <div className="space-y-4">
                  {cat.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex flex-col gap-1 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 text-[#112A46] font-bold text-[15px]">
                        <Icon icon={item.headerIcon} className="w-5 h-5" /> {item.name}
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2">{item.desc}</p>
                      <div className="flex items-center gap-2 text-[12px] text-slate-400 mt-1">
                        <Icon icon="mdi:calendar" /> {item.date}
                      </div>
                    </div>
                  ))}
                  {cat.items.length === 0 && (
                     <p className="text-sm text-slate-400 italic">Belum ada informasi.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
             <Link to="/informasi" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors">
               Lihat Semua Informasi <Icon icon="mdi:arrow-right" className="w-5 h-5" />
             </Link>
          </div>
         </section>
        
      </main>

    </div>
  );
}