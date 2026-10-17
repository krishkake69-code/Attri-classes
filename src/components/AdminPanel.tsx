import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, LogOut, Save, ShieldCheck, Check, AlertCircle, X, Plus, Trash2, 
  Settings, Megaphone, BarChart3, GraduationCap, Trophy, MessageSquare, Image, ArrowRight, MapPin,
  Mail, Inbox, RefreshCw, CheckCircle2, Phone, Calendar, MessageCircle,
  Users, CalendarCheck2, BookOpenCheck, CalendarPlus } from 'lucide-react';
import { Course, ResultItem, Testimonial, GalleryItem, StatItem, DynamicContent } from '../types';
import AdminStudents from './admin/AdminStudents';
import AdminAttendance from './admin/AdminAttendance';
import AdminMarks from './admin/AdminMarks';
import AdminCalendar from './admin/AdminCalendar';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: DynamicContent;
  onSave: (updatedData: DynamicContent) => Promise<boolean>;
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
  const [localData, setLocalData] = useState<DynamicContent | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'courses' | 'results' | 'testimonials' | 'gallery' | 'mailbox' | 'siteContent' | 'batches' | 'faqs' | 'students' | 'attendance' | 'marks' | 'calendar'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Inquiries mailbox states
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<string[]>([]);
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
      fetchSubscribers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTab === 'mailbox' && isAuthenticated) {
      fetchInquiries();
      fetchSubscribers();
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
      if (res.status === 401) {
        handleLogout();
        return;
      }
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

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem('attri_admin_token');
      if (!token) return;
      const res = await fetch('/api/newsletter', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (res.ok) {
        const list = await res.json();
        setSubscribers(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error('Failed to fetch newsletter subscribers:', err);
    }
  };

  const handleToggleRead = async (id: string) => {
    try {
      const token = localStorage.getItem('attri_admin_token');
      const res = await fetch(`/api/inquiries/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
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
      if (res.status === 401) {
        handleLogout();
        return;
      }
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
      } else if (res.status === 401) {
        handleLogout();
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

  const updateStatField = (index: number, field: keyof StatItem, value: string) => {
    if (!localData) return;
    const stats = Array.isArray(localData.stats) ? localData.stats : [];
    const nextStats = [...stats];
    if (index >= 0 && index < nextStats.length) {
      nextStats[index] = { ...nextStats[index], [field]: value };
      setLocalData({ ...localData, stats: nextStats });
    }
  };

  const addStat = () => {
    if (!localData) return;
    const stats = Array.isArray(localData.stats) ? localData.stats : [];
    const newStat: StatItem = { label: 'New Stat', value: '0', note: 'Add supporting detail' };
    setLocalData({ ...localData, stats: [...stats, newStat] });
  };

  const deleteStat = (index: number) => {
    if (!localData) return;
    const stats = Array.isArray(localData.stats) ? localData.stats : [];
    setLocalData({ ...localData, stats: stats.filter((_, idx) => idx !== index) });
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
    const nextCourses = [...(localData.courses ?? [])];
    nextCourses[index] = { ...nextCourses[index], [field]: value };
    setLocalData({ ...localData, courses: nextCourses });
  };

  const handleCourseFeatureChange = (courseIdx: number, featureIdx: number, val: string) => {
    if (!localData) return;
    const nextCourses = [...(localData.courses ?? [])];
    const nextFeatures = [...(nextCourses[courseIdx].features ?? [])];
    nextFeatures[featureIdx] = val;
    nextCourses[courseIdx] = { ...nextCourses[courseIdx], features: nextFeatures };
    setLocalData({ ...localData, courses: nextCourses });
  };

  const removeCourseFeature = (courseIdx: number, featureIdx: number) => {
    if (!localData) return;
    const nextCourses = [...(localData.courses ?? [])];
    const nextFeatures = (nextCourses[courseIdx].features ?? []).filter((_, i) => i !== featureIdx);
    nextCourses[courseIdx] = { ...nextCourses[courseIdx], features: nextFeatures };
    setLocalData({ ...localData, courses: nextCourses });
  };

  const addCourseFeature = (courseIdx: number) => {
    if (!localData) return;
    const nextCourses = [...(localData.courses ?? [])];
    const nextFeatures = [...(nextCourses[courseIdx].features ?? []), 'New syllabus point'];
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
    setLocalData({ ...localData, courses: [newCourseItem, ...(localData.courses ?? [])] });
  };

  const deleteCourse = (id: string) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      courses: (localData.courses ?? []).filter(c => c.id !== id)
    });
  };

  // -- Results --
  const updateResultField = (index: number, field: keyof ResultItem, value: string) => {
    if (!localData) return;
    const nextResults = [...(localData.results ?? [])];
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
    setLocalData({ ...localData, results: [newResultItem, ...(localData.results ?? [])] });
  };

  const deleteResult = (id: string) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      results: (localData.results ?? []).filter(r => r.id !== id)
    });
  };

  // -- Testimonials --
  const updateTestimonialField = (index: number, field: keyof Testimonial, value: any) => {
    if (!localData) return;
    const nextTestimonials = [...(localData.testimonials ?? [])];
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
    setLocalData({ ...localData, testimonials: [...(localData.testimonials ?? []), newTestimonialItem] });
  };

  const deleteTestimonial = (id: string) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      testimonials: (localData.testimonials ?? []).filter(t => t.id !== id)
    });
  };

  // -- Gallery --
  const updateGalleryField = (index: number, field: keyof GalleryItem, value: string) => {
    if (!localData) return;
    const nextGallery = [...(localData.gallery ?? [])];
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
    setLocalData({ ...localData, gallery: [...(localData.gallery ?? []), newGalleryItem] });
  };

  const deleteGallery = (id: string) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      gallery: (localData.gallery ?? []).filter(g => g.id !== id)
    });
  };

  // -- Batches --
  const updateBatchField = (index: number, field: 'batch' | 'audience' | 'days' | 'time' | 'seatsLeft' | 'seatsTotal' | 'mode', value: string | number) => {
    if (!localData) return;
    const batches = localData.batches ?? [];
    const nextBatches = [...batches];
    nextBatches[index] = { ...nextBatches[index], [field]: value };
    setLocalData({ ...localData, batches: nextBatches });
  };

  const addBatch = () => {
    if (!localData) return;
    const batches = localData.batches ?? [];
    setLocalData({
      ...localData,
      batches: [...batches, { id: `batch-${Date.now()}`, batch: '', audience: '', days: '', time: '', seatsLeft: 0, seatsTotal: 20, mode: '' }]
    });
  };

  const deleteBatch = (index: number) => {
    if (!localData) return;
    const batches = localData.batches ?? [];
    setLocalData({ ...localData, batches: batches.filter((_, i) => i !== index) });
  };

  // -- FAQs --
  const updateFaqField = (index: number, field: 'question' | 'answer', value: string) => {
    if (!localData) return;
    const faqs = localData.faqs ?? [];
    const nextFaqs = [...faqs];
    nextFaqs[index] = { ...nextFaqs[index], [field]: value };
    setLocalData({ ...localData, faqs: nextFaqs });
  };

  const addFaq = () => {
    if (!localData) return;
    const faqs = localData.faqs ?? [];
    setLocalData({ ...localData, faqs: [...faqs, { question: '', answer: '' }] });
  };

  const deleteFaq = (index: number) => {
    if (!localData) return;
    const faqs = localData.faqs ?? [];
    setLocalData({ ...localData, faqs: faqs.filter((_, i) => i !== index) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/50 backdrop-blur-md overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface w-full max-w-6xl h-[85vh] rounded-2xl flex flex-col shadow-2xl border-4 border-line overflow-hidden text-ink"
      >
        {/* Modal Header */}
        <header className="h-16 border-b border-line flex items-center justify-between px-6 bg-surface-muted shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-ink text-canvas rounded-lg flex items-center justify-center font-bold text-base">A</div>
            <span className="text-ink font-extrabold text-lg uppercase tracking-tight">
              Control <span className="text-accent">Center</span>
            </span>
            {isAuthenticated && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Single User Admin Session
              </span>
            )}
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-ink-faint hover:text-ink hover:bg-surface-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {!isAuthenticated ? (
            /* LOGIN CARD */
            <div className="flex-1 flex items-center justify-center bg-surface-muted p-6">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-xl border border-line flex flex-col"
              >
                <div className="w-14 h-14 bg-accent-soft text-accent rounded-full flex items-center justify-center mb-5 mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-center text-2xl font-semibold text-ink uppercase mb-2">
                  Admin <span className="text-accent">Gatekeeper</span>
                </h2>
                <p className="text-center text-xs text-ink-soft mb-6">
                  Verify your Single-User Administrative Passcode to edit courses, results, and general banners.
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
                      Passcode
                    </label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-sm focus:border-accent outline-none transition-colors"
                      required
                      autoFocus
                    />
                  </div>

                  {authError && (
                    <div className="flex items-center gap-2 text-xs text-accent font-medium bg-surface-muted p-3 rounded-lg border border-line">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmittingAuth}
                    className="w-full bg-accent hover:bg-accent-strong text-on-accent font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
              <aside className="w-full md:w-56 bg-surface-muted border-r border-line p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible md:overflow-y-auto shrink-0">
                <button 
                  onClick={() => setActiveTab('general')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'general' 
                      ? 'bg-ink text-canvas shadow-md' 
                      : 'hover:bg-surface-muted text-ink-soft '
                  }`}
                >
                  <Megaphone className="w-4 h-4 shrink-0" />
                  General & Stats
                </button>

                <button 
                  onClick={() => setActiveTab('courses')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'courses' 
                      ? 'bg-ink text-canvas shadow-md' 
                      : 'hover:bg-surface-muted text-ink-soft '
                  }`}
                >
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  Courses ({localData?.courses?.length || 0})
                </button>

                <button 
                  onClick={() => setActiveTab('results')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'results' 
                      ? 'bg-ink text-canvas shadow-md' 
                      : 'hover:bg-surface-muted text-ink-soft '
                  }`}
                >
                  <Trophy className="w-4 h-4 shrink-0" />
                  Hall of Fame ({localData?.results?.length || 0})
                </button>

                <button 
                  onClick={() => setActiveTab('testimonials')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'testimonials' 
                      ? 'bg-ink text-canvas shadow-md' 
                      : 'hover:bg-surface-muted text-ink-soft '
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  Testimonials ({localData?.testimonials?.length || 0})
                </button>

                <button 
                  onClick={() => setActiveTab('gallery')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'gallery' 
                      ? 'bg-ink text-canvas shadow-md' 
                      : 'hover:bg-surface-muted text-ink-soft '
                  }`}
                >
                  <Image className="w-4 h-4 shrink-0" />
                  Gallery Tour ({localData?.gallery?.length || 0})
                </button>

                <button 
                  onClick={() => setActiveTab('mailbox')}
                  className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'mailbox' 
                      ? 'bg-ink text-canvas shadow-md' 
                      : 'hover:bg-surface-muted text-ink-soft '
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>Mailbox Inbox</span>
                  </div>
                  {inquiries.filter((inq: any) => !inq.read).length > 0 && (
                    <span className="bg-accent text-on-accent text-[9px] px-1.5 py-0.5 rounded-full font-extrabold tracking-tight animate-pulse shrink-0">
                      {inquiries.filter((inq: any) => !inq.read).length} NEW
                    </span>
                  )}
                </button>

                <div className="hidden md:block pt-2">
                  <p className="px-4 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-faint">Student Portal</p>
                </div>

                <button
                  onClick={() => setActiveTab('students')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'students'
                      ? 'bg-ink text-canvas shadow-md'
                      : 'hover:bg-surface-muted text-ink-soft '
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  Students
                </button>

                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'attendance'
                      ? 'bg-ink text-canvas shadow-md'
                      : 'hover:bg-surface-muted text-ink-soft '
                  }`}
                >
                  <CalendarCheck2 className="w-4 h-4 shrink-0" />
                  Attendance
                </button>

                <button
                  onClick={() => setActiveTab('marks')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'marks'
                      ? 'bg-ink text-canvas shadow-md'
                      : 'hover:bg-surface-muted text-ink-soft '
                  }`}
                >
                  <BookOpenCheck className="w-4 h-4 shrink-0" />
                  Marks
                </button>

                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'calendar'
                      ? 'bg-ink text-canvas shadow-md'
                      : 'hover:bg-surface-muted text-ink-soft '
                  }`}
                >
                  <CalendarPlus className="w-4 h-4 shrink-0" />
                  Calendar
                </button>
                  <button
                    onClick={() => setActiveTab('siteContent')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 ${
                      activeTab === 'siteContent' 
                        ? 'bg-accent-soft text-accent ' 
                        : 'text-ink-soft hover:bg-surface-muted '
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    Site Content
                  </button>
                  <button
                    onClick={() => setActiveTab('batches')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 ${
                      activeTab === 'batches' 
                        ? 'bg-accent-soft text-accent ' 
                        : 'text-ink-soft hover:bg-surface-muted '
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    Batches
                  </button>
                  <button
                    onClick={() => setActiveTab('faqs')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 ${
                      activeTab === 'faqs' 
                        ? 'bg-accent-soft text-accent ' 
                        : 'text-ink-soft hover:bg-surface-muted '
                    }`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    FAQs
                  </button>


                <div className="hidden md:block flex-1 border-t border-line my-4" />

                <button 
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-accent hover:bg-accent-soft transition-all cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Lock Panel
                </button>
              </aside>

              {/* Main editing canvas */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-surface-muted">
                {localData && (
                  <>
                    {/* Tab 1: General & Stats */}
                    {activeTab === 'general' && (
                      <div className="space-y-6">
                        <div className="bg-surface p-6 rounded-2xl border border-line shadow-sm space-y-4">
                          <h3 className="text-sm font-semibold text-ink uppercase tracking-wider pb-2 border-b flex items-center gap-2">
                            <Megaphone className="w-4 h-4 text-accent" /> Marquee Announcement Banner
                          </h3>
                          <div>
                            <label className="block text-xs font-bold text-ink-soft uppercase tracking-wide mb-1.5">
                              Alert Marquee Message Text
                            </label>
                            <textarea 
                              value={localData.admissionMessage}
                              onChange={(e) => updateGeneralField('admissionMessage', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-sm focus:border-accent outline-none transition-colors"
                              rows={3}
                            />
                            <p className="text-[10px] text-ink-faint mt-1">
                              This text scrolls in the alert banner right at the very top of the landing page. Keep it highly promotional!
                            </p>
                          </div>
                        </div>

                        <div className="bg-surface p-6 rounded-2xl border border-line shadow-sm space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-line">
                            <h3 className="text-sm font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-accent" /> Statistics Counters
                            </h3>
                            <button 
                              type="button"
                              onClick={addStat}
                              className="text-xs bg-accent hover:bg-accent-strong text-on-accent font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add stat
                            </button>
                          </div>

                          <div className="space-y-4">
                            {(Array.isArray(localData.stats) ? localData.stats : []).length === 0 ? (
                              <p className="text-xs text-ink-faint italic">No statistics defined. Click 'Add stat' to add counters.</p>
                            ) : (
                              (Array.isArray(localData.stats) ? localData.stats : []).map((stat, index) => (
                                <div key={index} className="p-4 bg-surface-muted rounded-xl border border-line relative space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => deleteStat(index)}
                                    className="absolute top-3 right-3 p-1.5 text-ink-faint hover:text-accent hover:bg-accent-soft rounded-lg transition-colors cursor-pointer"
                                    title="Delete Stat"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                      <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                        Label
                                      </label>
                                      <input 
                                        type="text"
                                        value={stat.label}
                                        onChange={(e) => updateStatField(index, 'label', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-xs outline-none focus:border-accent"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                        Value
                                      </label>
                                      <input 
                                        type="text"
                                        value={stat.value}
                                        onChange={(e) => updateStatField(index, 'value', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-xs outline-none focus:border-accent"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                        Note
                                      </label>
                                      <input 
                                        type="text"
                                        value={stat.note}
                                        onChange={(e) => updateStatField(index, 'note', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-xs outline-none focus:border-accent"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Personal Contact Details */}
                        <div className="bg-surface p-6 rounded-2xl border border-line shadow-sm space-y-4">
                          <h3 className="text-sm font-semibold text-ink uppercase tracking-wider pb-2 border-b flex items-center gap-2">
                            <Settings className="w-4 h-4 text-accent" /> Personal Contact & Social Handles
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-ink-soft uppercase tracking-wide mb-1.5">
                                Phone Number / WhatsApp
                              </label>
                              <input 
                                type="text"
                                value={localData.contactInfo?.phone || ''}
                                onChange={(e) => updateContactInfoField('phone', e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-sm focus:border-accent outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-ink-soft uppercase tracking-wide mb-1.5">
                                Email Address
                              </label>
                              <input 
                                type="email"
                                value={localData.contactInfo?.email || ''}
                                onChange={(e) => updateContactInfoField('email', e.target.value)}
                                placeholder="admissions@attrichemistry.com"
                                className="w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-sm focus:border-accent outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-ink-soft uppercase tracking-wide mb-1.5">
                                Instagram Link
                              </label>
                              <input 
                                type="text"
                                value={localData.contactInfo?.instagram || ''}
                                onChange={(e) => updateContactInfoField('instagram', e.target.value)}
                                placeholder="https://instagram.com/attri_chemistry"
                                className="w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-sm focus:border-accent outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-ink-soft uppercase tracking-wide mb-1.5">
                                Facebook Link
                              </label>
                              <input 
                                type="text"
                                value={localData.contactInfo?.facebook || ''}
                                onChange={(e) => updateContactInfoField('facebook', e.target.value)}
                                placeholder="https://facebook.com/attri_chemistry"
                                className="w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-sm focus:border-accent outline-none transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Multiple Coaching Centers Locations */}
                        <div className="bg-surface p-6 rounded-2xl border border-line shadow-sm space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-line">
                            <h3 className="text-sm font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-accent" /> Coaching Center Locations
                            </h3>
                            <button 
                              type="button"
                              onClick={addCenter}
                              className="text-xs bg-accent hover:bg-accent-strong text-on-accent font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Location
                            </button>
                          </div>

                          <div className="space-y-4">
                            {(!localData.centers || localData.centers.length === 0) ? (
                              <p className="text-xs text-ink-faint italic">No center locations defined. Click 'Add Location' to define branch campuses.</p>
                            ) : (
                              localData.centers.map((center, index) => (
                                <div key={center.id} className="p-4 bg-surface-muted rounded-xl border border-line relative space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => deleteCenter(index)}
                                    className="absolute top-3 right-3 p-1.5 text-ink-faint hover:text-accent hover:bg-accent-soft rounded-lg transition-colors cursor-pointer"
                                    title="Delete Location"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                        Campus Name
                                      </label>
                                      <input 
                                        type="text"
                                        value={center.name}
                                        onChange={(e) => updateCenterField(index, 'name', e.target.value)}
                                        placeholder="e.g. Main Campus / South Hub"
                                        className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-xs font-extrabold outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                        Subtext / Travel Details
                                      </label>
                                      <input 
                                        type="text"
                                        value={center.details}
                                        onChange={(e) => updateCenterField(index, 'details', e.target.value)}
                                        placeholder="e.g. 1 Min walk from Metro Station Exit"
                                        className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-xs outline-none"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                      Full Physical Address
                                    </label>
                                    <textarea 
                                      value={center.address}
                                      onChange={(e) => updateCenterField(index, 'address', e.target.value)}
                                      placeholder="H-489 Govindpuram, Ghaziabad..."
                                      rows={2}
                                      className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-xs outline-none"
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
                        <div className="flex justify-between items-center pb-2 border-b border-line">
                          <div>
                            <h3 className="text-base font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
                              <GraduationCap className="w-5 h-5 text-accent" /> Professional Course Offerings
                            </h3>
                            <p className="text-xs text-ink-faint">Add, delete, or rewrite curriculum specifications for classes.</p>
                          </div>
                          <button 
                            onClick={addCourse}
                            className="bg-accent hover:bg-accent-strong text-on-accent font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4" /> Add Program
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          {(localData.courses ?? []).map((course, idx) => (
                            <div 
                              key={course.id} 
                              className="bg-surface p-6 rounded-2xl border border-line shadow-sm relative group"
                            >
                              <button 
                                onClick={() => deleteCourse(course.id)}
                                className="absolute top-4 right-4 p-2 text-ink-faint hover:text-accent hover:bg-accent-soft rounded-xl transition-colors cursor-pointer"
                                title="Delete Course"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                {/* Title and Details */}
                                <div className="md:col-span-8 space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                        Course Title / Name
                                      </label>
                                      <input 
                                        type="text"
                                        value={course.name}
                                        onChange={(e) => updateCourseField(idx, 'name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm focus:border-accent outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                        Duration Label
                                      </label>
                                      <input 
                                        type="text"
                                        value={course.duration}
                                        onChange={(e) => updateCourseField(idx, 'duration', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm focus:border-accent outline-none"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                        Category Target
                                      </label>
                                      <select 
                                        value={course.category}
                                        onChange={(e) => updateCourseField(idx, 'category', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none"
                                      >
                                        <option value="NEET">NEET</option>
                                        <option value="JEE">JEE</option>
                                        <option value="Boards">Boards</option>
                                        <option value="Foundation">Foundation</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                        Card Top Badge Tag
                                      </label>
                                      <input 
                                        type="text"
                                        value={course.tag}
                                        onChange={(e) => updateCourseField(idx, 'tag', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                        Border Tag Color
                                      </label>
                                      <select 
                                        value={course.accentColor}
                                        onChange={(e) => updateCourseField(idx, 'accentColor', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none"
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
                                    <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                      Course Description
                                    </label>
                                    <textarea 
                                      value={course.description}
                                      onChange={(e) => updateCourseField(idx, 'description', e.target.value)}
                                      className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none"
                                      rows={2}
                                    />
                                  </div>
                                </div>

                                {/* Features Bulletin */}
                                <div className="md:col-span-4 border-l border-line pl-0 md:pl-5 space-y-3">
                                  <div className="flex justify-between items-center">
                                    <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide">
                                      Syllabus Bullet Highlights
                                    </label>
                                    <button 
                                      onClick={() => addCourseFeature(idx)}
                                      className="text-accent hover:underline text-[10px] font-bold uppercase flex items-center gap-0.5 cursor-pointer"
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
                                          className="flex-1 px-2.5 py-1.5 rounded border border-line bg-canvas text-xs"
                                        />
                                        <button 
                                          onClick={() => removeCourseFeature(idx, fIdx)}
                                          className="p-1 text-ink-faint hover:text-accent hover:bg-accent-soft rounded"
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
                        <div className="flex justify-between items-center pb-2 border-b border-line">
                          <div>
                            <h3 className="text-base font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-accent" /> Hall of Fame Academic Results
                            </h3>
                            <p className="text-xs text-ink-faint">Post records and scores of recent JEE and NEET exam achievers.</p>
                          </div>
                          <button 
                            onClick={addResult}
                            className="bg-accent hover:bg-accent-strong text-on-accent font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4" /> Add Achiever
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {(localData.results ?? []).map((resItem, idx) => (
                            <div 
                              key={resItem.id} 
                              className="bg-surface p-5 rounded-2xl border border-line shadow-sm relative space-y-4"
                            >
                              <button 
                                onClick={() => deleteResult(resItem.id)}
                                className="absolute top-4 right-4 p-2 text-ink-faint hover:text-accent hover:bg-accent-soft rounded-xl transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="flex items-center gap-4">
                                <img 
                                  src={resItem.image} 
                                  alt={resItem.name}
                                  className="w-16 h-16 rounded-full object-cover border-2 border-line shadow-sm"
                                  onError={(e) => {
                                    // Fallback if Unsplash fails
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150';
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-0.5">
                                    Achiever's Full Name
                                  </label>
                                  <input 
                                    type="text"
                                    value={resItem.name}
                                    onChange={(e) => updateResultField(idx, 'name', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-canvas text-sm font-bold"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                    Rank / Score Title
                                  </label>
                                  <input 
                                    type="text"
                                    value={resItem.rank}
                                    onChange={(e) => updateResultField(idx, 'rank', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-canvas text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                    Exam Level
                                  </label>
                                  <input 
                                    type="text"
                                    value={resItem.exam}
                                    onChange={(e) => updateResultField(idx, 'exam', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-canvas text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                    Score Details
                                  </label>
                                  <input 
                                    type="text"
                                    value={resItem.score}
                                    onChange={(e) => updateResultField(idx, 'score', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-canvas text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                    Achieved Year
                                  </label>
                                  <input 
                                    type="text"
                                    value={resItem.year}
                                    onChange={(e) => updateResultField(idx, 'year', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-canvas text-xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1.5">
                                  Select Achiever Photo from Device (JPG/PNG/WEBP)
                                </label>
                                <div className="flex items-center gap-3">
                                  <label className="px-4 py-2 bg-surface-muted hover:bg-surface-muted text-ink rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors border border-line flex items-center gap-1.5 shrink-0">
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
                                    <span className="text-[10px] text-ink-faint font-mono truncate max-w-xs block">
                                      {resItem.image.startsWith('data:') ? '✓ Custom uploaded image' : '✓ Default active image'}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                  Specific Milestone / Subject Grade Achievement
                                </label>
                                <input 
                                  type="text"
                                  value={resItem.achievement}
                                  onChange={(e) => updateResultField(idx, 'achievement', e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-canvas text-xs"
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
                        <div className="flex justify-between items-center pb-2 border-b border-line">
                          <div>
                            <h3 className="text-base font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-accent" /> Parent & Student Reviews
                            </h3>
                            <p className="text-xs text-ink-faint">Edit core student and parent testimonials about Attri Chemistry.</p>
                          </div>
                          <button 
                            onClick={addTestimonial}
                            className="bg-accent hover:bg-accent-strong text-on-accent font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4" /> Add Testimonial
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          {(localData.testimonials ?? []).map((testItem, idx) => (
                            <div 
                              key={testItem.id} 
                              className="bg-surface p-6 rounded-2xl border border-line shadow-sm relative space-y-4"
                            >
                              <button 
                                onClick={() => deleteTestimonial(testItem.id)}
                                className="absolute top-4 right-4 p-2 text-ink-faint hover:text-accent hover:bg-accent-soft rounded-xl transition-colors cursor-pointer"
                                title="Delete Testimonial"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                    Reviewer Full Name
                                  </label>
                                  <input 
                                    type="text"
                                    value={testItem.name}
                                    onChange={(e) => updateTestimonialField(idx, 'name', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-canvas text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                    Role Designation
                                  </label>
                                  <select 
                                    value={testItem.role}
                                    onChange={(e) => updateTestimonialField(idx, 'role', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-canvas text-sm outline-none"
                                  >
                                    <option value="Student">Student</option>
                                    <option value="Parent">Parent</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                    Tag / Course Reference
                                  </label>
                                  <input 
                                    type="text"
                                    value={testItem.course}
                                    onChange={(e) => updateTestimonialField(idx, 'course', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-canvas text-sm"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                    Rating (Stars 1-5)
                                  </label>
                                  <input 
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={testItem.rating}
                                    onChange={(e) => updateTestimonialField(idx, 'rating', parseInt(e.target.value) || 5)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-canvas text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                    Avatar Initials / Seed Name
                                  </label>
                                  <input 
                                    type="text"
                                    value={testItem.avatarSeed}
                                    onChange={(e) => updateTestimonialField(idx, 'avatarSeed', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-canvas text-sm"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                  Full Review Message Text
                                </label>
                                <textarea 
                                  value={testItem.review}
                                  onChange={(e) => updateTestimonialField(idx, 'review', e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-canvas text-sm"
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
                        <div className="flex justify-between items-center pb-2 border-b border-line">
                          <div>
                            <h3 className="text-base font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
                              <Image className="w-5 h-5 text-accent" /> Custom Gallery Tour Photos
                            </h3>
                            <p className="text-xs text-ink-faint">Manage the educational slide, classroom, laboratory, and event photos.</p>
                          </div>
                          <button 
                            onClick={addGallery}
                            className="bg-accent hover:bg-accent-strong text-on-accent font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4" /> Add Photo
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {(localData.gallery ?? []).map((galItem, idx) => (
                            <div 
                              key={galItem.id} 
                              className="bg-surface p-5 rounded-2xl border border-line shadow-sm relative space-y-4"
                            >
                              <button 
                                onClick={() => deleteGallery(galItem.id)}
                                className="absolute top-4 right-4 p-2 text-ink-faint hover:text-accent hover:bg-accent-soft rounded-xl transition-colors"
                                title="Delete Photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="flex gap-4">
                                <img 
                                  src={galItem.imgUrl} 
                                  alt={galItem.title}
                                  className="w-24 h-16 rounded-lg object-cover border border-line"
                                />
                                <div className="flex-1 min-w-0">
                                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                    Photo Title
                                  </label>
                                  <input 
                                    type="text"
                                    value={galItem.title}
                                    onChange={(e) => updateGalleryField(idx, 'title', e.target.value)}
                                    className="w-full px-2.5 py-1 py-1.5 rounded-lg border border-line bg-canvas text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                    Gallery Category
                                  </label>
                                  <select 
                                    value={galItem.category}
                                    onChange={(e) => updateGalleryField(idx, 'category', e.target.value as any)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-canvas text-xs outline-none"
                                  >
                                    <option value="Classroom">Classroom</option>
                                    <option value="Lab">Lab</option>
                                    <option value="Events">Events</option>
                                  </select>
                                </div>
                                <div className="flex-1">
                                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">
                                    Brief Description
                                  </label>
                                  <input 
                                    type="text"
                                    value={galItem.desc}
                                    onChange={(e) => updateGalleryField(idx, 'desc', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-canvas text-xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1.5">
                                  Select Photo from Device (JPG/PNG/WEBP)
                                </label>
                                <div className="flex items-center gap-3">
                                  <label className="px-4 py-2 bg-surface-muted hover:bg-surface-muted text-ink rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors border border-line flex items-center gap-1.5 shrink-0">
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
                                    <span className="text-[10px] text-ink-faint font-mono truncate max-w-xs block">
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
                    {activeTab === 'siteContent' && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-sm font-semibold text-ink mb-4">Hero Section</h3>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-ink-soft mb-1">Headline</label>
                              <input type="text" value={localData?.heroContent?.headline || ''} onChange={(e) => setLocalData({...localData, heroContent: { ...(localData?.heroContent ?? { headline: '', subheadline: '' }), headline: e.target.value }})} className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none focus:border-accent" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-ink-soft mb-1">Subheadline</label>
                              <textarea value={localData?.heroContent?.subheadline || ''} onChange={(e) => setLocalData({...localData, heroContent: { ...(localData?.heroContent ?? { headline: '', subheadline: '' }), subheadline: e.target.value }})} rows={3} className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none focus:border-accent" />
                            </div>
                          </div>
                        </div>
                        <hr className="border-line" />
                        <div>
                          <h3 className="text-sm font-semibold text-ink mb-4">About Section</h3>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-ink-soft mb-1">Heading</label>
                              <input type="text" value={localData?.aboutContent?.heading || ''} onChange={(e) => setLocalData({...localData, aboutContent: { ...(localData?.aboutContent ?? { heading: '', paragraph1: '', paragraph2: '' }), heading: e.target.value }})} className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none focus:border-accent" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-ink-soft mb-1">Paragraph 1</label>
                              <textarea value={localData?.aboutContent?.paragraph1 || ''} onChange={(e) => setLocalData({...localData, aboutContent: { ...(localData?.aboutContent ?? { heading: '', paragraph1: '', paragraph2: '' }), paragraph1: e.target.value }})} rows={3} className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none focus:border-accent" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-ink-soft mb-1">Paragraph 2</label>
                              <textarea value={localData?.aboutContent?.paragraph2 || ''} onChange={(e) => setLocalData({...localData, aboutContent: { ...(localData?.aboutContent ?? { heading: '', paragraph1: '', paragraph2: '' }), paragraph2: e.target.value }})} rows={3} className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none focus:border-accent" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'batches' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-ink">Batch Schedule</h3>
                          <button onClick={addBatch} className="px-3 py-1.5 text-xs font-medium bg-ink text-canvas rounded-lg hover:bg-ink/90">Add Batch</button>
                        </div>
                        <div className="space-y-4">
                          {(localData?.batches ?? []).map((batch, index) => (
                            <div key={index} className="p-4 rounded-xl border border-line space-y-4 relative group">
                              <button onClick={() => deleteBatch(index)} className="absolute top-4 right-4 text-ink-faint hover:text-accent"><Trash2 className="h-4 w-4" /></button>
                              <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs mb-1">Batch Name</label><input type="text" value={batch.batch} onChange={(e) => updateBatchField(index, 'batch', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none focus:border-accent" /></div>
                                <div><label className="block text-xs mb-1">Audience</label><input type="text" value={batch.audience} onChange={(e) => updateBatchField(index, 'audience', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none focus:border-accent" /></div>
                                <div><label className="block text-xs mb-1">Days</label><input type="text" value={batch.days} onChange={(e) => updateBatchField(index, 'days', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none focus:border-accent" /></div>
                                <div><label className="block text-xs mb-1">Time</label><input type="text" value={batch.time} onChange={(e) => updateBatchField(index, 'time', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none focus:border-accent" /></div>
                                <div><label className="block text-xs mb-1">Seats Left</label><input type="number" value={batch.seatsLeft} onChange={(e) => updateBatchField(index, 'seatsLeft', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none focus:border-accent" /></div>
                                <div><label className="block text-xs mb-1">Mode</label><input type="text" value={batch.mode} onChange={(e) => updateBatchField(index, 'mode', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none focus:border-accent" /></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'faqs' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-ink">FAQs</h3>
                          <button onClick={addFaq} className="px-3 py-1.5 text-xs font-medium bg-ink text-canvas rounded-lg hover:bg-ink/90">Add FAQ</button>
                        </div>
                        <div className="space-y-4">
                          {(localData?.faqs ?? []).map((faq, index) => (
                            <div key={index} className="p-4 rounded-xl border border-line space-y-4 relative group">
                              <button onClick={() => deleteFaq(index)} className="absolute top-4 right-4 text-ink-faint hover:text-accent"><Trash2 className="h-4 w-4" /></button>
                              <div>
                                <label className="block text-xs mb-1">Question</label>
                                <input type="text" value={faq.question} onChange={(e) => updateFaqField(index, 'question', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none focus:border-accent" />
                              </div>
                              <div>
                                <label className="block text-xs mb-1">Answer</label>
                                <textarea value={faq.answer} onChange={(e) => updateFaqField(index, 'answer', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm outline-none focus:border-accent" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Student Portal: Students */}
                    {activeTab === 'students' && <AdminStudents onAuthError={handleLogout} />}

                    {/* Student Portal: Attendance */}
                    {activeTab === 'attendance' && <AdminAttendance onAuthError={handleLogout} />}

                    {/* Student Portal: Marks */}
                    {activeTab === 'marks' && <AdminMarks onAuthError={handleLogout} />}

                    {/* Student Portal: Calendar */}
                    {activeTab === 'calendar' && <AdminCalendar onAuthError={handleLogout} />}

                    {activeTab === 'mailbox' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center pb-2 border-b border-line">
                          <div>
                            <h3 className="text-base font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
                              <Inbox className="w-5 h-5 text-accent" /> Student Booking & Leads Inbox
                            </h3>
                            <p className="text-xs text-ink-faint">View real-time registrations and queries from 'Enroll & Book Demo' or 'Contact' forms.</p>
                          </div>
                          <button 
                            onClick={fetchInquiries}
                            disabled={isLoadingInquiries}
                            className="bg-surface-muted hover:bg-surface-muted text-ink font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw className={`w-4 h-4 ${isLoadingInquiries ? 'animate-spin' : ''}`} /> 
                            {isLoadingInquiries ? 'Refreshing...' : 'Refresh Inbox'}
                          </button>
                        </div>

                        {inquiries.length === 0 ? (
                          <div className="bg-surface rounded-2xl border border-line p-12 text-center space-y-4 shadow-sm">
                            <div className="w-16 h-16 bg-accent-soft rounded-full flex items-center justify-center mx-auto text-accent">
                              <Mail className="w-8 h-8 opacity-80" />
                            </div>
                            <h4 className="text-lg font-bold text-ink">Your Mailbox is Empty</h4>
                            <p className="text-sm text-ink-faint max-w-sm mx-auto leading-relaxed">
                              When students register for demo sessions or contact you from the main landing page, their real-time inquiries will appear here.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Inbox List Panel */}
                            <div className="lg:col-span-5 bg-surface rounded-2xl border border-line shadow-sm overflow-hidden flex flex-col max-h-[600px]">
                              <div className="p-4 border-b border-line bg-surface-muted flex justify-between items-center">
                                <span className="text-xs font-bold text-ink-soft uppercase tracking-wide">
                                  All Messages ({inquiries.length})
                                </span>
                                <span className="text-[10px] bg-accent-soft text-accent px-2 py-0.5 rounded font-bold">
                                  {inquiries.filter((inq: any) => !inq.read).length} Unread
                                </span>
                              </div>

                              <div className="divide-y divide-line overflow-y-auto flex-1">
                                {inquiries.map((inq: any) => {
                                  const isSelected = selectedInquiryId === inq.id;
                                  return (
                                    <div
                                      key={inq.id}
                                      onClick={() => setSelectedInquiryId(inq.id)}
                                      className={`p-4 transition-all cursor-pointer text-left relative ${
                                        isSelected 
                                          ? 'bg-accent-soft border-l-4 border-l-accent ' 
                                          : 'hover:bg-surface-muted '
                                      } ${!inq.read ? 'font-semibold' : ''}`}
                                    >
                                      {/* Unread status dot indicator */}
                                      {!inq.read && (
                                        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent" />
                                      )}

                                      <div className="flex items-center gap-2 mb-1.5">
                                        <span className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded tracking-wider ${
                                          inq.type === 'enroll'
                                            ? 'bg-emerald-50 text-emerald-700 '
                                            : 'bg-indigo-50 text-indigo-700 '
                                        }`}>
                                          {inq.type === 'enroll' ? 'Booking' : 'Inquiry'}
                                        </span>
                                        <span className="text-[10px] text-ink-faint font-mono">
                                          {formatDate(inq.timestamp)}
                                        </span>
                                      </div>

                                      <h5 className="text-sm font-bold text-ink truncate">
                                        {inq.name}
                                      </h5>
                                      <p className="text-xs text-ink-soft truncate mt-0.5">
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
                                  <div className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden flex flex-col">
                                    <div className="p-6 border-b border-line bg-surface-muted flex justify-between items-start gap-4 flex-wrap text-left">
                                      <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                          <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded tracking-widest ${
                                            activeInquiry.type === 'enroll'
                                              ? 'bg-emerald-100 text-emerald-800 '
                                              : 'bg-indigo-100 text-indigo-800 '
                                          }`}>
                                            {activeInquiry.type === 'enroll' ? 'Class Booking Lead' : 'General Contact Message'}
                                          </span>
                                          <span className="text-xs font-mono text-ink-faint">
                                            {formatDate(activeInquiry.timestamp)}
                                          </span>
                                        </div>
                                        <h4 className="text-lg sm:text-xl font-semibold text-ink leading-tight">
                                          {activeInquiry.name}
                                        </h4>
                                      </div>

                                      {/* Action buttons (Read status, Delete) */}
                                      <div className="flex items-center gap-2 shrink-0">
                                        <button
                                          onClick={() => handleToggleRead(activeInquiry.id)}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                                            activeInquiry.read 
                                              ? 'bg-surface-muted text-ink-soft border-line hover:bg-surface-muted '
                                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 '
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
                                              ? 'bg-accent text-on-accent border-accent hover:bg-accent-strong font-extrabold scale-105'
                                              : 'bg-surface-muted text-accent border-line hover:bg-accent-soft '
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
                                          <span className="block text-[10px] font-bold text-ink-faint uppercase tracking-wider">
                                            Contact Phone / WhatsApp
                                          </span>
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-extrabold text-ink font-mono">
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
                                          <span className="block text-[10px] font-bold text-ink-faint uppercase tracking-wider">
                                            Email Address
                                          </span>
                                          <span className="text-sm font-semibold text-ink block">
                                            {activeInquiry.email || <span className="text-ink-faint italic">Not Provided</span>}
                                          </span>
                                        </div>

                                        {/* Target Course / Batch */}
                                        <div className="space-y-1 sm:col-span-2">
                                          <span className="block text-[10px] font-bold text-ink-faint uppercase tracking-wider">
                                            Chemistry Program / Academic Batch Interest
                                          </span>
                                          <span className="text-sm font-extrabold text-accent block bg-surface-muted px-3 py-2 rounded-xl border border-line">
                                            {activeInquiry.course}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Student details / custom description inquiry message */}
                                      <div className="space-y-1 border-t border-line pt-5 font-sans">
                                        <span className="block text-[10px] font-bold text-ink-faint uppercase tracking-wider mb-2">
                                          Message Details & Preferences
                                        </span>
                                        <div className="bg-surface-muted p-4 rounded-xl text-xs sm:text-sm text-ink leading-relaxed font-medium min-h-[100px] whitespace-pre-wrap">
                                          {activeInquiry.message || <span className="text-ink-faint italic font-normal">No additional message or notes provided.</span>}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}

                        <div className="bg-surface rounded-2xl border border-line shadow-sm p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
                              <Mail className="w-4 h-4 text-accent" /> Practice bulletin subscribers
                            </h3>
                            <span className="text-[10px] bg-accent-soft text-accent px-2 py-0.5 rounded font-bold">
                              {subscribers.length}
                            </span>
                          </div>
                          {subscribers.length === 0 ? (
                            <p className="text-xs text-ink-faint italic">No newsletter subscribers yet.</p>
                          ) : (
                            <ul className="flex flex-wrap gap-2">
                              {subscribers.map((email, index) => (
                                <li key={`${email}-${index}`} className="text-xs text-ink-soft bg-surface-muted border border-line px-2.5 py-1 rounded-lg font-mono">
                                  {email}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
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
          <footer className="h-16 border-t border-line px-6 flex items-center justify-between bg-surface-muted shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">
              Verify values and click save. Updates sync globally in real-time.
            </span>

            <div className="flex items-center gap-3">
              <AnimatePresence mode="wait">
                {saveStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold uppercase tracking-wide bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
                  >
                    <Check className="w-4 h-4" /> Live Content Synced
                  </motion.div>
                )}
                {saveStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-1.5 text-xs text-accent font-bold uppercase tracking-wide bg-surface-muted px-3 py-1.5 rounded-lg border border-line"
                  >
                    <AlertCircle className="w-4 h-4" /> Sync Failure
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="bg-accent hover:bg-accent-strong text-on-accent font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
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
