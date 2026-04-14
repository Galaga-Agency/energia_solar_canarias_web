import { BlobDecor } from '@/components/ui/BlobDecor'

interface SobreNosotrosHeroProps {
  title: string
  body: string
}

export function SobreNosotrosHero({ title, body }: SobreNosotrosHeroProps) {
  return (
    <section
      data-hero
      className="relative overflow-hidden section-spacing-both"
      style={{ backgroundColor: 'var(--color-surface-dark)' }}
    >
      <BlobDecor className="top-0 right-0 w-[500px] h-[500px] opacity-20 translate-x-1/4 -translate-y-1/4" />
      <div className="section-inner relative">
        <h1 className="text-display mb-6 max-w-2xl" data-hero-item style={{ color: 'var(--color-text-on-dark)' }}>
          {title}
        </h1>
        <p className="text-body max-w-xl" data-hero-item style={{ color: 'var(--color-text-on-dark)', opacity: 0.8 }}>
          {body}
        </p>
      </div>
    </section>
  )
}
