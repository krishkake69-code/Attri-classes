import React, { useState, FormEvent, MouseEvent } from 'react';
import { Beaker, Mail, Sparkles, Send, Check, MessageSquare, Heart, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FooterProps {
  onAdminClick?: () => void;
  contactInfo?: {
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
}

export default function Footer({ onAdminClick, contactInfo }: FooterProps) {
  const [newsEmail, setNewsEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!newsEmail) return;
    setSubscribed(true);
    setNewsEmail('');
  };

  const handleScrollToSection = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const targetRect = target.getBoundingClientRect().top;
      const targetPosition = targetRect - bodyRect;
      const offsetPosition = targetPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Courses Catalog', href: '#courses' },
    { label: 'Results & Ranks', href: '#results' },
    { label: 'Parent Reviews', href: '#testimonials' },
    { label: 'Photo Gallery', href: '#gallery' },
    { label: 'Contact Admissions', href: '#contact' },
  ];

  const popularTags = [
    'NEET Chemistry Prep', 'JEE Organic Mechanics', 'Mole Concept Booster', 'CBSE Class 12 Boards', 'Olympiad Foundation', 'IIT Bombay Admissions'
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800/60 font-sans" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-5">
            <a href="#home" onClick={(e) => handleScrollToSection(e, '#home')} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold italic text-xl shadow-md">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight text-white leading-none">
                  ATTRI <span className="text-orange-500">CHEMISTRY</span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.25em] text-slate-500 uppercase mt-0.5">
                  CLASSES
                </span>
              </div>
            </a>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              ATTRI CHEMISTRY CLASSES is a premium, result-driven educational institute centered on converting complex chemical science formulas into easily digestible conceptual blocks.
            </p>

            {/* Social handles */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { name: 'facebook', href: contactInfo?.facebook || 'https://facebook.com/attri_chemistry' },
                { name: 'instagram', href: contactInfo?.instagram || 'https://instagram.com/attri_chemistry' },
                { name: 'youtube', href: 'https://youtube.com' },
                { name: 'linkedin', href: 'https://linkedin.com' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-orange-500 hover:text-white transition-colors border border-slate-800/80"
                  aria-label={`Visit our ${social.name}`}
                >
                  {social.name === 'facebook' && (
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V1h-3a4 4 0 00-4 4v3z"/>
                    </svg>
                  )}
                  {social.name === 'instagram' && (
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  )}
                  {social.name === 'youtube' && (
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507A3.003 3.003 0 00.503 6.163C0 8.039 0 12 0 12s0 3.961.503 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 002.11-2.11C24 15.961 24 12 24 12s0-3.961-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  )}
                  {social.name === 'linkedin' && (
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Quicklinks Col */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleScrollToSection(e, link.href)}
                    className="hover:text-orange-500 transition-colors block text-slate-450 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Bulletins Col */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">
              Weekly Practice Bulletins
            </h4>
            <p className="text-xs sm:text-sm text-slate-405 leading-relaxed">
              Subscribe to get free hand-written organic sheets, chapter-wise formulas, and class schedule notifications directly in your inbox.
            </p>

            <AnimatePresence mode="wait">
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <input
                    type="email"
                    required
                    value={newsEmail}
                    onChange={(e) => setNewsEmail(e.target.value)}
                    placeholder="Enter student or parent email"
                    className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 w-full"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/50 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 stroke-[3]" />
                  <span>Subscribed! Check your spam folder if you do not get welcome booklets.</span>
                </div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {popularTags.map((t, i) => (
                <span key={i} className="px-2 py-1 bg-slate-900 rounded-md text-[10px] font-bold text-slate-500">
                  #{t}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bottom info */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © 2026 ATTRI CHEMISTRY CLASSES. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-600">
            {onAdminClick && (
              <button 
                onClick={onAdminClick}
                className="hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1 font-bold text-[11px] text-slate-500 uppercase tracking-wider"
              >
                Admin Login
              </button>
            )}
            {onAdminClick && <span>•</span>}
            <span>Powered by Attri Digital Support Hub</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for medical & engineering aspirants.
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
