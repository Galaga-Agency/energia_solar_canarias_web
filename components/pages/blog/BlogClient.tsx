'use client'

import dynamic             from 'next/dynamic'
import { useState }        from 'react'
import { useTranslations } from 'next-intl'
import { usePageReady }    from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { BlogHero }        from '@/components/pages/blog/BlogHero'
import { Breadcrumbs }     from '@/components/shared/Breadcrumbs'
import type { Article }    from '@/types/article'
import { initHeroAnimations } from '@/utils/animations/hero-animations'

const BlogFilterBar = dynamic(() => import('./BlogFilterBar').then(m => m.BlogFilterBar))
const BlogArticles  = dynamic(() => import('./BlogArticles').then(m => m.BlogArticles))

export function BlogClient({ articles }: { articles: Article[] }) {
  usePageReady()
  const nav = useTranslations('nav')
  const t   = useTranslations('blog')

  const categories = t.raw('filter.categories') as string[]
  const [category, setCategory] = useState(categories[0])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
  }))

  const filtered = category === categories[0]
    ? articles
    : articles.filter((a) => a.category === category)

  return (
    <>
      <Breadcrumbs items={[
        { label: nav('home'), href: '/' },
        { label: nav('blog'), href: '/blog' },
      ]} />
      <BlogHero />
      <BlogFilterBar
        category={category}
        categories={categories}
        viewMode={viewMode}
        onCategoryChange={setCategory}
        onViewModeChange={setViewMode}
      />
      <BlogArticles articles={filtered} viewMode={viewMode} />
    </>
  )
}
