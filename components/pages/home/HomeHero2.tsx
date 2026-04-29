"use client";

import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/Button";

const LAYERS = [
  { key: "4", z: 2, cls: "object-cover object-right-top", initY: -90 },
  { key: "3", z: 3, cls: "object-cover",               initY: -60 },
  { key: "2", z: 4, cls: "object-cover",               initY: -35 },
  { key: "1", z: 5, cls: "object-cover",               initY: -12.5 },
] as const;

export function HomeHero2() {
  const t = useTranslations('home.hero')

  return (
    <section
      data-hero2
      className="relative min-h-svh overflow-hidden bg-[#f4f1ea]"
    >
      <div
        aria-hidden
        className="absolute inset-0 z-1 bg-[linear-gradient(to_bottom,rgba(15,36,33,0.75)_0%,rgba(31,58,52,0.45)_50%,transparent_100%)]"
      />

      {LAYERS.map(({ key, z, cls, initY }) => (
        <div
          key={key}
          className="absolute -inset-[10%]"
          style={{ zIndex: z, transform: `translateY(${initY}px)` }}
          data-layer-scroll={key}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/assets/images/home/parralax/layer-${key}.png`}
            alt=""
            data-layer-drift={key}
            className={`absolute inset-0 w-full h-full ${cls}`}
          />
        </div>
      ))}

      <div aria-hidden className="pointer-events-none absolute top-0 inset-x-0 z-10 h-56 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.2)_55%,transparent_100%)]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 inset-x-0 z-10 h-[85%] bg-[linear-gradient(to_bottom,transparent_0%,rgba(244,241,234,0.05)_20%,rgba(244,241,234,0.25)_45%,rgba(244,241,234,0.65)_72%,#f4f1ea_100%)]" />

      <div className="absolute bottom-16 sm:bottom-20 left-10 sm:left-16 z-20 max-w-2xl">
        <h1
          className="text-display text-white! mb-5 [text-shadow:0_2px_40px_rgba(228,87,44,0.3),0_2px_20px_rgba(0,0,0,0.6)]"
          data-hero2-item
        >
          {t('title')}
        </h1>
        <p
          className="text-white/65 text-lg mb-8 max-w-lg [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]"
          data-hero2-item
        >
          {t('body')}
        </p>
        <div data-hero2-item>
          <Button variant="white-filled" href="/contacto">
            {t('cta1')}
          </Button>
        </div>
      </div>
    </section>
  );
}
