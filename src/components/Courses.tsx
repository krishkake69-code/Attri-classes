import { useEffect, useState, FormEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { COURSES } from '../data';
import { Course } from '../types';
import { Clock, Check, BookOpen, X, ArrowUpRight } from 'lucide-react';

interface CoursesProps {
  courses?: Course[];
}

const FILTERS = ['All', 'NEET', 'JEE', 'Boards', 'Foundation'] as const;
type Filter = (typeof FILTERS)[number];

export default function Courses({ courses }: CoursesProps) {
  const [activeTab, setActiveTab] = useState<Filter>('All');
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<Course | null>(null);
  const [enrollFormSubmitted, setEnrollFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    grade: 'Class 12th',
    mode: 'Offline Classes',
  });
  const reduceMotion = useReducedMotion();

  const coursesToDisplay = courses || COURSES;
  const filteredCourses =
    activeTab === 'All'
      ? coursesToDisplay
      : coursesToDisplay.filter((course) => course.category === activeTab);

  useEffect(() => {
    if (!selectedCourseForEnroll) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseModal();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedCourseForEnroll]);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          course: selectedCourseForEnroll.name,
          message: `Class preference: ${formData.grade} | Mode of class: ${formData.mode}`,
          type: 'enroll',
        }),
      });

      if (res.ok) {
        setEnrollFormSubmitted(true);
      } else {
        const errData = await res.json();
        setSubmitError(errData.error || 'Could not register your booking. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Network error. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedCourseForEnroll(null);
    setFormData({ name: '', phone: '', grade: 'Class 12th', mode: 'Offline Classes' });
    setSubmitError(null);
  };

  return (
    <section id="courses" className="border-b border-line bg-canvas">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
              Batches that match the target exam
            </h2>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ink-soft">
              Six structured programmes, one teaching standard. Every batch includes printed
              material, timed tests and access to the daily doubt counter.
            </p>
          </div>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter courses">
            {FILTERS.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-200 ${
                  activeTab === tab
                    ? 'border-ink bg-ink text-canvas'
                    : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink'
                }`}
              >
                {tab === 'Boards' ? 'Boards prep' : tab}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course, index) => {
              const featured = index === 0;

              return (
                <motion.article
                  key={course.id}
                  layout
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex flex-col rounded-[1.5rem] border p-7 transition-colors duration-300 sm:p-9 ${
                    featured
                      ? 'border-[#1b1815] bg-[#1b1815] text-[#faf8f5]'
                      : 'border-line bg-surface hover:border-line-strong'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                        featured
                          ? 'border-[#faf8f5]/25 text-[#faf8f5]/80'
                          : 'border-line text-ink-soft'
                      }`}
                    >
                      {course.tag}
                    </span>
                    <span
                      className={`flex items-center gap-1.5 font-mono text-[11px] ${
                        featured ? 'text-[#faf8f5]/70' : 'text-ink-faint'
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {course.duration}
                    </span>
                  </div>

                  <h3
                    className={`mt-6 font-display text-2xl font-semibold tracking-[-0.01em] ${
                      featured ? 'text-[#faf8f5]' : 'text-ink'
                    }`}
                  >
                    {course.name}
                  </h3>

                  <p
                    className={`mt-3 text-sm leading-relaxed ${
                      featured ? 'text-[#faf8f5]/75' : 'text-ink-soft'
                    }`}
                  >
                    {course.description}
                  </p>

                  <ul
                    className={`mt-7 space-y-3 border-t pt-6 ${
                      featured ? 'border-[#faf8f5]/15' : 'border-line'
                    }`}
                  >
                    {course.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-start gap-3 text-sm ${
                          featured ? 'text-[#faf8f5]/85' : 'text-ink'
                        }`}
                      >
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            featured ? 'text-[#e07a48]' : 'text-accent'
                          }`}
                          strokeWidth={2}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex-1" />

                  <button
                    onClick={() => handleEnrollClick(course)}
                    className={`group inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
                      featured
                        ? 'bg-accent text-on-accent hover:bg-accent-strong'
                        : 'border border-line-strong text-ink hover:border-ink hover:bg-ink hover:text-canvas'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" strokeWidth={1.75} />
                    Book a free demo
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px"
                      strokeWidth={1.75}
                    />
                  </button>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredCourses.length === 0 && (
          <div className="mt-14 rounded-[1.5rem] border border-dashed border-line-strong bg-surface p-12 text-center">
            <p className="font-display text-xl font-semibold text-ink">
              No batches published for this track yet
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
              New batches open every term. Tell us your target exam and we will plan a seat for the
              next intake.
            </p>
            <a
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-strong"
            >
              Talk to the admissions desk
            </a>
          </div>
        )}

        <AnimatePresence>
          {selectedCourseForEnroll && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
              />

              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={`Book a free demo for ${selectedCourseForEnroll.name}`}
                initial={reduceMotion ? false : { scale: 0.96, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { scale: 0.96, opacity: 0, y: 12 }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="relative z-10 max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-line bg-surface"
              >
                <div className="flex items-start justify-between gap-4 border-b border-line p-6 sm:p-8">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                      Free demo seat
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold text-ink sm:text-2xl">
                      {selectedCourseForEnroll.name}
                    </h3>
                    <p className="mt-1 text-xs text-ink-soft">
                      Three lectures and one doubt session, no payment required.
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
                    aria-label="Close demo booking form"
                  >
                    <X className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>

                <div className="p-6 sm:p-8">
                  {!enrollFormSubmitted ? (
                    <form onSubmit={handleEnrollSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <label
                          htmlFor="enroll-name"
                          className="block text-xs font-semibold tracking-wide text-ink"
                        >
                          Student name
                        </label>
                        <input
                          id="enroll-name"
                          type="text"
                          required
                          autoFocus
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Full name as in school records"
                          className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="enroll-phone"
                          className="block text-xs font-semibold tracking-wide text-ink"
                        >
                          WhatsApp number
                        </label>
                        <input
                          id="enroll-phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label
                            htmlFor="enroll-grade"
                            className="block text-xs font-semibold tracking-wide text-ink"
                          >
                            Current class
                          </label>
                          <select
                            id="enroll-grade"
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent"
                          >
                            <option>Class 9th</option>
                            <option>Class 10th</option>
                            <option>Class 11th</option>
                            <option>Class 12th</option>
                            <option>Class 12th Passout</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="enroll-mode"
                            className="block text-xs font-semibold tracking-wide text-ink"
                          >
                            Batch preference
                          </label>
                          <select
                            id="enroll-mode"
                            value={formData.mode}
                            onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                            className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent"
                          >
                            <option>Offline Classes</option>
                            <option>Online Live Class</option>
                            <option>Hybrid Model</option>
                          </select>
                        </div>
                      </div>

                      {submitError && (
                        <p className="rounded-xl border border-accent bg-accent-soft p-3.5 text-xs leading-relaxed text-accent">
                          {submitError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-full bg-accent py-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? 'Reserving your seat' : 'Reserve demo seat'}
                      </button>
                      <p className="text-center text-[11px] text-ink-faint">
                        The admissions desk calls back within two working hours.
                      </p>
                    </form>
                  ) : (
                    <div className="space-y-5 py-4 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                        <Check className="h-6 w-6" strokeWidth={2.5} />
                      </div>
                      <h4 className="font-display text-xl font-semibold text-ink">
                        Demo seat reserved
                      </h4>
                      <p className="mx-auto max-w-sm text-sm leading-relaxed text-ink-soft">
                        Thank you, {formData.name}. Your seat for {selectedCourseForEnroll.name} is
                        held. We will call {formData.phone} shortly with timings and the joining
                        details.
                      </p>
                      <button
                        onClick={handleCloseModal}
                        className="rounded-full border border-line-strong px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-canvas"
                      >
                        Done
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
