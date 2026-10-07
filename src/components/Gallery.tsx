import { useEffect, useState } from 'react';
import { GALLERY_ITEMS } from '../data';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Maximize2, X } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryProps {
  items?: GalleryItem[];
}

const FILTERS = ['All', 'Classroom', 'Lab', 'Events'] as const;
type Filter = (typeof FILTERS)[number];

const aspectClass = (aspect?: GalleryItem['aspect']) => {
  if (aspect === 'square') return 'aspect-square';
  if (aspect === 'video') return 'aspect-video';
  return 'aspect-[4/3]';
};

export default function Gallery({ items }: GalleryProps) {
  const [filter, setFilter] = useState<Filter>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const reduceMotion = useReducedMotion();

  const galleryItems = items ?? GALLERY_ITEMS;
  const filteredItems =
    filter === 'All' ? galleryItems : galleryItems.filter((item) => item.category === filter);

  useEffect(() => {
    if (!activeItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveItem(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [activeItem]);

  return (
    <section id="gallery" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
              Inside the classroom
            </h2>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ink-soft">
              Lectures, practical demonstrations and the events that mark the year. Photographs
              from the Sector 15 campus.
            </p>
          </div>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter gallery">
            {FILTERS.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={filter === tab}
                onClick={() => setFilter(tab)}
                className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-200 ${
                  filter === tab
                    ? 'border-ink bg-ink text-canvas'
                    : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink'
                }`}
              >
                {tab === 'Lab' ? 'Lab sessions' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {filteredItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: reduceMotion ? 0 : Math.min(index, 4) * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={() => setActiveItem(item)}
              className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-[1.5rem] border border-line bg-surface text-left transition-colors duration-300 hover:border-line-strong"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.imgUrl}
                  alt={item.title}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${aspectClass(item.aspect)}`}
                />
                <span className="absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-canvas/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </div>
              <div className="p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                  {item.category}
                </p>
                <h3 className="mt-2 font-display text-base font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{item.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="mt-12 rounded-[1.5rem] border border-dashed border-line-strong bg-canvas p-12 text-center">
            <p className="font-display text-lg font-semibold text-ink">
              Nothing filed under this category yet
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              New classroom and lab photos are added after every term.
            </p>
          </div>
        )}

        <AnimatePresence>
          {activeItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveItem(null)}
                className="absolute inset-0 bg-ink/70 backdrop-blur-md"
              />

              <motion.figure
                role="dialog"
                aria-modal="true"
                aria-label={activeItem.title}
                initial={reduceMotion ? false : { scale: 0.96, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { scale: 0.96, opacity: 0, y: 12 }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="relative z-10 max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] border border-line bg-surface"
              >
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-canvas/90 text-ink transition-colors hover:bg-canvas"
                  aria-label="Close image viewer"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>

                <img
                  src={activeItem.imgUrl}
                  alt={activeItem.title}
                  className={`w-full object-cover ${aspectClass(activeItem.aspect)}`}
                />
                <figcaption className="p-6 sm:p-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                    {activeItem.category}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-ink sm:text-2xl">
                    {activeItem.title}
                  </h3>
                  <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-ink-soft">
                    {activeItem.desc}
                  </p>
                </figcaption>
              </motion.figure>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
