"use client";

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/Button";
import { AnimatedBrandBlob } from '@/components/ui/AnimatedBrandBlob'

const LAYERS = [
  { key: "4", z: 2, cls: "object-cover object-right-top" },
  { key: "3", z: 3, cls: "object-cover" },
  { key: "2", z: 4, cls: "object-cover" },
  { key: "1", z: 5, cls: "object-cover" },
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

      {LAYERS.map(({ key, z, cls }) => (
        <div
          key={key}
          className="absolute -inset-[10%] will-change-transform"
          style={{ zIndex: z }}
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

      {/* Content — centered on screen, left-aligned within column */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-6 pt-20 pb-16">
        <div className="flex flex-col items-start gap-6 w-full max-w-3xl">

          <div className="relative inline-block isolate overflow-visible ml-8 sm:ml-0" data-hero2-item>
            <AnimatedBrandBlob className="pointer-events-none absolute -left-10 -top-16 z-1 h-auto w-56 sm:-left-20 sm:-top-24 sm:w-[clamp(22rem,40vw,30rem)]" />
            <Image
              src="/assets/logos/svg/logo-icon-orange.svg"
              alt="Energía Solar Canarias"
              width={88}
              height={88}
              className="relative z-2 block h-auto w-28 sm:w-36"
              priority
            />
          </div>

          <h1
            className="text-display text-white! [text-shadow:0_2px_20px_rgba(0,0,0,0.42)]"
            data-hero2-item
          >
            {t('title')}
          </h1>

          <p
            className="text-base text-white/65 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]"
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
      </div>
    </section>
  );
}
