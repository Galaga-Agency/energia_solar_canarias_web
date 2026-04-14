interface BlogHeroProps {
  eyebrow: string
  title: string
  body: string
}

export function BlogHero({ eyebrow, title, body }: BlogHeroProps) {
  return (
    <section data-hero className="section-spacing-both" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner">
        <span className="text-label block mb-4" data-hero-item>{eyebrow}</span>
        <h1 className="text-title mb-6" data-hero-item>{title}</h1>
        <p className="text-body max-w-xl" data-hero-item>{body}</p>
      </div>
    </section>
  )
}
