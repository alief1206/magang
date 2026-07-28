import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import adminImage from '../assets/images/karakter.png';

const pelayananData = {
  "Mediasi antar Warga": "Untuk pelayanan mediasi antar warga, silakan pastikan Anda telah berkoordinasi dengan Ketua RT/RW setempat terlebih dahulu. Mediasi dilakukan di Balai Kelurahan setiap hari kerja.",
  "Program Kelurahan": "Kelurahan saat ini sedang menjalankan program 'Kampung Bersih' dan pelatihan UMKM rutin. Informasi lebih lanjut bisa dilihat pada papan pengumuman kelurahan.",
  "Perizinan Kegiatan": "Surat pengantar RT/RW wajib disertakan untuk setiap pengajuan izin keramaian atau kegiatan warga. Proses maksimal 2 hari kerja setelah dokumen lengkap.",
  "Perkembangan Lingkungan": "Laporan mengenai infrastruktur lingkungan seperti jalan rusak atau lampu mati dapat diteruskan langsung, kami akan berkoordinasi dengan dinas terkait.",
  "Layanan Administrasi": "Pelayanan administrasi seperti pembuatan KTP, KK, atau Surat Keterangan beroperasi dari Senin-Jumat pukul 08:00 - 15:00 WIB."
};

export default function TanyaPelayanan() {
  const navigate = useNavigate();
  
  // LIVE CHAT STATES
  const [conversationId, setConversationId] = useState(localStorage.getItem('conversationId') || null);
  const [guestName, setGuestName] = useState(localStorage.getItem('guestName') || '');
  const [liveMessages, setLiveMessages] = useState([]);
  
  // BOT / LOCAL STATES
  const [localMessages, setLocalMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'greeting',
      text: 'Halo! Saya asisten virtual Kelurahan. Silakan pilih topik pelayanan di bawah ini atau ketik langsung pertanyaan Anda.'
    }
  ]);
  const [pendingSubject, setPendingSubject] = useState('');

  // FORM STATES
  const [inputText, setInputText] = useState("");
  const [kelurahans, setKelurahans] = useState([]);
  const [showDataDiriModal, setShowDataDiriModal] = useState(false);
  const [dataDiri, setDataDiri] = useState({ nama: '', kelurahanId: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Fetch kelurahan data for the form
  useEffect(() => {
    fetch('http://localhost:5000/api/kelurahans')
      .then(res => res.json())
      .then(data => setKelurahans(data))
      .catch(err => console.error("Failed to fetch kelurahans", err));
  }, []);

  // Poll for messages if conversation exists (Live mode)
  useEffect(() => {
    let interval;
    if (conversationId) {
      const fetchConversation = () => {
        fetch(`http://localhost:5000/api/chats/${conversationId}`)
          .then(res => {
            if (!res.ok) {
              if (res.status === 404) {
                // If conversation not found, clear local storage
                localStorage.removeItem('conversationId');
                setConversationId(null);
              }
              throw new Error('Failed to fetch conversation');
            }
            return res.json();
          })
          .then(data => {
            setLiveMessages(data.data.messages || []);
          })
          .catch(err => console.error(err));
      };
      
      fetchConversation(); // Initial fetch
      interval = setInterval(fetchConversation, 3000); // Poll every 3 seconds
    }
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, liveMessages]);

  const handleDataDiriChange = (e) => {
    const { name, value } = e.target;
    setDataDiri(prev => ({ ...prev, [name]: value }));
  };

  // BOT INTERACTIONS
  const handleSelectCategory = (topik) => {
    const userMsg = { id: Date.now(), sender: 'user', text: topik };
    const botMsg = { 
      id: Date.now() + 1, 
      sender: 'bot', 
      type: 'confirmation',
      text: pelayananData[topik],
      originalSubject: topik
    };
    setLocalMessages(prev => [...prev, userMsg, botMsg]);
  };

  const handleConfirmation = (isHelpful, subject) => {
    if (isHelpful) {
      setLocalMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: 'Terima kasih! Senang bisa membantu Anda. Ada yang lain?'
      }]);
    } else {
      setLocalMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        type: 'escalation',
        text: 'Mohon maaf jawaban saya belum membantu. Silakan isi data diri Anda, dan pesan ini akan diteruskan ke Admin / Lurah.'
      }]);
      setPendingSubject(subject || 'Pertanyaan Lanjutan');
      setShowDataDiriModal(true);
    }
  };

  const handleSendLocalMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Push user message
    setLocalMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: inputText
    }]);

    // Push bot escalation
    setTimeout(() => {
      setLocalMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        type: 'escalation',
        text: 'Pesan Anda memerlukan bantuan Admin/Lurah. Silakan lengkapi data diri Anda agar kami dapat membalas.'
      }]);
      setPendingSubject(inputText);
      setShowDataDiriModal(true);
    }, 500);

    setInputText('');
  };

  // LIVE CHAT CREATION
  const createConversation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const payload = {
        subject: pendingSubject,
        kelurahanId: parseInt(dataDiri.kelurahanId, 10),
        guestName: dataDiri.nama,
        message: pendingSubject,
      };

      const response = await fetch('http://localhost:5000/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Gagal memulai percakapan');
      
      const data = await response.json();
      const newConversationId = data.data.id;
      
      localStorage.setItem('conversationId', newConversationId);
      localStorage.setItem('guestName', dataDiri.nama);
      
      setConversationId(newConversationId);
      setGuestName(dataDiri.nama);
      setShowDataDiriModal(false);
      setInputText('');
    } catch (error) {
      console.error(error);
      alert('Gagal memulai percakapan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendLiveMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const payload = {
        message: inputText,
        guestName: guestName,
      };

      const response = await fetch(`http://localhost:5000/api/chats/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Gagal mengirim pesan');
      
      const data = await response.json();
      setLiveMessages(prev => [...prev, data.data]);
      setInputText('');
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim pesan');
    }
  };

  const handleSubmit = (e) => {
    if (conversationId) {
      handleSendLiveMessage(e);
    } else {
      handleSendLocalMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F4F8] font-sans">
      <header className="bg-[#112A46] px-6 py-5 flex items-center gap-4 text-white z-10 shadow-md shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors outline-none">
          <Icon icon="mdi:arrow-left" className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
            <Icon icon="mdi:chat-processing-outline" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-[18px] leading-tight tracking-wide">Tanya Pelayanan</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-emerald-300 font-medium">
                {conversationId ? 'Terhubung dengan Kelurahan' : 'Asisten Virtual Kelurahan'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col gap-6">
        
        {/* RENDER BOT MODE */}
        {!conversationId && localMessages.map((msg) => {
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
                      Topik Konsultasi (Otomatis)
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
              <div key={msg.id} className="flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#E5EFFA] flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm mt-1">
                    <Icon icon="mdi:robot-outline" className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="p-4 lg:p-5 rounded-2xl text-[15px] shadow-sm whitespace-pre-wrap leading-relaxed bg-white text-slate-700 rounded-tl-none border border-slate-200">
                    {msg.text}
                  </div>
                </div>
                <div className="ml-15 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-fit rounded-tl-none">
                  <h4 className="font-bold text-slate-700 mb-4 text-[15px]">Apakah Jawaban ini Membantu?</h4>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleConfirmation(true, msg.originalSubject)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-blue-50 text-slate-700 font-medium text-sm transition-colors outline-none"
                    >
                      <Icon icon="mdi:thumb-up" className="text-blue-600" /> Ya, membantu
                    </button>
                    <button 
                      onClick={() => handleConfirmation(false, msg.originalSubject)}
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
              <div key={msg.id} className="flex items-start gap-4 animate-in fade-in zoom-in duration-200">
                <div className="w-11 h-11 rounded-full bg-[#E5EFFA] flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm mt-1">
                  <Icon icon="mdi:robot-outline" className="w-7 h-7 text-blue-600" />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center max-w-[320px] rounded-tl-none">
                  <h4 className="font-bold text-[#112A46] text-[16px] mb-2">Teruskan ke Admin/Lurah</h4>
                  <p className="text-slate-500 text-[13px] mb-5 leading-relaxed">
                    {msg.text}
                  </p>
                  <button onClick={() => setShowDataDiriModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm w-full justify-center outline-none">
                    <Icon icon="mdi:account-details-outline" className="w-5 h-5" /> Isi Data Diri
                  </button>
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
                className={`p-4 lg:p-5 rounded-2xl text-[15px] shadow-sm whitespace-pre-wrap leading-relaxed max-w-[80%]
                  ${msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'}`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* RENDER LIVE CHAT MODE */}
        {conversationId && liveMessages.map((msg) => {
          const isUser = msg.senderRole === 'warga';
          const isLurah = msg.senderRole === 'lurah';
          
          return (
            <div 
              key={msg.id} 
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-4 animate-in fade-in zoom-in duration-200`}
            >
              {!isUser && (
                <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border shadow-sm mt-1 ${isLurah ? 'bg-amber-50 border-amber-200' : 'bg-[#E5EFFA] border-blue-100'}`}>
                  {isLurah ? (
                     <Icon icon="mdi:account-tie" className="w-6 h-6 text-amber-600" />
                  ) : (
                     <Icon icon="mdi:shield-account" className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[80%]">
                {!isUser && (
                  <span className="text-xs font-semibold ml-2 text-slate-500 flex items-center gap-1">
                    {isLurah ? 'Bapak/Ibu Lurah' : 'Admin Kelurahan'}
                    {msg.source === 'whatsapp' && <Icon icon="mdi:whatsapp" className="text-emerald-500" />}
                  </span>
                )}
                <div 
                  className={`p-4 lg:p-5 rounded-2xl text-[15px] shadow-sm whitespace-pre-wrap leading-relaxed
                    ${isUser 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : isLurah 
                        ? 'bg-amber-100 text-amber-900 rounded-tl-none border border-amber-200'
                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'}`}
                >
                  {msg.message}
                </div>
                <span className={`text-[10px] text-slate-400 mt-1 ${isUser ? 'text-right mr-1' : 'ml-1'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 lg:p-6 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3 items-center">
           <input 
             type="text" 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder="Ketik pertanyaan Anda di sini..." 
             className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-4 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all text-[15px]" 
           />
           
           <button type="submit" disabled={!inputText.trim()} className="w-14 h-14 rounded-full bg-[#112A46] disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-800 flex items-center justify-center text-white shadow-md transition-colors outline-none flex-shrink-0 cursor-pointer">
             <Icon icon="mdi:send" className="w-6 h-6 translate-x-[2px] translate-y-[1px]" />
           </button>
        </form>
      </footer>

      {/* Modal Data Diri untuk Memulai Live Chat */}
      {showDataDiriModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112A46]/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-6 lg:p-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#112A46]">Hubungi Admin / Lurah</h3>
              <button 
                onClick={() => setShowDataDiriModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2"
                type="button"
              >
                <Icon icon="mdi:close" className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-sm text-slate-500 mb-6">
              Karena pertanyaan Anda memerlukan bantuan khusus, pesan akan diteruskan ke tim Kelurahan. Silakan lengkapi data Anda.
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
                  Kelurahan Anda <span className="text-red-500">*</span>
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <>Meneruskan... <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" /></>
                ) : (
                  <>Kirim ke Admin <Icon icon="mdi:send" className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}