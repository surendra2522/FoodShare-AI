import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
          isBot ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
        }`}>
          {isBot ? <Sparkles size={14} /> : <User size={14} />}
        </div>
        
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isBot 
            ? 'bg-white text-slate-800 rounded-bl-none shadow-md border border-slate-100' 
            : 'bg-emerald-600 text-white rounded-br-none shadow-lg shadow-emerald-200'
        }`}>
          {message.text}
          <div className={`text-[10px] mt-1.5 opacity-50 ${isBot ? 'text-slate-400' : 'text-emerald-100'}`}>
            {message.timestamp}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
