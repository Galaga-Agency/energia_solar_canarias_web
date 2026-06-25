'use client'

import dynamic                          from 'next/dynamic'
import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useLocale, useTranslations }   from 'next-intl'
import { usePageReady }                 from '@/hooks/usePageReady'
import { useGSAPAnimations }            from '@/hooks/useGSAPAnimations'
import { BlogHero }                     from '@/components/pages/blog/BlogHero'
import { BlogSearch }                   from '@/components/pages/blog/BlogSearch'
import { Breadcrumbs }                  from '@/components/shared/Breadcrumbs'
import type { Article, CategoryInfo }   from '@/types/article'
import { initHeroAnimations }           from '@/utils/animations/hero-animations'

const BlogFilterBar = dynamic(() => import('./BlogFilterBar').then(m => m.BlogFilterBar))
const BlogArticles  = dynamic(() => import('./BlogArticles').then(m => m.BlogArticles))

const ALL = '__all__'

interface BlogClientProps {
  articles:   Article[]
  categories: CategoryInfo[]
}

export function BlogClient({ articles, categories }: BlogClientProps) {
  usePageReady()
  const nav = useTranslations('nav')

  const [category, setCategory]   = useState(ALL)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [query, setQuery]         = useState('')
  const [searchSlugs, setSearchSlugs] = useState<string[] | null>(null)
  const [searching, setSearching] = useState(false)

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
  }))

  const locale = useLocale()
  const abortRef = useRef<AbortController | null>(null)

  // Debounced semantic search — single source of truth, driven by `query`.
  useEffect(() => {
    const q = query.trim()
    if (!q) {
      abortRef.current?.abort()
      setSearching(false)
      setSearchSlugs(null)
      return
    }
    setSearching(true)
    const handle = setTimeout(async () => {
      abortRef.current?.abort()
      const ctrl = new AbortController()
      abortRef.current = ctrl
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&locale=${locale}&limit=24`, { signal: ctrl.signal })
        const hits: { slug: string }[] = await res.json()
        setSearchSlugs(Array.isArray(hits) ? hits.map((h) => h.slug) : [])
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setSearchSlugs([])
      } finally {
        setSearching(false)
      }
    }, 280)
    return () => clearTimeout(handle)
  }, [query, locale])

  const onTagClick = useCallback((slug: string) => {
    setActiveTag((prev) => (prev === slug ? null : slug))
    setQuery('')
    setCategory(ALL)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const a of articles) c[a.category] = (c[a.category] ?? 0) + 1
    return c
  }, [articles])

  const tags = useMemo(() => {
    const map = new Map<string, { name: string; slug: string; count: number }>()
    for (const a of articles) {
      for (const tag of a.tags ?? []) {
        const entry = map.get(tag.slug)
        if (entry) entry.count += 1
        else map.set(tag.slug, { name: tag.name, slug: tag.slug, count: 1 })
      }
    }
    return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [articles])

  const isSearching = searchSlugs !== null

  const visible = useMemo(() => {
    if (isSearching) {
      const order = new Map(searchSlugs!.map((s, i) => [s, i]))
      return articles
        .filter((a) => order.has(a.slug))
        .sort((a, b) => (order.get(a.slug)! - order.get(b.slug)!))
    }
    if (activeTag) return articles.filter((a) => (a.tags ?? []).some((tg) => tg.slug === activeTag))
    return category === ALL ? articles : articles.filter((a) => a.category === category)
  }, [articles, category, activeTag, isSearching, searchSlugs])

  return (
    <>
      <Breadcrumbs items={[
        { label: nav('home'), href: '/' },
        { label: nav('blog'), href: '/blog' },
      ]} />
      <BlogHero>
        <BlogSearch value={query} onChange={setQuery} />
      </BlogHero>
      {!isSearching && (
        <BlogFilterBar
          category={category}
          categories={categories}
          allValue={ALL}
          counts={counts}
          total={articles.length}
          onCategoryChange={(c) => { setActiveTag(null); setCategory(c) }}
        />
      )}
      <BlogArticles
        articles={visible}
        tags={tags}
        activeTag={activeTag}
        searching={searching}
        isSearchResult={isSearching}
        onTagClick={onTagClick}
      />
    </>
  )
}
