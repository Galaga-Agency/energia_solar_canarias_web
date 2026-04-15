import Link from 'next/link'

// This file handles 404s that fall outside the [locale] segment.
// It cannot access locale context, so it renders bilingual static content.
export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <p className="text-label mb-4">Error 404</p>
      <h1 className="text-title mb-4">Página no encontrada</h1>
      <p className="text-body-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Page not found</p>
      <p className="text-body mb-8 max-w-md">
        La página que buscas no existe o ha sido movida.{' '}
        <span style={{ color: 'var(--color-text-muted)' }}>
          The page you are looking for does not exist or has been moved.
        </span>
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/" className="btn-base btn-filled">
          Inicio
        </Link>
        <Link href="/en" className="btn-base btn-outlined">
          English
        </Link>
      </div>
    </div>
  )
}
