import { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface FloatingWhatsAppProps {
  phone?: string;
}

const QUICK_QUESTIONS = [
  {
    text: 'Batch timings and fee structure',
    msg: 'Hi, I want to know about the batch timings and fee structure for the new session.',
  },
  {
    text: 'Free NCERT revision charts',
    msg: 'Hi Attri Sir, could you share the free NCERT organic naming reaction charts with me?',
  },
  {
    text: 'Scholar Admission Test details',
    msg: 'Hi, I want to enroll for the upcoming Scholar Admission Test for scholarship discounts.',
  },
];

export default function FloatingWhatsApp({ phone }: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '919876543210';

  const handleWhatsAppRedirect = (customMsg?: string) => {
    const baseMsg =
      customMsg ||
      'Hello Attri Chemistry Classes, I would like to inquire about batch timings and the free demo class.';
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(baseMsg)}`, '_blank');
  };

  return (
    <div className="fixed right-5 bottom-5 z-40 sm:right-6 sm:bottom-6" id="floating-whatsapp-widget">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="mb-4 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[0_24px_60px_-24px_rgba(27,24,21,0.4)]"
          >
            <div className="flex items-start justify-between border-b border-line p-5">
              <div>
                <p className="font-display text-base font-semibold text-ink">Admissions desk</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  Replies within 5 minutes, 9 AM to 7 PM
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-surface-muted hover:text-ink"
                aria-label="Close chat window"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="space-y-4 bg-surface-muted/60 p-5">
              <p className="rounded-2xl rounded-tl-sm border border-line bg-surface p-3.5 text-sm leading-relaxed text-ink-soft">
                Hello. Ask about batches, fees or demo classes and we will reply on WhatsApp.
              </p>

              <div className="space-y-2">
                <p className="px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  Common questions
                </p>
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q.text}
                    onClick={() => handleWhatsAppRedirect(q.msg)}
                    className="w-full rounded-xl border border-line bg-surface p-3 text-left text-xs font-medium text-ink-soft transition-colors hover:border-accent hover:text-ink"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-line p-4">
              <input
                type="text"
                readOnly
                placeholder="Continue the conversation on WhatsApp"
                className="min-w-0 flex-1 rounded-full bg-surface-muted px-4 py-2.5 text-xs text-ink-faint outline-none"
                aria-label="Open WhatsApp to type a message"
              />
              <button
                onClick={() => handleWhatsAppRedirect()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent transition-transform active:scale-95"
                aria-label="Open WhatsApp chat"
              >
                <Send className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-canvas shadow-[0_16px_40px_-16px_rgba(27,24,21,0.65)] transition-transform duration-300 hover:scale-[1.04] active:scale-95"
        aria-label={isOpen ? 'Close admissions chat' : 'Open admissions chat on WhatsApp'}
      >
        {isOpen ? (
          <X className="h-5 w-5" strokeWidth={1.75} />
        ) : (
          <MessageCircle className="h-6 w-6" strokeWidth={1.6} />
        )}
      </button>
    </div>
  );
}
