"use client";

import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "./Navbar";

export function LocaleShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
