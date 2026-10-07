import { ELEMENT_TILES } from '../data';

export default function ElementTicker() {
  const items = [...ELEMENT_TILES, ...ELEMENT_TILES];

  return (
    <div className="overflow-hidden border-y border-line bg-surface-muted" aria-label="Periodic table elements covered in class">
      <div className="marquee-track flex w-max items-stretch">
        {items.map((element, index) => (
          <div
            key={`${element.symbol}-${index}`}
            className="flex items-center gap-3 border-r border-line px-6 py-4 first:pl-6"
            aria-hidden={index >= ELEMENT_TILES.length}
          >
            <span className="font-mono text-[10px] text-ink-faint">{element.number}</span>
            <span className="font-display text-lg font-semibold text-ink">{element.symbol}</span>
            <span className="text-xs text-ink-soft">{element.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
