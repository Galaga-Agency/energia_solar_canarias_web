"use client";

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/Button";
import { AnimatedBrandBlob } from '@/components/ui/AnimatedBrandBlob'

const LAYERS = [
  { key: "4", src: "nubes-capa-0-cielo", z: 2, cls: "object-cover object-right-top", initialY: -90 },
  { key: "3", src: "nubes-capa-1",       z: 5, cls: "object-cover",                  initialY: -60 },
  { key: "2", src: "nubes-capa-2",       z: 4, cls: "object-cover",                  initialY: -35 },
  { key: "1", src: "nubes-capa-3",       z: 3, cls: "object-cover",                  initialY: -12.5 },
] as const;

export function HomeHero2() {
  const t = useTranslations('home.hero')

  return (
    <section
      data-hero2
      className="relative min-h-svh overflow-x-hidden overflow-y-hidden bg-[#f4f1ea] max-lg:-mt-18"
    >
      <div
        aria-hidden
        className="absolute inset-0 z-1 bg-[linear-gradient(to_bottom,rgba(15,36,33,0.75)_0%,rgba(31,58,52,0.45)_50%,transparent_100%)]"
      />

      {LAYERS.map(({ key, src, z, cls, initialY }) => (
        <div
          key={key}
          className="absolute -inset-y-12 inset-x-0 will-change-transform"
          style={{ zIndex: z, transform: `translate3d(0, ${initialY}px, 0)` }}
          data-layer-scroll={key}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/assets/images/home/parralax/${src}.png`}
            alt=""
            data-layer-drift={key}
            className={`absolute inset-0 w-full h-full ${cls}`}
          />
        </div>
      ))}

      <div aria-hidden className="pointer-events-none absolute top-0 inset-x-0 z-10 h-56 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.2)_55%,transparent_100%)]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 inset-x-0 z-10 h-[85%] bg-[linear-gradient(to_bottom,transparent_0%,rgba(244,241,234,0.05)_22%,rgba(244,241,234,0.22)_48%,rgba(244,241,234,0.62)_76%,#f4f1ea_96%)]" />

      {/* Mobile fallback — stack everything in one block, top to bottom */}
      <div className="absolute inset-0 z-20 flex flex-col gap-6 px-6 pt-28 pb-24 md:hidden">
        <div className="relative isolate overflow-visible">
          <AnimatedBrandBlob className="pointer-events-none absolute -left-10 -top-16 z-1 h-auto w-56" />
          <Image src="/assets/logos/svg/logo-icon-orange.svg" alt="Energía Solar Canarias" width={88} height={88} className="relative z-2 block h-auto w-20" priority />
        </div>
        <h1 className="text-display text-white! [text-shadow:0_2px_20px_rgba(0,0,0,0.42)]">
          {t('title')}
        </h1>
        <p className="max-w-[42ch] text-[clamp(0.98rem,1.3vw,1.1rem)] leading-relaxed text-white/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
          {t('body')}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Button variant="filled" href="/contacto">
            {t('cta1')}
          </Button>
          <Button variant="outlined" href="#beneficios" className="border-white/40! bg-transparent! text-white! hover:border-white/80! hover:text-white!">
            {t('cta2')}
          </Button>
        </div>
      </div>

      {/* Desktop — two-column band, bottom-aligned content, pulled toward mid-screen */}
      <div className="absolute inset-0 z-20 hidden items-center md:flex">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-12 items-end gap-10 px-[clamp(1.5rem,5vw,4rem)]">
          {/* Left — logo lockup + title */}
          <div className="col-span-7 flex flex-col gap-10 opacity-0" data-hero2-item>
            <div className="relative inline-flex w-fit items-center gap-5 isolate overflow-visible">
              <AnimatedBrandBlob className="pointer-events-none absolute -left-16 -top-16 z-1 h-auto w-[clamp(18rem,32vw,26rem)]" />
              <Image src="/assets/logos/svg/logo-icon-orange.svg" alt="Energía Solar Canarias" width={88} height={88} className="relative z-2 block h-auto w-20" priority />
            </div>

            <h1 className="text-display text-white! [text-shadow:0_2px_20px_rgba(0,0,0,0.42)] max-w-[14ch]">
              {t('title')}
            </h1>
          </div>

          {/* Right — slim column with body, hairline, CTAs */}
          <div className="col-span-5 flex flex-col gap-7 opacity-0 pb-4" data-hero2-item>
            <span className="block h-px w-12 bg-white/50" />
            <p className="text-body text-white! max-w-[36ch] leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_2px_18px_rgba(0,0,0,0.6)]">
              {t('body')}
            </p>
            <div className="grid grid-cols-[max-content] gap-3">
              <Button variant="filled" href="/contacto">
                {t('cta1')} <span aria-hidden>↗</span>
              </Button>
              <Button variant="outlined" href="#beneficios" className="border-white/40! bg-transparent! text-white! hover:border-white/80! hover:text-white!">
                {t('cta2')} <span aria-hidden>↓</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll — vertical, right edge, mid */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 md:block"
      >
        <span className="block font-mono text-[12px] uppercase tracking-[0.32em] text-white/65 [writing-mode:vertical-rl] [transform:rotate(180deg)]">
          {t('scroll')}
        </span>
      </div>
    </section>
  );
}
