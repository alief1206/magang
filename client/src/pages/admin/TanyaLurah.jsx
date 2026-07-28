import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import QuickReply from '../../components/chat/QuickReply';

export default function TanyaLurah() {
  // Common states
  const [error, setError] = useState('');
  
  // List View states
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Detail View states
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (token) {
      fetchConversations();
    } else {
      setError('Sesi telah berakhir atau Anda belum login.');
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (selectedConversationId) {
      fetchConversationDetail(selectedConversationId);
    }
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

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/chats', { headers: getHeaders() });
      if (!res.ok) throw new Error('Gagal memuat percakapan');
      const data = await res.json();
      setConversations(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversationDetail = async (id) => {
    try {
      setIsDetailLoading(true);
      const res = await fetch(`http://localhost:5000/api/chats/${id}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Gagal memuat detail percakapan');
      const data = await res.json();
      setSelectedConversation(data.data);
      setMessages(data.data.messages || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsDetailLoading(false);
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
      if (!res.ok) throw new Error('Gagal meneruskan ke lurah');
      const data = await res.json();
      alert('Berhasil meneruskan pesan ke Lurah.');
      if (data.data.whatsappUrl) {
        window.open(data.data.whatsappUrl, '_blank');
      }
      fetchConversationDetail(selectedConversationId);
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
    const matchesTab = activeTab === 'all' || conv.status === activeTab;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (conv.citizenName?.toLowerCase() || '').includes(searchLower) || 
                          (conv.subject?.toLowerCase() || '').includes(searchLower);
    return matchesTab && matchesSearch;
  });

  const getTabCount = (tabId) => {
    if (tabId === 'all') return conversations.length;
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
              Subjek: {selectedConversation?.subject || '-'}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {selectedConversation?.status && (
              <span className={`px-4 py-1.5 rounded-full border text-sm font-bold ${getStatusStyle(selectedConversation.status)}`}>
                {getStatusLabel(selectedConversation.status)}
              </span>
            )}
            
            {selectedConversation?.forwardedToLurahPhone ? (
              <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-sm font-bold flex items-center gap-2">
                <Icon icon="logos:whatsapp-icon" className="w-4 h-4" />
                Sudah diteruskan
              </div>
            ) : (
              <button
                onClick={handleForwardToLurah}
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors text-sm font-bold flex items-center gap-2 shadow-sm shadow-emerald-500/20"
              >
                <Icon icon="logos:whatsapp-icon" className="w-5 h-5" />
                Teruskan ke Lurah
              </button>
            )}
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
                    isOwn={msg.senderRole === 'admin'}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100 space-y-4">
            <QuickReply 
              onSelect={handleSendMessage} 
              replies={[
                'Terima kasih, akan kami proses.', 
                'Mohon tunggu konfirmasi dari Lurah.', 
                'Silakan datang ke kantor kelurahan membawa dokumen terkait.',
                'Ada yang bisa kami bantu lagi?'
              ]}
            />
            <ChatInput onSend={handleSendMessage} placeholder="Ketik pesan balasan..." disabled={isDetailLoading} />
          </div>
        </div>
      </div>
    );
  }

  // List View render
  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col h-full">
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
                onClick={() => setActiveTab(tab.id)}
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
                      {msg.lastMessageAt && (
                        <span className="text-xs font-medium text-slate-400">
                          {new Date(msg.lastMessageAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                      {msg.forwardedToLurahPhone && (
                        <Icon icon="logos:whatsapp-icon" className="w-4 h-4" title="Diteruskan ke Lurah" />
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