'use client'

import Image from 'next/image'

const LOGO_COUNT = 8

export function ClientsMarquee({ label }: { label?: string }) {
  const logos = Array.from({ length: LOGO_COUNT })
  const doubled = [...logos, ...logos]

  return (
    <div className="overflow-hidden section-spacing">
      {label && (
        <p className="section-inner mb-12 text-label text-primary!">{label}</p>
      )}
      <div
        aria-hidden="true"
        data-marquee-track
        className="flex items-center gap-32 w-max"
        style={{ willChange: 'transform' }}
      >
        {doubled.map((_, i) => (
          <div key={i} className="flex shrink-0 items-center justify-center opacity-50">
            <Image
              src="/assets/images/home/placeholder-logo.png"
              alt=""
              width={120}
              height={40}
              className="object-contain grayscale opacity-60"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
