"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { usePageReady } from "@/hooks/usePageReady";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { SobreNosotrosHero } from "@/components/pages/sobre-nosotros/SobreNosotrosHero";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

const MouseReactiveFlock = dynamic(
  () =>
    import("@/components/shared/MouseReactiveFlock").then(
      (m) => m.MouseReactiveFlock,
    ),
  { ssr: false },
);
import { initHeroAnimations } from "@/utils/animations/hero-animations";
import { initScrollRevealSections } from "@/utils/animations/scroll-reveal";
import { initBlobAnimation } from "@/utils/animations/blob";
import { initFounderFrameAnimation } from "@/utils/animations/founder-frame";
import { initBentoReveal } from "@/utils/animations/bento-reveal";
import { initCtaRevealAnimation } from "@/utils/animations/cta-reveal";

const SobreNosotrosNarrative = dynamic(() =>
  import("./SobreNosotrosNarrative").then((m) => m.SobreNosotrosNarrative),
);
const SobreNosotrosBenefits = dynamic(() =>
  import("./SobreNosotrosBenefits").then((m) => m.SobreNosotrosBenefits),
);
const SobreNosotrosAward = dynamic(() =>
  import("./SobreNosotrosAward").then((m) => m.SobreNosotrosAward),
);
const SobreNosotrosLeadership = dynamic(() =>
  import("./SobreNosotrosLeadership").then((m) => m.SobreNosotrosLeadership),
);
const SobreNosotrosTestimonial = dynamic(
  () =>
    import("./SobreNosotrosTestimonial").then(
      (m) => m.SobreNosotrosTestimonial,
    ),
  { ssr: false },
);
const SobreNosotrosCTA = dynamic(() =>
  import("./SobreNosotrosCTA").then((m) => m.SobreNosotrosCTA),
);

export function SobreNosotrosClient() {
  usePageReady();
  const nav = useTranslations("nav");

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    timeout: [initScrollRevealSections, initBlobAnimation, initFounderFrameAnimation, initBentoReveal, initCtaRevealAnimation],
  }));

  return (
    <>
      <Breadcrumbs
        items={[
          { label: nav("home"), href: "/" },
          { label: nav("about"), href: "/sobre-nosotros" },
        ]}
      />
      {/* Flock scoped to the hero group (absolute, scrolls WITH the section like
          the homepage — NOT fixed). Kept out of the Narrative wrapper because that
          section pins, and a flock canvas inside a pinned/overflow-hidden ancestor
          makes ScrollTrigger thrash the CPU. */}
      <div className="relative isolate overflow-hidden">
        <MouseReactiveFlock
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          birds={50}
        />
        <div className="relative z-10">
          <SobreNosotrosHero />
        </div>
      </div>
      <SobreNosotrosNarrative />
      <SobreNosotrosBenefits />
      <SobreNosotrosAward />
      <SobreNosotrosLeadership />
      <SobreNosotrosCTA />
    </>
  );
}
