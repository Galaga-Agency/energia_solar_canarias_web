"use client";

import dynamic from "next/dynamic";
import { usePageReady } from "@/hooks/usePageReady";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { Marquee } from "@/components/shared/Marquee";
import { AnimatedBirdFlock } from "@/components/shared/AnimatedBirdFlock";
import { initParallax } from "@/utils/animations/parallax";
import { initStatsCounterAnimations } from "@/utils/animations/stats-counter";
import { initScrollRevealSections } from "@/utils/animations/scroll-reveal";
import { initMarqueeAnimation } from "@/utils/animations/marquee";
import { initBlobAnimation } from "@/utils/animations/blob";
import { initScrollMarqueeAnimation } from "@/utils/animations/scroll-marquee";
import { initPanelStackAnimation } from "@/utils/animations/panel-stack";
import { initBirdFlockAnimation } from "@/utils/animations/bird-flock";
import { initFooterBirdFlockAnimation } from "@/utils/animations/footer-bird-flock";
import { initTestimonialsCardsAnimation } from "@/utils/animations/testimonials-cards";
import { HomeHero2 } from "./HomeHero2";
import { initHero2Animations } from "@/utils/animations/hero2-layers";

const HomeSoluciones = dynamic(() =>
  import("./HomeSoluciones").then((m) => m.HomeSoluciones),
);
const HomeBeneficios = dynamic(() =>
  import("./HomeBeneficios").then((m) => m.HomeBeneficios),
);
const HomeProyectos = dynamic(() =>
  import("./HomeProyectos").then((m) => m.HomeProyectos),
);
const HomeStats = dynamic(() => import("./HomeStats").then((m) => m.HomeStats));
const HomeFounder = dynamic(() =>
  import("./HomeFounder").then((m) => m.HomeFounder),
);
const HomeTestimonials = dynamic(() =>
  import("./HomeTestimonials").then((m) => m.HomeTestimonials),
);
const HomeCTA = dynamic(() => import("./HomeCTA").then((m) => m.HomeCTA));

const MARQUEE_ITEMS = [
  "Energía solar en Canarias",
  "Instalaciones certificadas",
  "Ahorra en tu factura",
  "Sistemas fotovoltaicos",
  "Autoconsumo inteligente",
  "Soluciones industriales",
  "Retorno garantizado",
  "Ingeniería local",
];

export function HomeClient() {
  usePageReady();

  useGSAPAnimations(() => ({
    critical: [initHero2Animations, initParallax],
    raf: [initStatsCounterAnimations],
    timeout: [
      initScrollRevealSections,
      initMarqueeAnimation,
      initBlobAnimation,
      initScrollMarqueeAnimation,
      initPanelStackAnimation,
      initBirdFlockAnimation,
      initFooterBirdFlockAnimation,
      initTestimonialsCardsAnimation,
    ],
  }));

  return (
    <>
      <HomeHero2 />
      <div
        className="relative isolate z-0 overflow-visible"
        data-home-panel-stack
      >
        <HomeSoluciones />
        <div className="relative z-10">
          <Marquee items={MARQUEE_ITEMS} />
        </div>
        <div
          className="home-bird-flock-stage panel-surface relative overflow-hidden"
          data-home-bird-flock-stage
          data-bird-flock-stage
        >
          <AnimatedBirdFlock className="home-bird-flock-backdrop" />
          <div className="relative z-10">
            <HomeBeneficios />
            <HomeProyectos />
          </div>
        </div>
      </div>
      <HomeStats />
      <HomeFounder />
      <HomeTestimonials />
      <HomeCTA />
    </>
  );
}
