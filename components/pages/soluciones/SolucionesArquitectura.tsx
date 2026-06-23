"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedBrandBlob } from "@/components/ui/AnimatedBrandBlob";

type Group = { name: string; items: string[] };
type Pilar = {
  key: string;
  num: string;
  tag: string;
  title: string;
  body: string;
  groups: Group[];
};

function splitTail(text: string): { lead: string; tail: string } {
  const trimmed = text.replace(/\.$/, "");
  const idx = trimmed.lastIndexOf(" ");
  if (idx === -1) return { lead: "", tail: text };
  const dot = text.endsWith(".") ? "." : "";
  return { lead: trimmed.slice(0, idx), tail: trimmed.slice(idx + 1) + dot };
}

export function SolucionesArquitectura() {
  const t = useTranslations("soluciones.arquitectura");
  const pilares = t.raw("items") as Pilar[];
  const tt = splitTail(t("titleLead") + " " + t("titleTail"));
  const [active, setActive] = useState(0);
  const current = pilares[active];
  const ttl = splitTail(current.title);
  const count = current.groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <section
      id="arquitectura"
      className="section-spacing relative isolate overflow-hidden bg-[#1f3a34] text-[#f4f1ea]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-35 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center bg-fixed"
      />

      {/* Living brand blob — fixed top offset (not %) so switching tabs,
          which changes section height, never makes it jump */}
      <AnimatedBrandBlob className="pointer-events-none absolute -right-[10%] top-32 z-0 h-auto w-[55%] opacity-30 md:-right-[4%] md:w-[34%]" />

      <div className="section-inner relative z-10">
        {/* Header */}
        <div className="max-w-[40ch]" data-reveal>
          <span className="text-label text-primary! mb-4 block">
            {t("eyebrow")}
          </span>
          <h2 className="text-title">
            {tt.lead}{" "}
            <em className="not-italic md:italic md:font-normal md:text-primary">
              {tt.tail}
            </em>
          </h2>
          <p className="mt-6 text-body text-ink/70">{t("body")}</p>
        </div>

        {/* Pillar selector — fixed-height row; active emphasis via transform
            (scale/colour) so switching tabs never reflows the layout */}
        <div
          role="tablist"
          aria-label={t("eyebrow")}
          className="mb-12 flex flex-wrap items-end gap-x-10 gap-y-6 md:mb-16 md:gap-x-16"
        >
          {pilares.map((p, i) => {
            const on = i === active;
            return (
              <button
                key={p.key}
                role="tab"
                aria-selected={on}
                aria-controls={`panel-${p.key}`}
                onClick={() => setActive(i)}
                className="group flex items-end gap-8 text-left"
              >
                <span
                  className={`origin-bottom font-bold leading-[0.8] tracking-[-0.06em] transition-all duration-500 ${
                    on
                      ? "text-[clamp(3.5rem,6vw,5.5rem)] text-primary"
                      : "text-[clamp(2rem,3.5vw,3rem)] text-ink/20 group-hover:text-ink/45"
                  }`}
                >
                  {p.num}
                </span>
                <span
                  className={`mb-2 max-w-[12ch] leading-tight tracking-tight transition-colors ${
                    on
                      ? "text-[clamp(1rem,1.3vw,1.25rem)] font-semibold text-ink"
                      : "text-[clamp(0.85rem,1vw,1rem)] text-ink/35 group-hover:text-ink/60"
                  }`}
                >
                  {p.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active pillar — editorial split */}
        <div
          key={current.key}
          id={`panel-${current.key}`}
          role="tabpanel"
          className="grid grid-cols-1 gap-12 motion-safe:animate-[arqfade_0.45s_ease-out] lg:grid-cols-[1fr_1.4fr] lg:gap-20"
        >
          {/* Left — the statement (secondary to the section title) */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h3 className="text-[clamp(1.6rem,2.4vw,2.2rem)] font-bold leading-[1.1] tracking-tight text-ink">
              {ttl.lead && <>{ttl.lead} </>}
              <em className="italic font-normal text-primary">{ttl.tail}</em>
            </h3>
            <p className="mt-5 max-w-[42ch] text-body text-ink/65">
              {current.body}
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-label font-mono text-primary!">
              <span className="h-px w-6 bg-primary/50" />
              {count} servicios
            </span>
          </div>

          {/* Right — grouped service catalogue, two tidy columns */}
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {current.groups.map((g) => (
              <div key={g.name}>
                <span className="text-label text-primary! mb-3 block border-b border-ink/15 pb-2">
                  {g.name}
                </span>
                <ul className="flex flex-col gap-2">
                  {g.items.map((s) => (
                    <li key={s} className="card-content text-ink/75!">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
