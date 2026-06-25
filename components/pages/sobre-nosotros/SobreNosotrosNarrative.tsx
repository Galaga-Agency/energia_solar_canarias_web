import { useTranslations } from 'next-intl'
import { PaperTexture } from '@/components/ui/PaperTexture'

export function SobreNosotrosNarrative() {
  const t          = useTranslations('sobre-nosotros.narrative')
  const paragraphs = t.raw('paragraphs') as string[]

  return (
    <section className="section-spacing relative isolate overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
      <PaperTexture className="z-0" />
      <div className="section-inner relative z-10" data-reveal>
        <h2 className="text-heading mb-8 max-w-lg">{t('title')}</h2>
        <div className="max-w-2xl flex flex-col gap-6 mb-12">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-body">{paragraph}</p>
          ))}
        </div>
        <div className="w-full aspect-video rounded-2xl bg-[var(--color-surface)]" />
      </div>
    </section>
  )
}
