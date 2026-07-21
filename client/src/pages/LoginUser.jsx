import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import kantorLurah from '../assets/images/kantor-lurah.png'; 
import lurah2 from '../assets/images/Lurah-2.png';
import logoAsli from '../assets/images/logo-asli.png';
import logoBwi from '../assets/images/logo-banyuwangi.png';

export default function LoginUser() {
  const [nik, setNik] = useState('');
  const [namaUser, setNamaUser] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#112A46] to-[#1A3D63] font-sans flex flex-col p-4 md:p-8 relative overflow-hidden items-center justify-center">
      
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/4 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[60px] translate-y-1/4 translate-x-1/4 pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-[1100px] bg-white rounded-[2rem] lg:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row overflow-hidden relative z-10"
      >
        
        <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-[#0F253F]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F253F] via-[#112A46] to-[#1A3D63] z-0"></div>
          
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] z-10 pointer-events-none"></div>
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] z-10 pointer-events-none"></div>
          
          <div 
            className="absolute inset-0 z-10 opacity-30 mix-blend-overlay scale-110 pointer-events-none"
            style={{ 
              WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
              maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
            }}
          >
            <img 
              src={kantorLurah} 
              alt="Kantor Lurah" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <img 
              src={lurah2} 
              alt="Karakter Lurah" 
              className="absolute bottom-[-5%] right-[-5%] w-[85%] max-h-[90%] object-contain object-bottom" 
            />
          </div>
          
          <div className="relative z-30">
            <div className="flex items-center gap-5 mb-4">
              <img src={logoBwi} alt="Logo Banyuwangi" className="h-14 w-auto object-contain drop-shadow-md" />
              <img src={logoAsli} alt="Logo ASLI" className="h-14 w-auto object-contain drop-shadow-md" />
            </div>
            <p className="text-blue-300 font-semibold italic text-lg tracking-wider mb-8 drop-shadow-md">
              "Saiki Tandang Bareng"
            </p>
            <h1 className="text-4xl font-extrabold leading-tight mb-4 drop-shadow-sm">
              <span className="text-white">Selamat Datang</span> <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">di ASLI</span>
            </h1>
            <p className="text-blue-100/90 text-[15px] leading-relaxed max-w-sm drop-shadow-md font-medium">
              Melayani dengan Hati, Membangun dengan Aksi. Jembatan komunikasi Anda dengan layanan kelurahan.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col justify-center bg-white relative z-20">
          
          <div className="lg:hidden flex items-center justify-center gap-4 mb-8">
            <img src={logoBwi} alt="Logo Kabupaten Banyuwangi" className="h-12 w-auto object-contain" />
            <img src={logoAsli} alt="Logo ASLI" className="h-12 w-auto object-contain" />
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-center lg:text-left text-transparent bg-clip-text bg-gradient-to-r from-[#112A46] to-blue-600 mb-3 pb-1">
            Masuk ke ASLI
          </h2>
          <p className="text-slate-500 text-[15px] mb-10 text-center lg:text-left">Silakan masuk menggunakan NIK dan Nama Lengkap untuk mengakses seluruh layanan.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="font-bold text-[#112A46] text-sm mb-2.5 block">NIK</label>
              <div className="relative flex items-center group">
                <Icon icon="mdi:account-outline" className="absolute left-5 w-6 h-6 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" />
                <input 
                  type="text" 
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="Masukkan NIK (16 digit)"
                  className="w-full px-14 py-4.5 bg-[#ECF1F6] border border-slate-100 rounded-2xl text-slate-700 placeholder:text-slate-400 font-medium text-[15px] focus:ring-2 focus:ring-blue-200 focus:border-blue-300 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#112A46] text-sm mb-2.5 block">Nama Lengkap</label>
              <div className="relative flex items-center group">
                <Icon icon="mdi:card-account-details-outline" className="absolute left-5 w-6 h-6 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" />
                <input 
                  type="text" 
                  value={namaUser}
                  onChange={(e) => setNamaUser(e.target.value)}
                  placeholder="Masukkan nama sesuai KTP"
                  className="w-full px-14 py-4.5 bg-[#ECF1F6] border border-slate-100 rounded-2xl text-slate-700 placeholder:text-slate-400 font-medium text-[15px] focus:ring-2 focus:ring-blue-200 focus:border-blue-300 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input 
                type="checkbox" 
                id="remember"
                className="w-4.5 h-4.5 border-slate-300 rounded focus:ring-blue-600 focus:ring-2 text-blue-600 cursor-pointer transition-all"
              />
              <label htmlFor="remember" className="text-[15px] text-slate-600 cursor-pointer select-none font-medium">
                Ingat saya
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full py-5.5 bg-gradient-to-r from-[#112A46] to-[#1A3D63] hover:from-blue-900 hover:to-blue-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-[0_10px_20px_rgba(17,42,70,0.2)] hover:shadow-[0_15px_30px_rgba(17,42,70,0.3)] hover:-translate-y-1 text-[16px]"
            >
              Masuk ke ASLI <Icon icon="mdi:arrow-right" className="w-6 h-6" />
            </button>
          </form>

          <div className="flex items-start gap-3 mt-10 p-5 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-sm">
            <Icon icon="mdi:shield-check" className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <p className="text-xs lg:text-[13px] text-slate-500 leading-relaxed font-medium">
              Dengan masuk, Anda menyetujui <br />
              <Link to="#" className="text-blue-600 font-bold hover:underline">Kebijakan Privasi</Link> dan <Link to="#" className="text-blue-600 font-bold hover:underline">Ketentuan Layanan</Link>.
            </p>
          </div>
          
        </div>
      </motion.div>
      
      <footer className="w-full text-center text-blue-200/60 text-xs lg:text-sm py-8 mt-4 font-medium relative z-10">
        © 2026 ASLI - Asosiasi Lurah Indonesia Kabupaten Banyuwangi.
      </footer>

    </div>
  );
}