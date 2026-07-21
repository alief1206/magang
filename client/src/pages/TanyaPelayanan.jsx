import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import adminImage from '../assets/images/karakter.png';

export default function TanyaPelayanan() {
  const navigate = useNavigate();
  
  const pelayananData = {
    "Mediasi antar Warga": {
      info: "Untuk proses Mediasi antar Warga, silakan menyiapkan dokumen berikut:\n\n✓ Fotokopi KTP pelapor & terlapor (jika ada)\n✓ Surat Pengantar RT/RW setempat\n✓ Bukti pendukung masalah (foto/surat)\n\nPertemuan akan dijadwalkan dalam 3-5 hari kerja setelah berkas diterima."
    },
    "Program Kelurahan": {
      info: "Program Kelurahan aktif meliputi:\n\n✓ Pemberdayaan ekonomi UMKM\n✓ Posyandu Balita & Lansia berkala\n✓ Program bantuan sosial daerah\n\nUntuk pendaftaran UMKM, silakan bawa fotokopi KTP dan NIB (jika ada)."
    },
    "Perizinan Kegiatan": {
      info: "Untuk Perizinan Kegiatan warga (keramaian/hajatan), mohon siapkan:\n\n✓ Fotokopi KTP Penanggung Jawab\n✓ Surat Pengantar RT/RW\n✓ Proposal acara singkat\n\nPengajuan dilakukan maksimal 7 hari sebelum pelaksanaan."
    },
    "Perkembangan Lingkungan": {
      info: "Laporan Perkembangan Lingkungan (renovasi fasum, drainase, jalan rusak) wajib menyertakan:\n\n✓ Foto lokasi kejadian/kerusakan\n✓ Alamat lengkap (RT/RW)\n✓ Deskripsi singkat masalah\n\nLaporan akan diteruskan ke tim teknis terkait."
    },
    "Layanan Administrasi": {
      info: "Untuk layanan administrasi (KTP, KK, Akta), silakan siapkan dokumen umum berikut:\n\n✓ Fotokopi dokumen lama (jika ada)\n✓ Surat pengantar RT/RW\n✓ Dokumen asli untuk verifikasi\n\nProses layanan biasanya memakan waktu 1-3 hari kerja."
    }
  };

  const [messages, setMessages] = useState([
    { id: 0, sender: 'bot', type: 'greeting', text: 'Halo, selamat datang di Pusat Layanan Konsultasi Lurah. Silakan pilih topik masalah atau keluhan yang ingin Anda bahas!' }
  ]);
  
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectCategory = (topik) => {
    const userMsg = { id: Date.now(), sender: 'user', text: topik };
    const botInfoMsg = { id: Date.now() + 1, sender: 'bot', type: 'info', text: pelayananData[topik].info };
    const botConfirmMsg = { id: Date.now() + 2, sender: 'bot', type: 'confirmation' };
    
    setMessages((prev) => [...prev, userMsg, botInfoMsg, botConfirmMsg]);
  };

  const handleConfirmation = (isHelpful) => {
    const userMsg = { 
      id: Date.now(), 
      sender: 'user', 
      text: isHelpful ? 'Ya, membantu' : 'Belum' 
    };

    let botReplyMsg;

    if (isHelpful) {
      botReplyMsg = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        type: 'text', 
        text: 'Baik, terima kasih! Silakan pilih topik lain jika ada yang ingin ditanyakan kembali.' 
      };
    } else {
      botReplyMsg = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        type: 'escalation'
      };
    }

    setMessages((prev) => [...prev, userMsg, botReplyMsg]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: inputText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText(""); 

    setTimeout(() => {
      const botReply = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        type: 'text', 
        text: "Pertanyaan spesifik Anda akan kami teruskan ke Admin Kelurahan untuk penanganan lebih lanjut." 
      };
      const escalationMsg = { 
        id: Date.now() + 2, 
        sender: 'bot', 
        type: 'escalation'
      };
      
      setMessages((prev) => [...prev, botReply, escalationMsg]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F4F8] font-sans">
      <header className="bg-[#112A46] px-6 py-5 flex items-center gap-4 text-white z-10 shadow-md shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors outline-none">
          <Icon icon="mdi:arrow-left" className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
            <Icon icon="mdi:card-account-phone-outline" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-[18px] leading-tight tracking-wide">Konsultasi & Pelayanan</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-emerald-300 font-medium">Siap Membantu</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col gap-8">
        {messages.map((msg) => {
          if (msg.type === 'greeting') {
            return (
              <div key={msg.id} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#E5EFFA] flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm mt-1">
                  <Icon icon="mdi:robot-outline" className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex flex-col gap-6 w-full">
                  <div className="bg-white px-6 py-5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-slate-700 text-[16px] leading-relaxed max-w-[800px]">
                    {msg.text}
                  </div>
                  <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100 w-fit">
                    <h3 className="font-extrabold text-[#112A46] text-[16px] mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
                      <Icon icon="mdi:handshake-outline" className="w-6 h-6 text-blue-500" />
                      Topik Konsultasi Warga
                    </h3>
                    <div className="flex flex-col gap-3">
                      {Object.keys(pelayananData).map((topik, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectCategory(topik)}
                          className="text-left px-5 py-4 rounded-xl bg-slate-50 hover:bg-[#F0F6FF] border border-transparent hover:border-blue-200 text-slate-700 hover:text-blue-700 font-medium transition-all duration-200 flex items-center justify-between outline-none cursor-pointer text-[15px]"
                        >
                          {topik}
                          <Icon icon="mdi:chevron-right" className="w-5 h-5 ml-6 opacity-50" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (msg.type === 'confirmation') {
            return (
              <div key={msg.id} className="flex items-start gap-4 animate-in fade-in zoom-in duration-200 ml-15">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-fit rounded-tl-none">
                  <h4 className="font-bold text-slate-700 mb-4 text-[15px]">Apakah Jawaban ini Membantu?</h4>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleConfirmation(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-blue-50 text-slate-700 font-medium text-sm transition-colors outline-none"
                    >
                      <Icon icon="mdi:thumb-up" className="text-blue-600" /> Ya, membantu
                    </button>
                    <button 
                      onClick={() => handleConfirmation(false)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-red-50 text-slate-700 font-medium text-sm transition-colors outline-none"
                    >
                      <Icon icon="mdi:thumb-down" className="text-red-500" /> Belum
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          if (msg.type === 'escalation') {
            return (
              <div key={msg.id} className="flex items-start gap-4 animate-in fade-in zoom-in duration-200 ml-15">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center max-w-[320px] rounded-tl-none">
                  <img src={adminImage} alt="Admin Kelurahan" className="w-32 h-auto mb-4 object-contain" />
                  <h4 className="font-bold text-[#112A46] text-[16px] mb-2">Hubungi Admin Kelurahan</h4>
                  <p className="text-slate-500 text-[13px] mb-5 leading-relaxed">
                    Sampaikan pertanyaan Anda langsung melalui WhatsApp agar segera ditangani oleh staf kami.
                  </p>
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm w-full justify-center outline-none">
                    <Icon icon="mdi:whatsapp" className="w-5 h-5" /> Hubungi via WhatsApp
                  </a>
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
                {msg.text || msg.info}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 lg:p-6 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3 items-center">
           <button type="button" className="w-12 h-12 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors outline-none cursor-pointer">
             <Icon icon="mdi:paperclip" className="w-7 h-7" />
           </button>
           
           <input 
             type="text" 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder="Sampaikan pertanyaan Anda lebih lanjut..." 
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