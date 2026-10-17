import { useState, useEffect, lazy, Suspense } from 'react';
import AdmissionBanner from './components/AdmissionBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ElementTicker from './components/ElementTicker';
import Stats from './components/Stats';
import Method from './components/Method';
import About from './components/About';
import Courses from './components/Courses';
import WhyChooseUs from './components/WhyChooseUs';
import Results from './components/Results';
import InteractiveChemistryQuiz from './components/InteractiveChemistryQuiz';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import BatchSchedule from './components/BatchSchedule';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { AnimatePresence } from 'motion/react';
import type { DynamicContent } from './types';
import {
  STATS,
  HERO_CONTENT,
  ABOUT_CONTENT,
  DEFAULT_CONTACT_INFO,
  DEFAULT_CENTERS,
  COURSES,
  RESULTS,
  TESTIMONIALS,
  BENTO_FEATURES,
  METHOD_STEPS,
  BATCH_SCHEDULE,
  FAQS,
  GALLERY_ITEMS,
} from './data';

const AdminPanel = lazy(() => import('./components/AdminPanel'));

/**
 * Content used before the API responds, when it returns nothing, and as the
 * initial seed in the admin panel. Mirrors src/data-store.json so the fallback
 * never drifts from the served content.
 */
const FALLBACK_CONTENT: DynamicContent = {
  admissionMessage: '⚡ ADMISSIONS OPEN FOR BATCH 2026-27 | REGISTER FOR FREE DEMO CLASSES NOW ⚡',
  stats: STATS,
  heroContent: HERO_CONTENT,
  aboutContent: ABOUT_CONTENT,
  methodology: METHOD_STEPS,
  features: BENTO_FEATURES,
  faqs: FAQS,
  batches: BATCH_SCHEDULE,
  courses: COURSES,
  results: RESULTS,
  testimonials: TESTIMONIALS,
  gallery: GALLERY_ITEMS,
  contactInfo: DEFAULT_CONTACT_INFO,
  centers: DEFAULT_CENTERS,
};

export default function App() {
  const [darkMode, setDarkMode] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [dynamicData, setDynamicData] = useState<DynamicContent | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('attri-theme', darkMode ? 'dark' : 'light');
    } catch (err) {
      console.error('Could not persist theme preference:', err);
    }
  }, [darkMode]);

  function normalizeStats(stats: unknown): any[] {
    if (Array.isArray(stats)) return stats;
    if (stats && typeof stats === 'object') {
      const s = stats as Record<string, any>;
      const mapped: Array<{ label: string; value: string; note: string }> = [];
      if (s.studentsCount !== undefined && s.studentsCount !== null) {
        mapped.push({ label: 'Students Mentored', value: String(s.studentsCount), note: 'Across NEET & JEE' });
      }
      if (s.successRate !== undefined && s.successRate !== null) {
        mapped.push({ label: 'Success Rate', value: String(s.successRate), note: 'Cleared Cutoff' });
      }
      if (s.experience !== undefined && s.experience !== null) {
        mapped.push({ label: 'Years of Experience', value: String(s.experience), note: 'Expert curriculum-focused mentorship' });
      }
      return mapped;
    }
    return [];
  }

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = (await res.json()) as DynamicContent;
          const merged = {
            ...FALLBACK_CONTENT,
            ...data,
            stats: normalizeStats((data as any)?.stats),
          };
          setDynamicData(merged);
        }
      } catch (err) {
        console.error('Failed to load dynamic data from backend:', err);
      }
    };
    fetchContent();
  }, []);

  const handleSaveContent = async (updatedData: DynamicContent) => {
    try {
      const token = localStorage.getItem('attri_admin_token');
      if (!token) {
        console.error('No admin token found');
        return false;
      }
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setDynamicData(updatedData);
        return true;
      }
      console.error('Save failed:', result.error || 'Unknown error');
      return false;
    } catch (err) {
      console.error('Error saving dynamic content to backend:', err);
      return false;
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-canvas text-ink antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-canvas"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50">
        <AdmissionBanner message={dynamicData?.admissionMessage} />
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onAdminClick={() => setIsAdminOpen(true)}
        />
      </header>

      <main id="main-content" className="overflow-x-hidden">
        <Hero content={dynamicData?.heroContent || FALLBACK_CONTENT.heroContent} />
        <ElementTicker />
        <Stats stats={Array.isArray(dynamicData?.stats) ? dynamicData.stats : FALLBACK_CONTENT.stats} />
        <Method methodology={dynamicData?.methodology || FALLBACK_CONTENT.methodology} />
        <About content={dynamicData?.aboutContent || FALLBACK_CONTENT.aboutContent} />
        <Courses courses={dynamicData?.courses || FALLBACK_CONTENT.courses} />
        <WhyChooseUs features={dynamicData?.features || FALLBACK_CONTENT.features} />
        <Results results={dynamicData?.results || FALLBACK_CONTENT.results} />
        <InteractiveChemistryQuiz />
        <Testimonials testimonials={dynamicData?.testimonials || FALLBACK_CONTENT.testimonials} />
        <Gallery items={dynamicData?.gallery || FALLBACK_CONTENT.gallery} />
        <BatchSchedule batches={dynamicData?.batches || FALLBACK_CONTENT.batches} />
        <FAQ faqs={dynamicData?.faqs || FALLBACK_CONTENT.faqs} />
        <Contact contactInfo={dynamicData?.contactInfo || FALLBACK_CONTENT.contactInfo} centers={dynamicData?.centers || FALLBACK_CONTENT.centers} />
      </main>

      <Footer
        onAdminClick={() => setIsAdminOpen(true)}
        contactInfo={dynamicData?.contactInfo}
      />

      <FloatingWhatsApp phone={dynamicData?.contactInfo?.phone} />

      <div className="grain-overlay" aria-hidden="true" />

      <AnimatePresence>
        {isAdminOpen && (
          <Suspense fallback={null}>
            <AdminPanel
              isOpen={isAdminOpen}
              onClose={() => setIsAdminOpen(false)}
              data={dynamicData || FALLBACK_CONTENT}
              onSave={handleSaveContent}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
