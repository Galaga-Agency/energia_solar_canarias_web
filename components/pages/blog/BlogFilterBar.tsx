'use client'

import { useTranslations } from 'next-intl'
import { PaperTexture } from '@/components/ui/PaperTexture'
import type { CategoryInfo } from '@/types/article'

interface BlogFilterBarProps {
  category: string
  categories: CategoryInfo[]
  allValue: string
  counts: Record<string, number>
  total: number
  onCategoryChange: (category: string) => void
}

export function BlogFilterBar({
  category,
  categories,
  allValue,
  counts,
  total,
  onCategoryChange,
}: BlogFilterBarProps) {
  const t = useTranslations('blog.filter')

  const pills = [
    { slug: allValue, label: t('all'), count: total },
    ...categories.map((c) => ({ slug: c.slug, label: c.label, count: counts[c.slug] ?? 0 })),
  ]

  return (
    <div className="sticky top-0 z-dropdown isolate overflow-hidden border-b border-ink/12 bg-bg/95 backdrop-blur">
      <PaperTexture className="z-0" />
      <div className="section-inner relative z-10 flex items-center gap-x-8 gap-y-3 overflow-x-auto py-4" role="tablist" aria-label={t('all')}>
        {pills.map((p) => {
          const active = category === p.slug
          return (
            <button
              key={p.slug}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onCategoryChange(p.slug)}
              className={`keyboard-focus-ring flex shrink-0 items-baseline gap-2 text-label font-mono transition-colors ${
                active ? 'text-primary!' : 'text-ink/70! hover:text-ink!'
              }`}
            >
              {p.label}
              <span aria-hidden className={active ? 'text-primary/60' : 'text-ink/35'}>
                {String(p.count).padStart(2, '0')}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
