'use client'

import { usePathname } from 'next/navigation'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { getLocaleFromPathname } from '@/config/i18n.config'

const copy = {
  es: {
    eyebrow: 'Error 404',
    title: 'Página no encontrada',
    body: 'La página que buscas no existe o ha sido movida.',
    cta: 'Volver al inicio',
  },
  en: {
    eyebrow: 'Error 404',
    title: 'Page not found',
    body: 'The page you are looking for does not exist or has been moved.',
    cta: 'Back to home',
  },
}

export default function LocaleNotFound() {
  const pathname = usePathname()
  const locale   = getLocaleFromPathname(pathname)
  const t        = copy[locale] ?? copy.es

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <p className="text-label mb-4">{t.eyebrow}</p>
      <h1 className="text-title mb-6">{t.title}</h1>
      <p className="text-body mb-8 max-w-md">{t.body}</p>
      <TransitionLink href={`/${locale}`} className="btn-base btn-filled">
        {t.cta}
      </TransitionLink>
    </div>
  )
}
