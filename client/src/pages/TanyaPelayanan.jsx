import React, { useState, useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
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

const layananAdministrasiList = [
  {
    id: 1,
    name: "Kartu Tanda Penduduk (KTP)/ Pemula/ Perubahan/ Kehilangan",
    syarat: `Persyaratan Penerbitan KTP:\n1. Pengantar Ketua RT diketahui RW\n2. KK Asli\n3. Surat Laporan kehilangan dari Kepolisian apabila KTP dan KK Asli Hilang.\n4. Pas Foto 3x4 Cm 2 lembar (Untuk tahun lahir ganjil background warna MERAH dan tahun lahir genap background warna BIRU)\n5. Bukti Pelunasan PBB`
  },
  {
    id: 2,
    name: "Kartu Keluarga (KK)",
    syarat: `Persyaratan Kartu Keluarga (KK):\n1. Pengantar Ketua RT diketahui RW\n2. KK Asli (Untuk Perubahan)\n3. KTP Anggota keluarga\n4. Surat Laporan kehilangan dari Polri apabila KTP dan KK Asli Hilang.\n5. FC Akta Nikah\n6. Surat Kelahiran dari Bidan/ RS untuk penambahan anggota keluarga\n7. FC Surat Pindah datang (bagi penduduk yang baru pindah)\n8. Bukti Pelunasan PBB.`
  },
  {
    id: 3,
    name: "Pendaftaran Penduduk Pindah Datang (WNI)",
    syarat: `Persyaratan Pendaftaran Penduduk Pindah Datang (WNI):\n1. Surat Pengantar Ketua RT diketahui RW\n2. Surat Pindah dari tempat asal dan lampirannya\n3. Rekomendasi dari Dispenduk Capil (bagi penduduk yang pindah dari luar kabupaten/ provinsi)\n4. Sertifikat Vaksin Covid 19`
  },
  {
    id: 4,
    name: "Pendaftaran Penduduk Pindah Keluar (WNI)",
    syarat: `Persyaratan Pendaftaran Penduduk Pindah Keluar (WNI):\n1. Surat Pengantar Ketua RT diketahui RW\n2. KTP dan KK\n3. Pas foto 3x4 Cm : 4 lembar untuk pindah dalam satu kecamatan, luar kecamatan 6 lembar\n4. SKCK untuk pindah luar Kecamatan/ Kabupaten\n5. Bukti Pelunasan PBB.`
  },
  {
    id: 5,
    name: "Surat Keterangan Bepergian",
    syarat: `Persyaratan Surat Keterangan Bepergian:\n1. Surat Pengantar Ketua RT diketahui RW\n2. KK dan KTP\n3. Pas Foto 3x4 Cm 2 lembar\n4. Surat Persetujuan Keluarga (Orang tua/ Suami/ Isteri)\n5. Bukti Pelunasan PBB.`
  },
  {
    id: 6,
    name: "Pendaftaran Kelahiran/ Keterangan Kelahiran",
    syarat: `Persyaratan Pendaftaran Kelahiran/ Keterangan Kelahiran:\n1. Surat Pengantar Ketua RT diketahui RW\n2. KK dan KTP orang tua\n3. Surat Nikah/ Akta Perkawinan orang tua\n4. Keterangan kelahiran dari bidan/ RS yang menolong persalinan\n5. KTP 2 orang saksi\n6. Bukti Pelunasan PBB.`
  },
  {
    id: 7,
    name: "Pencatatan lahir mati/ Pendaftaran Kematian/ Keterangan Kematian",
    syarat: `Persyaratan Pencatatan lahir mati/ Surat kematian:\n1. Surat Pengantar Ketua RT diketahui RW\n2. KK dan KTP\n3. Surat Nikah/ Akta Perkawinan\n4. Surat keterangan kematian dari dokter/ paramedis\n5. Surat keterangan dari Kepolisian\n6. Bukti Pelunasan PBB.`
  },
  {
    id: 8,
    name: "Surat Pengantar Permohonan Rekomendasi Ijin Keramaian",
    syarat: `Persyaratan Surat Pengantar Permohonan Rekomendasi Ijin Keramaian:\n1. Pengantar Ketua RT diketahui RW\n2. KK dan KTP\n3. Ketentuan lain terkait masa pandemi\n4. Bukti Pelunasan PBB`
  },
  {
    id: 9,
    name: "Surat Pernyataan Miskin (SPM)",
    syarat: `Persyaratan Surat Pernyataan Miskin (SPM):\n1. Pengantar Ketua RT diketahui RW\n2. KK dan KTP\n3. Surat Rujukan dari Faskes I (Puskesmas/ Dokter praktik)\n4. Bukti Pelunasan PBB`
  },
  {
    id: 10,
    name: "Surat Keterangan Tidak Mampu (SKTM)",
    syarat: `Persyaratan Surat Keterangan Tidak Mampu (SKTM):\n1. Pengantar Ketua RT diketahui RW\n2. KK dan KTP dan Kartu Pelajar/ Mahasiswa\n3. Bukti Bukti Lunas PBB`
  },
  {
    id: 11,
    name: "Surat Keterangan Belum Menikah (SKBM)",
    syarat: `Persyaratan Surat Keterangan Belum Menikah (SKBM):\n1. Surat Pengantar Ketua RT diketahui RW\n2. Pernyataan belum pernah menikah diketahui Orang tua/ RT dan RW\n3. KK dan KTP\n4. Bukti Pelunasan PBB`
  },
  {
    id: 12,
    name: "Surat Keterangan Usaha",
    syarat: `Persyaratan Surat Keterangan Usaha:\n1. Surat Pengantar Ketua RT diketahui RW\n2. KK dan KTP\n3. Bukti Kepemilikan Usaha/ Foto usaha/ pernyataan mempunyai usaha\n4. SPPT dan Bukti Pelunasan PBB`
  },
  {
    id: 13,
    name: "Surat Keterangan Pendaftaran Pernikahan",
    syarat: `Persyaratan Surat Keterangan Pendaftaran Pernikahan:\n1. Surat Pengantar Ketua RT diketahui RW\n2. Persetujuan Orang Tua bagi pasangan calon pengantin yang berusia minimal 19 tahun\n3. KTP dan KK orang tua\n4. Ijazah dan Akte Kelahiran\n5. KTP 2 orang saksi\n6. Foto pasangan calon pengantin 3x3 dalam 1 lembar sebanyak 4 lembar\n7. Materai 2 lembar\n8. Akta Perceraian (bila cerai hidup)\n9. Akta Kematian (bila cerai mati)\n10. Bukti Pelunasan PBB`
  },
  {
    id: 14,
    name: "Surat Keterangan Domisili Usaha/ Perusahaan/ Penduduk Sementara",
    syarat: `Persyaratan Surat Keterangan Domisili Usaha/ Perusahaan/ Penduduk Sementara:\n1. Surat Pengantar Ketua RT diketahui RW\n2. KK dan KTP\n3. Bukti Kepemilikan usaha/ perusahaan (akta pendirian/ NIB)\n4. SPPT dan Bukti Pelunasan PBB`
  },
  {
    id: 15,
    name: "Surat Keterangan Taksiran Harga Tanah",
    syarat: `Persyaratan Surat Keterangan Perkiraan/ Taksiran Harga Tanah:\n1. Surat Pengantar Ketua RT diketahui RW\n2. KK dan KTP Pemohon\n3. Bukti Kepemilikan Tanah\n4. Surat Pernyataan bermaterai mengetahui Ketua RT/ RW dan Tetangga sebelah objek\n5. SPPT dan Bukti Pelunasan PBB`
  },
  {
    id: 16,
    name: "Surat Keterangan/ Pernyataan Waris",
    syarat: `Persyaratan Surat Keterangan/ Pernyataan Waris:\n1. Surat Pengantar Ketua RT diketahui RW\n2. KK dan KTP Ahli Waris\n3. Bukti Kepemilikan/ Pernyataan tentang status tanah yang dimohon\n4. Silsilah Keluarga Ahli Waris\n5. SPPT dan Bukti Pelunasan PBB\n6. Materai 1 lembar\n7. KTP 2 orang saksi\n8. Akta Kelahiran seluruh ahli waris`
  },
  {
    id: 17,
    name: "Surat Kuasa",
    syarat: `Persyaratan Surat Kuasa:\n1. Pengantar Ketua RT diketahui RW\n2. KK dan KTP masing-masing pihak\n3. Materai 1 lembar\n4. Bukti Pelunasan PBB`
  },
  {
    id: 18,
    name: "Permohonan Tandatangan Mengetahui/ Legalisir",
    syarat: `Persyaratan Permohonan Tandatangan Mengetahui/ Legalisir:\n1. Surat Pengantar Ketua RT/ RW\n2. KK dan KTP\n3. Surat/ Dokumen Asli yang dilegalisir\n4. Bukti Pelunasan PBB`
  },
  {
    id: 19,
    name: "Surat keterangan Lainnya",
    syarat: `Persyaratan Surat Keterangan Lainnya:\n1. Surat Pengantar Ketua RT/ RW\n2. KK dan KTP\n3. Dokumen Pendukung (Wajib ada)\n4. Bukti Pelunasan PBB`
  }
];

export default function TanyaPelayanan() {
  const navigate = useNavigate();
  
  // LIVE CHAT STATES
  const [conversationId, setConversationId] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [liveMessages, setLiveMessages] = useState([]);
  const [notification, setNotification] = useState('');
  
  const prevLiveMessagesCount = useRef(0);
  const isFirstFetch = useRef(true);
  
  // BOT / LOCAL STATES
  const [localMessages, setLocalMessages] = useState(() => {
    const saved = localStorage.getItem('botChatHistory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 1,
        sender: 'bot',
        type: 'greeting',
        text: 'Halo! Saya asisten virtual Kelurahan. Silakan pilih topik pelayanan di bawah ini atau ketik langsung pertanyaan Anda.'
      }
    ];
  });
  const [pendingSubject, setPendingSubject] = useState('');
  const [pendingMessage, setPendingMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAwaitingQuestion, setIsAwaitingQuestion] = useState(false);
  const [isAwaitingMoreHelp, setIsAwaitingMoreHelp] = useState(false);

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
      .then(data => setKelurahans(data.data || []))
      .catch(err => console.error("Failed to fetch kelurahans", err));

    // Restore session from localStorage if exists
    const savedConversationId = localStorage.getItem('activeConversationId');
    const savedGuestName = localStorage.getItem('guestName');
    
    if (savedConversationId && savedGuestName) {
      setConversationId(savedConversationId);
      setGuestName(savedGuestName);
    }
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
                // If conversation not found, reset state and clear localStorage
                setConversationId(null);
                setGuestName('');
                setLiveMessages([]);
                localStorage.removeItem('activeConversationId');
                localStorage.removeItem('guestName');
                localStorage.removeItem('botChatHistory');
                setLocalMessages([{
                  id: 1,
                  sender: 'bot',
                  type: 'greeting',
                  text: 'Halo! Saya asisten virtual Kelurahan. Silakan pilih topik pelayanan di bawah ini atau ketik langsung pertanyaan Anda.'
                }]);
                alert('Sesi obrolan Anda telah ditutup oleh admin.');
              }
              throw new Error('Failed to fetch conversation');
            }
            return res.json();
          })
          .then(data => {
            const newMessages = data.data.messages || [];
            setLiveMessages(newMessages);

            if (!isFirstFetch.current && newMessages.length > prevLiveMessagesCount.current) {
               const lastMessage = newMessages[newMessages.length - 1];
               if (lastMessage && lastMessage.senderRole !== 'warga') {
                 setNotification('Pesan baru dari Admin/Lurah!');
                 setTimeout(() => setNotification(''), 4000);
                 
                 // Play notification sound
                 try {
                   const audio = new Audio('/notification.mp3');
                   audio.play().catch(e => e);
                 } catch(e) {}
               }
            }
            prevLiveMessagesCount.current = newMessages.length;
            isFirstFetch.current = false;
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

  useEffect(() => {
    localStorage.setItem('botChatHistory', JSON.stringify(localMessages));
  }, [localMessages]);

  const handleDataDiriChange = (e) => {
    const { name, value } = e.target;
    setDataDiri(prev => ({ ...prev, [name]: value }));
  };

  // BOT INTERACTIONS
  const resetSession = () => {
    setConversationId(null);
    setLiveMessages([]);
    localStorage.removeItem('activeConversationId');
    localStorage.removeItem('guestName');
    prevLiveMessagesCount.current = 0;
    isFirstFetch.current = true;
    setIsAwaitingMoreHelp(false);
  };

  const handleSelectCategory = (topik) => {
    resetSession();
    setSelectedCategory(topik);
    const userMsg = { id: Date.now(), sender: 'user', text: topik };
    
    if (topik === 'Layanan Administrasi') {
      const botMsg = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        type: 'layanan_list'
      };
      setLocalMessages(prev => [...prev, userMsg, botMsg]);
    } else {
      const botMsg = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        type: 'confirmation',
        text: pelayananData[topik],
        originalSubject: topik
      };
      setLocalMessages(prev => [...prev, userMsg, botMsg]);
    }
  };

  const handleSelectSubCategory = (layananId) => {
    if (!layananId) return;
    setIsAwaitingMoreHelp(false);
    const layanan = layananAdministrasiList.find(l => l.id === parseInt(layananId));
    if (layanan) {
      const userMsg = { id: Date.now(), sender: 'user', text: layanan.name };
      const botMsg = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        type: 'confirmation',
        text: layanan.syarat,
        originalSubject: 'Layanan Administrasi: ' + layanan.name
      };
      setLocalMessages(prev => [...prev, userMsg, botMsg]);
    }
  };

  const handleConfirmation = (isHelpful, subject) => {
    if (isHelpful) {
      setLocalMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: 'Terima kasih! Senang bisa membantu Anda. Ada yang lain?'
      }]);
      setIsAwaitingMoreHelp(true);
    } else {
      resetSession();
      setLocalMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: 'Silakan ketikkan pertanyaan Anda.'
      }]);
      setIsAwaitingQuestion(true);
      setIsAwaitingMoreHelp(false);
    }
  };

  const handleSendLocalMessage = (e) => {
    e.preventDefault();
    
    const sentText = inputText.trim();
    if (!sentText) return;

    setInputText('');

    // Push user message
    setLocalMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: sentText
    }]);

    if (isAwaitingMoreHelp) {
      const lowerText = sentText.toLowerCase();
      const isNegative = ['tidak', 'nggak', 'enggak', 'engga', 'tdk', 'ga', 'gak'].some(w => lowerText.includes(w));
      
      if (isNegative) {
        setIsAwaitingMoreHelp(false);
        setTimeout(() => {
          setLocalMessages(prev => [...prev, {
            id: Date.now() + 1,
            sender: 'bot',
            type: 'greeting',
            text: 'Baik. Silakan pilih topik pelayanan di bawah ini atau ketik langsung pertanyaan Anda jika ada keperluan lain.'
          }]);
        }, 500);
        return;
      }
      
      const isPositive = ['ya', 'iya', 'ada'].includes(lowerText);
      if (isPositive) {
        setIsAwaitingMoreHelp(false);
        setIsAwaitingQuestion(true);
        setTimeout(() => {
          setLocalMessages(prev => [...prev, {
            id: Date.now() + 1,
            sender: 'bot',
            text: 'Silakan ketikkan pertanyaan Anda.'
          }]);
        }, 500);
        return;
      }
      
      // If neither, assume it's their actual question, reset flag and fall through to escalation
      setIsAwaitingMoreHelp(false);
    }

    // Push bot escalation
    setTimeout(() => {
      setLocalMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        type: 'escalation',
        text: 'Terimakasih atas pertanyaan Anda, pertanyaan Anda akan kami teruskan ke pihak admin. Terimakasih. Silakan lengkapi data diri Anda di bawah ini.'
      }]);
      setPendingSubject(selectedCategory || 'Pertanyaan Umum');
      setPendingMessage(sentText);
      setShowDataDiriModal(true);
      setIsAwaitingQuestion(false);
    }, 500);
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
        message: pendingMessage,
      };

      const response = await fetch('http://localhost:5000/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Gagal memulai percakapan');
      
      const data = await response.json();
      const newConversationId = data.data.id;
      
      // Pre-populate live messages to avoid blank space
      setLiveMessages([{
        id: 'temp-' + Date.now(),
        message: pendingMessage,
        senderRole: 'warga',
        guestName: dataDiri.nama,
        createdAt: new Date().toISOString()
      }]);
      
      setConversationId(newConversationId);
      setGuestName(dataDiri.nama);
      
      // Save to localStorage
      localStorage.setItem('activeConversationId', newConversationId);
      localStorage.setItem('guestName', dataDiri.nama);
      
      setShowDataDiriModal(false);
      setInputText('');
      
      // Push the final bot message so it feels seamless
      setLocalMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: 'Terimakasih atas pertanyaan Anda, pertanyaan Anda akan kami teruskan ke pihak admin. Terimakasih.'
      }]);
      
    } catch (error) {
      console.error(error);
      alert('Gagal memulai percakapan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendLiveMessage = async (e) => {
    e.preventDefault();
    const sentText = inputText.trim();
    if (!sentText) return;
    
    setInputText('');
    
    const tempId = 'temp-' + Date.now();
    
    // Optimistic UI update
    setLiveMessages(prev => [...prev, {
      id: tempId,
      message: sentText,
      senderRole: 'warga',
      guestName: guestName,
      createdAt: new Date().toISOString()
    }]);

    try {
      const payload = {
        message: sentText,
        guestName: guestName,
      };

      const response = await fetch(`http://localhost:5000/api/chats/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 404) {
          setConversationId(null);
          setGuestName('');
          setLiveMessages([]);
          localStorage.removeItem('activeConversationId');
          localStorage.removeItem('guestName');
          localStorage.removeItem('botChatHistory');
          setLocalMessages([{
            id: 1,
            sender: 'bot',
            type: 'greeting',
            text: 'Halo! Saya asisten virtual Kelurahan. Silakan pilih topik pelayanan di bawah ini atau ketik langsung pertanyaan Anda.'
          }]);
          alert('Sesi obrolan Anda telah ditutup oleh admin.');
        }
        throw new Error('Gagal mengirim pesan');
      }
      
      const data = await response.json();
      
      // Replace optimistic message with actual message from server
      setLiveMessages(prev => prev.map(msg => msg.id === tempId ? data.data : msg));
      
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim pesan');
      // Revert optimistic message if error
      setLiveMessages(prev => prev.filter(msg => msg.id !== tempId));
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
    <ErrorBoundary fallbackRender={({ error }) => (
      <div className="p-10 text-red-600 bg-red-50 min-h-screen">
        <h1 className="text-2xl font-bold">Terjadi Kesalahan (Crash)</h1>
        <pre className="mt-4 bg-white p-4 rounded shadow overflow-auto whitespace-pre-wrap text-sm">{error.message}</pre>
        <pre className="mt-4 bg-white p-4 rounded shadow overflow-auto whitespace-pre-wrap text-xs">{error.stack}</pre>
        <p className="mt-4 font-bold">Mohon kirimkan tangkapan layar (screenshot) halaman ini agar bisa diperbaiki.</p>
      </div>
    )}>
      <div className="flex flex-col h-[100dvh] bg-[#F0F4F8] font-sans relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#112A46] text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-blue-800 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Icon icon="mdi:bell-ring-outline" className="w-6 h-6 text-blue-400" />
          </div>
          <span className="font-bold">{notification}</span>
          <button onClick={() => setNotification('')} className="ml-4 text-slate-400 hover:text-white">
            <Icon icon="mdi:close" className="w-5 h-5" />
          </button>
        </div>
      )}

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
        
        {/* RENDER BOT MODE (ALWAYS VISIBLE) */}
        {localMessages.map((msg) => {
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
                  {!conversationId ? (
                    <button onClick={() => setShowDataDiriModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm w-full justify-center outline-none">
                      <Icon icon="mdi:account-details-outline" className="w-5 h-5" /> Isi Data Diri
                    </button>
                  ) : (
                    <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-xl font-medium transition-colors text-sm w-full flex items-center justify-center gap-2 border border-emerald-200">
                      <Icon icon="mdi:check-circle" className="w-5 h-5" /> Data Diri Terkirim
                    </div>
                  )}
                </div>
              </div>
            );
          }

          if (msg.type === 'layanan_list') {
            return (
              <div key={msg.id} className="flex items-start gap-4 animate-in fade-in zoom-in duration-200">
                <div className="w-11 h-11 rounded-full bg-[#E5EFFA] flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm mt-1">
                  <Icon icon="mdi:robot-outline" className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <div className="bg-white px-6 py-5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-slate-700 text-[15px] leading-relaxed max-w-[800px]">
                    Silakan pilih layanan administrasi yang Anda butuhkan pada pilihan di bawah ini:
                  </div>
                  <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100 w-fit rounded-tl-none">
                    <h3 className="font-extrabold text-[#112A46] text-[16px] mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
                      <Icon icon="mdi:file-document-outline" className="w-6 h-6 text-blue-500" />
                      Layanan Administrasi
                    </h3>
                    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {layananAdministrasiList.map((layanan) => (
                        <button
                          key={layanan.id}
                          onClick={() => handleSelectSubCategory(layanan.id)}
                          className="text-left px-5 py-4 rounded-xl bg-slate-50 hover:bg-[#F0F6FF] border border-transparent hover:border-blue-200 text-slate-700 hover:text-blue-700 font-medium transition-all duration-200 flex items-center justify-between outline-none cursor-pointer text-[15px]"
                        >
                          <span className="max-w-[280px] sm:max-w-[350px]">{layanan.name}</span>
                          <Icon icon="mdi:chevron-right" className="w-5 h-5 ml-6 opacity-50 shrink-0" />
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
        {conversationId && liveMessages.map((msg, idx) => {
          // Skip first message if we still have local history (prevents duplicate display of the question)
          if (idx === 0 && msg.senderRole === 'warga' && localMessages.length > 1) {
            return null;
          }

          const isUser = msg.senderRole === 'warga';
          const isLurah = msg.senderRole === 'lurah' || msg.source === 'whatsapp';
          
          return (
            <div 
              key={msg.id} 
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-4 animate-in fade-in zoom-in duration-200`}
            >
              {!isUser && (
                <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border shadow-sm mt-1 ${isLurah ? 'bg-emerald-50 border-emerald-300 text-emerald-600 ring-2 ring-emerald-400/30' : 'bg-[#E5EFFA] border-blue-100 text-blue-600'}`}>
                  {isLurah ? (
                     <Icon icon="mdi:account-tie-voice" className="w-6 h-6" />
                  ) : (
                     <Icon icon="mdi:shield-account" className="w-6 h-6" />
                  )}
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[80%]">
                {!isUser && (
                  <span className="text-xs font-semibold ml-1 flex items-center gap-1">
                    {isLurah ? (
                      <span className="text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold shadow-xs">
                        <Icon icon="mdi:whatsapp" className="w-4 h-4 text-emerald-600 animate-pulse" />
                        Jawaban Resmi Pak Lurah (via WhatsApp)
                      </span>
                    ) : (
                      <span className="text-blue-700 font-bold flex items-center gap-1">
                        <Icon icon="mdi:shield-check" className="w-4 h-4 text-blue-600" />
                        Admin Kelurahan
                      </span>
                    )}
                  </span>
                )}
                <div 
                  className={`p-4 lg:p-5 rounded-2xl text-[15px] shadow-sm whitespace-pre-wrap leading-relaxed
                    ${isUser 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : isLurah 
                        ? 'bg-gradient-to-br from-emerald-50 to-white text-slate-800 rounded-tl-none border-2 border-emerald-400 shadow-md'
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
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-6 lg:p-8 animate-in fade-in zoom-in duration-300 max-h-[90dvh] overflow-y-auto">
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
    </ErrorBoundary>
  );
}