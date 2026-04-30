"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "./Navbar";
import { MobileMenu } from "./MobileMenu";
import { stripLocaleFromPathname } from "@/config/i18n.config";

export function LocaleShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = stripLocaleFromPathname(pathname) === "/";
  const heroMode = isHome && !scrolled;

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <>
      <div
        className={`sticky top-0 z-70 lg:contents ${
          !heroMode && !menuOpen
            ? "max-lg:bg-(--color-bg) max-lg:border-b max-lg:border-(--color-border)"
            : ""
        }`}
      >
        <Navbar
          mobileMenuOpen={menuOpen}
          onMobileMenuToggle={() => setMenuOpen((v) => !v)}
        />
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
