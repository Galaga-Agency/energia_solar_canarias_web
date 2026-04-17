'use client'

import Image                  from 'next/image'
import { Button }             from '@/components/ui/Button'
import { useGSAPAnimations }  from '@/hooks/useGSAPAnimations'
import { initHighlightDraw }  from '@/utils/animations/highlight-draw'

interface HomeFounderProps {
  eyebrow: string
  title:   string
  role:    string
  name:    string
  body1:   string
  quote:   string
  link:    string
}

export function HomeFounder({ eyebrow, title, role, name, body1, quote, link }: HomeFounderProps) {
  useGSAPAnimations(() => ({
    critical: [() => initHighlightDraw()],
  }))

  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner" data-reveal>

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12 max-w-3xl mx-auto">
          <span className="text-label text-primary!">{eyebrow}</span>
          <h2 className="text-title">{title}</h2>
        </div>

        {/* Card */}
        <div className="border border-border rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

          {/* Left — text */}
          <div className="p-8 md:p-10 flex flex-col gap-8 justify-between bg-white">
            <div className="flex flex-col gap-5">
              <span className="card-eyebrow">{role}</span>
              <p className="card-title">
                <mark data-highlight-draw className="relative inline-block py-0.5 text-ink">
                  {name},
                  <span aria-hidden="true" className="highlight-overlay absolute -inset-x-2 inset-y-0 bg-primary text-text-on-primary overflow-hidden flex items-center px-2">{name},</span>
                </mark>
                {' '}{quote}
              </p>
              <p className="card-content">{body1}</p>
            </div>
            <div>
              <Button variant="green-dark" href="/sobre-nosotros">{link}</Button>
            </div>
          </div>

          {/* Right — image */}
          <div className="relative min-h-80 md:min-h-144 overflow-hidden">
            <div className="absolute inset-x-0 inset-y-[-12%]" data-speed="0.85">
              <Image
                src="/assets/images/home/carla.webp"
                alt={name}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
