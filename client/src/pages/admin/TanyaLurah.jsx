import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import QuickReply from '../../components/chat/QuickReply';

export default function TanyaLurah() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Common states
  const [error, setError] = useState('');
  
  // List View states
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Detail View states
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [notification, setNotification] = useState('');
  
  const messagesEndRef = useRef(null);
  const prevWaitingCount = useRef(0);
  const isFirstFetch = useRef(true);

  const token = localStorage.getItem('adminToken');
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const currentRole = adminUser.role;

  useEffect(() => {
    let interval;
    if (token) {
      fetchConversations(true); // Initial fetch
      interval = setInterval(() => {
        fetchConversations(false);
      }, 3000);
    } else {
      setError('Sesi telah berakhir atau Anda belum login.');
      setIsLoading(false);
    }
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    let detailInterval;
    if (selectedConversationId) {
      fetchConversationDetail(selectedConversationId, true);
      detailInterval = setInterval(() => {
        fetchConversationDetail(selectedConversationId, false);
      }, 3000);
    }
    return () => {
      if (detailInterval) clearInterval(detailInterval);
    };
  }, [selectedConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getHeaders = () => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const fetchConversations = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/chats', { headers: getHeaders() });
      if (!res.ok) throw new Error('Gagal memuat percakapan');
      const data = await res.json();
      
      const newConversations = data.data || [];
      setConversations(newConversations);

      const currentWaitingCount = newConversations.filter(c => c.status === 'waiting_response').length;
      
      if (!isFirstFetch.current && currentWaitingCount > prevWaitingCount.current) {
         setNotification('Ada pesan baru dari warga!');
         // Auto hide notification
         setTimeout(() => setNotification(''), 4000);
         
         // Play sound (optional, might require user interaction first, but standard notification sound)
         try {
           const audio = new Audio('/notification.mp3'); // Fallback if file doesn't exist it fails silently
           audio.play().catch(e => e);
         } catch(e) {}
      }
      
      prevWaitingCount.current = currentWaitingCount;
      isFirstFetch.current = false;
      
    } catch (err) {
      console.error(err);
      if (showLoading) setError(err.message);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const fetchConversationDetail = async (id, showLoading = true) => {
    try {
      if (showLoading) setIsDetailLoading(true);
      const res = await fetch(`http://localhost:5000/api/chats/${id}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Gagal memuat detail percakapan');
      const data = await res.json();
      setSelectedConversation(data.data);
      setMessages(data.data.messages || []);
    } catch (err) {
      console.error(err);
      if (showLoading) alert(err.message);
    } finally {
      if (showLoading) setIsDetailLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || !selectedConversationId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/chats/${selectedConversationId}/messages`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message: text })
      });
      if (!res.ok) throw new Error('Gagal mengirim pesan');
      fetchConversationDetail(selectedConversationId);
      fetchConversations();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleForwardToLurah = async () => {
    if (!selectedConversationId) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/chats/${selectedConversationId}/forward-to-lurah`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Gagal meneruskan ke lurah');
      }
      fetchConversationDetail(selectedConversationId);
      fetchConversations();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedConversationId) return;
    
    if (!window.confirm("Apakah Anda yakin ingin menghapus percakapan ini? Tindakan ini akan menutup obrolan bagi pengguna.")) {
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5000/api/chats/${selectedConversationId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Gagal menghapus percakapan');
      
      setSelectedConversationId(null);
      fetchConversations();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // List view logic
  const tabs = [
    { id: 'all', label: 'Semua' },
    { id: 'waiting_response', label: 'Menunggu Respon' },
    { id: 'perlu_lurah', label: 'Perlu Lurah' },
    { id: 'answered', label: 'Sudah Dijawab' },
    { id: 'closed', label: 'Ditutup' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'waiting_response': return 'text-red-600 bg-red-50 border-red-100';
      case 'answered': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'closed': return 'text-slate-600 bg-slate-50 border-slate-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'waiting_response': return 'Menunggu Respon';
      case 'answered': return 'Sudah Dijawab';
      case 'closed': return 'Ditutup';
      default: return status;
    }
  };

  const filteredConversations = conversations.filter(conv => {
    let matchesTab = false;
    if (activeTab === 'all') {
      matchesTab = true;
    } else if (activeTab === 'perlu_lurah') {
      matchesTab = conv.targetRole === 'lurah' && conv.status === 'waiting_response';
    } else {
      matchesTab = conv.status === activeTab;
    }

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (conv.citizenName?.toLowerCase() || '').includes(searchLower) || 
                          (conv.subject?.toLowerCase() || '').includes(searchLower);
    return matchesTab && matchesSearch;
  });

  const getTabCount = (tabId) => {
    if (tabId === 'all') return conversations.length;
    if (tabId === 'perlu_lurah') return conversations.filter(c => c.targetRole === 'lurah' && c.status === 'waiting_response').length;
    return conversations.filter(c => c.status === tabId).length;
  };

  if (!token || error) {
    return (
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col items-center justify-center h-full">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
          <Icon icon="mdi:alert-circle" className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Akses Ditolak</h2>
          <p>{error || 'Silakan login terlebih dahulu.'}</p>
        </div>
      </div>
    );
  }

  // Detail View render
  if (selectedConversationId) {
    return (
      <div className="p-4 md:p-8 max-w-[1000px] mx-auto w-full flex flex-col h-[calc(100vh-80px)]">
        <div className="mb-4 flex items-center gap-4">
          <button 
            onClick={() => setSelectedConversationId(null)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <Icon icon="mdi:arrow-left" className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-[#112A46] leading-tight">
              {selectedConversation?.citizenName || 'Memuat...'}
            </h1>
            <p className="text-slate-500 font-medium">
              Subjek: {selectedConversation?.subject || '-'} • <span className="text-blue-600 font-semibold">{selectedConversation?.kelurahanName ? `Kelurahan ${selectedConversation.kelurahanName}` : ''}</span>
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {selectedConversation?.status && (
              <span className={`px-4 py-1.5 rounded-full border text-sm font-bold ${getStatusStyle(selectedConversation.status)}`}>
                {getStatusLabel(selectedConversation.status)}
              </span>
            )}
            
            {selectedConversation?.targetRole === 'lurah' || selectedConversation?.forwardedToLurahPhone ? (
              <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-sm font-bold flex items-center gap-2">
                <Icon icon="mdi:account-tie" className="w-4 h-4" />
                Tujuan: Pak Lurah
              </div>
            ) : (
              <button
                onClick={handleForwardToLurah}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-bold flex items-center gap-2 shadow-sm shadow-emerald-500/20"
              >
                <Icon icon="mdi:database-send" className="w-5 h-5" />
                Teruskan ke Lurah
              </button>
            )}

            <button
              onClick={handleDeleteConversation}
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors text-sm font-bold flex items-center gap-2"
              title="Hapus Percakapan"
            >
              <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
              Hapus
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50">
            {isDetailLoading ? (
              <div className="flex justify-center items-center h-full">
                <Icon icon="mdi:loading" className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <ChatBubble 
                    key={msg.id}
                    message={msg.message}
                    senderRole={msg.senderRole}
                    senderName={msg.senderName}
                    source={msg.source}
                    createdAt={msg.createdAt}
                    isOwn={msg.senderRole === currentRole}
                    isRead={msg.isRead}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100 space-y-4">
            <QuickReply 
              onSelect={handleSendMessage} 
              replies={currentRole === 'lurah' ? [
                'Baik, akan segera saya tindak lanjuti.',
                'Terima kasih atas masukannya.',
                'Silakan temui saya di kantor kelurahan.',
                'Apakah ada hal lain yang bisa saya bantu?'
              ] : [
                'Terima kasih, akan kami proses.', 
                'Mohon tunggu konfirmasi dari Lurah.', 
                'Silakan datang ke kantor kelurahan membawa dokumen terkait.',
                'Ada yang bisa kami bantu lagi?'
              ]}
            />
            <ChatInput 
              key={selectedConversationId} 
              onSend={handleSendMessage} 
              placeholder="Ketik pesan balasan..." 
              disabled={isDetailLoading}
              initialValue={selectedConversation?.subject ? `Terkait ${selectedConversation.subject}, ` : ''} 
            />
          </div>
        </div>
      </div>
    );
  }

  // List View render
  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col h-full relative">
      
      {/* Toast Notification */}
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-4 right-8 z-50 bg-[#112A46] text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-blue-800"
        >
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Icon icon="mdi:bell-ring-outline" className="w-6 h-6 text-blue-400" />
          </div>
          <span className="font-bold">{notification}</span>
          <button onClick={() => setNotification('')} className="ml-4 text-slate-400 hover:text-white">
            <Icon icon="mdi:close" className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#112A46] mb-2">Tanya Lurah</h1>
        <p className="text-slate-500">Kelola dan balas pertanyaan warga dengan cepat.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col flex-1 overflow-hidden">
        <div className="p-6 border-b border-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:max-w-md">
              <Icon icon="mdi:magnify" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari nama atau subjek..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchParams({ tab: tab.id });
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#112A46] text-white shadow-md' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {getTabCount(tab.id)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Icon icon="mdi:loading" className="w-10 h-10 animate-spin text-blue-500" />
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((msg, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
                key={msg.id} 
                onClick={() => setSelectedConversationId(msg.id)}
                className="group flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                    {(msg.citizenName || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-extrabold text-[#112A46] text-[16px] group-hover:text-blue-600 transition-colors truncate">
                        {msg.citizenName}
                      </h4>
                      {msg.kelurahanName && (
                        <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-bold shrink-0">
                          {msg.kelurahanName}
                        </span>
                      )}
                      {msg.lastMessageAt && (
                        <span className="text-xs font-medium text-slate-400">
                          {new Date(msg.lastMessageAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                      {(msg.targetRole === 'lurah' || msg.forwardedToLurahPhone) && (
                        <Icon icon="mdi:account-tie" className="w-4 h-4 text-emerald-600" title="Tujuan: Pak Lurah" />
                      )}
                    </div>
                    <p className="text-[14px] text-slate-600 truncate">{msg.subject}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 shrink-0 pl-16 md:pl-0">
                  <div className={`px-4 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap ${getStatusStyle(msg.status)}`}>
                    {getStatusLabel(msg.status)}
                  </div>
                  <Icon icon="mdi:chevron-right" className="w-6 h-6 text-slate-300 group-hover:text-blue-500 transition-colors hidden md:block" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Icon icon="mdi:inbox-outline" className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-[#112A46] mb-1">Tidak ada percakapan</h3>
              <p className="text-slate-500 text-sm">Coba ubah filter atau kata kunci pencarian.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}