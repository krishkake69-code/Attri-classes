import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, Sparkles, LayoutGrid } from 'lucide-react';

interface GalleryItem {
  id: string;
  category: 'Classroom' | 'Lab' | 'Events';
  title: string;
  desc: string;
  imgUrl: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    category: 'Classroom',
    title: 'Interactive Conceptual Lecture',
    desc: 'Attri Sir breaking down covalent bonds using 3D molecular props.',
    imgUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 'gal-2',
    category: 'Lab',
    title: 'Practical Chemistry Experimentation',
    desc: 'Demonstrating qualitative salt analysis and acid-base titrations.',
    imgUrl: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 'gal-3',
    category: 'Events',
    title: 'NEET Toppers Celebration',
    desc: 'Award ceremony for students who scored 170+ out of 180 in chemistry.',
    imgUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 'gal-4',
    category: 'Classroom',
    title: 'Doubt Counter Interaction',
    desc: 'Students clearing equations 1-on-1 with dedicated expert assistants.',
    imgUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 'gal-5',
    category: 'Lab',
    title: 'Molecular Models Lab Session',
    desc: 'Visualizing stereoisomerism and optical isomerism geometries.',
    imgUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 'gal-6',
    category: 'Events',
    title: 'Parent-Teacher Orientation Seminar',
    desc: 'Setting the strategy guidelines and score tracking mechanisms.',
    imgUrl: 'https://images.unsplash.com/photo-1544531516-a5e340a7147d?auto=format&fit=crop&q=80&w=600&h=400'
  }
];

interface GalleryProps {
  items?: GalleryItem[];
}

export default function Gallery({ items }: GalleryProps) {
  const [filter, setFilter] = useState<'All' | 'Classroom' | 'Lab' | 'Events'>('All');
  const [activeItemForLightBox, setActiveItemForLightBox] = useState<GalleryItem | null>(null);

  const galleryItemsToDisplay = items || GALLERY_ITEMS;

  const filteredItems = filter === 'All'
    ? galleryItemsToDisplay
    : galleryItemsToDisplay.filter(item => item.category === filter);

  return (
    <section
      id="gallery"
      className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-black tracking-widest text-blue-600 dark:text-orange-500 uppercase mb-2">
            Campus Life & Events
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Take a Tour of Our Classes
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Glimpses of modern state-of-the-art classroom sessions, interactive laboratories, and academic achievements.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Categories Tab */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-sm mx-auto bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-850">
          {(['All', 'Classroom', 'Lab', 'Events'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-black transition-all ${
                filter === tab
                  ? 'bg-blue-600 dark:bg-orange-500 text-white shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab === 'Lab' ? 'Lab Sessions' : tab}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md group cursor-pointer relative"
                onClick={() => setActiveItemForLightBox(item)}
              >
                {/* Photo box with overlay */}
                <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img
                    src={item.imgUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Hover dark cover */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 transform translate-y-3 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Category Pill Tag top-right */}
                  <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest bg-blue-600 dark:bg-orange-500 text-white px-2.5 py-1 rounded">
                    {item.category}
                  </span>
                </div>

                {/* Details card body */}
                <div className="p-5">
                  <h4 className="text-base font-black text-slate-800 dark:text-slate-100">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Full screen lightbox */}
        <AnimatePresence>
          {activeItemForLightBox && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Blur background */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveItemForLightBox(null)}
                className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
              />

              {/* Box container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden max-w-3xl w-full relative z-10 border border-slate-200 dark:border-slate-800"
              >
                {/* Close button */}
                <button
                  onClick={() => setActiveItemForLightBox(null)}
                  className="absolute top-4 right-4 bg-slate-950/50 hover:bg-slate-950 text-white p-1.5 rounded-full z-20 border border-white/20 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Main image */}
                <div className="aspect-video w-full bg-slate-100 dark:bg-slate-950">
                  <img
                    src={activeItemForLightBox.imgUrl}
                    alt={activeItemForLightBox.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Lightbox details */}
                <div className="p-6">
                  <span className="text-xs font-black text-blue-600 dark:text-orange-500 uppercase tracking-widest">
                    {activeItemForLightBox.category} Room Tour
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {activeItemForLightBox.title}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {activeItemForLightBox.desc}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
