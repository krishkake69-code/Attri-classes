import { motion, useReducedMotion } from 'motion/react';
import { STATS } from '../data';
import type { StatItem } from '../types';

interface StatsProps {
  stats?: StatItem[];
}

export default function Stats({ stats }: StatsProps) {
  const reduceMotion = useReducedMotion();

  const statsList = stats && stats.length > 0 ? stats : STATS;

  return (
    <section className="border-b border-line bg-surface" id="stats">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {statsList.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                delay: reduceMotion ? 0 : index * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-surface py-10 sm:py-14 lg:px-10 lg:first:pl-0 lg:last:pr-0"
            >
              <p className="font-mono text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-semibold text-ink">{stat.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-faint">{stat.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
