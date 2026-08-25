import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquareCode, X, Send, Beaker } from 'lucide-react';

interface FloatingWhatsAppProps {
  phone?: string;
}

export default function FloatingWhatsApp({ phone }: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '919876543210';

  const handleWhatsAppRedirect = (customMsg?: string) => {
    const baseMsg = customMsg || "Hello ATTRI CHEMISTRY CLASSES! I would like to inquire about the physical chemistry and NEET crash courses.";
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(baseMsg)}`, '_blank');
  };

  const sampleQuestions = [
    { text: '🗓️ Batch Timings & Fee Structure', msg: 'Hi! I want to know about the batch timings and fee structure for the new session.' },
    { text: '🧪 Free NCERT Revision Charts', msg: 'Hi Attri Sir! Could you share the free NCERT organic naming reaction charts with me?' },
    { text: '🎓 Scholar Admission Test (SAT)', msg: 'Hi! I want to enroll for the upcoming Scholar Admission Test for scholarship discounts.' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="floating-whatsapp-widget">
      
      {/* Mini Assistant Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="bg-white dark:bg-slate-900 w-80 max-w-sm rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden mb-4"
          >
            {/* Header branding */}
            <div className="bg-emerald-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center relative">
                  <Beaker className="w-6 h-6 animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black leading-tight">Attri Chemistry Care</h4>
                  <p className="text-[10px] text-emerald-100">Typically replies in 5 mins</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Chat Bubble area */}
            <div className="p-5 space-y-4 bg-slate-50 dark:bg-slate-950/40 text-xs sm:text-sm">
              <div className="bg-slate-100 dark:bg-slate-850 p-3.5 rounded-2xl rounded-tl-none text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                Hello! 👋 Welcome to <span className="font-extrabold text-blue-600 dark:text-orange-500">ATTRI CHEMISTRY CLASSES</span>. How can we support your NEET/JEE academic preparation today?
              </div>

              {/* Sample preselected options for quick clicking */}
              <div className="space-y-2 pt-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1">
                  Click to Ask on WhatsApp:
                </p>
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleWhatsAppRedirect(q.msg)}
                    className="w-full text-left p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/10 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer block"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer action button */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-3">
              <input
                type="text"
                readOnly
                placeholder="Type dynamic message on WhatsApp..."
                className="bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 rounded-xl text-xs flex-1 text-slate-400 focus:outline-none"
              />
              <button
                onClick={() => handleWhatsAppRedirect()}
                className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shrink-0 cursor-pointer"
                aria-label="Send WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Main pulsing launcher button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer relative group"
        aria-label="Open Chat Help Desk"
      >
        <span className="absolute inset-0 rounded-2xl bg-emerald-500/30 animate-ping opacity-75 group-hover:hidden pointer-events-none" />
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.01 14.069.988 11.99.988c-5.438 0-9.863 4.373-9.867 9.803-.001 1.97.512 3.888 1.49 5.593L2.613 21.35l5.09-1.33c1.56.95 3.1 1.45 4.815 1.45l.13-.1zM17.37 14.5c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-2.73-1.36-3.85-2.28-4.9-4.1-.15-.26-.15-.45-.01-.59.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.22-.24-.59-.5-.51-.67-.52-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.12 4.52.72.31 1.28.5 1.71.64.72.23 1.38.2 1.9.12.58-.09 1.74-.71 1.99-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.22-.57-.37z"/>
          </svg>
        )}
      </button>

    </div>
  );
}
