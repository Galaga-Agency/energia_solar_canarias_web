'use client'

import Image from 'next/image'

const LOGO_COUNT = 8

export function ClientsMarquee() {
  const logos = Array.from({ length: LOGO_COUNT })
  const doubled = [...logos, ...logos]

  return (
    <div aria-hidden="true" className="overflow-hidden section-spacing">
      <div
        data-marquee-track
        className="flex items-center gap-32 w-max"
        style={{ willChange: 'transform' }}
      >
        {doubled.map((_, i) => (
          <div key={i} className="flex items-center justify-center opacity-40 shrink-0">
            <Image
              src="/assets/images/home/placeholder-logo.png"
              alt=""
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
