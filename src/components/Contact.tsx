import { useState, FormEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Phone, Mail, MapPin, Check, Send, MessageCircle } from 'lucide-react';

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

const DEFAULT_CENTERS = [
  {
    id: 'center-1',
    name: 'Main Campus',
    address: 'H-489 Govindpuram, Ghaziabad, Uttar Pradesh',
    details: 'Near Spring Dales School',
  },
];

export default function Contact({ contactInfo, centers }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'NEET Chemistry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedCenterIdx, setSelectedCenterIdx] = useState(0);
  const reduceMotion = useReducedMotion();

  const cleanPhone = contactInfo?.phone ? contactInfo.phone.replace(/[^0-9]/g, '') : '919876543210';
  const displayPhone = contactInfo?.phone || '+91 98765 43210';
  const displayEmail = contactInfo?.email || 'admissions@attrichemistry.com';

  const centersToDisplay = centers && centers.length > 0 ? centers : DEFAULT_CENTERS;
  const activeCenter = centersToDisplay[selectedCenterIdx] || centersToDisplay[0];

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      'Hi Attri Chemistry Classes, I would like to inquire about batch timings and book a free demo class.'
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          course: formData.course,
          message: formData.message,
          type: 'contact',
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', course: 'NEET Chemistry', message: '' });
      } else {
        const errData = await res.json();
        setSubmitError(errData.error || 'Could not submit the form. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Network error. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="border-b border-line bg-canvas">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
            Start with a free demo
          </h2>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ink-soft">
            Share a few details and the admissions desk will call back within two working hours
            with batch timings, fees and the demo schedule.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface text-accent">
                  <Phone className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                    Phone
                  </h3>
                  <a
                    href={`tel:${displayPhone.replace(/\s/g, '')}`}
                    className="mt-1 block text-base font-semibold text-ink transition-colors hover:text-accent"
                  >
                    {displayPhone}
                  </a>
                  <p className="mt-0.5 text-xs text-ink-faint">9:00 AM to 7:00 PM, all days</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface text-accent">
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                    Email
                  </h3>
                  <a
                    href={`mailto:${displayEmail}`}
                    className="mt-1 block text-base font-semibold text-ink transition-colors hover:text-accent"
                  >
                    {displayEmail}
                  </a>
                  <p className="mt-0.5 text-xs text-ink-faint">Academic and parent support</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface text-accent">
                  <MapPin className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                    {activeCenter.name}
                  </h3>
                  <p className="mt-1 text-base leading-snug font-semibold text-ink">
                    {activeCenter.address}
                  </p>
                  <p className="mt-1 text-xs text-ink-faint">{activeCenter.details}</p>
                </div>
              </div>

              {centersToDisplay.length > 1 && (
                <div className="space-y-2 pt-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                    Select campus
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {centersToDisplay.map((center, index) => (
                      <button
                        key={center.id}
                        onClick={() => setSelectedCenterIdx(index)}
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                          selectedCenterIdx === index
                            ? 'border-ink bg-ink text-canvas'
                            : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink'
                        }`}
                      >
                        {center.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleWhatsAppInquiry}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-canvas transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                Chat on WhatsApp
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[2rem] border border-line bg-surface p-6 sm:p-10">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleFormSubmit}
                    initial={false}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-semibold tracking-wide text-ink"
                        >
                          Full name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Student full name"
                          className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="contact-phone"
                          className="block text-xs font-semibold tracking-wide text-ink"
                        >
                          WhatsApp number
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          required
                          pattern="[0-9+\-\s()]{8,16}"
                          title="Enter a valid phone number with 8 to 16 digits"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-semibold tracking-wide text-ink"
                        >
                          Email <span className="font-normal text-ink-faint">(optional)</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@email.com"
                          className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="contact-course"
                          className="block text-xs font-semibold tracking-wide text-ink"
                        >
                          Target batch
                        </label>
                        <select
                          id="contact-course"
                          value={formData.course}
                          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                          className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent"
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

                    <div className="space-y-2">
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-semibold tracking-wide text-ink"
                      >
                        Anything we should know? <span className="font-normal text-ink-faint">(optional)</span>
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Current school marks, topics that need work, preferred batch timing"
                        className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
                      />
                    </div>

                    {submitError && (
                      <p className="rounded-xl border border-accent bg-accent-soft p-3.5 text-xs leading-relaxed text-accent">
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        'Sending your details'
                      ) : (
                        <>
                          <Send className="h-4 w-4" strokeWidth={1.75} />
                          Book a free demo
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] leading-relaxed text-ink-faint">
                      No payment is collected for the demo. Details are used only for admission
                      follow-up.
                    </p>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center py-10 text-center"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                      <Check className="h-7 w-7" strokeWidth={2.5} />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-semibold text-ink">
                      Details received
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                      The admissions desk will call back within two working hours to confirm the
                      demo slot and share the batch schedule.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-7 rounded-full border border-line-strong px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
                    >
                      Register another student
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
