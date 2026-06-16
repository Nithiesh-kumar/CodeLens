import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react';

const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // If it's already loaded in this session, skip entirely
    if (sessionStorage.getItem('codelens_loaded')) {
      setIsVisible(false);
      onComplete();
      return;
    }

    // Set flag and start loading timer (1.5s total)
    sessionStorage.setItem('codelens_loaded', 'true');
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // allow fade out
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-none"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-center gap-6"
        >
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-nebula-purple to-aurora-green rounded-2xl shadow-[0_0_40px_rgba(123,92,240,0.4)]">
              <Layers size={48} className="text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              CodeLens
            </h1>
          </div>
          
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
            Precision Static Analysis
          </div>
        </motion.div>

        {/* Progress bar container at bottom */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-64 h-1 bg-white/5 rounded-full overflow-hidden">
           <motion.div 
             initial={{ x: '-100%' }}
             animate={{ x: '100%' }}
             transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
             className="w-1/2 h-full bg-gradient-to-r from-transparent via-cosmic-blue to-transparent"
           />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
