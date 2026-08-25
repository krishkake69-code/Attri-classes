import { useState } from 'react';
import { Sparkles, X, Flame } from 'lucide-react';
import { motion } from 'motion/react';

interface AdmissionBannerProps {
  message?: string;
}

export default function AdmissionBanner({ message }: AdmissionBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-orange-600 via-amber-500 to-blue-700 text-white relative z-50 text-xs sm:text-sm font-medium py-2.5 px-4 shadow-md"
      id="admission-alert-banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 animate-pulse">
            <Flame className="w-3 h-3 text-amber-200 fill-amber-200" /> New Session
          </span>
          <span className="text-center sm:text-left">
            {message ? (
              <span className="font-bold tracking-wide">{message}</span>
            ) : (
              <>
                Admissions Open for <span className="font-bold underline">NEET, JEE, Board Batches (2026-2027)</span>.
                <span className="hidden md:inline"> Early bird registration discount of 15% valid this week!</span>
              </>
            )}
          </span>
        </div>
        
        <div className="flex items-center gap-4 mx-auto sm:mx-0 shrink-0">
          <a
            href="#contact"
            className="bg-white text-blue-900 hover:bg-orange-100 px-3.5 py-1 rounded-full text-xs font-semibold shadow transition-all duration-200 flex items-center gap-1 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500 group-hover:scale-125 transition-transform" />
            Book Free Demo
          </a>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
