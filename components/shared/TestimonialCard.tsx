import { MdStar } from '@/components/ui/Icons'

interface TestimonialCardProps {
  quote:  string
  name:   string
  role:   string
  avatar?: string
}

export function TestimonialCard({ quote, name, role }: TestimonialCardProps) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <article className="bg-white rounded-lg border border-sand-100 p-5 md:p-6 flex flex-col gap-4 h-full select-none">
      <div className="flex gap-1" role="img" aria-label="5 de 5 estrellas">
        {Array.from({ length: 5 }).map((_, i) => <MdStar key={i} size={18} className="text-green-600" aria-hidden="true" />)}
      </div>

      <blockquote className="text-body flex-1">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full bg-sand-200 flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <span className="text-xs font-semibold text-ink">{initials}</span>
        </div>
        <div>
          <p className="text-body font-semibold text-ink leading-snug">{name}</p>
          <p className="text-body-sm leading-snug">{role}</p>
        </div>
      </div>
    </article>
  )
}
