"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { splitTail } from "@/utils/text";

type Group = { name: string; items: string[] };
type Pilar = {
  key: string;
  num: string;
  tag: string;
  title: string;
  body: string;
  groups: Group[];
};

export function SolucionesArquitectura() {
  const t = useTranslations("soluciones.arquitectura");
  const pilares = t.raw("items") as Pilar[];
  const tt = splitTail(t("titleLead") + " " + t("titleTail"));
  // Accordion — only one open at a time. Click open row to collapse it.
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIndex((cur) => (cur === i ? null : i));

  return (
    <section
      id="arquitectura"
      className="relative isolate overflow-hidden bg-[#1f3a34] text-[#f4f1ea]"
    >

      <div className="relative z-10">
        {/* Header */}
        <div className="section-inner pt-[clamp(4rem,8vw,8rem)] pb-12 max-w-[44ch] md:pb-16" data-reveal>
          <span className="text-label text-primary! mb-4 block">{t("eyebrow")}</span>
          <h2 className="text-title text-[#f4f1ea]!">
            {tt.lead}{" "}
            <em className="not-italic md:italic md:font-normal md:text-primary">
              {tt.tail}
            </em>
          </h2>
          <p className="mt-6 text-body text-[#f4f1ea]/85!">{t("body")}</p>
        </div>

        {/* Full-span accordion rows — edge to edge, active expands inline */}
        <div className="border-t border-[#f4f1ea]/15">
          {pilares.map((p, i) => {
            const on = openIndex === i;
            const ttl = splitTail(p.title);
            const count = p.groups.reduce((n, g) => n + g.items.length, 0);
            return (
              <div
                key={p.key}
                className="border-b border-[#f4f1ea]/15"
              >
                {/* Row header — full width, clickable */}
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => toggle(i)}
                  className="group block w-full text-left"
                >
                  <div className="section-inner flex items-center gap-6 py-7 md:gap-10 md:py-9">
                    <span
                      className={`shrink-0 font-bold leading-none tracking-[-0.05em] transition-colors text-[clamp(1.6rem,2.6vw,2.4rem)] ${
                        on ? "text-primary" : "text-[#f4f1ea]/55 group-hover:text-[#f4f1ea]/80"
                      }`}
                    >
                      {p.num}
                    </span>
                    <span
                      className={`flex-1 font-bold leading-tight tracking-tight transition-colors text-[clamp(1.3rem,2.2vw,2rem)] ${
                        on ? "text-[#f4f1ea]" : "text-[#f4f1ea]/75 group-hover:text-[#f4f1ea]"
                      }`}
                    >
                      {p.tag}
                    </span>
                    <span className="hidden shrink-0 text-label font-mono text-[#f4f1ea]/40! md:block">
                      {count} servicios
                    </span>
                    <span
                      aria-hidden
                      className={`shrink-0 text-primary transition-transform duration-300 ${on ? "rotate-180" : ""}`}
                    >
                      ↓
                    </span>
                  </div>
                </button>

                {/* Expanding body — full-bleed band */}
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out ${
                    on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0">
                    <div className="section-inner grid grid-cols-1 gap-x-16 gap-y-10 pb-16 lg:grid-cols-[0.85fr_2fr]">
                      {/* Statement — set apart with a left accent rule */}
                      <div className="border-l-2 border-primary pl-6">
                        <h3 className="text-[clamp(1.4rem,2vw,1.9rem)] font-bold leading-[1.1] tracking-tight text-[#f4f1ea] max-w-[20ch]">
                          {ttl.lead && <>{ttl.lead} </>}
                          <em className="italic font-normal text-primary">{ttl.tail}</em>
                        </h3>
                        <p className="mt-4 max-w-[40ch] text-body text-[#f4f1ea]/85!">{p.body}</p>
                      </div>

                      {/* Catalogue — numbered groups, scannable rows */}
                      <div className="grid grid-cols-1 gap-x-12 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
                        {p.groups.map((g, gi) => (
                          <div key={g.name}>
                            <div className="mb-4 flex items-baseline gap-2 border-b border-[#f4f1ea]/20 pb-2">
                              <span className="text-label font-mono text-primary!">
                                {String(gi + 1).padStart(2, "0")}
                              </span>
                              <span className="text-label text-[#f4f1ea]!">{g.name}</span>
                            </div>
                            <ul className="flex flex-col">
                              {g.items.map((s) => (
                                <li
                                  key={s}
                                  className="card-content text-[#f4f1ea]/85! flex items-start gap-3 border-b border-[#f4f1ea]/8 py-2 last:border-b-0"
                                >
                                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 bg-primary" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
