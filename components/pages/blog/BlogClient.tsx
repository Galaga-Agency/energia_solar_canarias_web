'use client'

import dynamic             from 'next/dynamic'
import { useState }        from 'react'
import { usePageReady }    from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { useTranslation }  from '@/contexts/TranslationContext'
import { BlogHero }        from '@/components/pages/blog/BlogHero'
import { Breadcrumbs }     from '@/components/shared/Breadcrumbs'
import type { Article }    from '@/types/article'
import { initHeroAnimations }       from '@/utils/animations/hero-animations'

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
  usePageReady()
  const { t } = useTranslation()
  const [category, setCategory] = useState(messages.filter.categories[0])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
  }))

  const filtered = category === messages.filter.categories[0]
    ? articles
    : articles.filter((a) => a.category === category)

  return (
    <>
      <Breadcrumbs items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.blog'), href: '/blog' },
      ]} />
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
