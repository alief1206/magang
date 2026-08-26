import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import rapat from '../assets/images/rapat.png';
import lurah2 from '../assets/images/Lurah-2.png'; 
import { formatInformasiByCategory } from '../data/mockInformasi';

export default function Informasi() {
  const navigate = useNavigate();

  const [kelurahans, setKelurahans] = useState([]);
  const [selectedKelurahan, setSelectedKelurahan] = useState('');
  const [informations, setInformations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/kelurahans')
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setKelurahans(data.data);
          setSelectedKelurahan(data.data[0].id.toString());
        }
      })
      .catch(err => console.error("Failed to fetch kelurahans", err));
  }, []);

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
          }
        })
        .catch(err => console.error("Gagal mengambil informasi:", err));
    };

    fetchInfo();
    const interval = setInterval(fetchInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = selectedKelurahan 
    ? informations.filter(item => item.kelurahanId.toString() === selectedKelurahan)
    : informations;

  const categories = formatInformasiByCategory(filteredData);

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col pb-12">
      
      <section className="w-full bg-gradient-to-b from-[#112A46] to-[#1A3D63] pt-6 pb-20 relative">
        <header className="px-6 lg:px-10 py-2 mb-4 flex items-center gap-4 text-white relative z-30">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer outline-none">
            <Icon icon="mdi:arrow-left" className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-[18px] tracking-wide">Informasi</h1>
        </header>

        <div className="relative z-20 max-w-[1440px] w-full mx-auto px-6 lg:px-10 flex flex-col items-center justify-center text-center gap-6">
          
          <div className="w-full max-w-3xl pb-0 lg:pb-4">
            <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-blue-100 font-medium text-sm w-fit mb-6 mx-auto backdrop-blur-sm shadow-lg">
              <Icon icon="mdi:sparkles" className="text-emerald-400 w-5 h-5" /> Pusat Layanan Digital
            </div>

            <h1 className="text-4xl lg:text-[50px] font-extrabold text-white leading-[1.15] mb-6 tracking-wide">
              Informasi Kelurahan
            </h1>
            
            <p className="text-slate-200 text-lg lg:text-xl leading-relaxed mx-auto">
              Dapatkan informasi terbaru seputar kegiatan, pengumuman, dan program kelurahan. Tetap terhubung dengan warga lainnya melalui layanan ini.
            </p>
          </div>
          
          <div className="flex-shrink-0 flex items-end justify-center w-full relative z-30 mt-4 md:mt-0">
             <div className="relative transform translate-y-[35px] lg:translate-y-[65px]">
               <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[60%] h-[15px] bg-black/40 blur-[12px] rounded-[100%] z-0"></div>
               <img 
                 src={lurah2} 
                 alt="Aktor Lurah" 
                 className="w-[340px] md:w-[480px] lg:w-[600px] h-auto object-contain block relative z-10 drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)] mx-auto" 
               />
             </div>
          </div>

        </div>
      </section>

      <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 mt-8 relative z-20">
        <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-shrink-0 text-[#112A46] font-bold">
            <Icon icon="mdi:filter-variant" className="w-6 h-6 inline-block mr-2" />
            Filter Kelurahan:
          </div>
          <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
            <select
              value={selectedKelurahan}
              onChange={(e) => setSelectedKelurahan(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 pl-4 pr-10 rounded-xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 cursor-pointer transition-all"
            >
              <option value="" disabled>Pilih Kelurahan...</option>
              {kelurahans.map((kel) => (
                <option key={kel.id} value={kel.id}>
                  Kelurahan {kel.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
              <Icon icon="mdi:chevron-down" className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <section className="py-12 lg:py-16 bg-white rounded-t-[3rem] relative z-10 -mt-10 shadow-[0_-15px_40px_rgba(0,0,0,0.1)] border-t border-slate-100">
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

          {categories.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="mdi:calendar-blank-outline" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Belum ada informasi</h3>
              <p className="text-slate-500">Tidak ada informasi untuk kelurahan yang dipilih saat ini.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}