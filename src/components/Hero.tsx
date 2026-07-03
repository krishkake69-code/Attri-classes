import { motion } from 'motion/react';
import { ArrowRight, Play, Award, Sparkles, Flame, CheckCircle } from 'lucide-react';
import ChemistryParticles from './ChemistryParticles';

export default function Hero() {
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const targetRect = el.getBoundingClientRect().top;
      const targetPosition = targetRect - bodyRect;
      const offsetPosition = targetPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 sm:pt-32 pb-16 md:pb-24 flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300"
    >
      {/* Dynamic chemistry canvas particles */}
      <ChemistryParticles />

      {/* Geometric Backdrop Shapes */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/60 dark:bg-blue-950/20 rounded-full -mr-20 -mt-20 opacity-60 pointer-events-none" />
      <div className="absolute bottom-12 left-10 hidden xl:flex gap-3 pointer-events-none">
        <div className="w-14 h-14 border-4 border-blue-200/50 dark:border-blue-900/30 rounded-full"></div>
        <div className="w-14 h-14 border-4 border-orange-200/40 dark:border-orange-500/20 rounded-lg rotate-45"></div>
      </div>

      {/* Radial Gradient Ambient Light Effect */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-orange-500/10 dark:bg-orange-600/10 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Left Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Admissions alert pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 text-orange-800 dark:text-orange-300 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
              <span>Admission Open 2026-27</span>
            </motion.div>

            {/* Large Heading with gradient accents */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-blue-900 dark:text-white tracking-tight leading-[1.1] uppercase"
              id="hero-main-title"
            >
              Master <br className="hidden sm:inline" />
              <span className="text-orange-600 dark:text-orange-500">Chemistry</span> for NEET & JEE
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-300 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Building Strong Concepts for NEET, JEE, Boards & Competitive Exams with India's most dedicated faculty.
            </motion.p>

            {/* Bullet Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0 text-left"
            >
              {[
                'NCERT Line-by-Line Decoded',
                'Advanced MCQ Question Bank',
                '1-on-1 Personalized Guidance',
                'Comprehensive Practice Sheets'
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => handleScrollToSection('contact')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-base shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer group"
              >
                Book Free Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleScrollToSection('results')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-white border-2 border-slate-200 dark:border-slate-800 font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Our Results
              </button>
            </motion.div>
          </div>

          {/* Interactive Atom/Molecular Model Right Column */}
          <div className="lg:col-span-5 flex justify-center relative mt-8 lg:mt-0">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-[280px] sm:w-[350px] md:w-[400px] h-[280px] sm:h-[350px] md:h-[400px] flex items-center justify-center"
            >
              {/* Outer Shell Rotation Orbit 1 */}
              <div className="absolute inset-0 border-2 border-dashed border-blue-400/30 dark:border-blue-400/15 rounded-full animate-[spin_16s_linear_infinite]" />
              
              {/* Outer Shell Rotation Orbit 2 */}
              <div className="absolute inset-4 border border-dashed border-orange-400/30 dark:border-orange-400/15 rounded-full animate-[spin_10s_linear_infinite_reverse] rotate-45" />

              {/* Electron 1 on Orbit 1 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50 flex items-center justify-center text-[8px] font-bold text-white">e⁻</div>

              {/* Electron 2 on Orbit 2 */}
              <div className="absolute bottom-4 right-1/4 w-3.5 h-3.5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 flex items-center justify-center text-[7px] font-bold text-white">e⁻</div>

              {/* Floating Molecule Lab Beaker Illustration Inside a Glass Box */}
              <div className="w-[180px] sm:w-[220px] h-[180px] sm:h-[220px] rounded-3xl bg-white/40 dark:bg-slate-900/65 backdrop-blur-xl border border-white/40 dark:border-slate-800/65 shadow-2xl flex flex-col items-center justify-center p-6 relative group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-2 rounded-xl shadow-lg rotate-12">
                  <Award className="w-5 h-5" />
                </div>
                
                {/* Visual Glassware with bubbles */}
                <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 border-3 border-blue-500 dark:border-blue-400 rounded-b-3xl rounded-t-lg bg-blue-100/30 dark:bg-blue-950/20 overflow-hidden">
                    {/* Bubbles */}
                    <div className="absolute bottom-2 left-4 w-2.5 h-2.5 bg-blue-500/50 dark:bg-blue-300/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-blue-500/50 dark:bg-blue-300/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    <div className="absolute bottom-4 left-12 w-2 h-2 bg-blue-500/50 dark:bg-blue-300/40 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }} />
                  </div>
                  <div className="w-6 h-6 border-3 border-blue-500 dark:border-blue-400 rounded-sm -mt-24 bg-white dark:bg-slate-900 z-10" />
                </div>

                <p className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-wide text-center uppercase">
                  Attri Sir Chemistry
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 text-orange-500 text-xs font-extrabold">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  <span>Interactive Learning</span>
                </div>
              </div>

              {/* Mini Periodic table elements hanging around */}
              <div className="absolute top-10 left-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 flex flex-col items-center shadow-lg">
                <span className="text-[10px] text-slate-400 uppercase font-sans">Carbon</span>
                <span className="text-base font-black">6 C</span>
                <span className="text-[8px] text-slate-500">12.011</span>
              </div>

              <div className="absolute bottom-10 right-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800 text-xs font-mono font-bold text-orange-600 dark:text-orange-400 flex flex-col items-center shadow-lg">
                <span className="text-[10px] text-slate-400 uppercase font-sans">Oxygen</span>
                <span className="text-base font-black">8 O</span>
                <span className="text-[8px] text-slate-500">15.999</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
