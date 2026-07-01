"use client"
import { useTranslations } from "next-intl"
import { usePageReady } from "@/hooks/usePageReady"
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations"
import { PaperTexture } from "@/components/ui/PaperTexture"
import { initLegalReveal } from "@/utils/animations/legal-reveal"

interface LegalArticleProps {
  // Key under the "legal" namespace, e.g. "cookies" | "privacidad" | "aviso-legal"
  section: string
}

interface LegalSection {
  heading: string
  body: string
}

export function LegalArticle({ section }: LegalArticleProps) {
  const t = useTranslations(`legal.${section}`)
  const sections = t.raw("sections") as LegalSection[]

  usePageReady()
  useGSAPAnimations(() => ({
    critical: [initLegalReveal],
  }))

  return (
    <section className="relative isolate overflow-hidden bg-[#f4f1ea] section-spacing-both">
      <PaperTexture className="z-0" />

      <div data-legal className="section-inner relative z-10 max-w-[72ch]">
          {/* Header */}
          <span data-legal-item className="mb-6 block text-label text-primary! opacity-0">{t("eyebrow")}</span>
          <h1 data-legal-item className="text-display text-ink max-w-[20ch] opacity-0">{t("title")}</h1>
          <p data-legal-item className="mt-5 text-label text-ink/45! opacity-0">{t("updated")}</p>
          <p data-legal-item className="mt-10 max-w-[64ch] text-subheading text-ink/75 opacity-0">{t("intro")}</p>

          {/* Sections */}
          <div className="mt-[clamp(3rem,7vh,5rem)] flex flex-col gap-[clamp(2.4rem,5vh,3.4rem)]">
            {sections.map((s, i) => (
              <section
                key={s.heading}
                data-legal-item
                className={`opacity-0 ${i > 0 ? "border-t border-ink/10 pt-[clamp(2.4rem,5vh,3.4rem)]" : ""}`}
              >
                <h2 className="text-heading text-ink max-w-[26ch]">{s.heading}</h2>
                <p className="mt-4 max-w-[64ch] text-body text-ink/75">{s.body}</p>
              </section>
            ))}
        </div>
      </div>
    </section>
  )
}
