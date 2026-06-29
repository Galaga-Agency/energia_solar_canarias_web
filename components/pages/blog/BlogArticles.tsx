'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { PaperTexture } from '@/components/ui/PaperTexture'

const MouseReactiveFlock = dynamic(() => import('@/components/shared/MouseReactiveFlock').then(m => m.MouseReactiveFlock), { ssr: false })
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { splitLastWord } from '@/utils/text'
import type { Article } from '@/types/article'
import { initScrollRevealSections } from '@/utils/animations/scroll-reveal'
import { BlogTags, type TagWithCount } from './BlogTags'

interface BlogArticlesProps {
  articles: Article[]
  tags?: TagWithCount[]
  activeTag?: string | null
  searching?: boolean
  isSearchResult?: boolean
  onTagClick?: (slug: string) => void
}

const CAPTION_VARIANTS = [
  { bg: 'bg-[#d8cbb5]',                       dark: false },
  { bg: 'bg-[#1f3a34]',                       dark: true  },
  { bg: 'bg-[#f4f1ea] border border-ink/10',  dark: false },
] as const

function formatDate(iso: string, locale: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString(locale === 'en' ? 'en-GB' : 'es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

/* ── Image card with colored caption block ───────────────────────────────── */
function ImageCard({ article, variant, span }: { article: Article; variant: number; span: boolean }) {
  const t = useTranslations('blog')
  const locale = useLocale()
  const v = CAPTION_VARIANTS[variant % CAPTION_VARIANTS.length]
  const { lead, tail } = splitLastWord(article.title)

  return (
    <article data-reveal className={span ? 'md:col-span-2' : ''}>
      <TransitionLink
        href={`/blog/${article.slug}`}
        aria-label={article.title}
        className="keyboard-focus-ring group block h-full brand-radius overflow-hidden"
      >
        <div className={`flex h-full flex-col ${span ? 'md:flex-row' : ''}`}>
          <div className={`relative overflow-hidden bg-sand-200 ${span ? 'aspect-video md:aspect-auto md:w-1/2' : 'aspect-16/10'}`}>
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes={span ? '(min-width:768px) 45vw, 100vw' : '(min-width:768px) 30vw, 100vw'}
              className="object-cover transition-transform duration-1100 ease-out group-hover:scale-[1.04]"
              style={{ objectPosition: article.imagePosition ?? 'center' }}
            />
          </div>

          <figcaption className={`flex flex-1 flex-col p-6 ${v.bg} ${span ? 'md:w-1/2 md:justify-center md:p-8' : ''}`}>
            {article.categoryLabel && (
              <span className="font-mono text-[11px] uppercase italic tracking-[0.24em] text-primary md:text-[12px]">{article.categoryLabel}</span>
            )}
            <h3 className={`card-title mt-3 ${v.dark ? 'text-[#f4f1ea]!' : ''}`}>
              {lead && <>{lead} </>}
              <em className="not-italic md:italic md:font-normal md:text-primary">{tail}</em>
            </h3>
            <p className={`card-content mt-3 max-w-[42ch] ${v.dark ? 'text-[#f4f1ea]/72!' : 'text-ink/68!'}`}>{article.excerpt}</p>

            <div className={`mt-5 flex items-center justify-between gap-4 border-t pt-4 ${v.dark ? 'border-[#f4f1ea]/15' : 'border-ink/12'}`}>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase italic tracking-[0.22em] text-primary transition-all group-hover:gap-3">
                {t('readMore')} <span aria-hidden>↗</span>
              </span>
              {article.publishedAt && (
                <time dateTime={article.publishedAt} className={`shrink-0 font-mono text-[11px] tracking-widest ${v.dark ? 'text-[#f4f1ea]/45' : 'text-ink/35'}`}>
                  {formatDate(article.publishedAt, locale)}
                </time>
              )}
            </div>
          </figcaption>
        </div>
      </TransitionLink>
    </article>
  )
}

export function BlogArticles({ articles, tags = [], activeTag, searching = false, isSearchResult = false, onTagClick }: BlogArticlesProps) {
  const t           = useTranslations('blog')
  const articleKeys = articles.map((article) => article.id).join('|')

  useGSAPAnimations(() => ({
    timeout: [initScrollRevealSections],
  }), { dependencies: [articleKeys, isSearchResult] })

  return (
    <section className="section-spacing-both relative isolate overflow-hidden bg-bg">
      <PaperTexture className="z-0" />
      <MouseReactiveFlock className="pointer-events-none absolute inset-0 z-0 h-full w-full" birds={45} />
      <div className="section-inner relative z-10">
        {isSearchResult && (
          <p className="mb-10 text-label font-mono text-ink/45!">
            {searching ? t('search.searching') : t('search.results', { count: articles.length })}
          </p>
        )}

        {!isSearchResult && activeTag && (
          <div className="mb-10 flex items-center gap-4">
            <span className="text-label font-mono text-ink/45!">
              {t('tags.filtered', { count: articles.length, tag: tags.find((tg) => tg.slug === activeTag)?.name ?? activeTag })}
            </span>
            <button
              type="button"
              onClick={() => onTagClick?.(activeTag)}
              className="keyboard-focus-ring text-label font-mono text-primary! hover:underline"
            >
              {t('tags.clear')}
            </button>
          </div>
        )}

        {articles.length === 0 ? (
          <p className="text-body text-ink/55">{isSearchResult ? t('search.empty') : t('empty')}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(() => {
              // Colour assignment that avoids same-colour neighbours both horizontally
              // (previous card) and vertically (the card ~3 cells back, i.e. above).
              // Spanning cards occupy 2 cells, so we track a per-cell colour history.
              const COLS = 3
              const cellColors: number[] = [] // colour per grid cell, in flow order
              return articles.map((a, i) => {
                const span = !isSearchResult && (i === 0 || i % 6 === 0)
                const cell = cellColors.length
                const left  = cellColors[cell - 1]            // neighbour to the left
                const above = cellColors[cell - COLS]         // neighbour above
                let variant = 0
                for (let c = 0; c < CAPTION_VARIANTS.length; c++) {
                  if (c !== left && c !== above) { variant = c; break }
                }
                cellColors.push(variant)
                if (span) cellColors.push(variant) // span fills a second cell
                return <ImageCard key={a.id} article={a} variant={variant} span={span} />
              })
            })()}
          </div>
        )}

        {!isSearchResult && articles.length > 0 && (
          <p className="mt-14 text-label font-mono text-ink/35!">{t('comingSoon')}</p>
        )}

        {!isSearchResult && <BlogTags tags={tags} activeTag={activeTag} onTagClick={onTagClick} />}
      </div>
    </section>
  )
}
