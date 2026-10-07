import { BATCH_SCHEDULE } from '../data';

export default function BatchSchedule() {
  return (
    <section id="batches" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
            Batch timings for the current session
          </h2>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ink-soft">
            Seats are counted live at the front desk. All timings are IST, and one batch change is
            allowed within the first month.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[1.5rem] border border-line">
          <div className="hidden grid-cols-12 gap-4 border-b border-line bg-surface-muted px-7 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint lg:grid">
            <span className="col-span-3">Batch</span>
            <span className="col-span-2">Audience</span>
            <span className="col-span-2">Days</span>
            <span className="col-span-2">Time</span>
            <span className="col-span-2">Seats left</span>
            <span className="col-span-1 text-right">Mode</span>
          </div>

          {BATCH_SCHEDULE.map((slot) => {
            const fewSeatsLeft = slot.seatsLeft <= 5;

            return (
              <div
                key={slot.id}
                className="grid grid-cols-1 gap-3 border-b border-line px-7 py-6 transition-colors last:border-b-0 hover:bg-surface-muted/40 lg:grid-cols-12 lg:items-center lg:gap-4"
              >
                <span className="font-display text-base font-semibold text-ink lg:col-span-3">
                  {slot.batch}
                </span>
                <span className="text-sm text-ink-soft lg:col-span-2">{slot.audience}</span>
                <span className="font-mono text-sm text-ink-soft lg:col-span-2">{slot.days}</span>
                <span className="font-mono text-sm text-ink-soft lg:col-span-2">{slot.time}</span>
                <span className="lg:col-span-2">
                  <span
                    className={`font-mono text-sm ${
                      fewSeatsLeft ? 'font-medium text-accent' : 'text-ink-soft'
                    }`}
                  >
                    {slot.seatsLeft} of {slot.seatsTotal}
                  </span>
                  {fewSeatsLeft && (
                    <span className="mt-0.5 block text-[11px] text-accent">Filling fast</span>
                  )}
                </span>
                <span className="text-sm text-ink-faint lg:col-span-1 lg:text-right">
                  {slot.mode}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
