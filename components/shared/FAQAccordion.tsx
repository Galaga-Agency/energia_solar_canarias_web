'use client'

import { HiChevronDown, HiChevronUp } from '@/components/ui/Icons'
import type { FAQItem } from '@/types/faq'
import { useState } from 'react'

interface FAQAccordionProps {
  items:  FAQItem[]
  label?: string
}

export function FAQAccordion({ items, label = 'FAQ' }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      aria-label={label}
      className="section-spacing-both"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="section-inner">
        <dl>
          {items.map((item, i) => {
            const panelId   = `faq-panel-${i}`
            const triggerId = `faq-trigger-${i}`
            const isOpen    = openIndex === i

            return (
              <div key={i} className="accordion-item">
                <dt>
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    data-accordion-trigger={panelId}
                    className="accordion-trigger"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <h3 className="text-subheading text-left">{item.question}</h3>
                    {isOpen
                      ? <HiChevronUp   aria-hidden="true" className="w-5 h-5 shrink-0" style={{ color: 'var(--color-primary)' }} />
                      : <HiChevronDown aria-hidden="true" className="w-5 h-5 shrink-0" />
                    }
                  </button>
                </dt>

                <dd
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  hidden={!isOpen}
                >
                  {isOpen && (
                    <p className="text-body pb-6">{item.answer}</p>
                  )}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
