import { useState, useEffect } from 'react';
import AdmissionBanner from './components/AdmissionBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Stats from './components/Stats';
import Courses from './components/Courses';
import WhyChooseUs from './components/WhyChooseUs';
import Results from './components/Results';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import AdminPanel from './components/AdminPanel';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [dynamicData, setDynamicData] = useState<any>(null);

  // Apply dark mode styling to root document
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Load backend content on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          // Verify that we received valid data objects
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
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setDynamicData(updatedData);
        return true;
      }
    } catch (err) {
      console.error('Error saving dynamic content to backend:', err);
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 antialiased selection:bg-orange-500 selection:text-white">
      {/* 1. Admission Alert Marquee Banner */}
      <AdmissionBanner message={dynamicData?.admissionMessage} />

      {/* 2. Responsive Sticky Navigation Header */}
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        onAdminClick={() => setIsAdminOpen(true)} 
      />

      {/* 3. Immersive Hero Portal with Chemistry Particles */}
      <Hero />

      {/* 4. Statistics Counter Section */}
      <Stats stats={dynamicData?.stats} />

      {/* 5. Classroom & Teacher About Section */}
      <About />

      {/* 6. Professional Courses Catalog with Registration Modal */}
      <Courses courses={dynamicData?.courses} />

      {/* 7. Bento Grid Style: Why Choose Us (Icon Cards) */}
      <WhyChooseUs />

      {/* 8. Champions Board & Top Ranks Results Section */}
      <Results results={dynamicData?.results} />

      {/* 10. Reviews & Feedback Slides */}
      <Testimonials testimonials={dynamicData?.testimonials} />

      {/* 11. Custom Lightbox Grid Tour Gallery */}
      <Gallery items={dynamicData?.gallery} />

      {/* 12. Complete Contact Coordinates & Forms */}
      <Contact contactInfo={dynamicData?.contactInfo} centers={dynamicData?.centers} />

      {/* 13. Professional Informational Footer */}
      <Footer onAdminClick={() => setIsAdminOpen(true)} contactInfo={dynamicData?.contactInfo} />

      {/* 14. Floating WhatsApp Interactive Desk Widget */}
      <FloatingWhatsApp phone={dynamicData?.contactInfo?.phone} />

      {/* Admin Panel Modal Control Center */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel 
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            data={dynamicData || {
              admissionMessage: "",
              stats: { studentsCount: "", successRate: "", experience: "" },
              courses: [],
              results: [],
              testimonials: [],
              gallery: [],
              contactInfo: {
                phone: "+91 98765 43210",
                email: "admissions@attrichemistry.com",
                instagram: "https://instagram.com/attri_chemistry",
                facebook: "https://facebook.com/attri_chemistry",
                whatsapp: "+91 98765 43210"
              },
              centers: []
            }}
            onSave={handleSaveContent}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
