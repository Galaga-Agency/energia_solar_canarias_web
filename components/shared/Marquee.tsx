import { FiChevronDown } from 'react-icons/fi'

interface MarqueeProps {
  items: string[]
}

export function Marquee({ items }: MarqueeProps) {
  const doubled = [...items, ...items]

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden bg-primary py-3"
    >
      <div
        data-scroll-marquee-track
        className="flex items-center gap-8 w-max"
        style={{ willChange: 'transform' }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-8 shrink-0">
            <span className="text-text-on-primary text-sm font-medium uppercase tracking-widest whitespace-nowrap">
              {item}
            </span>
            <FiChevronDown
              className="text-text-on-primary shrink-0"
              size={14}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
