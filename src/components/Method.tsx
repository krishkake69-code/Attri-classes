import { METHOD_STEPS } from '../data';
import { motion, useReducedMotion } from 'motion/react';

export default function Method() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="method" className="border-b border-line bg-canvas">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
            How the year runs
          </h2>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-ink-soft">
            One framework, applied to every batch. The sequence matters more than the hours: gaps
            are found before teaching starts, and every phase ends with a scored paper.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {METHOD_STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.55,
                delay: reduceMotion ? 0 : index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="border-t border-line-strong pt-6"
            >
              <p className="font-mono text-[11px] text-ink-faint">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{step.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
