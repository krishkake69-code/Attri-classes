import { FEATURES } from '../data';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';

export default function WhyChooseUs() {
  return (
    <section
      id="why-us"
      className="py-20 md:py-28 bg-white dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-black tracking-widest text-blue-600 dark:text-orange-500 uppercase mb-2">
            Why Choose Us
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How We Bridge the Gap from Confusion to Mastery
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Our pedagogical framework combines classic traditional teacher mentorship with ultra-modern analytical tracking dashboards.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => {
            // Dynamically resolve icon from Lucide
            const IconComponent = (LucideIcons as any)[feature.iconName] || LucideIcons.HelpCircle;

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between group relative shadow-sm hover:shadow-xl transition-all"
              >
                {/* Visual Glow Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-orange-500/0 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  {/* Icon wrap with colorful gradient background */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg shadow-blue-500/10`}>
                    <IconComponent className="w-6 h-6 stroke-[2]" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
