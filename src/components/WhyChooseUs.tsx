import { BENTO_FEATURES } from '../data';
import { motion, useReducedMotion } from 'motion/react';

const SPANS = [
  'sm:col-span-2 lg:col-span-2 lg:row-span-2',
  'lg:col-span-1',
  'lg:col-span-1',
  'sm:col-span-2 lg:col-span-2',
  'sm:col-span-2 lg:col-span-2',
  'sm:col-span-2 lg:col-span-2',
];

export default function WhyChooseUs() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="why-us" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
            What the fee actually buys
          </h2>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ink-soft">
            No auditorium lectures, no rotating faculty, no unused app subscription. Six things,
            every one of them used weekly.
          </p>
        </div>

        <div className="mt-14 grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(190px,auto)] lg:grid-cols-4">
          {BENTO_FEATURES.map((feature, index) => {
            const isImage = feature.variant === 'image';
            const isAccent = feature.variant === 'accent';
            const isPattern = feature.variant === 'pattern';

            return (
              <motion.article
                key={feature.title}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.55,
                  delay: reduceMotion ? 0 : index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`flex flex-col rounded-[1.5rem] border border-line p-7 ${SPANS[index]} ${
                  isAccent ? 'bg-accent-soft' : 'bg-surface-muted/50'
                }`}
                style={
                  isPattern
                    ? {
                        backgroundImage:
                          'radial-gradient(var(--line-strong) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }
                    : undefined
                }
              >
                <div className={isImage ? '' : 'flex-1'}>
                  <p className="font-mono text-2xl font-medium text-ink sm:text-3xl">
                    {feature.stat}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                    {feature.statLabel}
                  </p>
                  <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-ink-soft">
                    {feature.description}
                  </p>
                </div>

                {isImage && feature.image && (
                  <img
                    src={feature.image}
                    alt="Chemistry laboratory glassware used during practical demonstration classes"
                    width={1200}
                    height={750}
                    loading="lazy"
                    className="mt-7 aspect-[16/10] w-full rounded-2xl border border-line object-cover"
                  />
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
