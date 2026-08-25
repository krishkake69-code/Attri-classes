import { useState } from 'react';
import { TESTIMONIALS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowLeft, ArrowRight, Quote, HeartHandshake, UserCheck } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonialsToDisplay = testimonials || TESTIMONIALS;
  const hasTestimonials = testimonialsToDisplay.length > 0;
  const safeIndex = hasTestimonials && currentIndex >= testimonialsToDisplay.length ? 0 : currentIndex;

  const handlePrev = () => {
    if (!hasTestimonials) return;
    setCurrentIndex((prev) => {
      const idx = prev >= testimonialsToDisplay.length ? 0 : prev;
      return idx === 0 ? testimonialsToDisplay.length - 1 : idx - 1;
    });
  };

  const handleNext = () => {
    if (!hasTestimonials) return;
    setCurrentIndex((prev) => {
      const idx = prev >= testimonialsToDisplay.length ? 0 : prev;
      return idx === testimonialsToDisplay.length - 1 ? 0 : idx + 1;
    });
  };

  const current = hasTestimonials ? testimonialsToDisplay[safeIndex] : null;

  return (
    <section
      id="testimonials"
      className="py-20 md:py-28 bg-white dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-black tracking-widest text-blue-600 dark:text-orange-500 uppercase mb-2">
            Feedback & Reviews
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            What Students & Parents Are Saying
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Testimonials Main Interface */}
        <div className="max-w-4xl mx-auto relative px-4">
          
          {hasTestimonials ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="bg-slate-50 dark:bg-slate-950 p-8 sm:p-12 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm relative flex flex-col justify-between"
              >
                {/* Double quote visual decoration */}
                <Quote className="w-20 h-20 text-slate-200 dark:text-slate-800 absolute top-4 left-4 -z-0 opacity-40 pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  
                  {/* Star rating row */}
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: current!.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-500" />
                    ))}
                  </div>

                  {/* Main feedback body */}
                  <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic">
                    "{current!.review}"
                  </p>

                  {/* Profile details bottom row */}
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-850">
                    {/* Initials circle */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/10">
                      {current!.name[0]}
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        {current!.name}
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${
                          current!.role === 'Student' 
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' 
                            : 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300'
                        }`}>
                          {current!.role}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                        {current!.course}
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-950 p-12 rounded-3xl border border-slate-100 dark:border-slate-850 text-center">
              <Quote className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4 opacity-50" />
              <p className="text-slate-500 dark:text-slate-400 text-lg">No testimonials yet. Add some from the admin panel!</p>
            </div>
          )}

          {/* Controls next/prev under the box */}
          <div className="flex items-center justify-between sm:justify-end gap-4 mt-8">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="font-bold text-blue-600 dark:text-orange-500">0{currentIndex + 1}</span>
              <span>/</span>
              <span>0{TESTIMONIALS.length}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-blue-500 transition-colors shadow-sm cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-blue-600 dark:bg-orange-500 text-white hover:bg-blue-700 dark:hover:bg-orange-600 transition-colors shadow shadow-blue-500/10 cursor-pointer"
                aria-label="Next testimonial"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Lead Trust highlights row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">
          {[
            { label: 'Parent Approved', icon: HeartHandshake },
            { label: 'Rank-Producing Guidance', icon: Star },
            { label: 'Daily WhatsApp Progress', icon: UserCheck },
            { label: 'Doubt Resolved Today', icon: Quote }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850/40">
              <item.icon className="w-5 h-5 text-orange-500 mb-1.5" />
              <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">{item.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
