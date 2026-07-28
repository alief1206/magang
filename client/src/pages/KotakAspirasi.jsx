import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function KotakAspirasi() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    kategori: '',
    judul: '',
    pesan: '',
    isAnonim: false
  });

  const [dataDiri, setDataDiri] = useState({
    nama: '',
    alamat: '',
    nomorHp: '',
    kelurahanId: ''
  });
  
  const [kelurahans, setKelurahans] = useState([]);
  
  const [showDataDiriModal, setShowDataDiriModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/kelurahans')
      .then(res => res.json())
      .then(data => setKelurahans(data))
      .catch(err => console.error("Failed to fetch kelurahans", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDataDiriChange = (e) => {
    const { name, value } = e.target;
    setDataDiri(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAspirasiSubmit = (e) => {
    e.preventDefault();
    setShowDataDiriModal(true);
  };

  const submitToAPI = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        name: formData.isAnonim ? 'Anonim' : dataDiri.nama,
        address: dataDiri.alamat,
        category: formData.kategori,
        shortTitle: formData.judul,
        description: formData.pesan,
        kelurahanId: parseInt(dataDiri.kelurahanId, 10),
        source: 'web'
      };

      const response = await fetch('http://localhost:5000/api/aspirations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim aspirasi');
      }

      setShowDataDiriModal(false);
      setIsSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat mengirim aspirasi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative">
      <div className="w-full bg-gradient-to-b from-[#112A46] to-[#1A3D63] pt-6 pb-24 relative z-0">
        
        <header className="px-6 lg:px-10 py-4 flex items-center gap-4 text-white">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer outline-none">
            <Icon icon="mdi:arrow-left" className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-[18px] tracking-wide">Kotak Aspirasi</h1>
        </header>

        <div className="flex flex-col items-center text-center mt-4 px-4">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-5 border border-white/20 shadow-lg">
            <Icon icon="mdi:lightbulb-on-outline" className="w-8 h-8 text-emerald-300" />
          </div>
          <h2 className="text-[32px] lg:text-[40px] font-extrabold text-white mb-3 tracking-tight">Sampaikan Suara Anda</h2>
          <p className="text-blue-100 text-[16px] lg:text-[18px] leading-relaxed max-w-xl">
            Ide, saran, dan evaluasi pelayanan Anda sangat berarti untuk kemajuan kebijakan di desa kita.
          </p>
        </div>
      </div>
      
      <main className="flex-1 w-full bg-white rounded-t-[3rem] -mt-12 relative z-10 px-6 py-12 lg:py-16 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        
        <div className="max-w-[1100px] mx-auto">
          {!isSubmitted ? (
            <form onSubmit={handleAspirasiSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              
              <div className="md:col-span-2 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-4 items-start mb-2">
                <Icon icon="mdi:alert-circle-outline" className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[14px] lg:text-[15px] text-amber-900 leading-relaxed">
                  <strong>Perhatian:</strong> Formulir ini khusus untuk usulan program dan evaluasi pelayanan. Untuk laporan <strong>kerusakan infrastruktur fisik</strong> (jalan berlubang, dll), mohon gunakan <a href="https://smartkampung.id/" target="_blank" rel="noopener noreferrer" className="font-bold underline text-amber-700 hover:text-amber-500 transition-colors">Smart Kampung</a>.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[15px] font-bold text-[#112A46]">Kategori Usulan <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Icon icon="mdi:tag-outline" className="w-6 h-6" />
                  </div>
                  <select 
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    required
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all text-slate-700 font-semibold text-[15px] appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Pilih kategori...</option>
                    <option value="Kualitas Pelayanan Administrasi">Kualitas Pelayanan Administrasi</option>
                    <option value="Pemberdayaan & UMKM">Pemberdayaan & UMKM Warga</option>
                    <option value="Kegiatan Sosial & Kesehatan">Sosial & Kesehatan (Posyandu, dll)</option>
                    <option value="Inovasi & Kegiatan Pemuda">Inovasi & Kegiatan Pemuda</option>
                    <option value="Ketertiban & Keamanan">Ketertiban & Keamanan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-400">
                    <Icon icon="mdi:chevron-down" className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[15px] font-bold text-[#112A46]">Judul Singkat <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Icon icon="mdi:format-title" className="w-6 h-6" />
                  </div>
                  <input 
                    type="text" 
                    name="judul"
                    value={formData.judul}
                    onChange={handleChange}
                    placeholder="Contoh: Pengadaan Bak Sampah"
                    required
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all text-slate-700 font-semibold text-[15px]"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col gap-3 mt-2">
                <label className="text-[15px] font-bold text-[#112A46]">Detail Aspirasi <span className="text-red-500">*</span></label>
                <textarea 
                  name="pesan"
                  value={formData.pesan}
                  onChange={handleChange}
                  placeholder="Ceritakan lebih detail mengenai gagasan atau evaluasi Anda di sini..."
                  required
                  rows="6"
                  className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all text-slate-700 font-medium text-[15px] resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="md:col-span-2 flex items-start gap-4 p-5 bg-[#F0F6FF] rounded-2xl border border-blue-100">
                <input 
                  type="checkbox" 
                  id="anonim"
                  name="isAnonim"
                  checked={formData.isAnonim}
                  onChange={handleChange}
                  className="w-5 h-5 mt-1 rounded border-blue-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
                <label htmlFor="anonim" className="text-[14.5px] text-slate-600 cursor-pointer select-none leading-relaxed">
                  <strong className="text-[#112A46] block mb-1">Kirim sebagai Anonim</strong>
                  Identitas Anda tidak akan ditampilkan ke publik, sehingga Anda dapat memberikan evaluasi atau saran dengan lebih nyaman.
                </label>
              </div>

              <button 
                type="submit" 
                className="md:col-span-2 w-full bg-gradient-to-r from-[#112A46] to-[#1A3D63] hover:from-blue-900 hover:to-blue-800 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 transition-all mt-4 shadow-[0_10px_20px_rgba(17,42,70,0.2)] hover:shadow-[0_15px_30px_rgba(17,42,70,0.3)] hover:-translate-y-1 text-[16px]"
              >
                Kirim Aspirasi Sekarang <Icon icon="mdi:send-check" className="w-6 h-6" />
              </button>
            </form>

          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
              <div className="w-28 h-28 bg-[#F0FDF4] text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[inset_0_4px_20px_rgba(16,185,129,0.15)] border border-emerald-100">
                <Icon icon="mdi:check-decagram" className="w-16 h-16" />
              </div>
              <h3 className="text-3xl font-extrabold text-[#112A46] mb-4">Berhasil Dikirim!</h3>
              <p className="text-slate-500 text-[16px] leading-relaxed max-w-md mb-10">
                Terima kasih atas partisipasi Anda. Pesan Anda telah masuk ke sistem dan akan menjadi bahan pertimbangan Lurah.
              </p>
              <button 
                onClick={() => navigate(-1)} 
                className="px-10 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#112A46] font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors text-[15px]"
              >
                <Icon icon="mdi:arrow-left" className="w-5 h-5"/> Kembali ke Layanan Utama
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modal Data Diri */}
      {showDataDiriModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112A46]/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl p-6 lg:p-8 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#112A46]">Lengkapi Data Diri</h3>
              <button 
                onClick={() => setShowDataDiriModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2"
                type="button"
              >
                <Icon icon="mdi:close" className="w-6 h-6" />
              </button>
            </div>
            
            {errorMsg && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200 flex items-center gap-2">
                <Icon icon="mdi:alert-circle" className="w-5 h-5 shrink-0" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={submitToAPI} className="flex flex-col gap-4">
              <div>
                <label className="text-[14px] font-bold text-[#112A46] mb-1.5 block">
                  Nama Lengkap {!formData.isAnonim && <span className="text-red-500">*</span>}
                </label>
                <input 
                  type="text" 
                  name="nama"
                  value={dataDiri.nama}
                  onChange={handleDataDiriChange}
                  required={!formData.isAnonim}
                  disabled={formData.isAnonim}
                  placeholder={formData.isAnonim ? "Anonim (Disembunyikan)" : "Contoh: Budi Santoso"}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all text-slate-700 disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[14px] font-bold text-[#112A46] mb-1.5 block">
                  Alamat / RT RW <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="alamat"
                  value={dataDiri.alamat}
                  onChange={handleDataDiriChange}
                  required
                  placeholder="Contoh: Jl. Merdeka RT 01/RW 02"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all text-slate-700"
                />
              </div>

              <div>
                <label className="text-[14px] font-bold text-[#112A46] mb-1.5 block">
                  Kelurahan/Desa <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <select 
                    name="kelurahanId"
                    value={dataDiri.kelurahanId}
                    onChange={handleDataDiriChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all text-slate-700 appearance-none pr-10"
                  >
                    <option value="" disabled>Pilih Kelurahan...</option>
                    {kelurahans.map(kel => (
                      <option key={kel.id} value={kel.id}>{kel.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                    <Icon icon="mdi:chevron-down" className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[14px] font-bold text-[#112A46] mb-1.5 block">
                  Nomor HP / WhatsApp (Opsional)
                </label>
                <input 
                  type="text" 
                  name="nomorHp"
                  value={dataDiri.nomorHp}
                  onChange={handleDataDiriChange}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all text-slate-700"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#112A46] to-[#1A3D63] hover:from-blue-900 hover:to-blue-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <>Memproses... <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" /></>
                ) : (
                  <>Kirim Aspirasi <Icon icon="mdi:check-circle" className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}