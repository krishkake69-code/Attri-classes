import { motion } from 'motion/react';
import { Award, Target, Eye, Users, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function About() {
  const highlights = [
    {
      title: 'Experienced Faculty',
      desc: 'Learn directly from Attri Sir, a seasoned expert with over 10 years of mentoring students to national ranks in JEE and NEET.',
      icon: GraduationCap,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40'
    },
    {
      title: 'Concept-Based Learning',
      desc: 'We discard memory formulas. Our methodology prioritizes reaction mechanisms, physical logic, and logical deduction.',
      icon: Target,
      color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40'
    },
    {
      title: 'Regular Assessment & Tests',
      desc: 'Weekly topic-wise tests and monthly standardized examinations styled exactly to NTA and NEET templates.',
      icon: Award,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
    },
    {
      title: 'Personalized Guidance',
      desc: 'Doubt-solving counters, progress monitoring, and psychological mentorship to keep stress away and performance high.',
      icon: Users,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40'
    }
  ];

  return (
    <section
      id="about"
      className="py-20 md:py-28 bg-white dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-black tracking-widest text-blue-600 dark:text-orange-500 uppercase mb-2">
            Who We Are
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Nurturing Future Scholars & Doctors Since 2016
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Welcome to ATTRI CHEMISTRY CLASSES
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
              At Attri Chemistry Classes, we believe that chemistry is not just a subject to pass—it is the foundational science of understanding how our physical universe exists. Led by elite chemistry mentor <span className="font-bold text-slate-950 dark:text-white">Attri Sir</span>, our institute has established a stellar legacy of converting average science scorers into board toppers and top-100 rankers in NEET and JEE.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
              Through immersive models, NCERT-focused memory charts, and extensive numerical practice sessions, we make even the dreaded organic chemical equations intuitive and fun.
            </p>

            {/* Mission & Vision Side-by-Side Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-base mb-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  <span>Our Mission</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  To democratize elite level science education by breaking complex academic formulas into simplistic, understandable chemical logic.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-base mb-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <span>Our Vision</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  To remain the premier chemistry coaching house where every medical and engineering seat aspirant accomplishes their maximum potential.
                </p>
              </div>
            </div>
          </div>

          {/* Right Highlights Column */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((h, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`p-3 rounded-xl w-fit ${h.color}`}>
                    <h.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {h.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {h.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-orange-400 pt-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified Standard</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
