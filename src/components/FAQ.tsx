import { FAQS } from '../data';
import { Plus } from 'lucide-react';

export default function FAQ() {
  return (
    <section id="faq" className="border-b border-line bg-canvas">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
                Questions parents ask before enrolling
              </h2>
              <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink-soft">
                Straight answers on batch size, fees, demos and progress reporting. Anything not
                covered here can be asked on the phone or at the front desk.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t border-line">
              {FAQS.map((faq) => (
                <details key={faq.question} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                    <span className="font-display text-lg font-medium text-ink">
                      {faq.question}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-transform duration-300 group-open:rotate-45">
                      <Plus className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                  </summary>
                  <p className="max-w-[65ch] pb-7 text-sm leading-relaxed text-ink-soft">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
