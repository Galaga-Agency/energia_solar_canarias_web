"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "./Navbar";
import { MobileMenu } from "./MobileMenu";

export function LocaleShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Navbar
        mobileMenuOpen={menuOpen}
        onMobileMenuToggle={() => setMenuOpen((v) => !v)}
      />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
