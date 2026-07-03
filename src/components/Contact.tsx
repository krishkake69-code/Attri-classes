import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, MapPin, Check, Send, Sparkles, AlertCircle } from 'lucide-react';

interface ContactProps {
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

export default function Contact({ contactInfo, centers }: ContactProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', course: 'NEET Prep', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedCenterIdx, setSelectedCenterIdx] = useState(0);

  const cleanPhone = contactInfo?.phone ? contactInfo.phone.replace(/[^0-9]/g, '') : '919876543210';

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hi ATTRI CHEMISTRY CLASSES, I would like to inquire about batch timings and book a free Demo class. My name is [Student Name].`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          course: formData.course,
          message: formData.message,
          type: 'contact'
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', course: 'NEET Prep', message: '' });
      } else {
        const errData = await res.json();
        setSubmitError(errData.error || 'Failed to submit registration. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultCenters = [
    {
      id: 'center-1',
      name: "Main Campus",
      address: "3rd Floor, Golden Plaza, Opp. Medical College Road, Sector 15, New Delhi - 110001",
      details: "Main Commercial Hub Area"
    }
  ];

  const centersToDisplay = (centers && centers.length > 0) ? centers : defaultCenters;
  const activeCenter = centersToDisplay[selectedCenterIdx] || centersToDisplay[0] || defaultCenters[0];

  return (
    <section
      id="contact"
      className="py-20 md:py-28 bg-white dark:bg-slate-900 transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-black tracking-widest text-blue-600 dark:text-orange-500 uppercase mb-2">
            Admissions Open
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Connect With Our Academic Advisors
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Have questions about fees, batch timings, or study materials? Write to us or call our support lines.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Details without map */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-start">
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                Contact Information
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Our coaching campuses are located in the heart of the education hubs. Stop by for a free counseling session and physical inspection of study halls.
              </p>

              {/* Multi Center Selector */}
              {centersToDisplay.length > 1 && (
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Branch Campus:</span>
                  <div className="flex flex-wrap gap-2">
                    {centersToDisplay.map((center, index) => (
                      <button
                        key={center.id}
                        onClick={() => setSelectedCenterIdx(index)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                          selectedCenterIdx === index
                            ? 'bg-blue-900 border-blue-900 text-white shadow'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}
                      >
                        {center.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Detail Items */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-450">Phone Number</h4>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {contactInfo?.phone || '+91 98765 43210'}
                    </p>
                    <p className="text-xs text-slate-400">Available 9:00 AM - 7:00 PM Daily</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-450">Email Address</h4>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {contactInfo?.email || 'admissions@attrichemistry.com'}
                    </p>
                    <p className="text-xs text-slate-400">Official academic & parents support line</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-450">
                      {activeCenter.name} Address
                    </h4>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 leading-tight">
                      {activeCenter.address}
                    </p>
                    <p className="text-xs text-slate-400">{activeCenter.details}</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout Banner */}
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                {/* Custom glowing icon */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.01 14.069.988 11.99.988c-5.438 0-9.863 4.373-9.867 9.803-.001 1.97.512 3.888 1.49 5.593L2.613 21.35l5.09-1.33c1.56.95 3.1 1.45 4.815 1.45l.13-.1zM17.37 14.5c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-2.73-1.36-3.85-2.28-4.9-4.1-.15-.26-.15-.45-.01-.59.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.22-.24-.59-.5-.51-.67-.52-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.12 4.52.72.31 1.28.5 1.71.64.72.23 1.38.2 1.9.12.58-.09 1.74-.71 1.99-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.22-.57-.37z"/>
                </svg>
                <span>Chat Instantly on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Column: Contact Lead Generation Form */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 sm:p-10 border border-slate-200/50 dark:border-slate-850 flex flex-col justify-between shadow-sm relative">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleFormSubmit}
                  className="space-y-5 flex-1 flex flex-col justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                      Book 3 Free Demo Lectures
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-normal">
                      Fill out your scientific goals and contact details. Our administrative officer will activate your classroom portal logins within 2 hours.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Student full name"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-450 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          WhatsApp / Phone
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="WhatsApp number for reports"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-450 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. name@domain.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-450 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Target Course */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          Select Chemistry Batch
                        </label>
                        <select
                          value={formData.course}
                          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none transition-all"
                        >
                          <option>NEET Chemistry</option>
                          <option>JEE Chemistry</option>
                          <option>Class 11 Chemistry</option>
                          <option>Class 12 Chemistry</option>
                          <option>CBSE Class 12 Boards</option>
                          <option>Junior Science Foundation</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Any questions or current school marks?
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="e.g. Scored 85% in Class 10. Want organic chemistry booster class."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-450 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-medium">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 mt-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm tracking-wide shadow shadow-blue-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Reserving demo slot...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Registration & Claim Free Booklets</span>
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12 space-y-6 flex flex-col items-center justify-center h-full"
                >
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
                    <Check className="w-10 h-10 stroke-[3]" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                      Counseling Seat Reserved!
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      We have received your contact details. Our chief advisor <span className="font-bold text-slate-850 dark:text-white">Attri Sir</span> or a faculty coordinator will call you back within <span className="font-semibold text-blue-600 dark:text-orange-500">2 hours</span> to confirm timings.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-black cursor-pointer"
                  >
                    Register another student
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
