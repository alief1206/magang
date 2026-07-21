import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logoAsli from "../../assets/images/logo-asli2.png";
import logoBwi from "../../assets/images/logo-banyuwangi.png";
import admin from "../../assets/images/admin.png";

export default function LoginAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/admin/dashboard'); 
  };

  return (
    <div className="min-h-screen bg-[#0F253F] font-sans flex flex-col p-4 md:p-8 relative overflow-hidden items-center justify-center">
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-[1100px] bg-white rounded-[2rem] lg:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row overflow-hidden relative z-10"
      >
        <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-[#0F253F]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F253F] via-[#112A46] to-[#0a362a] z-0"></div>
          
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-emerald-500/30 rounded-full blur-[100px] z-10 pointer-events-none"></div>
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] z-10 pointer-events-none"></div>

          <img 
            src={admin} 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover z-10 opacity-40 mix-blend-overlay scale-110" 
            style={{ 
              WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
              maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
            }}
          />
          
          <div className="relative z-20">
            <div className="flex items-center gap-5 mb-4">
              <img src={logoAsli} alt="Logo ASLI" className="h-14 w-auto object-contain drop-shadow-md" />
              <img src={logoBwi} alt="Logo Kabupaten Banyuwangi" className="h-14 w-auto object-contain drop-shadow-md" />
            </div>
            <p className="text-emerald-300 font-semibold italic text-lg tracking-wider mb-10 drop-shadow-md">
              "Saiki Tandang Bareng"
            </p>
            <h1 className="text-4xl font-extrabold leading-tight mb-4 drop-shadow-sm">
              <span className="text-white">Dashboard</span> <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">Admin ASLI</span>
            </h1>
            <p className="text-slate-200 text-[15px] leading-relaxed max-w-sm drop-shadow-md font-medium">
              Kelola percakapan, aspirasi, dan informasi kelurahan dengan mudah, cepat, dan terorganisir.
            </p>
          </div>

          <div className="relative z-20 flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-lg mt-12">
             <div className="p-3 bg-emerald-500 text-white rounded-full"><Icon icon="mdi:shield-check" className="w-6 h-6"/></div>
             <div>
                <h4 className="font-extrabold text-white text-[16px] mb-0.5">Akses Terbatas</h4>
                <p className="text-xs text-slate-200 leading-relaxed">Halaman ini diperuntukkan bagi admin kelurahan yang memiliki hak akses.</p>
             </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col justify-center bg-white relative z-20">
          <div className="lg:hidden flex items-center justify-center gap-4 mb-8">
            <img src={logoAsli} alt="Logo ASLI" className="h-12 w-auto object-contain" />
            <img src={logoBwi} alt="Logo Kabupaten Banyuwangi" className="h-12 w-auto object-contain" />
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-center lg:text-left text-transparent bg-clip-text bg-gradient-to-r from-[#112A46] to-emerald-600 mb-3 pb-1">
            Login Admin Kelurahan
          </h2>
          <p className="text-slate-500 text-[15px] mb-10 text-center lg:text-left">Silahkan masuk menggunakan akun resmi untuk mengakses dashboard admin ASLI.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="font-bold text-[#112A46] text-sm mb-2.5 block">Username / Email Dinas</label>
                <div className="relative flex items-center group">
                    <Icon icon="mdi:account-outline" className="absolute left-5 w-6 h-6 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" />
                    <input 
                      type="text" 
                      placeholder="Masukkan username / email"
                      className="w-full px-14 py-4.5 bg-[#ECF1F6] border border-slate-100 rounded-2xl text-slate-700 placeholder:text-slate-400 font-medium text-[15px] focus:ring-2 focus:ring-blue-200 focus:border-blue-300 outline-none transition-all"
                      required
                    />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#112A46] text-sm mb-2.5 block">Password</label>
                <div className="relative flex items-center group">
                    <Icon icon="mdi:lock-outline" className="absolute left-5 w-6 h-6 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      className="w-full px-14 py-4.5 bg-[#ECF1F6] border border-slate-100 rounded-2xl text-slate-700 placeholder:text-slate-400 font-medium text-[15px] focus:ring-2 focus:ring-blue-200 focus:border-blue-300 outline-none transition-all"
                      required
                    />
                    <button 
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-5 text-slate-400 hover:text-slate-600 z-10">
                        <Icon icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"} className="w-5 h-5"/>
                    </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm pt-2">
                 <div className="flex items-center gap-2">
                     <input type="checkbox" id="remember" className="w-4.5 h-4.5 border-slate-300 rounded focus:ring-blue-600 focus:ring-2 text-blue-600 cursor-pointer transition-all" />
                     <label htmlFor="remember" className="text-slate-600 font-medium cursor-pointer">Ingat Saya</label>
                 </div>
                 <Link to="#" className="text-blue-600 font-bold hover:text-blue-700">Lupa Password?</Link>
              </div>

              <button 
                 type="submit" 
                 className="w-full py-5.5 bg-gradient-to-r from-[#112A46] to-[#1A3D63] hover:from-blue-900 hover:to-blue-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-[0_10px_20px_rgba(17,42,70,0.2)] hover:shadow-[0_15px_30px_rgba(17,42,70,0.3)] hover:-translate-y-1 text-[16px]">
                Masuk ke Dashboard <Icon icon="mdi:arrow-right" className="w-6 h-6"/> 
              </button>
          </form>
          
          <div className="relative flex items-center justify-center my-8">
             <div className="flex-1 border-t border-slate-100"></div>
             <span className="px-4 text-xs font-medium text-slate-400 bg-white">atau</span>
             <div className="flex-1 border-t border-slate-100"></div>
          </div>

          <div className="flex items-center justify-between gap-4 bg-[#ECF1F6] p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md hover:bg-slate-50 transition-all">
              <div className="p-3 bg-white text-blue-600 rounded-xl border border-slate-100 shadow-inner"><Icon icon="mdi:headset" className="w-6 h-6"/></div>
              <div className="flex-1 px-1">
                 <h4 className="font-extrabold text-[#112A46] text-[15px] mb-0.5">Butuh bantuan?</h4>
                 <p className="text-xs text-slate-600">Hubungi Super Admin via WhatsApp.</p>
              </div>
              <Icon icon="mdi:chevron-right" className="w-6 h-6 text-slate-400"/>
          </div>
          
        </div>
      </motion.div>
      
      <footer className="w-full flex flex-col md:flex-row items-center justify-between text-xs text-white/40 pt-10 px-4 max-w-[1440px] mx-auto z-10 gap-2">
         <span>© 2026 ASLI - Asosiasi Lurah Indonesia Kabupaten Banyuwangi.</span>
         <span>Sistem informasi terintegrasi</span>
      </footer>

    </div>
  );
}