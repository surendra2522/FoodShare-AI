import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Minus, Send, Sparkles, Utensils, 
  MapPin, Heart, ShieldCheck, Activity, Info, Headphones,
  Maximize2
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { chatbotResponses, getSimulatedAIResponse } from '../data/chatbotResponses';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const chatEndRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('foodshare_chat_history');
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    } else {
      // First time welcome
      const welcomeMsg = {
        id: Date.now(),
        text: "Hi 👋 I’m your FoodShare AI assistant. I can help you donate surplus food, find NGOs, track redistribution, and answer platform questions.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('foodshare_chat_history', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (text = inputText) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Process Bot Response
    setTimeout(() => {
      const botReply = getBotResponse(text.toLowerCase());
      const botMsg = {
        id: Date.now() + 1,
        text: botReply,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (text) => {
    // Check keywords
    for (const key in chatbotResponses) {
      if (text.includes(key)) return chatbotResponses[key];
    }
    
    // Check simulated AI responses
    const aiSim = getSimulatedAIResponse(text);
    if (aiSim) return aiSim;

    return "I’m still learning. Please contact support at support@foodshare.ai for more specific details about your query.";
  };

  const quickActions = [
    { label: 'Donate Food', icon: <Utensils size={14} />, keyword: 'donate' },
    { label: 'Nearby NGOs', icon: <MapPin size={14} />, keyword: 'ngo' },
    { label: 'Freshness Help', icon: <ShieldCheck size={14} />, keyword: 'freshness' },
    { label: 'Track Donation', icon: <Activity size={14} />, keyword: 'track' },
    { label: 'AI Insights', icon: <Sparkles size={14} />, keyword: 'ai' },
    { label: 'Contact Support', icon: <Headphones size={14} />, keyword: 'contact' },
  ];

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-[200]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { setIsOpen(true); setHasNotification(false); }}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all hover:bg-emerald-600 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageSquare size={28} className="relative z-10" />
          
          <AnimatePresence>
            {hasNotification && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[10px] font-bold z-20"
              >
                1
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* AI Pulse Effect */}
          <div className="absolute inset-0 h-full w-full animate-ping rounded-full bg-emerald-400/20" />
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[210] bg-slate-900/40 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.8, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.8 }}
              className="fixed bottom-24 right-6 z-[220] w-[90vw] max-w-[400px] h-[600px] glass rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-slate-900 px-6 py-5 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm tracking-tight">FoodShare AI Assistant</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Smart Support Active</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white">
                    <Minus size={18} />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/50">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                
                {messages.length < 5 && (
                   <div className="flex flex-wrap gap-2 mb-6">
                     {quickActions.map((action, idx) => (
                       <button
                         key={idx}
                         onClick={() => handleSend(action.label)}
                         className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[11px] font-bold text-slate-700 shadow-sm border border-slate-100 hover:border-emerald-200 hover:text-emerald-600 transition-all hover:scale-105 active:scale-95"
                       >
                         {action.icon}
                         {action.label}
                       </button>
                     ))}
                   </div>
                )}

                {isTyping && <TypingIndicator />}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-100">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex items-center gap-2 bg-slate-100 rounded-2xl p-1 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about donation or NGOs..."
                    className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
                      inputText.trim() 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95' 
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </form>
                <div className="mt-3 text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">
                  Powered by FoodShare AI Deep Learning
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
