import { Button } from '@/components/ui/Button'

interface SolucionesPainPointsProps {
  eyebrow: string
  title: string
  body: string
  tags: string[]
  cta: string
}

export function SolucionesPainPoints({ eyebrow, title, body, tags, cta }: SolucionesPainPointsProps) {
  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner" data-reveal>
        <span className="text-label block mb-4">{eyebrow}</span>
        <h2 className="text-heading mb-4 max-w-lg">{title}</h2>
        <p className="text-body mb-8 max-w-xl">{body}</p>
        <div className="flex flex-wrap gap-3 mb-8">
          {tags.map((tag) => (
            <span key={tag} className="pill-tag">{tag}</span>
          ))}
        </div>
        <Button variant="outlined" href="/proyectos">{cta}</Button>
      </div>
    </section>
  )
}
