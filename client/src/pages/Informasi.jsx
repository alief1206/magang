import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import rapat from '../assets/images/rapat.png';
import lurah2 from '../assets/images/Lurah-2.png'; 

export default function Informasi() {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Agenda Kegiatan",
      items: [
        { 
          name: "Musyawarah RT", 
          headerIcon: "mdi:presentation",
          desc: "Pembahasan Program kerja lingkungan dan rencana bulan Juli", 
          date: "Senin, 15 Juli 2026", 
          time: "08.00 WIB - Selesai", 
          loc: "Balai Kelurahan", 
          target: "Terbuka untuk seluruh warga." 
        },
        { 
          name: "Rapat Rutinan", 
          headerIcon: "mdi:bullhorn",
          desc: "Rapat koordinasi bulanan pengurus kelurahan mengenai evaluasi kinerja staf.", 
          date: "Jumat, 20 Juli 2026", 
          time: "09.00 WIB - Selesai", 
          loc: "Balai Kelurahan", 
          target: "Khusus staf dan jajaran RT/RW." 
        }
      ]
    },
    {
      title: "Pengumuman",
      items: [
        { 
          name: "Bantuan Sosial (Bansos) / Pembagian Sembako", 
          headerIcon: "mdi:human-dolly",
          desc: "Pembagian sembako rutin untuk warga yang terdaftar sebagai penerima bantuan.", 
          date: "Selasa, 17 Juli 2026", 
          time: "09.00 WIB - Selesai", 
          loc: "Balai Kelurahan", 
          target: "Warga penerima undangan bansos" 
        }
      ]
    },
    {
      title: "Program Kegiatan",
      items: [
        { 
          name: "Posyandu & Cek Kesehatan", 
          headerIcon: "mdi:hospital-box-outline",
          desc: "Pelayanan imunisasi balita serta pemeriksaan tekanan darah gratis untuk lansia.", 
          date: "Rabu, 18 Juli 2026", 
          time: "07.00 WIB - Selesai", 
          loc: "Balai RT / RW", 
          target: "Terbuka untuk ibu hamil, balita, dan lansia" 
        },
        { 
          name: "Pembukaan Siskamling Baru", 
          headerIcon: "mdi:shield-home-outline",
          desc: "Koordinasi perdana jadwal ronda malam demi meningkatkan keamanan.", 
          date: "Jumat, 20 Juli 2026", 
          time: "22.00 WIB - Selesai", 
          loc: "Pos Ronda Utama", 
          target: "Terbuka untuk seluruh warga." 
        }
      ]
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col pb-12">
      
      <section className="w-full bg-gradient-to-b from-[#112A46] to-[#1A3D63] pt-6 pb-20 relative">
        <header className="px-6 lg:px-10 py-2 mb-4 flex items-center gap-4 text-white relative z-30">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer outline-none">
            <Icon icon="mdi:arrow-left" className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-[18px] tracking-wide">Informasi</h1>
        </header>

        <div className="relative z-20 max-w-[1440px] w-full mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-end justify-between gap-10">
          
          <div className="w-full md:flex-1 text-left pb-4 lg:pb-12">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-blue-100 font-medium text-sm w-fit mb-6 mx-auto lg:mx-0 backdrop-blur-sm shadow-lg">
              <Icon icon="mdi:sparkles" className="text-emerald-400 w-5 h-5" /> Pusat Layanan Digital
            </div>

            <h1 className="text-4xl lg:text-[50px] font-extrabold text-white leading-[1.15] mb-6 tracking-wide">
              Informasi Kelurahan
            </h1>
            
            <p className="text-slate-200 text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
              Dapatkan informasi terbaru seputar kegiatan, pengumuman, dan program kelurahan. Tetap terhubung dengan warga lainnya melalui layanan ini.
            </p>
          </div>
          
          <div className="flex-shrink-0 flex items-end h-full pt-6 md:pt-0 relative z-30">
             <div className="relative transform translate-y-[35px] lg:translate-y-[65px]">
               <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[60%] h-[15px] bg-black/40 blur-[12px] rounded-[100%] z-0"></div>
               <img 
                 src={lurah2} 
                 alt="Aktor Lurah" 
                 className="w-[260px] md:w-[360px] lg:w-[460px] h-auto object-contain block relative z-10 drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]" 
               />
             </div>
          </div>

        </div>
      </section>
      <section className="py-16 pt-24 lg:pt-32 bg-white rounded-t-[3rem] relative z-10 -mt-16 shadow-[0_-15px_40px_rgba(0,0,0,0.1)] border-t border-slate-100">
        <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="mb-12">
              <h2 className="font-extrabold text-[#112A46] mb-6 text-[20px] lg:text-[24px]">
                {cat.title}
              </h2>
              
              <div className="space-y-4">
                {cat.items.map((item, i) => (
                  <details 
                    key={i} 
                    className="bg-white rounded-xl border border-slate-200 group overflow-hidden transition-all duration-300 shadow-sm"
                  >
                    <summary className="p-4 lg:p-5 cursor-pointer font-bold text-[#112A46] flex items-center justify-between text-[16px] lg:text-[18px] bg-[#D0E2FF] hover:bg-[#c2d8fc] outline-none select-none transition-colors">
                      <div className="flex items-center gap-3">
                        <Icon icon={item.headerIcon} className="w-6 h-6 text-[#112A46]" /> 
                        {item.name}
                      </div>
                      <Icon 
                        icon="mdi:chevron-down" 
                        className="w-6 h-6 group-open:rotate-180 transition-transform duration-300 text-[#112A46]"
                      />
                    </summary>
                    
                    <div className="p-6 border-t border-slate-200 flex flex-col lg:flex-row gap-6 items-start">
                      <div className="w-full lg:w-[35%] xl:w-[30%] flex-shrink-0">
                        <img 
                          src={rapat} 
                          alt="Dokumentasi Kegiatan" 
                          className="w-full h-[180px] lg:h-[200px] object-cover rounded-xl shadow-sm border border-slate-100" 
                        />
                      </div>
                      
                      <div className="flex-1 text-left flex flex-col gap-4">
                        <p className="text-[15px] lg:text-[16px] text-slate-800 font-medium leading-relaxed">
                          {item.desc}
                        </p>
                        
                        <div className="flex flex-col gap-2 mt-1">
                          <div className="flex items-center gap-3 text-sm lg:text-[15px] text-slate-700 font-medium">
                            <Icon icon="mdi:calendar-text-outline" className="w-5 h-5 text-slate-500" />
                            {item.date}
                          </div>
                          <div className="flex items-center gap-3 text-sm lg:text-[15px] text-slate-700 font-medium">
                            <Icon icon="mdi:history" className="w-5 h-5 text-slate-500" />
                            {item.time}
                          </div>
                          <div className="flex items-center gap-3 text-sm lg:text-[15px] text-slate-700 font-medium">
                            <Icon icon="mdi:home" className="w-5 h-5 text-slate-500" />
                            {item.loc}
                          </div>
                          <div className="flex items-center gap-3 text-sm lg:text-[15px] text-slate-700 font-medium">
                            <Icon icon="mdi:account-multiple" className="w-5 h-5 text-slate-500" />
                            {item.target}
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}