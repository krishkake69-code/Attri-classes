import { RESULTS } from '../data';
import { motion } from 'motion/react';
import { Award, Trophy, MapPin, Sparkles, GraduationCap } from 'lucide-react';
import { ResultItem } from '../types';

interface ResultsProps {
  results?: ResultItem[];
}

export default function Results({ results }: ResultsProps) {
  const resultsToDisplay = results || RESULTS;

  return (
    <section
      id="results"
      className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-black tracking-widest text-blue-600 dark:text-orange-500 uppercase mb-2">
            Hall of Fame
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our Champions of Chemistry
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Hard work meets expert conceptual guidance. Meet our top-scoring students admitted into premium medical colleges and IITs.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto mt-4 rounded-full" />
        </div>
 
        {/* Top Highlight Topper Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resultsToDisplay.map((res, index) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-md hover:shadow-xl transition-shadow flex flex-col group"
            >
              {/* Photo Box with Badge overlays */}
              <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-950">
                <img
                  src={res.image}
                  alt={res.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Visual Glassmorphic gradient band */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Score badge top-left */}
                <div className="absolute top-4 left-4 bg-orange-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{res.rank}</span>
                </div>

                {/* Exam Title overlay bottom-left */}
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                    {res.exam} • Year {res.year}
                  </p>
                  <p className="text-lg font-black tracking-tight mt-0.5">
                    {res.name}
                  </p>
                </div>
              </div>

              {/* Card Footer detail */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-sm font-black">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span>{res.score}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm italic font-medium leading-relaxed">
                    "{res.achievement}"
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                  <GraduationCap className="w-4 h-4 text-emerald-500" />
                  <span>Verified Classroom Alumnus</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Motivational Quote banner */}
        <div className="mt-16 text-center max-w-2xl mx-auto p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100/35 dark:border-blue-900/35">
          <Sparkles className="w-5 h-5 text-orange-500 mx-auto mb-2 animate-bounce" />
          <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300 italic">
            "Your photo could be here next year. Our next super-batch has limited slots. Begin your conceptual chemistry journey today."
          </p>
        </div>

      </div>
    </section>
  );
}
