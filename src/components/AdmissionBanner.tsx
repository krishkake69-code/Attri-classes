import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdmissionBannerProps {
  message?: string;
}

export default function AdmissionBanner({ message }: AdmissionBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          initial={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="overflow-hidden border-b border-line bg-surface-muted"
        >
          <div className="mx-auto flex h-10 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8">
            <p className="min-w-0 flex-1 truncate font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              {message ? (
                <span className="font-medium text-ink">{message}</span>
              ) : (
                <>
                  <span className="text-accent">Admissions 2026-27</span>
                  <span className="mx-2 text-line-strong">/</span>
                  NEET, JEE and Board batches now open
                </>
              )}
            </p>
            <a
              href="#contact"
              className="hidden shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent sm:block"
            >
              Book a free demo
            </a>
            <button
              onClick={() => setIsVisible(false)}
              className="shrink-0 rounded-full p-1 text-ink-faint transition-colors hover:bg-line hover:text-ink"
              aria-label="Dismiss admissions notice"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
