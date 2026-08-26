import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import karakterLurah from '../assets/images/karakter.png'; 

export default function LaporPengaduan() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="relative w-full pt-12 lg:pt-16 pb-24 lg:pb-32">
    
        <div className="absolute inset-0 bg-gradient-to-br from-[#112A46] to-[#1A3D63] overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/4 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[60px] translate-y-1/4 -translate-x-1/4"></div>
        </div>

        <div className="max-w-[1350px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center relative">
          
          <div className="lg:w-[55%] flex flex-col justify-center text-center lg:text-left relative z-10 pt-4 lg:pt-0">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-blue-100 font-medium text-sm w-fit mb-6 mx-auto lg:mx-0 backdrop-blur-sm shadow-lg">
              <Icon icon="mdi:sparkles" className="text-emerald-400 w-5 h-5" /> Pusat Layanan Digital
            </div>
            
            <h1 className="text-4xl lg:text-[50px] font-extrabold text-white leading-[1.15] mb-6 tracking-wide">
              Selamat datang di <br />
              Layanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">Tanya Lurah ASLI</span>
            </h1>
            
            <p className="text-slate-300 text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
              Sampaikan keluhan, cari informasi persyaratan, atau konsultasikan kebutuhan administrasi Anda dengan mudah tanpa harus antre.
            </p>
          </div>

          <div className="lg:w-[45%] relative flex justify-center items-end z-30 w-full h-[340px] lg:h-[440px] mt-10 lg:mt-0 -mb-8 lg:-mb-[75px] pointer-events-none">
            <img 
              src={karakterLurah} 
              alt="Ilustrasi Layanan" 
              className="w-auto h-full object-contain object-bottom drop-shadow-[0_25px_20px_rgba(0,0,0,0.45)]" 
            />
          </div>
          
        </div>
      </div>

      <div className="bg-[#F8FAFC] rounded-t-[50px] -mt-16 lg:-mt-24 relative z-20 pt-20 lg:pt-28 pb-24 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] border-t border-white/50">
        
        <div className="max-w-[1350px] mx-auto px-6 lg:px-10">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#112A46] mb-10 text-center lg:text-left tracking-tight">Layanan Utama ASLI</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            <div className="bg-white rounded-[50px] p-10 lg:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col h-full hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 group">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#112A46] to-[#1A3D63] text-white rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Icon icon="mdi:chat-processing-outline" className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-[#112A46] text-2xl">Tanya Pelayanan</h3>
              </div>
              <p className="text-slate-500 text-[16px] mb-12 flex-1 leading-relaxed">
                Cari informasi seputar persyaratan, alur, dokumen, dan layanan kelurahan lainnya secara cepat (Dijawab Otomatis).
              </p>
              <Link to="/tanya-pelayanan" className="inline-flex items-center justify-center gap-2 bg-[#F0F4F8] text-[#112A46] font-bold px-8 py-4 rounded-full w-full hover:bg-[#112A46] hover:text-white transition-colors duration-300 text-[16px]">
                Mulai Tanya <Icon icon="mdi:arrow-right" className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-white rounded-[50px] p-10 lg:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col h-full hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 group">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#112A46] to-[#1A3D63] text-white rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Icon icon="mdi:lightbulb-on-outline" className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-[#112A46] text-2xl">Kotak Aspirasi</h3>
              </div>
              <p className="text-slate-500 text-[16px] mb-12 flex-1 leading-relaxed">
                Sampaikan ide, saran, keluhan pelayanan, atau usulan program kemajuan desa langsung kepada Lurah.
              </p>
              <Link to="/kotak-aspirasi" className="inline-flex items-center justify-center gap-2 bg-[#F0F4F8] text-[#112A46] font-bold px-8 py-4 rounded-full w-full hover:bg-[#112A46] hover:text-white transition-colors duration-300 text-[16px]">
                Kirim Aspirasi <Icon icon="mdi:arrow-right" className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-white rounded-[50px] p-10 lg:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col h-full hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 group">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#112A46] to-[#1A3D63] text-white rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Icon icon="mdi:calendar-month" className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-[#112A46] text-2xl">Informasi Kelurahan</h3>
              </div>
              <p className="text-slate-500 text-[16px] mb-12 flex-1 leading-relaxed">
                Dapatkan informasi agenda, pengumuman, program, dan kegiatan kelurahan terkini di sini.
              </p>
              <Link to="/informasi" className="inline-flex items-center justify-center gap-2 bg-[#F0F4F8] text-[#112A46] font-bold px-8 py-4 rounded-full w-full hover:bg-[#112A46] hover:text-white transition-colors duration-300 text-[16px]">
                Lihat Informasi <Icon icon="mdi:arrow-right" className="w-5 h-5" />
              </Link>
            </div>

          </div>
          <div className="mt-12 lg:mt-16 bg-gradient-to-r from-[#112A46] to-[#1A3D63] rounded-[40px] p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_40px_rgba(17,42,70,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
            
            <div className="flex-1 relative z-10 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4 text-emerald-400 font-semibold text-sm">
                <Icon icon="mdi:shield-check" className="w-5 h-5" />
                <span>Terintegrasi Resmi</span>
              </div>
              <h3 className="text-2xl lg:text-[32px] font-extrabold text-white mb-4 leading-tight">Lapor Kerusakan Fasilitas</h3>
              <p className="text-blue-100 text-[16px] leading-relaxed max-w-3xl">
                Menemukan jalan berlubang, lampu jalan mati, atau masalah infrastruktur lainnya? Sampaikan laporan fisik Anda dengan cepat dan terpadu melalui aplikasi <strong>Smart Kampung Banyuwangi</strong>.
              </p>
            </div>
            
            <div className="relative z-10 shrink-0 w-full md:w-auto mt-4 md:mt-0">
              <a 
                href="https://smartkampung.id/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-100 text-[#112A46] font-bold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-[16px]"
              >
                Buka Smart Kampung <Icon icon="mdi:open-in-new" className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}