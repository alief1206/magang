import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function TanyaLurah() {
  const faqData = {
    'Cara Membuat Surat Domisili': 'Untuk membuat Surat Domisili, silakan bawa: \n- KTP Asli \n- Kartu Keluarga \n- Surat Pengantar dari RT/RW. \nProses ini biasanya selesai dalam 1 hari kerja.',
    'Syarat Pindah Datang': 'Syarat Pindah Datang: \n- Surat Pindah dari daerah asal \n- KTP & KK asli \n- Fotokopi dokumen pendukung. \nSilakan datang ke loket kelurahan untuk verifikasi.',
    'Jam Pelayanan Kelurahan': 'Jam Pelayanan Kelurahan: \nSenin - Kamis: 08.00 - 15.30 WIB \nJumat: 08.00 - 11.00 WIB \nSabtu & Minggu: Tutup',
    'Pertanyaan Infrastruktur': 'Untuk laporan infrastruktur (jalan rusak/lampu mati), silakan lampirkan foto lokasi dan detail alamat. Laporan akan diteruskan ke tim teknis lapangan.',
    'Bagaimana cara mengurus KK': 'Mengurus KK baru: \n- Surat Pengantar RT/RW \n- Fotokopi KTP \n- Dokumen pendukung (Akta Kelahiran/Nikah).',
    'Laporan Kehilangan Dokumen' : 'Untuk laporan kehilangan dokumen, silakan datang ke kelurahan dengan membawa fotokopi dokumen yang hilang dan KTP asli. Petugas akan membantu membuat surat kehilangan resmi.',
    'Permohonan Izin Usaha' : 'Untuk permohonan izin usaha, silakan lengkapi dokumen berikut: \n- Fotokopi KTP pemohon \n- Fotokopi KK \n- Surat Pengantar RT/RW \n- Rencana usaha atau deskripsi kegiatan.'
  };

  const [messages, setMessages] = useState([
    { id: 0, sender: 'bot', isFirstMessage: true }
  ]);
  const [inputText, setInputText] = useState("");
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectCategory = (category) => {
    const userMsg = { id: Date.now(), sender: 'user', text: category };
    const botMsg = { id: Date.now() + 1, sender: 'bot', text: faqData[category] };
    setMessages([...messages, userMsg, botMsg]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: inputText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText(""); 

    setTimeout(() => {
      let botReply = "Maaf, saya belum menemukan jawaban pasti untuk pertanyaan tersebut. Silakan pilih dari Pertanyaan Populer atau hubungi loket kelurahan.";
      const textLower = inputText.toLowerCase();

      if (textLower.includes("ktp")) {
        botReply = "Untuk keperluan KTP (baru/hilang/rusak), silakan bawa KK Asli dan Surat Pengantar RT/RW ke loket 1 kelurahan.";
      } else if (textLower.includes("jam") || textLower.includes("buka")) {
        botReply = "Kelurahan buka dari Senin-Kamis (08.00-15.30 WIB) dan Jumat (08.00-11.00 WIB). Sabtu & Minggu kami tutup.";
      } else if (textLower.includes("halo") || textLower.includes("pagi")) {
        botReply = "Halo! Selamat datang di Tanya Lurah ASLI. Silakan ketik pertanyaan Anda seputar layanan administrasi.";
      }

      const botMsg = { id: Date.now() + 1, sender: 'bot', text: botReply };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#F0F4F8] font-sans">
      <header className="bg-[#112A46] px-6 py-5 flex items-center gap-4 text-white z-10 shadow-md">
        <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer outline-none">
          <Icon icon="mdi:arrow-left" className="w-6 h-6" />
        </Link>
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
            <Icon icon="mdi:robot-outline" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-[18px] leading-tight tracking-wide">Tanya Lurah ASLI</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-emerald-300 font-medium">Online</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col gap-8">
        
        {messages.map((msg) => {
          if (msg.isFirstMessage) {
            return (
              <div key={msg.id} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#E5EFFA] flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm mt-1">
                  <Icon icon="mdi:robot-outline" className="w-7 h-7 text-blue-600" />
                </div>

                <div className="flex flex-col gap-6 w-full">
                  <div className="bg-white px-6 py-5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-slate-700 text-[16px] leading-relaxed max-w-[800px]">
                    Halo! Saya AI Asisten Lurah. Silakan pilih topik di bawah atau ketik pertanyaan Anda.
                  </div>

                  <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100 w-fit">
                    <h3 className="font-extrabold text-[#112A46] text-[16px] mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
                      <Icon icon="mdi:chat-question-outline" className="w-6 h-6 text-blue-500" />
                      Pertanyaan Populer
                    </h3>
                    <div className="flex flex-col gap-3">
                      {Object.keys(faqData).map((cat, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectCategory(cat)}
                          className="text-left px-5 py-4 rounded-xl bg-slate-50 hover:bg-[#F0F6FF] border border-transparent hover:border-blue-200 text-slate-700 hover:text-blue-700 font-medium transition-all duration-200 flex items-center justify-between outline-none cursor-pointer text-[15px]"
                        >
                          {cat}
                          <Icon icon="mdi:chevron-right" className="w-5 h-5 ml-6 opacity-50" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-4 animate-in fade-in zoom-in duration-200`}
            >
              {msg.sender === 'bot' && (
                <div className="w-11 h-11 rounded-full bg-[#E5EFFA] flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm mt-1">
                  <Icon icon="mdi:robot-outline" className="w-7 h-7 text-blue-600" />
                </div>
              )}
              <div 
                className={`p-6 rounded-2xl max-w-[800px] text-[16px] shadow-sm whitespace-pre-line leading-relaxed
                  ${msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 lg:p-6 bg-white border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3 items-center">
           <button type="button" className="w-12 h-12 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors outline-none cursor-pointer">
             <Icon icon="mdi:paperclip" className="w-7 h-7" />
           </button>
           
           <input 
             type="text" 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder="Ketik pertanyaan Anda..." 
             className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-4 outline-none focus:border-blue-300 focus:bg-white transition-all text-[16px]" 
           />
           
           <button type="submit" className="w-14 h-14 rounded-full bg-[#112A46] hover:bg-blue-800 flex items-center justify-center text-white shadow-md transition-colors outline-none flex-shrink-0 cursor-pointer">
             <Icon icon="mdi:send" className="w-6 h-6 translate-x-[2px] translate-y-[1px]" />
           </button>
        </form>
      </footer>
    </div>
  );
}