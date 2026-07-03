import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COURSES } from '../data';
import { Course } from '../types';
import { Clock, CheckCircle2, Bookmark, Flame, Sparkles, BookOpen, UserCheck, X, Check } from 'lucide-react';

interface CoursesProps {
  courses?: Course[];
}

export default function Courses({ courses }: CoursesProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'NEET' | 'JEE' | 'Boards' | 'Foundation'>('All');
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<Course | null>(null);
  const [enrollFormSubmitted, setEnrollFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', grade: '12th Class', mode: 'Offline' });

  const coursesToDisplay = courses || COURSES;

  // Filter courses based on tab
  const filteredCourses = activeTab === 'All' 
    ? coursesToDisplay 
    : coursesToDisplay.filter(course => course.category === activeTab);

  const handleEnrollClick = (course: Course) => {
    setSelectedCourseForEnroll(course);
    setEnrollFormSubmitted(false);
    setSubmitError(null);
  };

  const handleEnrollSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !selectedCourseForEnroll) return;
    
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
          course: selectedCourseForEnroll.name,
          message: `Class Preference: ${formData.grade} | Mode of Class: ${formData.mode}`,
          type: 'enroll'
        })
      });

      if (res.ok) {
        setEnrollFormSubmitted(true);
      } else {
        const errData = await res.json();
        setSubmitError(errData.error || 'Failed to register your booking. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal and reset
  const handleCloseModal = () => {
    setSelectedCourseForEnroll(null);
    setFormData({ name: '', phone: '', grade: '12th Class', mode: 'Offline' });
    setSubmitError(null);
  };

  return (
    <section
      id="courses"
      className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-black tracking-widest text-blue-600 dark:text-orange-500 uppercase mb-2">
            Academic Programs
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our Result-Oriented Chemistry Batches
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Meticulously structured modules with NCERT core alignments, weekly assessments, and interactive sessions.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-xl mx-auto bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800">
          {(['All', 'NEET', 'JEE', 'Boards', 'Foundation'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 dark:bg-orange-500 text-white shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'Boards' ? 'Boards prep' : tab}
            </button>
          ))}
        </div>

        {/* Courses Grid with motion animation */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => {
              const borderAccentColor = 
                course.category === 'NEET' ? 'border-t-4 border-t-rose-500' :
                course.category === 'JEE' ? 'border-t-4 border-t-blue-500' :
                course.category === 'Boards' ? 'border-t-4 border-t-indigo-500' :
                'border-t-4 border-t-amber-500';

              const headerPillColor = 
                course.category === 'NEET' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' :
                course.category === 'JEE' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' :
                course.category === 'Boards' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' :
                'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';

              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-md hover:shadow-xl p-6 sm:p-7 flex flex-col justify-between transition-all ${borderAccentColor} group relative overflow-hidden`}
                >
                  <div>
                    {/* Top Tag & Indicator */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${headerPillColor}`}>
                        {course.tag}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        <span>{course.duration.split(' ')[0]} {course.duration.split(' ')[1]}</span>
                      </div>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-orange-400 transition-colors mb-3">
                      {course.name}
                    </h3>

                    {/* Course Description */}
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Feature Bullets */}
                    <div className="space-y-3 border-t border-slate-100 dark:border-slate-800/80 pt-5 mb-8">
                      {course.features.map((feat, index) => (
                        <div key={index} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enroll CTA */}
                  <button
                    onClick={() => handleEnrollClick(course)}
                    className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-orange-500 text-white font-bold text-sm tracking-wide transition-all shadow hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    Enroll & Book Demo
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Quick Registration Popup Dialog */}
        <AnimatePresence>
          {selectedCourseForEnroll && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Blur backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800"
              >
                {/* Header background band */}
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-6 relative">
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] uppercase font-black tracking-widest bg-orange-500 text-white px-2.5 py-0.5 rounded">
                    Batch Registration
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black mt-2 leading-tight">
                    {selectedCourseForEnroll.name}
                  </h4>
                  <p className="text-blue-100 text-xs mt-1">
                    Book your free, non-obligatory demo session instantly.
                  </p>
                </div>

                {/* Form or Success state */}
                <div className="p-6 sm:p-8">
                  {!enrollFormSubmitted ? (
                    <form onSubmit={handleEnrollSubmit} className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          Student Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          WhatsApp / Contact Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                            Current Class
                          </label>
                          <select
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none"
                          >
                            <option>Class 9th</option>
                            <option>Class 10th</option>
                            <option>Class 11th</option>
                            <option>Class 12th</option>
                            <option>Class 12th Passout</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                            Batch Preference
                          </label>
                          <select
                            value={formData.mode}
                            onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none"
                          >
                            <option>Offline Classes</option>
                            <option>Online Live Class</option>
                            <option>Hybrid Model</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 py-2 text-slate-500 dark:text-slate-400 text-xs">
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                        <span>No credit card required. Free demo includes 3 masterclasses.</span>
                      </div>

                      {submitError && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-medium">
                          {submitError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Registering...' : 'Confirm Slot & Get Call-Back'}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-6 space-y-4">
                      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>
                      <h5 className="text-xl font-bold text-slate-900 dark:text-white">
                        Registration Successful!
                      </h5>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                        Thank you, <span className="font-extrabold text-slate-800 dark:text-slate-100">{formData.name}</span>. We have reserved your demo seat for <span className="font-semibold">{selectedCourseForEnroll.name}</span>. Attri Sir or our team advisor will contact you on <span className="font-semibold">{formData.phone}</span> shortly.
                      </p>
                      <button
                        onClick={handleCloseModal}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm cursor-pointer"
                      >
                        Okay, Perfect
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
