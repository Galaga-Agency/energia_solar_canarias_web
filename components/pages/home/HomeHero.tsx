"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export function HomeHero() {
  const t = useTranslations("home.hero");
  return (
    <section
      data-hero
      className="relative min-h-screen flex items-center justify-center overflow-hidden pb-[10%]"
    >
      <div className="absolute inset-x-0 inset-y-[-15%] z-0" data-speed="0.85" data-hero-image>
        <Image
          src="/assets/images/home/arid-volcanic-road-landscape.webp"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-10 max-w-5xl mx-auto">
        <h1 className="text-display text-white! mb-6 opacity-0" data-hero-item>
          {t("title")}
        </h1>

        <p className="text-lg text-white/80! mb-10 max-w-2xl opacity-0" data-hero-item>
          {t("body")}
        </p>

        <div className="opacity-0" data-hero-item>
          <Button variant="white-filled" href="/contacto">
            {t("cta1")}
          </Button>
        </div>
      </div>
    </section>
  );
}
