'use client'

import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/constants/nav.constants'
import { Button } from '@/components/ui/Button'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { HiArrowRight } from '@/components/ui/Icons'
import { getLocaleFromPathname, getLocalizedHref } from '@/config/i18n.config'
import commonEs from '@/locales/es/common.json'
import commonEn from '@/locales/en/common.json'

interface MobileMenuProps {
  open:    boolean
  onClose: () => void
  headerHeight: number
  onHeightChange?: (height: number) => void
}

export function MobileMenu({ open, onClose, headerHeight, onHeightChange }: MobileMenuProps) {
  const pathname = usePathname()
  const locale   = getLocaleFromPathname(pathname)
  const messages = locale === 'en' ? commonEn : commonEs
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(open)
  const panelRef = useRef<HTMLDivElement>(null)
  const itemCount = NAV_LINKS.length + 1
  const getStaggerStyle = (index: number) => ({ ['--menu-index' as string]: index }) as CSSProperties

  useEffect(() => {
    if (open) {
      setMounted(true)
      const frame = window.requestAnimationFrame(() => setVisible(true))
      document.body.style.overflow = 'hidden'
      return () => window.cancelAnimationFrame(frame)
    }

    setVisible(false)
    document.body.style.overflow = ''

    const timeout = window.setTimeout(() => {
      setMounted(false)
    }, 700)

    return () => window.clearTimeout(timeout)
  }, [open])

  useEffect(() => {
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (!mounted || !panelRef.current || !onHeightChange) return

    const updateHeight = () => {
      onHeightChange(panelRef.current?.offsetHeight ?? 0)
    }

    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(panelRef.current)

    return () => observer.disconnect()
  }, [mounted, onHeightChange, visible])

  useEffect(() => {
    if (!open && onHeightChange) {
      onHeightChange(0)
    }
  }, [open, onHeightChange])

  if (!mounted) return null

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      data-state={visible ? 'open' : 'closed'}
      style={{
        ['--mobile-header-height' as string]: `${headerHeight}px`,
        ['--mobile-menu-count' as string]: itemCount,
      } as CSSProperties}
      className="mobile-menu-shell fixed inset-0 overflow-hidden md:hidden z-99"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="mobile-menu-backdrop absolute inset-0"
      />

      <div ref={panelRef} className="mobile-menu-panel absolute inset-x-0 top-0 flex max-h-[100svh] flex-col overflow-y-auto bg-bg px-6 pb-6 pt-[calc(var(--mobile-header-height)+1.25rem)] sm:px-8 sm:pb-8 sm:pt-[calc(var(--mobile-header-height)+1.5rem)]">
        <nav
          aria-label="Menú móvil"
          className="mobile-menu-nav flex flex-col"
        >
          {[{ labelKey: 'home' as const, href: '/' }, ...NAV_LINKS].map(({ labelKey, href }, i) => {
            const localizedHref = getLocalizedHref(href, locale)
            const isActive      = pathname === localizedHref || pathname.startsWith(`${localizedHref}/`)

            return (
              <TransitionLink
                key={href}
                href={localizedHref}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className="mobile-menu-link group flex items-center justify-between [-webkit-tap-highlight-color:transparent]"
                style={getStaggerStyle(i)}
              >
                <div className="flex items-baseline">
                  <span
                    className="mobile-menu-label font-normal leading-[1.05] tracking-tight transition-colors duration-200"
                    style={{ fontSize: 'var(--text-2xl)' }}
                  >
                    {messages.nav[labelKey]}
                  </span>
                </div>
                <HiArrowRight
                  aria-hidden="true"
                  className={`mobile-menu-arrow h-5 w-5 shrink-0 transition-all duration-200 ${isActive ? 'text-primary' : 'text-surface group-hover:text-primary'}`}
                />
              </TransitionLink>
            )
          })}
        </nav>

        <div
          className="mobile-menu-cta pt-4 sm:pt-5 [-webkit-tap-highlight-color:transparent]"
          style={getStaggerStyle(itemCount)}
        >
          <Button variant="filled" href={getLocalizedHref('/contacto', locale)} onClick={onClose} className="w-full justify-center">
            {messages.nav.cta}
          </Button>
        </div>
      </div>
    </div>
  )
}
