'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'

interface SolucionCardProps {
  label:    string
  title:    string
  desc:     string
  image:    string
  isOpen:   boolean
  onSelect: () => void
}

export function SolucionCard({ label, title, desc, image, isOpen, onSelect }: SolucionCardProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef  = useRef<HTMLParagraphElement>(null)
  const tlRef    = useRef<gsap.core.Timeline | null>(null)
  const mounted  = useRef(false)

  useEffect(() => {
    const title = titleRef.current
    const desc  = descRef.current
    if (!title || !desc) return

    tlRef.current?.kill()

    if (!mounted.current) {
      mounted.current = true
      if (isOpen) {
        gsap.set(title, { rotation: 0, transformOrigin: '0% 100%' })
        gsap.set(desc,  { autoAlpha: 1, y: 0 })
      } else {
        title.style.whiteSpace = 'nowrap'
        gsap.set(title, { rotation: -90, transformOrigin: '0% 100%' })
        gsap.set(desc,  { autoAlpha: 0 })
      }
      return
    }

    const tl = gsap.timeline()
    tlRef.current = tl

    if (isOpen) {
      title.style.whiteSpace = 'normal'
      tl.to(title, { rotation: 0, transformOrigin: '0% 100%', duration: 0.6, ease: 'power3.out' }, 0)
      tl.fromTo(desc,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' },
        0.32,
      )
    } else {
      tl.to(desc, { autoAlpha: 0, duration: 0.15 }, 0)
      tl.to(title, {
        rotation: -90,
        transformOrigin: '0% 100%',
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => { title.style.whiteSpace = 'nowrap' },
      }, 0)
    }

    return () => { tl.kill() }
  }, [isOpen])

  return (
    <article
      onClick={onSelect}
      onMouseEnter={onSelect}
      className={`relative overflow-hidden brand-radius cursor-pointer solucion-card${isOpen ? ' solucion-card--open' : ''}`}
    >
      {/* Mobile */}
      <div className="flex flex-col md:hidden">
        <div className="p-6 flex flex-col gap-3">
          <span className="card-eyebrow">{label}</span>
          <h3 className="card-title">{title}</h3>
          <p className="card-content">{desc}</p>
        </div>
        <div className="relative aspect-video">
          <Image src={image} alt={title} fill className="object-cover" sizes="100vw" />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover solucion-card-image"
          sizes="(min-width: 768px) 50vw, 100vw"
        />

        {/* Brand aura — the orange blob signature over the landscape */}
        <div aria-hidden="true" className="solucion-card-aura absolute inset-0 pointer-events-none" />
        {/* Bottom scrim — readability only */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/55 to-transparent" />

        {/* Label — top left */}
        <span className="solucion-card-label absolute top-5 left-6 z-10 text-xs uppercase tracking-widest font-medium text-white/60">
          {label}
        </span>

        {/* Title + desc — bottom left, white on image */}
        <div className="absolute bottom-7 left-6 z-10">
          <h3
            ref={titleRef}
            className="text-xl font-semibold text-white leading-snug max-w-50"
          >
            {title}
          </h3>
          <p
            ref={descRef}
            className="text-sm text-white/80 leading-relaxed max-w-50 mt-2"
          >
            {desc}
          </p>
        </div>
      </div>
    </article>
  )
}
