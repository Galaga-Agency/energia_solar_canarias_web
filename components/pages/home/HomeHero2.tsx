"use client";

import { Button } from "@/components/ui/Button";

interface HomeHero2Props {
  eyebrow: string;
  title: string;
  body: string;
  cta1: string;
  cta2: string;
}

const LAYERS = [
  { key: "4", z: 2, cls: "object-cover object-bottom" },
  { key: "3", z: 3, cls: "object-cover" },
  { key: "2", z: 4, cls: "object-cover" },
  { key: "1", z: 5, cls: "object-cover" },
] as const;

export function HomeHero2({ title, body, cta1 }: HomeHero2Props) {
  return (
    <section
      data-hero2
      className="relative min-h-svh overflow-hidden bg-[#f4f1ea]"
    >
      {/* Dark atmospheric base — teal at top fading to near-black */}
      <div
        aria-hidden
        className="absolute inset-0 z-1 bg-[linear-gradient(to_bottom,rgba(15,36,33,0.75)_0%,rgba(31,58,52,0.45)_50%,transparent_100%)]"
      />

      {/* Parallax layers — z-index fixed, order never swaps */}
      {LAYERS.map(({ key, z, cls }) => (
        <div
          key={key}
          className="absolute -inset-[10%]"
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

      {/* Top scrim — above cloud layers, keeps navbar readable */}
      <div aria-hidden className="pointer-events-none absolute top-0 inset-x-0 z-10 h-56 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.2)_55%,transparent_100%)]" />

      {/* Bottom fade into next section */}
      <div aria-hidden className="pointer-events-none absolute bottom-0 inset-x-0 z-10 h-[60%] bg-[linear-gradient(to_bottom,transparent_0%,rgba(244,241,234,0.3)_40%,rgba(244,241,234,0.7)_65%,#f4f1ea_100%)]" />

      {/* Text — bottom left */}
      <div className="absolute bottom-16 sm:bottom-20 left-10 sm:left-16 z-20 max-w-2xl">
        <h1
          className="text-display text-white! mb-5 [text-shadow:0_2px_40px_rgba(228,87,44,0.3),0_2px_20px_rgba(0,0,0,0.6)]"
          data-hero2-item
        >
          {title}
        </h1>
        <p
          className="text-white/65 text-lg mb-8 max-w-lg [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]"
          data-hero2-item
        >
          {body}
        </p>
        <div data-hero2-item>
          <Button variant="white-filled" href="/contacto">
            {cta1}
          </Button>
        </div>
      </div>
    </section>
  );
}
