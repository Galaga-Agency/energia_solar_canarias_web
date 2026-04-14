'use client'

import Image from 'next/image'
import { MdStar } from '@/components/ui/Icons'

interface TestimonialSingleProps {
  quote:       string
  name:        string
  role:        string
  companyLogo: string
  avatar:      string
}

export function TestimonialSingle({
  quote,
  name,
  role,
  companyLogo,
  avatar,
}: TestimonialSingleProps) {
  return (
    <section
      className="section-spacing-both"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="section-inner" data-reveal>
        <div className="flex gap-1 mb-6 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <MdStar key={i} aria-hidden="true" className="w-5 h-5" />
          ))}
          <span className="sr-only">5 de 5 estrellas</span>
        </div>

        <blockquote className="mb-8">
          <p
            className="text-heading"
            style={{ fontWeight: 'var(--font-weight-semibold)', fontStyle: 'italic' }}
          >
            &quot;{quote}&quot;
          </p>
        </blockquote>

        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[var(--color-surface)]">
            <Image src={avatar} alt={name} fill className="object-cover" />
          </div>
          <div>
            <p className="text-body" style={{ fontWeight: 'var(--font-weight-semibold)' }}>{name}</p>
            <p className="text-body-sm">{role}</p>
          </div>
          <div className="ml-auto relative w-24 h-8">
            <Image src={companyLogo} alt="Logo empresa" fill className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  )
}
