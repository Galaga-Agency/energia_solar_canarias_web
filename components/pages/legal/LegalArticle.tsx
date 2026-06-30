"use client"
import { useTranslations } from "next-intl"
import { PaperTexture } from "@/components/ui/PaperTexture"

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

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="relative isolate overflow-hidden bg-[#f4f1ea] section-spacing-both">
        <PaperTexture className="z-0" />

        <div className="section-inner relative z-10 max-w-[72ch]">
          {/* Header */}
          <span className="mb-6 block text-label text-primary!">{t("eyebrow")}</span>
          <h1 className="text-display text-ink max-w-[20ch]">{t("title")}</h1>
          <p className="mt-5 text-label text-ink/45!">{t("updated")}</p>

          <p className="mt-10 max-w-[64ch] text-subheading text-ink/75">{t("intro")}</p>

          {/* Sections */}
          <div className="mt-[clamp(3rem,7vh,5rem)] flex flex-col gap-[clamp(2.4rem,5vh,3.4rem)]">
            {sections.map((s, i) => (
              <section
                key={s.heading}
                className={i > 0 ? "border-t border-ink/10 pt-[clamp(2.4rem,5vh,3.4rem)]" : ""}
              >
                <h2 className="text-heading text-ink max-w-[26ch]">{s.heading}</h2>
                <p className="mt-4 max-w-[64ch] text-body text-ink/75">{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
