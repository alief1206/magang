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
  const [activeChatId, setActiveChatId] = useState(localStorage.getItem('userActiveChatId') || null);
  const [chatCodeInput, setChatCodeInput] = useState("");
  const [chatInfo, setChatInfo] = useState(null);
  const [loadingCode, setLoadingCode] = useState(false);

  const [kelurahans, setKelurahans] = useState([]);
  const [showDataDiriModal, setShowDataDiriModal] = useState(false);
  const [dataDiri, setDataDiri] = useState({ nama: '', kelurahanId: '' });
  const [pendingText, setPendingText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/kelurahans')
      .then(res => res.json())
      .then(data => setKelurahans(data.data || []))
      .catch(err => console.error("Failed to fetch kelurahans", err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatInfo]);

  // Polling data chat asli dari server jika activeChatId terpasang
  useEffect(() => {
    let interval;
    if (activeChatId) {
      fetchServerChat(activeChatId);
      interval = setInterval(() => {
        fetchServerChat(activeChatId);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeChatId]);

  const fetchServerChat = async (chatId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/chats/${chatId}`);
      if (!res.ok) {
        if (res.status === 404) {
          // Jika chat dihapus oleh admin, reset state ke awal
          setActiveChatId(null);
          localStorage.removeItem('userActiveChatId');
          setChatInfo(null);
        }
        return;
      }
      const data = await res.json();
      const conversation = data.data;

      if (conversation) {
        setChatInfo(conversation);
      }
    } catch (err) {
      console.error("Gagal mengambil data chat server:", err);
    }
  };

  const handleLookupChatCode = async (e) => {
    e.preventDefault();
    if (!chatCodeInput.trim()) return;

    // Bersihkan format "CHAT-2" -> "2"
    const cleanedId = chatCodeInput.replace(/CHAT-/i, '').trim();
    if (!cleanedId) return;

    setLoadingCode(true);
    try {
      const res = await fetch(`http://localhost:5000/api/chats/${cleanedId}`);
      if (!res.ok) throw new Error('Pesan tidak ditemukan');
      const data = await res.json();
      
      setActiveChatId(cleanedId);
      localStorage.setItem('userActiveChatId', cleanedId);
      setChatInfo(data.data);
      setChatCodeInput("");
    } catch (err) {
      alert("Kode Chat tidak ditemukan! Silakan periksa kembali kode Anda (Contoh: CHAT-2).");
    } finally {
      setLoadingCode(false);
    }
  };

  const handleSelectCategory = (category) => {
    const userMsg = { id: Date.now(), sender: 'user', text: category };
    const botMsg = { id: Date.now() + 1, sender: 'bot', text: faqData[category] };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleDataDiriChange = (e) => {
    const { name, value } = e.target;
    setDataDiri(prev => ({ ...prev, [name]: value }));
  };

  const createConversation = async (e) => {
    e.preventDefault();
    if (!dataDiri.kelurahanId) {
      alert('Silakan pilih kelurahan Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kelurahanId: parseInt(dataDiri.kelurahanId, 10),
          guestName: dataDiri.nama || 'Warga',
          subject: pendingText.slice(0, 50),
          message: pendingText
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Gagal membuat pesan');
      }

      const data = await res.json();
      const newChatId = data.data.id;
      setActiveChatId(newChatId);
      localStorage.setItem('userActiveChatId', newChatId);
      setShowDataDiriModal(false);
      setInputText('');
      setPendingText('');
      fetchServerChat(newChatId);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Gagal mengirim pesan ke kelurahan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const currentText = inputText;

    if (activeChatId) {
      setInputText("");
      try {
        const res = await fetch(`http://localhost:5000/api/chats/${activeChatId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: currentText })
        });
        
        if (!res.ok && res.status === 404) {
          // Chat sudah dihapus, reset dan lanjut ke pemindahan ke modal
          setActiveChatId(null);
          localStorage.removeItem('userActiveChatId');
          setChatInfo(null);
        } else {
          fetchServerChat(activeChatId);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Jika belum ada chat aktif, buka modal data diri (Nama & Kelurahan)
    setPendingText(currentText);
    setShowDataDiriModal(true);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#F0F4F8] font-sans">
      {/* Header Utama */}
      <header className="bg-[#112A46] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white z-10 shadow-md">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer outline-none">
            <Icon icon="mdi:arrow-left" className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center border border-white/10 relative">
              <Icon icon="mdi:robot-outline" className="w-6 h-6 text-white" />
              {activeChatId && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div>
              <h2 className="font-bold text-[18px] leading-tight tracking-wide flex items-center gap-2">
                Tanya Lurah ASLI
                {activeChatId && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-mono">
                    CHAT-{activeChatId}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-emerald-300 font-medium">
                  {chatInfo ? `Status: ${chatInfo.status === 'answered' ? 'Sudah Dijawab Pak Lurah' : 'Diproses'}` : 'Online'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Lacak Kode Chat di Header */}
        <form onSubmit={handleLookupChatCode} className="flex items-center gap-2 bg-white/10 p-2 rounded-xl border border-white/20 shadow-inner">
          <Icon icon="mdi:magnify" className="w-5 h-5 text-emerald-400 ml-1" />
          <input
            type="text"
            value={chatCodeInput}
            onChange={(e) => setChatCodeInput(e.target.value)}
            placeholder="Lacak Kode (Misal: CHAT-2)"
            className="bg-transparent text-white placeholder-blue-200/70 text-xs px-2 py-1 outline-none w-44 font-mono font-semibold"
          />
          <button
            type="submit"
            disabled={loadingCode}
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {loadingCode ? 'Mencari...' : 'Lacak Chat'}
          </button>
          {activeChatId && (
            <button
              type="button"
              onClick={() => {
                setActiveChatId(null);
                localStorage.removeItem('userActiveChatId');
                setChatInfo(null);
              }}
              title="Keluar dari Lacak Chat"
              className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-200 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </form>
      </header>

      {/* Main Body */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col gap-6">
        {/* Card Petunjuk Lacak Kode jika belum ada chat aktif */}
        {!activeChatId && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-md border border-blue-400/30 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center border border-white/20 flex-shrink-0">
                <Icon icon="mdi:ticket-confirmation-outline" className="w-7 h-7 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-[16px] flex items-center gap-2">
                  Sudah Punya Kode Chat (Contoh: CHAT-2)?
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Ketik kode chat Anda di bawah ini atau di header kanan atas untuk melihat balasan resmi dari Pak Lurah.
                </p>
              </div>
            </div>

            <form onSubmit={handleLookupChatCode} className="flex items-center gap-2 bg-white/20 p-1.5 rounded-xl border border-white/30">
              <input
                type="text"
                value={chatCodeInput}
                onChange={(e) => setChatCodeInput(e.target.value)}
                placeholder="Ketik CHAT-2"
                className="bg-transparent text-white placeholder-white/70 text-xs px-3 py-1.5 outline-none w-36 font-mono font-bold"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-1"
              >
                <Icon icon="mdi:magnify" className="w-4 h-4" /> Lacak
              </button>
            </form>
          </div>
        )}

        {/* Jika ada percakapan aktif di server */}
        {chatInfo && chatInfo.messages && chatInfo.messages.length > 0 ? (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            {/* Notification Banner untuk Chat Berkode */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md border border-blue-700/40 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                  <Icon icon="mdi:whatsapp" className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    Obrolan Resmi Kode: <span className="font-mono text-emerald-300 text-base">CHAT-{chatInfo.id}</span>
                  </h4>
                  <p className="text-xs text-blue-200">
                    {chatInfo.status === 'answered'
                      ? 'Pak Lurah telah memberikan balasan resmi untuk pertanyaan Anda!'
                      : 'Pertanyaan telah diteruskan ke Pak Lurah. Balasan akan muncul otomatis di sini.'}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider ${
                chatInfo.status === 'answered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {chatInfo.status === 'answered' ? 'Dijawab Pak Lurah' : 'Menunggu Lurah'}
              </span>
            </div>

            {/* List Pesan Server */}
            {chatInfo.messages.map((m) => {
              const isUser = m.senderRole === 'warga';
              const isLurahWA = m.senderRole === 'lurah' || m.source === 'whatsapp';
              const isAdmin = m.senderRole === 'admin';

              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3 animate-in fade-in zoom-in duration-200`}
                >
                  {!isUser && (
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mt-1 border ${
                      isLurahWA 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-600 ring-2 ring-emerald-400/30' 
                        : 'bg-[#E5EFFA] border-blue-100 text-blue-600'
                    }`}>
                      <Icon icon={isLurahWA ? "mdi:account-tie-voice" : "mdi:account-tie"} className="w-6 h-6" />
                    </div>
                  )}

                  <div className={`flex flex-col gap-1 max-w-[800px] ${isUser ? 'items-end' : 'items-start'}`}>
                    {/* Header Nama Pengirim */}
                    <div className="flex items-center gap-2 text-xs font-semibold px-1">
                      {isUser && <span className="text-slate-500">Anda (Warga)</span>}
                      {isAdmin && <span className="text-blue-700 font-bold flex items-center gap-1"><Icon icon="mdi:shield-check" className="w-4 h-4 text-blue-600" /> Admin Kelurahan</span>}
                      {isLurahWA && (
                        <span className="text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5 font-bold shadow-xs">
                          <Icon icon="mdi:whatsapp" className="w-4 h-4 text-emerald-600 animate-pulse" />
                          Jawaban Resmi Pak Lurah (via WhatsApp)
                        </span>
                      )}
                    </div>

                    {/* Bubble Content */}
                    <div
                      className={`p-5 rounded-2xl text-[16px] shadow-sm whitespace-pre-line leading-relaxed ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : isLurahWA
                          ? 'bg-gradient-to-br from-emerald-50 to-white text-slate-800 rounded-tl-none border-2 border-emerald-400 shadow-md'
                          : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                      }`}
                    >
                      {m.message}
                    </div>

                    <span className="text-[11px] text-slate-400 px-1 mt-0.5">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Tampilan Bot Default saat belum ada chat server terpilih */
          messages.map((msg) => {
            if (msg.isFirstMessage) {
              return (
                <div key={msg.id} className="flex items-start gap-4 max-w-4xl mx-auto w-full">
                  <div className="w-11 h-11 rounded-full bg-[#E5EFFA] flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm mt-1">
                    <Icon icon="mdi:robot-outline" className="w-7 h-7 text-blue-600" />
                  </div>

                  <div className="flex flex-col gap-6 w-full">
                    <div className="bg-white px-6 py-5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-slate-700 text-[16px] leading-relaxed max-w-[800px]">
                      Halo! Saya AI Asisten Lurah. Silakan pilih topik di bawah atau ketik pertanyaan Anda untuk diteruskan ke Pak Lurah.
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
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-4 max-w-4xl mx-auto w-full animate-in fade-in zoom-in duration-200`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-11 h-11 rounded-full bg-[#E5EFFA] flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm mt-1">
                    <Icon icon="mdi:robot-outline" className="w-7 h-7 text-blue-600" />
                  </div>
                )}
                <div
                  className={`p-6 rounded-2xl max-w-[800px] text-[16px] shadow-sm whitespace-pre-line leading-relaxed
                    ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Footer Form Send */}
      <footer className="p-4 lg:p-6 bg-white border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3 items-center">
          <button
            type="button"
            className="w-12 h-12 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors outline-none cursor-pointer"
          >
            <Icon icon="mdi:paperclip" className="w-7 h-7" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={activeChatId ? "Ketik pesan balasan Anda..." : "Ketik pertanyaan Anda seputar pelayanan..."}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-4 outline-none focus:border-blue-300 focus:bg-white transition-all text-[16px]"
          />

          <button
            type="submit"
            className="w-14 h-14 rounded-full bg-[#112A46] hover:bg-blue-800 flex items-center justify-center text-white shadow-md transition-colors outline-none flex-shrink-0 cursor-pointer"
          >
            <Icon icon="mdi:send" className="w-6 h-6 translate-x-[2px] translate-y-[1px]" />
          </button>
        </form>
      </footer>

      {/* Modal Data Diri untuk Memulai Chat Kelurahan */}
      {showDataDiriModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112A46]/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-6 lg:p-8 animate-in fade-in zoom-in duration-300 max-h-[90dvh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#112A46]">Kirim Pertanyaan ke Lurah</h3>
              <button 
                onClick={() => setShowDataDiriModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2"
                type="button"
              >
                <Icon icon="mdi:close" className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-sm text-slate-500 mb-6">
              Silakan lengkapi data Anda dan pilih Kelurahan tujuan agar pertanyaan Anda dapat langsung diterima oleh Admin/Lurah terkait.
            </p>

            <form onSubmit={createConversation} className="flex flex-col gap-4">
              <div>
                <label className="text-[14px] font-bold text-[#112A46] mb-1.5 block">
                  Nama Anda <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="nama"
                  value={dataDiri.nama}
                  onChange={handleDataDiriChange}
                  required
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700"
                />
              </div>

              <div>
                <label className="text-[14px] font-bold text-[#112A46] mb-1.5 block">
                  Kelurahan Tujuan <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <select 
                    name="kelurahanId"
                    value={dataDiri.kelurahanId}
                    onChange={handleDataDiriChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 appearance-none pr-10"
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

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                {isLoading ? (
                  <>Meneruskan... <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" /></>
                ) : (
                  <>Kirim ke Admin/Lurah <Icon icon="mdi:send" className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}