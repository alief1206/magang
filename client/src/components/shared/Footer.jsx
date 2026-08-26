import React from 'react';
import { Icon } from '@iconify/react';
import logoAsli from '../../assets/images/logo-asli2.png'; 
import logoBwi from '../../assets/images/logo-banyuwangi.png'; 

export default function Footer() {
  return (
    <footer className="bg-[#112A46] text-white pt-16 pb-8 w-full border-t-[12px] border-slate-100 flex flex-col items-center">
      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-16">
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-5 mb-4">
               <img 
                src={logoBwi} 
                alt="Logo Banyuwangi" 
                className="h-16 lg:h-25 w-auto object-contain block" 
              />
              <img 
                src={logoAsli} 
                alt="Logo ASLI" 
                className="h-16 lg:h-20 w-auto object-contain block" 
              />
            </div>
            
            <p className="text-white/90 font-semibold italic text-[15px] mb-5 tracking-wide">
              "Saiki Tandang Bareng"
            </p>

            <h3 className="font-extrabold text-[18px] lg:text-[20px] mb-2 tracking-wide">
              Kabupaten Banyuwangi
            </h3>
            <p className="text-white/70 text-[14px] lg:text-[15px] leading-relaxed mb-6 max-w-sm">
              Melayani dengan hati untuk mewujudkan masyarakat Banyuwangi yang sejahtera dan maju.
            </p>

            <div className="flex items-center gap-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-blue-400 transition-all border border-white/10 shadow-sm">
                <Icon icon="mdi:facebook" className="w-5 h-5" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-pink-400 transition-all border border-white/10 shadow-sm">
                <Icon icon="mdi:instagram" className="w-5 h-5" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-red-500 transition-all border border-white/10 shadow-sm">
                <Icon icon="mdi:youtube" className="w-5 h-5" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-green-400 transition-all border border-white/10 shadow-sm">
                <Icon icon="mdi:whatsapp" className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-start text-left">
            <h3 className="font-extrabold text-[18px] lg:text-[20px] mb-6 tracking-wide border-b-2 border-white/10 pb-2 w-full max-w-[120px]">
              Pelayanan
            </h3>
            <div className="flex items-start gap-3.5 bg-white/5 p-4 rounded-xl border border-white/5 w-full shadow-inner">
              <Icon icon="mdi:clock-outline" className="w-6 h-6 flex-shrink-0 text-blue-300 mt-0.5" />
              <div className="text-[14px] lg:text-[15px] text-white/80">
                <p className="font-bold text-white mb-1">Senin - Jumat</p>
                <p className="font-semibold text-white/90">08.00 - 16.00 WIB</p>
                <p className="text-[12px] lg:text-[13px] mt-2 italic text-white/50 block">
                  *Hari libur nasional tutup
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start text-left">
            <h3 className="font-extrabold text-[18px] lg:text-[20px] mb-6 tracking-wide border-b-2 border-white/10 pb-2 w-full max-w-[140px]">
              Hubungi Kami
            </h3>
            <ul className="space-y-4 text-white/85 text-[14px] lg:text-[15px] w-full">
              <li className="flex items-center gap-3.5 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-300 group-hover:bg-blue-500/20 transition-all flex-shrink-0">
                  <Icon icon="mdi:phone" className="w-4 h-4" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors">(0333) 1234567</span>
              </li>
              <li className="flex items-center gap-3.5 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-300 group-hover:bg-blue-500/20 transition-all flex-shrink-0">
                  <Icon icon="mdi:email" className="w-4 h-4" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors break-all">kelurahan@banyuwangikab.go.id</span>
              </li>
              <li className="flex items-start gap-3.5 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-300 group-hover:bg-blue-500/20 transition-all flex-shrink-0 mt-0.5">
                  <Icon icon="mdi:map-marker" className="w-4 h-4" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors leading-relaxed">
                  Banyuwangi, Jawa Timur, Indonesia
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/40 text-[13px] lg:text-[14px]">
          <p>&copy; 2026 Asosiasi Lurah Indonesia (ASLI) Kabupaten Banyuwangi.</p>
          <p className="font-medium tracking-wide">All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}