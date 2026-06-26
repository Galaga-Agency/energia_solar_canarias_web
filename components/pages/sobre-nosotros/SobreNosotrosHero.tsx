"use client";

import { useTranslations } from "next-intl";
import { AnimatedBrandBlob } from "@/components/ui/AnimatedBrandBlob";
import { PaperTexture } from "@/components/ui/PaperTexture";

export function SobreNosotrosHero() {
  const t = useTranslations("sobre-nosotros.hero");

  return (
    <section
      data-hero
      data-nav-theme="light"
      className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-[clamp(1.5rem,5vw,4rem)] pt-28 text-center"
    >
      <PaperTexture className="z-0" />
      <AnimatedBrandBlob className="pointer-events-none absolute right-0 top-[15%] z-0 h-auto w-[70%] opacity-35 md:w-[44%]" />

      <div className="relative z-10 flex max-w-4xl flex-col items-center">
        <span data-hero-item className="mb-8 text-label text-primary!">
          {t("eyebrow")}
        </span>

        <h1 className="text-display text-ink">
          <span className="block overflow-hidden">
            <span data-hero-item className="block">
              {t("titleLead")}
            </span>
          </span>
          <span className="block overflow-hidden">
            <em
              data-hero-item
              className="block italic font-normal text-primary"
            >
              {t("titleTail")}
            </em>
          </span>
        </h1>

        <p
          data-hero-item
          className="mt-8 max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.35rem)] leading-relaxed text-ink/70"
        >
          {t("body")}
        </p>
      </div>

      <span
        data-hero-item
        className="absolute inset-x-0 bottom-10 z-10 text-center text-label text-ink/40!"
      >
        {t("meta")}
      </span>
    </section>
  );
}
