import { useRef } from 'react';
import { RESULTS } from '../data';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ResultItem } from '../types';

interface ResultsProps {
  results?: ResultItem[];
}

export default function Results({ results }: ResultsProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const resultsToDisplay = results ?? RESULTS;

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * 360, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <section id="results" className="border-b border-line bg-canvas">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
              Champions of chemistry
            </h2>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ink-soft">
              Scorecards presented at the centre, listed without rounding. Five of the 268
              selections since 2016.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollByCard(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-ink"
              aria-label="Scroll to previous results"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-ink"
              aria-label="Scroll to next results"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
        >
          {resultsToDisplay.map((result, index) => (
            <motion.article
              key={result.id}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: reduceMotion ? 0 : Math.min(index, 3) * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`w-[82vw] shrink-0 snap-start rounded-[1.5rem] border p-7 sm:w-[330px] ${
                index === 0 ? 'border-accent bg-accent-soft' : 'border-line bg-surface'
              }`}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                {result.exam} / {result.year}
              </p>
              <p
                className={`mt-5 font-mono text-4xl font-medium tracking-tight ${
                  index === 0 ? 'text-accent' : 'text-ink'
                }`}
              >
                {result.rank}
              </p>
              <h3 className="mt-5 font-display text-xl font-semibold text-ink">{result.name}</h3>
              <div className="mt-6 border-t border-line pt-5">
                <p className="font-mono text-sm text-ink">{result.score}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{result.achievement}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-6 text-xs text-ink-faint">
          {resultsToDisplay.length > 0
            ? 'Names and scores shared with permission of students and parents.'
            : ''}
        </p>

        {resultsToDisplay.length === 0 && (
          <div className="mt-12 rounded-[1.5rem] border border-dashed border-line-strong bg-surface p-12 text-center">
            <p className="font-display text-lg font-semibold text-ink">
              Results are being updated
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
              Scorecards for this season are published as soon as families approve them. Call the
              desk for the current list.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
