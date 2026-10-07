import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, type MotionProps } from 'motion/react';
import ChemistryParticles from './ChemistryParticles';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?auto=format&fit=crop&q=80&w=1200&h=1500';

interface HeroProps {
  content?: { headline: string; subheadline: string };
}
export default function Hero({ content }: HeroProps) {
  const reduceMotion = useReducedMotion();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const enter = (delay: number): MotionProps =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
        };

  return (
    <section id="home" className="relative overflow-hidden bg-canvas">
      <ChemistryParticles className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 30% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 30% 40%, black, transparent)',
        }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-accent-soft blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-4 pt-14 pb-20 sm:px-6 lg:px-8 lg:pt-20 lg:pb-28">
        <div className="grid items-center gap-14 lg:min-h-[calc(100dvh-190px)] lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <motion.h1
              {...enter(0)}
              className="font-display text-[clamp(2.5rem,5.5vw,4.4rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-ink"
              id="hero-main-title"
            >
              Chemistry that
              <br />
              finally <span className="text-accent">makes sense.</span>
            </motion.h1>

            <motion.p
              {...enter(0.12)}
              className="mt-6 max-w-[46ch] text-base leading-relaxed text-ink-soft sm:text-lg"
            >
              Concept-first coaching for NEET, JEE and Boards. Small batches, weekly tests and a
              mentor who stays until it clicks.
            </motion.p>

            <motion.div
              {...enter(0.22)}
              className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
            >
              <button
                onClick={() => scrollTo('contact')}
                className="group inline-flex items-center gap-2 rounded-full bg-accent py-1.5 pr-1.5 pl-6 text-sm font-semibold text-on-accent transition-all duration-300 hover:bg-accent-strong active:scale-[0.98]"
              >
                Book a free demo
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-on-accent/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </button>

              <button
                onClick={() => scrollTo('results')}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-accent"
              >
                See our results
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.75}
                />
              </button>
            </motion.div>

            <motion.dl
              {...enter(0.32)}
              className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6"
            >
              {[
                { value: '18', label: 'seats per batch' },
                { value: '52', label: 'tests a year' },
                { value: '11', label: 'years teaching' },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="sr-only">{item.label}</dt>
                  <dd className="font-mono text-xl font-medium text-ink sm:text-2xl">
                    {item.value}
                  </dd>
                  <dd className="mt-1 text-[11px] leading-snug text-ink-faint">{item.label}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <motion.div
            {...(reduceMotion
              ? {}
              : ({
                  initial: { opacity: 0, scale: 0.96 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] },
                } satisfies MotionProps))}
            className="lg:col-span-6"
          >
            <div className="mx-auto max-w-md rounded-[2rem] border border-line bg-surface p-2 shadow-[0_30px_70px_-40px_rgba(27,24,21,0.45)] lg:ml-auto lg:max-w-none">
              <figure className="overflow-hidden rounded-[1.5rem]">
                <img
                  src={HERO_IMAGE}
                  alt="Glassware and reagents on a laboratory bench during a chemistry demonstration"
                  width={1200}
                  height={1500}
                  loading="eager"
                  fetchPriority="high"
                  className="aspect-[4/5] w-full object-cover lg:max-h-[600px]"
                />
              </figure>
              <figcaption className="flex items-center justify-between gap-4 px-3 py-3">
                <span className="text-xs leading-relaxed text-ink-soft">
                  Demonstration bench, Sector 15 campus
                </span>
                <span className="flex shrink-0 items-center gap-2 rounded-xl border border-line bg-surface-muted px-3 py-2">
                  <span className="font-mono text-[10px] text-ink-faint">7</span>
                  <span className="font-display text-sm font-semibold text-ink">N</span>
                  <span className="text-[10px] text-ink-faint">Nitrogen</span>
                </span>
              </figcaption>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
