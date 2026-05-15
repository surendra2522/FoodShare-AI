import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-md border border-slate-100">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.2
              }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            />
          ))}
        </div>
        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest ml-1">AI Thinking...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
