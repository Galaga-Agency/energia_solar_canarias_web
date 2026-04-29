"use client";

import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar2 } from "./Navbar2";

export function LocaleShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar2 />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
