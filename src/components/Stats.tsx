import { Award, Users, BookOpen, Star } from 'lucide-react';

interface StatsProps {
  stats?: {
    studentsCount: string;
    successRate: string;
    experience: string;
  };
}

export default function Stats({ stats }: StatsProps) {
  const statsList = [
    {
      label: 'Students Mentored',
      value: stats?.studentsCount || '1000+',
      description: 'Medical and engineering aspirants trained since our inception.',
      icon: Users,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      label: 'Success Rate',
      value: stats?.successRate || '95%',
      description: 'Continuous board and competitive exam clearing ratio.',
      icon: Star,
      color: 'from-orange-500 to-amber-600'
    },
    {
      label: 'Years of Experience',
      value: stats?.experience || '10+',
      description: 'Expert, curriculum-focused core chemistry mentorship.',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      label: 'Selections in JEE/NEET',
      value: '250+',
      description: 'Students admitted into premium IITs, NITs, and Government Medical Colleges.',
      icon: Award,
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  return (
    <section className="relative py-16 bg-blue-900 text-white overflow-hidden" id="why-us">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-orange-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {statsList.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3"
            >
              <div className={`p-3.5 rounded-2xl bg-white/10 backdrop-blur-md shadow-inner text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-orange-400">
                  {stat.value}
                </p>
                <p className="text-base sm:text-lg font-bold text-slate-100 mt-1">
                  {stat.label}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xs leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
