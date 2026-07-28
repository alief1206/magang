import React from 'react';
import { Icon } from '@iconify/react';

const QuickReply = ({ replies, onSelect }) => {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="flex overflow-x-auto gap-2 py-2 px-1 scrollbar-hide">
      {replies.map((reply, index) => (
        <button
          key={index}
          onClick={() => onSelect(reply)}
          className="flex items-center gap-1.5 flex-shrink-0 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl px-4 py-2 text-sm text-slate-700 transition-colors"
        >
          <Icon icon="mdi:flash" className="w-4 h-4 text-amber-500" />
          <span className="whitespace-nowrap">{reply}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickReply;
