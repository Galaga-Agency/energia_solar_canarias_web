"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuToggle } from "@/components/layout/MenuToggle";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS } from "@/constants/nav.constants";
import {
  getLocaleFromPathname,
  getLocalizedHref,
  getLocalizedCanonicalPath,
  stripLocaleFromPathname,
} from "@/config/i18n.config";
import commonEs from "@/locales/es/common.json";
import commonEn from "@/locales/en/common.json";

interface NavbarProps {
  mobileMenuOpen:    boolean;
  onMobileMenuToggle: () => void;
}

export function Navbar({ mobileMenuOpen, onMobileMenuToggle }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const locale   = getLocaleFromPathname(pathname);
  const messages = locale === "en" ? commonEn : commonEs;
  const isHome   = stripLocaleFromPathname(pathname) === "/";

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <header
      style={{ height: "72px" }}
      className="lg:fixed lg:inset-x-0 lg:top-0 lg:z-70"
    >
      <div
        className={`relative navbar-shell navbar-shell-layout flex h-[72px] items-center gap-4 px-[clamp(1.5rem,5vw,4rem)] ${transparent ? "navbar-shell--hero" : "navbar-shell--scrolled"}`}
      >
        <TransitionLink
          href="/"
          aria-label="Energía Solar Canarias — inicio"
          className={`shrink-0 transition-opacity duration-500 ${transparent ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <Logo width={150} className="transition-all duration-300" />
        </TransitionLink>

        <nav
          aria-label="Navegación principal"
          className="navbar-desktop hidden lg:flex"
        >
          {NAV_LINKS.map(({ labelKey, href }) => {
            const localizedHref = getLocalizedHref(href, locale);
            const isActive =
              pathname === localizedHref ||
              pathname.startsWith(`${localizedHref}/`);
            return (
              <TransitionLink
                key={href}
                href={localizedHref}
                aria-current={isActive ? "page" : undefined}
                className={`navbar-link ${isActive ? "navbar-link--active" : ""} ${transparent ? "navbar-link--hero" : "navbar-link--scrolled"}`}
              >
                {messages.nav[labelKey]}
              </TransitionLink>
            );
          })}
        </nav>

        <div className="hidden lg:flex ml-auto items-center gap-6">
          <div
            className={`flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] transition-colors ${
              transparent ? "text-white/65" : "text-ink/55"
            }`}
          >
            {(["es", "en"] as const).map((loc, i) => {
              const active = loc === locale;
              const href   = getLocalizedCanonicalPath(pathname, loc);
              return (
                <span key={loc} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden className={transparent ? "text-white/30" : "text-ink/25"}>
                      |
                    </span>
                  )}
                  <Link
                    href={href}
                    aria-current={active ? "true" : undefined}
                    className={`transition-colors ${
                      active
                        ? transparent ? "text-white" : "text-primary"
                        : transparent ? "hover:text-white" : "hover:text-ink"
                    }`}
                  >
                    {loc.toUpperCase()}
                  </Link>
                </span>
              );
            })}
          </div>

          <div
            className={`transition-all duration-300 ${
              transparent
                ? "opacity-0 pointer-events-none -translate-y-1"
                : "opacity-100 translate-y-0"
            }`}
          >
            <Button
              variant="filled"
              href={getLocalizedHref("/contacto", locale)}
              className="px-5! py-2! text-sm!"
            >
              {messages.nav.cta}
            </Button>
          </div>
        </div>

        <div className="lg:hidden ml-auto">
          <MenuToggle
            open={mobileMenuOpen}
            onToggle={onMobileMenuToggle}
            heroMode={transparent}
          />
        </div>
      </div>
    </header>
  );
}
