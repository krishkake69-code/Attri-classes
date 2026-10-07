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

const AdminPanel = lazy(() => import('./components/AdminPanel'));

export default function App() {
  const [darkMode, setDarkMode] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [dynamicData, setDynamicData] = useState<any>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('attri-theme', darkMode ? 'dark' : 'light');
    } catch (err) {
      console.error('Could not persist theme preference:', err);
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          if (data && data.admissionMessage) {
            setDynamicData(data);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic data from backend:', err);
      }
    };
    fetchContent();
  }, []);

  const handleSaveContent = async (updatedData: any) => {
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
        <Hero content={dynamicData?.heroContent} />
        <ElementTicker />
        <Stats stats={dynamicData?.stats} />
        <Method methodology={dynamicData?.methodology} />
        <About content={dynamicData?.aboutContent} />
        <Courses courses={dynamicData?.courses} />
        <WhyChooseUs features={dynamicData?.features} />
        <Results results={dynamicData?.results} />
        <InteractiveChemistryQuiz />
        <Testimonials testimonials={dynamicData?.testimonials} />
        <Gallery items={dynamicData?.gallery} />
        <BatchSchedule batches={dynamicData?.batches} />
        <FAQ faqs={dynamicData?.faqs} />
        <Contact contactInfo={dynamicData?.contactInfo} centers={dynamicData?.centers} />
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
              data={
                dynamicData || {
                  admissionMessage: '',
                  stats: { studentsCount: '', successRate: '', experience: '' },
                  courses: [],
                  results: [],
                  testimonials: [],
                  gallery: [],
                  contactInfo: {
                    phone: '+91 98765 43210',
                    email: 'admissions@attrichemistry.com',
                    instagram: 'https://instagram.com/attri_chemistry',
                    facebook: 'https://facebook.com/attri_chemistry',
                    whatsapp: '+91 98765 43210',
                  },
                  centers: [],
                }
              }
              onSave={handleSaveContent}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
