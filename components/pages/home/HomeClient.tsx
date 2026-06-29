"use client";

import dynamic from "next/dynamic";
import { usePageReady } from "@/hooks/usePageReady";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { useIsMobile } from "@/hooks/useIsMobile";
import { initParallax } from "@/utils/animations/parallax";
import { initScrollRevealSections } from "@/utils/animations/scroll-reveal";
import { initMarqueeAnimation } from "@/utils/animations/marquee";
import { initBlobAnimation } from "@/utils/animations/blob";
import { initSolucionCardsAnimation } from "@/utils/animations/solucion-cards";
import { initStatsRevealAnimation } from "@/utils/animations/stats-reveal";
import { initProcesoTimelineAnimation } from "@/utils/animations/proceso-timeline";
import { initCtaRevealAnimation } from "@/utils/animations/cta-reveal";
import { initBeneficiosListAnimation } from "@/utils/animations/beneficios-list";
import { initFounderFrameAnimation } from "@/utils/animations/founder-frame";
import { initProyectosCardsAnimation } from "@/utils/animations/proyectos-cards";
import { initHero2Animations } from "@/utils/animations/hero2-layers";
import { HomeHero } from "./HomeHero";
import { HomeManifestoStrip } from "./HomeManifestoStrip";
import { MouseReactiveFlock } from "@/components/shared/MouseReactiveFlock";
import { PaperTexture } from "@/components/ui/PaperTexture";

const HomeStats = dynamic(() => import("./HomeStats").then((m) => m.HomeStats));
const HomeBeneficios = dynamic(() =>
  import("./HomeBeneficios").then((m) => m.HomeBeneficios),
);
const HomeSoluciones = dynamic(() =>
  import("./HomeSoluciones").then((m) => m.HomeSoluciones),
);
const HomeProceso = dynamic(() =>
  import("./HomeProceso").then((m) => m.HomeProceso),
);
const HomeProyectos = dynamic(() =>
  import("./HomeProyectos").then((m) => m.HomeProyectos),
);
const HomeFounder = dynamic(() =>
  import("./HomeFounder").then((m) => m.HomeFounder),
);
const HomeTestimonials = dynamic(() =>
  import("./HomeTestimonials").then((m) => m.HomeTestimonials),
);
const HomeCTA = dynamic(() => import("./HomeCTA").then((m) => m.HomeCTA));

export function HomeClient() {
  usePageReady();

  const isMobile = useIsMobile();
  const flockBirds = isMobile
    ? { top: 40, bottom: 30 }
    : { top: 70, bottom: 55 };

  useGSAPAnimations(() => ({
    critical: [initHero2Animations, initParallax],
    raf: [],
    timeout: [
      initScrollRevealSections,
      initMarqueeAnimation,
      initBlobAnimation,
      initSolucionCardsAnimation,
      initStatsRevealAnimation,
      initProcesoTimelineAnimation,
      initCtaRevealAnimation,
      initBeneficiosListAnimation,
      initFounderFrameAnimation,
      initProyectosCardsAnimation,
    ],
  }));

  return (
    <>
      <div className="relative isolate">
        <PaperTexture className="z-30" />
        <HomeHero />
      <HomeManifestoStrip />
      </div>
      <HomeStats />
      <div className="relative isolate overflow-hidden bg-[#f4f1ea]">
        <PaperTexture className="z-0" />
        <MouseReactiveFlock
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          birds={flockBirds.top}
        />
        <div className="relative z-10">
          <HomeBeneficios />
          <HomeSoluciones />
        </div>
      </div>
      <HomeProceso />
      <div className="relative isolate overflow-hidden bg-[#f4f1ea]">
        <PaperTexture className="z-0" />
        <MouseReactiveFlock
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          birds={flockBirds.bottom}
        />
        <div className="relative z-10">
          <HomeProyectos />
          <HomeFounder />
        </div>
      </div>
      <HomeTestimonials />
      <HomeCTA />
    </>
  );
}
