import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <p className="text-label mb-4">Error 404</p>
      <h1 className="text-title mb-6">Página no encontrada</h1>
      <p className="text-body mb-8 max-w-md">
        La página que buscas no existe o ha sido movida.
      </p>
      <Link
        href="/"
        className="btn-base btn-filled"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
