'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/shared/Logo'
import { PaperTexture } from '@/components/ui/PaperTexture'

const EXIT_MS = 700
const MIN_SHOW_MS = 800 // graceful minimum so the loader reads as intentional, not a flash

/** Local article loader — covers the article until `ready` AND a minimum show
 *  time, then fades up and unmounts. Prevents the hero-image / body pop-in flash. */
export function ArticleLoader({ ready }: { ready: boolean }) {
  const t = useTranslations('blog')
  const [phase, setPhase] = useState<'visible' | 'exiting' | 'gone'>('visible')
  const [minElapsed, setMinElapsed] = useState(false)

  useEffect(() => {
    const m = setTimeout(() => setMinElapsed(true), MIN_SHOW_MS)
    return () => clearTimeout(m)
  }, [])

  useEffect(() => {
    if (!ready || !minElapsed) return
    setPhase('exiting')
    const gone = setTimeout(() => setPhase('gone'), EXIT_MS)
    return () => clearTimeout(gone)
  }, [ready, minElapsed])

  if (phase === 'gone') return null

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-overlay overflow-hidden bg-bg transition-[opacity,transform] ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{
        opacity: phase === 'exiting' ? 0 : 1,
        transform: phase === 'exiting' ? 'translateY(-1.5rem)' : 'translateY(0)',
        transitionDuration: `${EXIT_MS}ms`,
      }}
    >
      <PaperTexture opacityClassName="opacity-30" />
      {/* Sticky viewport-height panel so the content centers in the fold even on tall articles */}
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div className="relative flex w-full max-w-104 flex-col items-center gap-7 px-6">
          <Logo width={150} />
          <div className="relative h-px w-full overflow-hidden bg-ink/15">
            <span className="absolute inset-y-0 left-0 w-1/3 animate-[loader-sweep_1.1s_ease-in-out_infinite] bg-primary" />
          </div>
          <span className="flex items-center gap-2 text-label font-mono text-ink/55!">
            <span aria-hidden className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
            {t('loading')}
          </span>
        </div>
      </div>
    </div>
  )
}
