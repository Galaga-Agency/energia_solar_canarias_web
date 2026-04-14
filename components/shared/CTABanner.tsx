'use client'

import { BlobDecor } from '@/components/ui/BlobDecor'
import { Button }    from '@/components/ui/Button'

interface CTABannerProps {
  title:          string
  body:           string
  primaryLabel:   string
  primaryHref:    string
  secondaryLabel: string
  secondaryHref:  string
}

export function CTABanner({
  title,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CTABannerProps) {
  return (
    <section
      className="relative overflow-hidden section-spacing-both"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <BlobDecor className="inset-0 m-auto w-[600px] h-[600px] opacity-10" />

      <div className="section-inner relative text-center" data-reveal>
        <h2 className="text-heading mb-4">{title}</h2>
        <p className="text-body max-w-2xl mx-auto mb-8">{body}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="filled"   href={primaryHref}>{primaryLabel}</Button>
          <Button variant="outlined" href={secondaryHref}>{secondaryLabel}</Button>
        </div>
      </div>
    </section>
  )
}
