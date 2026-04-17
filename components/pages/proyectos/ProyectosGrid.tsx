import { Button }         from '@/components/ui/Button'
import { TransitionLink } from '@/components/ui/TransitionLink'
import type { Project }   from '@/types/project'

interface ProyectosGridProps {
  projects: Project[]
  readMore: string
  seeAll: string
}

export function ProyectosGrid({ projects, readMore, seeAll }: ProyectosGridProps) {
  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {projects.map((p) => (
            <article key={p.id} className="bg-surface rounded-2xl overflow-hidden flex flex-col">
              <div className="w-full aspect-video bg-[var(--color-border)]" />
              <div className="p-6 flex flex-col gap-3 flex-1">
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-ink text-text-on-dark">{tag}</span>
                  ))}
                </div>
                <h3 className="text-subheading">{p.title}</h3>
                <p className="text-body flex-1">{p.excerpt}</p>
                <TransitionLink
                  href={`/proyectos/${p.slug}`}
                  className="text-body-sm font-semibold"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {readMore}
                </TransitionLink>
              </div>
            </article>
          ))}
        </div>
        <div className="flex justify-center">
          <Button variant="outlined" href="/proyectos">{seeAll}</Button>
        </div>
      </div>
    </section>
  )
}
