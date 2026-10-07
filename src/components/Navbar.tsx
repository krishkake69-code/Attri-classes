import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon, Lock, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onAdminClick?: () => void;
}

const NAV_ITEMS = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'Method', href: '#method', id: 'method' },
  { label: 'Courses', href: '#courses', id: 'courses' },
  { label: 'Results', href: '#results', id: 'results' },
  { label: 'Gallery', href: '#gallery', id: 'gallery' },
  { label: 'Batches', href: '#batches', id: 'batches' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export default function Navbar({ darkMode, setDarkMode, onAdminClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="px-3 pt-3 pb-1 sm:px-4" aria-label="Primary">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 rounded-full border border-line bg-canvas/85 pr-2 pl-4 shadow-[0_10px_30px_-24px_rgba(27,24,21,0.5)] backdrop-blur-xl sm:pl-6">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Attri Chemistry Classes, back to top"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-ink">
            <span className="absolute inset-0 rounded-xl border border-on-accent/10" />
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M12 2.8 20 7.5v9L12 21.2 4 16.5v-9z"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.6"
              />
              <circle cx="12" cy="12" r="2.6" fill="var(--accent)" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
              Attri Chemistry
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">
              Classes
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
                activeSection === item.id
                  ? 'bg-surface-muted text-ink'
                  : 'text-ink-soft hover:bg-surface-muted/70 hover:text-ink'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
            aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {darkMode ? (
              <Sun className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Moon className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>

          {onAdminClick && (
            <button
              onClick={onAdminClick}
              className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink sm:flex"
              aria-label="Open admin panel"
            >
              <Lock className="h-4 w-4" strokeWidth={1.75} />
            </button>
          )}

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="group hidden items-center gap-2 rounded-full bg-accent py-1.5 pr-1.5 pl-5 text-[13px] font-semibold text-on-accent transition-all duration-300 hover:bg-accent-strong active:scale-[0.98] sm:inline-flex"
          >
            Book a free demo
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-on-accent/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px">
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          </a>

          <button
            onClick={() => setIsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-muted lg:hidden"
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-canvas/95 backdrop-blur-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex h-16 shrink-0 items-center justify-between px-4 pt-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                Menu
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface-muted"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-1 px-6">
              {NAV_ITEMS.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: reduceMotion ? 0 : 0.06 + index * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="flex items-baseline justify-between border-b border-line py-4 font-display text-3xl font-medium tracking-tight text-ink"
                >
                  {item.label}
                  <span className="font-mono text-[11px] text-ink-faint">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.4 }}
              className="shrink-0 px-6 pb-10"
            >
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#contact');
                }}
                className="flex w-full items-center justify-center rounded-full bg-accent px-6 py-4 text-sm font-semibold text-on-accent"
              >
                Book a free demo
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
