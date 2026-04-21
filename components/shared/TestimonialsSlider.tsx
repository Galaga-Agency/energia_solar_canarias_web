'use client'

import { useRef, useState, useCallback } from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { TestimonialCard } from '@/components/shared/TestimonialCard'

export interface TestimonialItem { name: string; role: string; quote: string }

export function TestimonialsSlider({ items }: { items: TestimonialItem[] }) {
  const [current, setCurrent] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[index] as HTMLElement
    if (!card) return
    const scrollPad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0
    track.scrollTo({ left: card.offsetLeft - scrollPad, behavior: 'smooth' })
    setCurrent(index)
  }, [])

  const handleScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const scrollPad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0
    const active = Array.from(track.children).reduce((closest, child, index) => {
      const distance = Math.abs((child as HTMLElement).offsetLeft - scrollPad - track.scrollLeft)
      return distance < closest.distance ? { distance, index } : closest
    }, { distance: Number.POSITIVE_INFINITY, index: 0 })
    setCurrent(active.index)
  }, [])

  return (
    <>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none mb-8 carousel-scroll-padding carousel-track-end"
      >
        {items.map((item, i) => (
          <div
            key={i}
            className={`snap-start flex-none w-[80vw] sm:w-[62vw] md:w-[44vw] lg:w-[32vw] xl:w-[30vw]${i === 0 ? ' carousel-track-first' : ''}`}
          >
            <TestimonialCard {...item} />
          </div>
        ))}
      </div>

      <div className="section-inner flex items-center justify-between">
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Ir al testimonio ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                i === current ? 'bg-primary' : 'bg-sand-300'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scrollToIndex(Math.max(0, current - 1))}
            disabled={current === 0}
            aria-label="Anterior"
            className="w-11 h-11 rounded-lg border border-sand-200 flex items-center justify-center text-ink hover:bg-sand-50 disabled:opacity-30 transition-colors duration-200"
          >
            <FiArrowLeft size={18} />
          </button>
          <button
            onClick={() => scrollToIndex(Math.min(items.length - 1, current + 1))}
            disabled={current === items.length - 1}
            aria-label="Siguiente"
            className="w-11 h-11 rounded-lg border border-sand-200 flex items-center justify-center text-ink hover:bg-sand-50 disabled:opacity-30 transition-colors duration-200"
          >
            <FiArrowRight size={18} />
          </button>
        </div>
      </div>
    </>
  )
}
