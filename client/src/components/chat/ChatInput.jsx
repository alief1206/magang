import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const ChatInput = ({ onSend, placeholder = 'Ketik pesan...', disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full p-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-[#112A46] focus:ring-1 focus:ring-[#112A46] disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#112A46] text-white hover:bg-[#1a3f69] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
      >
        <Icon icon="mdi:send" className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatInput;
