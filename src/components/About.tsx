import { motion, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';

const MENTOR_IMAGE =
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=1200&h=900';

const CREDENTIALS = [
  'M.Sc. Chemistry, University of Delhi',
  '11 years of NEET and JEE classroom teaching',
  'Author of the printed reaction-map booklets',
  '268 selections mentored since 2016',
];

export default function About() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="overflow-hidden rounded-[2rem] border border-line bg-surface-muted p-2">
              <img
                src={MENTOR_IMAGE}
                alt="A Class 11 chemistry batch during a lecture at the Sector 15 campus"
                width={1200}
                height={900}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
              />
            </div>
            <blockquote className="mt-8 border-l-2 border-accent pl-5">
              <p className="font-display text-lg leading-snug text-ink">
                &ldquo;A reaction is never random. If it looks random, the explanation started in
                the wrong place.&rdquo;
              </p>
              <footer className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                Attri Sir, Founder and Faculty
              </footer>
            </blockquote>
          </motion.div>

          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
              The mentor behind the method
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-soft">
              <p className="max-w-[65ch]">
                Attri Sir has taught chemistry for eleven years, most of them to students who
                arrived convinced the subject was beyond them. Classes start on the board, not in
                the textbook: electron movement first, mechanism second, exceptions last.
              </p>
              <p className="max-w-[65ch]">
                The institute opened in 2016 with one batch and a single rule. No student moves to
                the next chapter with an unanswered question from the last one. Every feature on
                this page exists to enforce that rule.
              </p>
            </div>

            <ul className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {CREDENTIALS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-12 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                  Mission
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  Make serious chemistry coaching affordable and understandable for every student,
                  whatever their school background.
                </p>
              </div>
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                  Vision
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  Stay the institute where a 40-mark student becomes a 90-mark student, not just a
                  place where toppers enrol.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
