import { TESTIMONIALS } from '../data';
import { motion, useReducedMotion } from 'motion/react';
import { Star } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const reduceMotion = useReducedMotion();
  const testimonialsToDisplay = testimonials ?? TESTIMONIALS;

  return (
    <section id="testimonials" className="border-b border-line bg-canvas">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
            What families say after results day
          </h2>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ink-soft">
            Four notes shared with permission, two from students and two from parents.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {testimonialsToDisplay.map((testimonial, index) => (
            <motion.figure
              key={testimonial.id}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.55,
                delay: reduceMotion ? 0 : (index % 2) * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`flex flex-col justify-between rounded-[1.5rem] border border-line p-7 sm:p-9 ${
                index % 2 === 0 ? 'bg-surface' : 'bg-surface-muted/60'
              }`}
            >
              <div className="flex items-center gap-1.5 text-accent">
                <Star className="h-4 w-4 fill-current" strokeWidth={1.5} />
                <span className="font-mono text-sm">{testimonial.rating.toFixed(1)}</span>
              </div>

              <blockquote className="mt-6">
                <p className="font-display text-lg leading-relaxed text-ink sm:text-xl">
                  &ldquo;{testimonial.review}&rdquo;
                </p>
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-4 border-t border-line pt-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink font-display text-base font-semibold text-canvas">
                  {testimonial.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{testimonial.name}</span>
                  <span className="mt-0.5 block text-xs text-ink-faint">
                    {testimonial.role} / {testimonial.course}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {testimonialsToDisplay.length === 0 && (
          <div className="mt-14 rounded-[1.5rem] border border-dashed border-line-strong bg-surface p-12 text-center">
            <p className="font-display text-lg font-semibold text-ink">
              No reviews published yet
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
              Reviews are added after every result season, always with permission from the family.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
