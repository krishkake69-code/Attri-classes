import { useState, FormEvent } from 'react';
import { Mail, Send, Check, Facebook, Instagram } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { DEFAULT_CONTACT_INFO } from '../data';
import type { ContactInfo } from '../types';

interface FooterProps {
  onAdminClick?: () => void;
  contactInfo?: ContactInfo;
}

const QUICK_LINKS = [
  { label: 'Method', href: '#method' },
  { label: 'Courses', href: '#courses' },
  { label: 'Results', href: '#results' },
  { label: 'Batch timings', href: '#batches' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Questions', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer({ onAdminClick, contactInfo }: FooterProps) {
  const [newsEmail, setNewsEmail] = useState('');
  const [subscribeState, setSubscribeState] = useState<'idle' | 'submitting' | 'done' | 'error'>(
    'idle'
  );
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!newsEmail || subscribeState === 'submitting') return;

    setSubscribeState('submitting');
    setSubscribeError(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsEmail }),
      });
      const result = await res.json().catch(() => ({}));

      if (res.ok && result.success) {
        setSubscribeState('done');
        setNewsEmail('');
      } else {
        setSubscribeError(result.error || 'Could not subscribe right now. Please try again.');
        setSubscribeState('error');
      }
    } catch {
      setSubscribeError('Network error. Please try again in a moment.');
      setSubscribeState('error');
    }
  };

  const subscribed = subscribeState === 'done';

  const handleNavClick = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const info = contactInfo || DEFAULT_CONTACT_INFO;
  const socials = [
    { name: 'Facebook', href: info.facebook, Icon: Facebook },
    { name: 'Instagram', href: info.instagram, Icon: Instagram },
  ];

  return (
    <footer className="border-t border-line bg-surface-muted" id="footer-section">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="flex items-center gap-2.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink">
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
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              A chemistry-first coaching institute for NEET, JEE, Boards and Foundation students.
              Small batches, printed material and weekly tests since 2016.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {socials.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:border-accent hover:text-accent"
                  aria-label={`Attri Chemistry Classes on ${name}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          <nav className="lg:col-span-2" aria-label="Footer">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="text-sm text-ink-soft transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
              Reach us
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-ink-soft">
              <li>
                <a
                  href={`tel:${info.phone.replace(/\s/g, '')}`}
                  className="transition-colors hover:text-accent"
                >
                  {info.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${info.email}`}
                  className="transition-colors hover:text-accent"
                >
                  {info.email}
                </a>
              </li>
              <li className="leading-relaxed">
                H-489 Govindpuram,
                <br />
                Ghaziabad, Uttar Pradesh
              </li>
              <li className="pt-1 font-mono text-xs text-ink-faint">
                Mon to Sun, 9:00 AM to 7:00 PM
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
              Practice bulletin
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-ink-soft">
              One email a week with a solved problem set, a formula sheet and batch updates.
            </p>
            <AnimatePresence mode="wait" initial={false}>
              {!subscribed ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubscribe}
                  initial={false}
                  exit={{ opacity: 0 }}
                  className="mt-4"
                >
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="pointer-events-none absolute h-0 w-0 opacity-0"
                  />
                  <div className="flex items-center gap-2 rounded-full border border-line bg-surface p-1 pl-4">
                    <Mail className="h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.75} />
                    <input
                      id="footer-email"
                      type="email"
                      required
                      value={newsEmail}
                      onChange={(e) => setNewsEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink-faint"
                    />
                    <button
                      type="submit"
                      disabled={subscribeState === 'submitting'}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-canvas transition-transform active:scale-95 disabled:opacity-60"
                      aria-label="Subscribe to the practice bulletin"
                    >
                      <Send className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                  {subscribeState === 'error' && subscribeError && (
                    <p className="mt-2 text-xs leading-relaxed text-accent">{subscribeError}</p>
                  )}
                </motion.form>
              ) : (
                <motion.p
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 flex items-start gap-2 rounded-2xl border border-line bg-surface p-4 text-xs leading-relaxed text-ink-soft"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                  Subscribed. The first bulletin arrives on Monday morning.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-faint">
            © 2026 Attri Chemistry Classes. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-faint">
            <span>
              Privacy policy available on request at{' '}
              <a
                href={`mailto:${info.email}`}
                className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent"
              >
                {info.email}
              </a>
            </span>
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-accent"
              >
                Admin login
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
