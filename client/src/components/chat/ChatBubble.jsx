import React from 'react';
import { Icon } from '@iconify/react';

const ChatBubble = ({ message, senderRole, senderName, source, createdAt, isOwn, isRead }) => {
  const getBubbleStyle = () => {
    if (isOwn) {
      return 'bg-blue-600 text-white rounded-br-none';
    }
    if (senderRole === 'lurah') {
      return 'bg-emerald-50 border border-emerald-200 text-slate-800 rounded-bl-none';
    }
    // Default warga
    return 'bg-white border border-slate-200 text-slate-800 rounded-bl-none';
  };

  return (
    <div className={`flex flex-col mb-4 ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center gap-2 mb-1 px-1">
        <span className="text-xs text-slate-500 font-medium">{senderName}</span>
        {source === 'whatsapp' && (
          <Icon icon="logos:whatsapp-icon" className="w-3 h-3" />
        )}
      </div>
      <div className={`px-4 py-2.5 rounded-2xl shadow-sm max-w-[80%] ${getBubbleStyle()}`}>
        <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
      </div>
      <div className={`mt-1 px-1 text-[10px] text-slate-400 flex items-center gap-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
        {createdAt && new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        {(senderRole === 'admin' || senderRole === 'lurah') && (
          <Icon 
            icon={isRead ? "mdi:check-all" : "mdi:check"} 
            className={`w-3.5 h-3.5 ${isRead ? 'text-blue-500' : 'text-slate-400'}`} 
          />
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
