'use client'

import { useTranslations } from 'next-intl'

type Step = { num: string; title: string; body: string }

export function HomeProceso() {
  const t     = useTranslations('home.proceso')
  const items = t.raw('items') as Step[]
  const total = items.length.toString().padStart(2, '0')

  return (
    <section data-proceso-section className="relative isolate overflow-hidden bg-[#1f3a34] text-[#f4f1ea]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-35 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center bg-fixed"
      />

      {/* Mobile — natural vertical stack */}
      <div className="section-spacing md:hidden">
        <div className="section-inner">
          <div className="mb-12">
            <span className="mb-5 block font-mono text-[13px] uppercase tracking-[0.18em] text-primary">
              {t('eyebrow')}
            </span>
            <h2 className="text-title text-[#f4f1ea]! max-w-[26ch]">{t('title')}</h2>
          </div>

          <ol className="flex flex-col gap-5">
            {items.map((step) => (
              <li
                key={step.num}
                className="flex flex-col gap-4 border border-[#f4f1ea]/12 bg-[#f4f1ea]/[0.03] p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-primary">
                    Paso {step.num}
                  </span>
                </div>
                <span className="text-[clamp(3rem,12vw,4.5rem)] font-bold leading-none tracking-[-0.05em] text-primary">
                  {step.num}
                </span>
                <h3 className="text-[1.4rem] leading-tight tracking-[-0.022em] text-[#f4f1ea]">
                  {step.title}
                </h3>
                <p className="text-[0.98rem] leading-relaxed text-[#f4f1ea]/65">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Desktop — pinned horizontal */}
      <div data-proceso-pin className="relative hidden h-svh overflow-hidden md:block">
        <div className="section-inner relative z-10 flex h-full flex-col pt-24 lg:pt-28">
          <div className="grid grid-cols-12 items-end gap-12">
            <div className="col-span-8">
              <span className="mb-5 block font-mono text-[13px] uppercase tracking-[0.18em] text-primary">
                {t('eyebrow')}
              </span>
              <h2 className="text-title text-[#f4f1ea]! max-w-[26ch]">{t('title')}</h2>
            </div>
            <span className="col-span-4 justify-self-end text-right font-mono text-[12px] uppercase tracking-[0.22em] text-[#f4f1ea]/45">
              Paso <span data-proceso-current className="text-primary">01</span> / {total}
            </span>
          </div>
        </div>

        <div className="absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 overflow-hidden">
          <div
            data-proceso-track
            className="flex items-center gap-8 will-change-transform"
            style={{ paddingLeft: 'clamp(1.5rem, 5vw, 4rem)', paddingRight: 'clamp(1.5rem, 5vw, 4rem)' }}
          >
            {items.map((step, i) => (
              <article
                key={step.num}
                data-proceso-card
                className="relative flex h-[58vh] w-[52vw] shrink-0 flex-col gap-6 border border-[#f4f1ea]/12 bg-[#f4f1ea]/[0.03] p-10 lg:w-[44vw] lg:p-12"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-primary">
                    Paso {step.num}
                  </span>
                  <span aria-hidden className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#f4f1ea]/30">
                    {String(i + 1).padStart(2, '0')}/{total}
                  </span>
                </div>

                <span className="mt-auto text-[clamp(4.5rem,8vw,7.5rem)] font-bold leading-none tracking-[-0.055em] text-primary">
                  {step.num}
                </span>

                <h3 className="text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.08] tracking-[-0.022em] text-[#f4f1ea]">
                  {step.title}
                </h3>

                <p className="max-w-[42ch] text-[clamp(0.98rem,1.2vw,1.1rem)] leading-relaxed text-[#f4f1ea]/65">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div aria-hidden className="pointer-events-none absolute bottom-10 left-0 right-0 z-10 flex justify-center">
          <span className="inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.22em] text-[#f4f1ea]/45">
            <span className="block h-px w-8 bg-[#f4f1ea]/30" />
            scroll
            <span aria-hidden>↓</span>
            <span className="block h-px w-8 bg-[#f4f1ea]/30" />
          </span>
        </div>
      </div>
    </section>
  )
}
