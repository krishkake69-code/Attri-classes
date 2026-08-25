import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, LogOut, Save, ShieldCheck, Check, AlertCircle, X, Plus, Trash2, 
  Settings, Megaphone, BarChart3, GraduationCap, Trophy, MessageSquare, Image, ArrowRight, MapPin,
  Mail, Inbox, RefreshCw, CheckCircle2, Phone
} from 'lucide-react';
import { Course, ResultItem, Testimonial } from '../types';

interface GalleryItem {
  id: string;
  category: 'Classroom' | 'Lab' | 'Events';
  title: string;
  desc: string;
  imgUrl: string;
}

interface DynamicData {
  admissionMessage: string;
  stats: {
    studentsCount: string;
    successRate: string;
    experience: string;
  };
  courses: Course[];
  results: ResultItem[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  contactInfo?: {
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
  centers?: {
    id: string;
    name: string;
    address: string;
    details: string;
  }[];
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: DynamicData;
  onSave: (updatedData: DynamicData) => Promise<boolean>;
}

export default function AdminPanel({ isOpen, onClose, data, onSave }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return isoString;
    }
  };
  
  // Local editable copies of data
  const [localData, setLocalData] = useState<DynamicData | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'courses' | 'results' | 'testimonials' | 'gallery' | 'mailbox'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Inquiries mailbox states
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);

  // Load local editable copy when data is provided or panel opens
  useEffect(() => {
    if (data) {
      setLocalData(JSON.parse(JSON.stringify(data)));
    }
    
    // Check if token already exists in session/local storage
    const token = localStorage.getItem('attri_admin_token');
    if (token) {
      validateToken(token);
    }
  }, [data, isOpen]);

  // Fetch inquiries when user becomes authenticated or toggles mailbox tab
  useEffect(() => {
    if (isAuthenticated) {
      fetchInquiries();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTab === 'mailbox' && isAuthenticated) {
      fetchInquiries();
    }
  }, [activeTab, isAuthenticated]);

  const fetchInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const token = localStorage.getItem('attri_admin_token');
      if (!token) return;
      const res = await fetch('/api/inquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const list = await res.json();
        setInquiries(list);
        if (list.length > 0 && !selectedInquiryId) {
          setSelectedInquiryId(list[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  const handleToggleRead = async (id: string) => {
    try {
      const token = localStorage.getItem('attri_admin_token');
      const res = await fetch(`/api/inquiries/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error('Error toggling read status:', err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 4000); // Reset after 4s
      return;
    }
    setDeleteConfirmId(null);
    try {
      const token = localStorage.getItem('attri_admin_token');
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error('Error deleting inquiry:', err);
    }
  };

  const validateToken = async (token: string) => {
    try {
      const res = await fetch('/api/auth/session', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('attri_admin_token');
      }
    } catch (e) {
      console.error('Session validation error:', e);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsSubmittingAuth(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        localStorage.setItem('attri_admin_token', result.token);
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setAuthError(result.error || 'Invalid administrator password.');
      }
    } catch (err) {
      setAuthError('Server connection failed. Is the backend running?');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('attri_admin_token');
    setIsAuthenticated(false);
    setActiveTab('general');
    setSaveStatus('idle');
  };

  const handleSaveAll = async () => {
    if (!localData) return;
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const success = await onSave(localData);
      if (success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // ----------------------------------------------------
  // Dynamic Content Mutation Helpers
  // ----------------------------------------------------
  const updateGeneralField = (field: 'admissionMessage', value: string) => {
    if (!localData) return;
    setLocalData({ ...localData, [field]: value });
  };

  const updateStatField = (field: 'studentsCount' | 'successRate' | 'experience', value: string) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      stats: { ...localData.stats, [field]: value }
    });
  };

  const updateContactInfoField = (field: 'phone' | 'email' | 'instagram' | 'facebook' | 'whatsapp', value: string) => {
    if (!localData) return;
    const currentContact = localData.contactInfo || {
      phone: '+91 98765 43210',
      email: 'admissions@attrichemistry.com',
      instagram: 'https://instagram.com/attri_chemistry',
      facebook: 'https://facebook.com/attri_chemistry',
      whatsapp: '+91 98765 43210'
    };
    setLocalData({
      ...localData,
      contactInfo: { ...currentContact, [field]: value }
    });
  };

  const updateCenterField = (index: number, field: 'name' | 'address' | 'details', value: string) => {
    if (!localData) return;
    const nextCenters = localData.centers ? [...localData.centers] : [];
    if (nextCenters[index]) {
      nextCenters[index] = { ...nextCenters[index], [field]: value };
      setLocalData({ ...localData, centers: nextCenters });
    }
  };

  const addCenter = () => {
    if (!localData) return;
    const nextCenters = localData.centers ? [...localData.centers] : [];
    const newCenter = {
      id: `center-${Date.now()}`,
      name: 'New Branch Center',
      address: 'Enter full physical address',
      details: 'e.g. Near metro station'
    };
    setLocalData({ ...localData, centers: [...nextCenters, newCenter] });
  };

  const deleteCenter = (index: number) => {
    if (!localData) return;
    const nextCenters = localData.centers ? [...localData.centers] : [];
    setLocalData({
      ...localData,
      centers: nextCenters.filter((_, idx) => idx !== index)
    });
  };

  // -- Courses --
  const updateCourseField = (index: number, field: keyof Course, value: any) => {
    if (!localData) return;
    const nextCourses = [...localData.courses];
    nextCourses[index] = { ...nextCourses[index], [field]: value };
    setLocalData({ ...localData, courses: nextCourses });
  };

  const handleCourseFeatureChange = (courseIdx: number, featureIdx: number, val: string) => {
    if (!localData) return;
    const nextCourses = [...localData.courses];
    const nextFeatures = [...nextCourses[courseIdx].features];
    nextFeatures[featureIdx] = val;
    nextCourses[courseIdx] = { ...nextCourses[courseIdx], features: nextFeatures };
    setLocalData({ ...localData, courses: nextCourses });
  };

  const removeCourseFeature = (courseIdx: number, featureIdx: number) => {
    if (!localData) return;
    const nextCourses = [...localData.courses];
    const nextFeatures = nextCourses[courseIdx].features.filter((_, i) => i !== featureIdx);
    nextCourses[courseIdx] = { ...nextCourses[courseIdx], features: nextFeatures };
    setLocalData({ ...localData, courses: nextCourses });
  };

  const addCourseFeature = (courseIdx: number) => {
    if (!localData) return;
    const nextCourses = [...localData.courses];
    const nextFeatures = [...nextCourses[courseIdx].features, 'New syllabus point'];
    nextCourses[courseIdx] = { ...nextCourses[courseIdx], features: nextFeatures };
    setLocalData({ ...localData, courses: nextCourses });
  };

  const addCourse = () => {
    if (!localData) return;
    const newCourseItem: Course = {
      id: `course-${Date.now()}`,
      name: 'New Chemistry Crash Course',
      category: 'Boards',
      duration: '3 Months Program',
      description: 'Add course specifications, reference syllabus, exam patterns, etc.',
      features: ['Regular Mock Assessments', 'Handwritten Key Revision Charts'],
      tag: 'New Course',
      accentColor: 'rose'
    };
    setLocalData({ ...localData, courses: [newCourseItem, ...localData.courses] });
  };

  const deleteCourse = (id: string) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      courses: localData.courses.filter(c => c.id !== id)
    });
  };

  // -- Results --
  const updateResultField = (index: number, field: keyof ResultItem, value: string) => {
    if (!localData) return;
    const nextResults = [...localData.results];
    nextResults[index] = { ...nextResults[index], [field]: value };
    setLocalData({ ...localData, results: nextResults });
  };

  const addResult = () => {
    if (!localData) return;
    const newResultItem: ResultItem = {
      id: `res-${Date.now()}`,
      name: 'Topper Name',
      rank: 'AIR 100',
      exam: 'NEET UG',
      score: '700/720',
      year: '2026',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300&h=300',
      achievement: 'Chemistry Score 180/180'
    };
    setLocalData({ ...localData, results: [newResultItem, ...localData.results] });
  };

  const deleteResult = (id: string) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      results: localData.results.filter(r => r.id !== id)
    });
  };

  // -- Testimonials --
  const updateTestimonialField = (index: number, field: keyof Testimonial, value: any) => {
    if (!localData) return;
    const nextTestimonials = [...localData.testimonials];
    nextTestimonials[index] = { ...nextTestimonials[index], [field]: value };
    setLocalData({ ...localData, testimonials: nextTestimonials });
  };

  const addTestimonial = () => {
    if (!localData) return;
    const newTestimonialItem: Testimonial = {
      id: `test-${Date.now()}`,
      name: 'Parent / Student Name',
      role: 'Student',
      review: 'Attri Chemistry Classes transformed my outlook on science...',
      rating: 5,
      course: 'JEE Mains & Advanced Chemistry',
      avatarSeed: 'Aditya'
    };
    setLocalData({ ...localData, testimonials: [...localData.testimonials, newTestimonialItem] });
  };

  const deleteTestimonial = (id: string) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      testimonials: localData.testimonials.filter(t => t.id !== id)
    });
  };

  // -- Gallery --
  const updateGalleryField = (index: number, field: keyof GalleryItem, value: string) => {
    if (!localData) return;
    const nextGallery = [...localData.gallery];
    nextGallery[index] = { ...nextGallery[index], [field]: value };
    setLocalData({ ...localData, gallery: nextGallery });
  };

  const addGallery = () => {
    if (!localData) return;
    const newGalleryItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      category: 'Classroom',
      title: 'Chemistry Brainstorm Session',
      desc: 'Describing chemical formula mechanisms dynamically.',
      imgUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600&h=400'
    };
    setLocalData({ ...localData, gallery: [...localData.gallery, newGalleryItem] });
  };

  const deleteGallery = (id: string) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      gallery: localData.gallery.filter(g => g.id !== id)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[85vh] rounded-2xl flex flex-col shadow-2xl border-4 border-blue-900 overflow-hidden text-slate-800 dark:text-slate-100"
      >
        {/* Modal Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-slate-50 dark:bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-900 text-white rounded-lg flex items-center justify-center font-bold text-base">A</div>
            <span className="text-blue-900 dark:text-white font-extrabold text-lg uppercase tracking-tight">
              Control <span className="text-orange-600">Center</span>
            </span>
            {isAuthenticated && (
              <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Single User Admin Session
              </span>
            )}
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {!isAuthenticated ? (
            /* LOGIN CARD */
            <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800 flex flex-col"
              >
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-950/40 text-orange-600 rounded-full flex items-center justify-center mb-5 mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-center text-2xl font-black text-blue-900 dark:text-white uppercase mb-2">
                  Admin <span className="text-orange-600">Gatekeeper</span>
                </h2>
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 mb-6">
                  Verify your Single-User Administrative Passcode to edit courses, results, and general banners.
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Passcode
                    </label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••••"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-blue-900 outline-none transition-colors"
                      required
                      autoFocus
                    />
                  </div>

                  {authError && (
                    <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg border border-rose-200/50">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmittingAuth}
                    className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingAuth ? 'Verifying...' : 'Authenticate Access'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            </div>
          ) : (
            /* ADMIN EDITOR DASHBOARD */
            <>
              {/* Left sidebar nav */}
              <aside className="w-full md:w-56 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible md:overflow-y-auto shrink-0">
                <button 
                  onClick={() => setActiveTab('general')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'general' 
                      ? 'bg-blue-900 text-white shadow-md' 
                      : 'hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Megaphone className="w-4 h-4 shrink-0" />
                  General & Stats
                </button>

                <button 
                  onClick={() => setActiveTab('courses')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'courses' 
                      ? 'bg-blue-900 text-white shadow-md' 
                      : 'hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  Courses ({localData?.courses.length || 0})
                </button>

                <button 
                  onClick={() => setActiveTab('results')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'results' 
                      ? 'bg-blue-900 text-white shadow-md' 
                      : 'hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Trophy className="w-4 h-4 shrink-0" />
                  Hall of Fame ({localData?.results.length || 0})
                </button>

                <button 
                  onClick={() => setActiveTab('testimonials')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'testimonials' 
                      ? 'bg-blue-900 text-white shadow-md' 
                      : 'hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  Testimonials ({localData?.testimonials.length || 0})
                </button>

                <button 
                  onClick={() => setActiveTab('gallery')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'gallery' 
                      ? 'bg-blue-900 text-white shadow-md' 
                      : 'hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Image className="w-4 h-4 shrink-0" />
                  Gallery Tour ({localData?.gallery.length || 0})
                </button>

                <button 
                  onClick={() => setActiveTab('mailbox')}
                  className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'mailbox' 
                      ? 'bg-blue-900 text-white shadow-md' 
                      : 'hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>Mailbox Inbox</span>
                  </div>
                  {inquiries.filter((inq: any) => !inq.read).length > 0 && (
                    <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-extrabold tracking-tight animate-pulse shrink-0">
                      {inquiries.filter((inq: any) => !inq.read).length} NEW
                    </span>
                  )}
                </button>

                <div className="hidden md:block flex-1 border-t border-slate-200 dark:border-slate-800 my-4" />

                <button 
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Lock Panel
                </button>
              </aside>

              {/* Main editing canvas */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950/20">
                {localData && (
                  <>
                    {/* Tab 1: General & Stats */}
                    {activeTab === 'general' && (
                      <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
                          <h3 className="text-sm font-black text-blue-900 dark:text-white uppercase tracking-wider pb-2 border-b flex items-center gap-2">
                            <Megaphone className="w-4 h-4 text-orange-600" /> Marquee Announcement Banner
                          </h3>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                              Alert Marquee Message Text
                            </label>
                            <textarea 
                              value={localData.admissionMessage}
                              onChange={(e) => updateGeneralField('admissionMessage', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-blue-900 outline-none transition-colors"
                              rows={3}
                            />
                            <p className="text-[10px] text-slate-400 mt-1">
                              This text scrolls in the alert banner right at the very top of the landing page. Keep it highly promotional!
                            </p>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
                          <h3 className="text-sm font-black text-blue-900 dark:text-white uppercase tracking-wider pb-2 border-b flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-orange-600" /> Statistics Counters
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Students Mentored Count
                              </label>
                              <input 
                                type="text"
                                value={localData.stats.studentsCount}
                                onChange={(e) => updateStatField('studentsCount', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-blue-900 outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Success Rate (%)
                              </label>
                              <input 
                                type="text"
                                value={localData.stats.successRate}
                                onChange={(e) => updateStatField('successRate', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-blue-900 outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Years of Experience
                              </label>
                              <input 
                                type="text"
                                value={localData.stats.experience}
                                onChange={(e) => updateStatField('experience', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-blue-900 outline-none transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Personal Contact Details */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
                          <h3 className="text-sm font-black text-blue-900 dark:text-white uppercase tracking-wider pb-2 border-b flex items-center gap-2">
                            <Settings className="w-4 h-4 text-orange-600" /> Personal Contact & Social Handles
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Phone Number / WhatsApp
                              </label>
                              <input 
                                type="text"
                                value={localData.contactInfo?.phone || ''}
                                onChange={(e) => updateContactInfoField('phone', e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-blue-900 outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Email Address
                              </label>
                              <input 
                                type="email"
                                value={localData.contactInfo?.email || ''}
                                onChange={(e) => updateContactInfoField('email', e.target.value)}
                                placeholder="admissions@attrichemistry.com"
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-blue-900 outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Instagram Link
                              </label>
                              <input 
                                type="text"
                                value={localData.contactInfo?.instagram || ''}
                                onChange={(e) => updateContactInfoField('instagram', e.target.value)}
                                placeholder="https://instagram.com/attri_chemistry"
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-blue-900 outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Facebook Link
                              </label>
                              <input 
                                type="text"
                                value={localData.contactInfo?.facebook || ''}
                                onChange={(e) => updateContactInfoField('facebook', e.target.value)}
                                placeholder="https://facebook.com/attri_chemistry"
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-blue-900 outline-none transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Multiple Coaching Centers Locations */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm font-black text-blue-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-orange-600" /> Coaching Center Locations
                            </h3>
                            <button 
                              type="button"
                              onClick={addCenter}
                              className="text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Location
                            </button>
                          </div>

                          <div className="space-y-4">
                            {(!localData.centers || localData.centers.length === 0) ? (
                              <p className="text-xs text-slate-400 italic">No center locations defined. Click 'Add Location' to define branch campuses.</p>
                            ) : (
                              localData.centers.map((center, index) => (
                                <div key={center.id} className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60 relative space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => deleteCenter(index)}
                                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Location"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                        Campus Name
                                      </label>
                                      <input 
                                        type="text"
                                        value={center.name}
                                        onChange={(e) => updateCenterField(index, 'name', e.target.value)}
                                        placeholder="e.g. Main Campus / South Hub"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-extrabold outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                        Subtext / Travel Details
                                      </label>
                                      <input 
                                        type="text"
                                        value={center.details}
                                        onChange={(e) => updateCenterField(index, 'details', e.target.value)}
                                        placeholder="e.g. 1 Min walk from Metro Station Exit"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs outline-none"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                      Full Physical Address
                                    </label>
                                    <textarea 
                                      value={center.address}
                                      onChange={(e) => updateCenterField(index, 'address', e.target.value)}
                                      placeholder="3rd Floor, Golden Plaza, Sector 15..."
                                      rows={2}
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs outline-none"
                                    />
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Courses */}
                    {activeTab === 'courses' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                          <div>
                            <h3 className="text-base font-black text-blue-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                              <GraduationCap className="w-5 h-5 text-orange-600" /> Professional Course Offerings
                            </h3>
                            <p className="text-xs text-slate-400">Add, delete, or rewrite curriculum specifications for classes.</p>
                          </div>
                          <button 
                            onClick={addCourse}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4" /> Add Program
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          {localData.courses.map((course, idx) => (
                            <div 
                              key={course.id} 
                              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm relative group"
                            >
                              <button 
                                onClick={() => deleteCourse(course.id)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
                                title="Delete Course"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                {/* Title and Details */}
                                <div className="md:col-span-8 space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                        Course Title / Name
                                      </label>
                                      <input 
                                        type="text"
                                        value={course.name}
                                        onChange={(e) => updateCourseField(idx, 'name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-blue-900 outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                        Duration Label
                                      </label>
                                      <input 
                                        type="text"
                                        value={course.duration}
                                        onChange={(e) => updateCourseField(idx, 'duration', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-blue-900 outline-none"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                        Category Target
                                      </label>
                                      <select 
                                        value={course.category}
                                        onChange={(e) => updateCourseField(idx, 'category', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none"
                                      >
                                        <option value="NEET">NEET</option>
                                        <option value="JEE">JEE</option>
                                        <option value="Boards">Boards</option>
                                        <option value="Foundation">Foundation</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                        Card Top Badge Tag
                                      </label>
                                      <input 
                                        type="text"
                                        value={course.tag}
                                        onChange={(e) => updateCourseField(idx, 'tag', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                        Border Tag Color
                                      </label>
                                      <select 
                                        value={course.accentColor}
                                        onChange={(e) => updateCourseField(idx, 'accentColor', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none"
                                      >
                                        <option value="rose">Rose (Red-NEET)</option>
                                        <option value="blue">Blue (JEE)</option>
                                        <option value="indigo">Indigo (Class 11)</option>
                                        <option value="emerald">Emerald (Class 12)</option>
                                        <option value="orange">Orange (CBSE)</option>
                                        <option value="amber">Amber (Foundation)</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                      Course Description
                                    </label>
                                    <textarea 
                                      value={course.description}
                                      onChange={(e) => updateCourseField(idx, 'description', e.target.value)}
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none"
                                      rows={2}
                                    />
                                  </div>
                                </div>

                                {/* Features Bulletin */}
                                <div className="md:col-span-4 border-l border-slate-200 dark:border-slate-800 pl-0 md:pl-5 space-y-3">
                                  <div className="flex justify-between items-center">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                      Syllabus Bullet Highlights
                                    </label>
                                    <button 
                                      onClick={() => addCourseFeature(idx)}
                                      className="text-blue-900 dark:text-blue-400 hover:underline text-[10px] font-bold uppercase flex items-center gap-0.5 cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5" /> Add Bullet
                                    </button>
                                  </div>

                                  <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {course.features.map((feat, fIdx) => (
                                      <div key={fIdx} className="flex items-center gap-2">
                                        <input 
                                          type="text"
                                          value={feat}
                                          onChange={(e) => handleCourseFeatureChange(idx, fIdx, e.target.value)}
                                          className="flex-1 px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                        />
                                        <button 
                                          onClick={() => removeCourseFeature(idx, fIdx)}
                                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tab 3: Hall of Fame / Results */}
                    {activeTab === 'results' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                          <div>
                            <h3 className="text-base font-black text-blue-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-orange-600" /> Hall of Fame Academic Results
                            </h3>
                            <p className="text-xs text-slate-400">Post records and scores of recent JEE and NEET exam achievers.</p>
                          </div>
                          <button 
                            onClick={addResult}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4" /> Add Achiever
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {localData.results.map((resItem, idx) => (
                            <div 
                              key={resItem.id} 
                              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm relative space-y-4"
                            >
                              <button 
                                onClick={() => deleteResult(resItem.id)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>

                              <div className="flex items-center gap-4">
                                <img 
                                  src={resItem.image} 
                                  alt={resItem.name}
                                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-900 shadow-sm"
                                  onError={(e) => {
                                    // Fallback if Unsplash fails
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150';
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">
                                    Achiever's Full Name
                                  </label>
                                  <input 
                                    type="text"
                                    value={resItem.name}
                                    onChange={(e) => updateResultField(idx, 'name', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm font-bold"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                    Rank / Score Title
                                  </label>
                                  <input 
                                    type="text"
                                    value={resItem.rank}
                                    onChange={(e) => updateResultField(idx, 'rank', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                    Exam Level
                                  </label>
                                  <input 
                                    type="text"
                                    value={resItem.exam}
                                    onChange={(e) => updateResultField(idx, 'exam', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                    Score Details
                                  </label>
                                  <input 
                                    type="text"
                                    value={resItem.score}
                                    onChange={(e) => updateResultField(idx, 'score', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                    Achieved Year
                                  </label>
                                  <input 
                                    type="text"
                                    value={resItem.year}
                                    onChange={(e) => updateResultField(idx, 'year', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                  Select Achiever Photo from Device (JPG/PNG/WEBP)
                                </label>
                                <div className="flex items-center gap-3">
                                  <label className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shrink-0">
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => {
                                            updateResultField(idx, 'image', reader.result as string);
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                    <span>Upload Photo</span>
                                  </label>
                                  {resItem.image && (
                                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-xs block">
                                      {resItem.image.startsWith('data:') ? '✓ Custom uploaded image' : '✓ Default active image'}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                  Specific Milestone / Subject Grade Achievement
                                </label>
                                <input 
                                  type="text"
                                  value={resItem.achievement}
                                  onChange={(e) => updateResultField(idx, 'achievement', e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tab 4: Testimonials */}
                    {activeTab === 'testimonials' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                          <div>
                            <h3 className="text-base font-black text-blue-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-orange-600" /> Parent & Student Reviews
                            </h3>
                            <p className="text-xs text-slate-400">Edit core student and parent testimonials about Attri Chemistry.</p>
                          </div>
                          <button 
                            onClick={addTestimonial}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4" /> Add Testimonial
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          {localData.testimonials.map((testItem, idx) => (
                            <div 
                              key={testItem.id} 
                              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm relative space-y-4"
                            >
                              <button 
                                onClick={() => deleteTestimonial(testItem.id)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
                                title="Delete Testimonial"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                    Reviewer Full Name
                                  </label>
                                  <input 
                                    type="text"
                                    value={testItem.name}
                                    onChange={(e) => updateTestimonialField(idx, 'name', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                    Role Designation
                                  </label>
                                  <select 
                                    value={testItem.role}
                                    onChange={(e) => updateTestimonialField(idx, 'role', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none"
                                  >
                                    <option value="Student">Student</option>
                                    <option value="Parent">Parent</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                    Tag / Course Reference
                                  </label>
                                  <input 
                                    type="text"
                                    value={testItem.course}
                                    onChange={(e) => updateTestimonialField(idx, 'course', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                    Rating (Stars 1-5)
                                  </label>
                                  <input 
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={testItem.rating}
                                    onChange={(e) => updateTestimonialField(idx, 'rating', parseInt(e.target.value) || 5)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                    Avatar Initials / Seed Name
                                  </label>
                                  <input 
                                    type="text"
                                    value={testItem.avatarSeed}
                                    onChange={(e) => updateTestimonialField(idx, 'avatarSeed', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                  Full Review Message Text
                                </label>
                                <textarea 
                                  value={testItem.review}
                                  onChange={(e) => updateTestimonialField(idx, 'review', e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                                  rows={3}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tab 5: Gallery */}
                    {activeTab === 'gallery' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                          <div>
                            <h3 className="text-base font-black text-blue-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                              <Image className="w-5 h-5 text-orange-600" /> Custom Gallery Tour Photos
                            </h3>
                            <p className="text-xs text-slate-400">Manage the educational slide, classroom, laboratory, and event photos.</p>
                          </div>
                          <button 
                            onClick={addGallery}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4" /> Add Photo
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {localData.gallery.map((galItem, idx) => (
                            <div 
                              key={galItem.id} 
                              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm relative space-y-4"
                            >
                              <button 
                                onClick={() => deleteGallery(galItem.id)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
                                title="Delete Photo"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>

                              <div className="flex gap-4">
                                <img 
                                  src={galItem.imgUrl} 
                                  alt={galItem.title}
                                  className="w-24 h-16 rounded-lg object-cover border border-slate-200"
                                />
                                <div className="flex-1 min-w-0">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                    Photo Title
                                  </label>
                                  <input 
                                    type="text"
                                    value={galItem.title}
                                    onChange={(e) => updateGalleryField(idx, 'title', e.target.value)}
                                    className="w-full px-2.5 py-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                    Gallery Category
                                  </label>
                                  <select 
                                    value={galItem.category}
                                    onChange={(e) => updateGalleryField(idx, 'category', e.target.value as any)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
                                  >
                                    <option value="Classroom">Classroom</option>
                                    <option value="Lab">Lab</option>
                                    <option value="Events">Events</option>
                                  </select>
                                </div>
                                <div className="flex-1">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                                    Brief Description
                                  </label>
                                  <input 
                                    type="text"
                                    value={galItem.desc}
                                    onChange={(e) => updateGalleryField(idx, 'desc', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                  Select Photo from Device (JPG/PNG/WEBP)
                                </label>
                                <div className="flex items-center gap-3">
                                  <label className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shrink-0">
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => {
                                            updateGalleryField(idx, 'imgUrl', reader.result as string);
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                    <span>Upload Photo</span>
                                  </label>
                                  {galItem.imgUrl && (
                                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-xs block">
                                      {galItem.imgUrl.startsWith('data:') ? '✓ Custom uploaded image' : '✓ Default active image'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tab 6: Inquiry Mailbox */}
                    {activeTab === 'mailbox' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                          <div>
                            <h3 className="text-base font-black text-blue-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                              <Inbox className="w-5 h-5 text-orange-600" /> Student Booking & Leads Inbox
                            </h3>
                            <p className="text-xs text-slate-400">View real-time registrations and queries from 'Enroll & Book Demo' or 'Contact' forms.</p>
                          </div>
                          <button 
                            onClick={fetchInquiries}
                            disabled={isLoadingInquiries}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw className={`w-4 h-4 ${isLoadingInquiries ? 'animate-spin' : ''}`} /> 
                            {isLoadingInquiries ? 'Refreshing...' : 'Refresh Inbox'}
                          </button>
                        </div>

                        {inquiries.length === 0 ? (
                          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-12 text-center space-y-4 shadow-sm">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-orange-500">
                              <Mail className="w-8 h-8 opacity-80" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Your Mailbox is Empty</h4>
                            <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                              When students register for demo sessions or contact you from the main landing page, their real-time inquiries will appear here.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Inbox List Panel */}
                            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
                              <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                  All Messages ({inquiries.length})
                                </span>
                                <span className="text-[10px] bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-bold">
                                  {inquiries.filter((inq: any) => !inq.read).length} Unread
                                </span>
                              </div>

                              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-y-auto flex-1">
                                {inquiries.map((inq: any) => {
                                  const isSelected = selectedInquiryId === inq.id;
                                  return (
                                    <div
                                      key={inq.id}
                                      onClick={() => setSelectedInquiryId(inq.id)}
                                      className={`p-4 transition-all cursor-pointer text-left relative ${
                                        isSelected 
                                          ? 'bg-blue-50/70 dark:bg-blue-950/30 border-l-4 border-l-blue-600 dark:border-l-orange-500' 
                                          : 'hover:bg-slate-50/50 dark:hover:bg-slate-950/20'
                                      } ${!inq.read ? 'font-semibold' : ''}`}
                                    >
                                      {/* Unread status dot indicator */}
                                      {!inq.read && (
                                        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-orange-500" />
                                      )}

                                      <div className="flex items-center gap-2 mb-1.5">
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                                          inq.type === 'enroll'
                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                            : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                                        }`}>
                                          {inq.type === 'enroll' ? 'Booking' : 'Inquiry'}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono">
                                          {formatDate(inq.timestamp)}
                                        </span>
                                      </div>

                                      <h5 className="text-sm font-bold text-slate-950 dark:text-white truncate">
                                        {inq.name}
                                      </h5>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        {inq.course}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Detail Panel */}
                            <div className="lg:col-span-7">
                              {(() => {
                                const activeInquiry = inquiries.find((inq: any) => inq.id === selectedInquiryId) || inquiries[0];
                                if (!activeInquiry) return null;

                                const cleanPhoneNum = activeInquiry.phone ? activeInquiry.phone.replace(/[^0-9]/g, '') : '';
                                const waLink = `https://wa.me/${cleanPhoneNum}?text=${encodeURIComponent(`Hi ${activeInquiry.name}, thank you for registering with Attri Chemistry Classes! I would love to schedule your Free Demo session.`)}`;

                                return (
                                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden flex flex-col">
                                    <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 flex justify-between items-start gap-4 flex-wrap text-left">
                                      <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded tracking-widest ${
                                            activeInquiry.type === 'enroll'
                                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-400'
                                          }`}>
                                            {activeInquiry.type === 'enroll' ? 'Class Booking Lead' : 'General Contact Message'}
                                          </span>
                                          <span className="text-xs font-mono text-slate-400">
                                            {formatDate(activeInquiry.timestamp)}
                                          </span>
                                        </div>
                                        <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                                          {activeInquiry.name}
                                        </h4>
                                      </div>

                                      {/* Action buttons (Read status, Delete) */}
                                      <div className="flex items-center gap-2 shrink-0">
                                        <button
                                          onClick={() => handleToggleRead(activeInquiry.id)}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                                            activeInquiry.read 
                                              ? 'bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-750 hover:bg-slate-100 dark:hover:bg-slate-800'
                                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-950/60'
                                          }`}
                                          title={activeInquiry.read ? 'Mark as Unread' : 'Mark as Read'}
                                        >
                                          <CheckCircle2 className="w-4 h-4" />
                                          <span>{activeInquiry.read ? 'Mark Unread' : 'Mark Read'}</span>
                                        </button>

                                        <button
                                          onClick={() => handleDeleteInquiry(activeInquiry.id)}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                                            deleteConfirmId === activeInquiry.id
                                              ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 font-extrabold scale-105'
                                              : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-150 dark:border-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-950/40'
                                          }`}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                          <span>{deleteConfirmId === activeInquiry.id ? 'Confirm?' : 'Delete'}</span>
                                        </button>
                                      </div>
                                    </div>

                                    {/* Detail Content Fields */}
                                    <div className="p-6 sm:p-8 space-y-6 text-left">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
                                        {/* Contact Phone details */}
                                        <div className="space-y-1">
                                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            Contact Phone / WhatsApp
                                          </span>
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 font-mono">
                                              {activeInquiry.phone}
                                            </span>
                                            {cleanPhoneNum && (
                                              <a
                                                href={waLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-[10px] font-extrabold uppercase transition-colors"
                                              >
                                                <Phone className="w-3.5 h-3.5 mr-0.5 fill-white" /> WhatsApp Call-Back
                                              </a>
                                            )}
                                          </div>
                                        </div>

                                        {/* Contact Email details */}
                                        <div className="space-y-1">
                                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            Email Address
                                          </span>
                                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                                            {activeInquiry.email || <span className="text-slate-400 italic">Not Provided</span>}
                                          </span>
                                        </div>

                                        {/* Target Course / Batch */}
                                        <div className="space-y-1 sm:col-span-2">
                                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            Chemistry Program / Academic Batch Interest
                                          </span>
                                          <span className="text-sm font-extrabold text-blue-750 dark:text-orange-400 block bg-blue-50/50 dark:bg-slate-950/50 px-3 py-2 rounded-xl border border-blue-100/30 dark:border-slate-800/80">
                                            {activeInquiry.course}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Student details / custom description inquiry message */}
                                      <div className="space-y-1 border-t border-slate-100 dark:border-slate-800/80 pt-5 font-sans">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                          Message Details & Preferences
                                        </span>
                                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium min-h-[100px] whitespace-pre-wrap">
                                          {activeInquiry.message || <span className="text-slate-400 italic font-normal">No additional message or notes provided.</span>}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {isAuthenticated && (
          <footer className="h-16 border-t border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Verify values and click save. Updates sync globally in real-time.
            </span>

            <div className="flex items-center gap-3">
              <AnimatePresence mode="wait">
                {saveStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wide bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-200"
                  >
                    <Check className="w-4 h-4" /> Live Content Synced
                  </motion.div>
                )}
                {saveStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wide bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 rounded-lg border border-rose-200"
                  >
                    <AlertCircle className="w-4 h-4" /> Sync Failure
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Syncing...' : 'Save All Changes'}
              </button>
            </div>
          </footer>
        )}
      </motion.div>
    </div>
  );
}
