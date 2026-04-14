'use client'

import dynamic             from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useMarkReady }    from '@/hooks/useAppReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { BlogHero }        from '@/components/pages/blog/BlogHero'
import type { Article }    from '@/types/article'
import { initHeroAnimations }       from '@/utils/animations/hero-animations'
import { initScrollRevealSections } from '@/utils/animations/scroll-reveal'

const BlogFilterBar = dynamic(() => import('./BlogFilterBar').then(m => m.BlogFilterBar))
const BlogArticles  = dynamic(() => import('./BlogArticles').then(m => m.BlogArticles))

interface BlogClientProps {
  articles: Article[]
  messages: {
    hero: { eyebrow: string; title: string; body: string }
    filter: { categories: string[]; gridLabel: string; listLabel: string }
    readMore: string
    empty: string
  }
}

export function BlogClient({ articles, messages }: BlogClientProps) {
  const markReady = useMarkReady()
  const [category, setCategory] = useState(messages.filter.categories[0])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    document.fonts.ready.then(() => {
      const t = setTimeout(markReady, 600)
      return () => clearTimeout(t)
    })
  }, [markReady])

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    timeout:  [initScrollRevealSections],
  }))

  const filtered = category === messages.filter.categories[0]
    ? articles
    : articles.filter((a) => a.category === category)

  return (
    <>
      <BlogHero {...messages.hero} />
      <BlogFilterBar
        category={category}
        categories={messages.filter.categories}
        gridLabel={messages.filter.gridLabel}
        listLabel={messages.filter.listLabel}
        viewMode={viewMode}
        onCategoryChange={setCategory}
        onViewModeChange={setViewMode}
      />
      <BlogArticles articles={filtered} viewMode={viewMode} readMore={messages.readMore} empty={messages.empty} />
    </>
  )
}
