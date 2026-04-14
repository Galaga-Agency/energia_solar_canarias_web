import { TransitionLink } from '@/components/ui/TransitionLink'

interface SobreNosotrosLeadershipProps {
  eyebrow: string
  title: string
  quote: string
  body: string
  link: string
}

export function SobreNosotrosLeadership({ eyebrow, title, quote, body, link }: SobreNosotrosLeadershipProps) {
  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="section-inner" data-reveal>
        <span className="text-label block mb-4">{eyebrow}</span>
        <h2 className="text-heading mb-8">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="w-full aspect-[3/4] rounded-2xl bg-[var(--color-border)]" />
          <div>
            <h3 className="text-subheading mb-6">{quote}</h3>
            <p className="text-body mb-6">{body}</p>
            <TransitionLink href="/sobre-nosotros" style={{ color: 'var(--color-primary)' }} className="text-body-sm font-semibold">
              {link}
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  )
}
