'use client'

import { useTranslations } from 'next-intl'
import { TagChip } from '@/components/ui/TagChip'
import type { ArticleTag } from '@/types/article'

export interface TagWithCount extends ArticleTag {
  count: number
}

interface BlogTagsProps {
  tags: TagWithCount[]
  activeTag?: string | null
  onTagClick?: (slug: string) => void
}

export function BlogTags({ tags, activeTag, onTagClick }: BlogTagsProps) {
  const t = useTranslations('blog')
  if (tags.length === 0) return null

  return (
    <div className="mt-(--gap) [--gap:clamp(4rem,9vw,8rem)]" data-reveal>
      <p className="mb-6 max-w-[40ch] text-body text-ink/55">{t('tags.intro')}</p>

      <ul className="flex flex-wrap gap-2.5">
        {tags.map((tag) => (
          <li key={tag.slug}>
            <TagChip
              label={tag.name}
              active={activeTag === tag.slug}
              onClick={() => onTagClick?.(tag.slug)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
