'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import type { Project } from '@/types/project'

/**
 * Each case study is composed DIFFERENTLY so the page never reads as a uniform
 * list. Layouts cycle: full-bleed image w/ overlaid panel · offset split ·
 * tall image w/ side panel · wide image w/ content below. Brand colours rotate.
 */

const PANEL = [
  { bg: 'bg-[#1f3a34]', text: 'text-[#f4f1ea]', sub: 'text-[#f4f1ea]/65!', rule: 'border-[#f4f1ea]/15' },
  { bg: 'bg-[#d8cbb5]', text: 'text-ink',       sub: 'text-ink/60!',       rule: 'border-ink/15' },
  { bg: 'bg-[#1c1c1a]', text: 'text-[#f4f1ea]', sub: 'text-[#f4f1ea]/65!', rule: 'border-[#f4f1ea]/15' },
] as const

function Index({ n, className }: { n: number; className?: string }) {
  return (
    <span aria-hidden className={`pointer-events-none select-none text-stat font-[700] leading-none ${className}`}>
      {String(n).padStart(2, '0')}
    </span>
  )
}

function Meta({ project, sub }: { project: Project; sub: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-label text-primary!">{project.service}</span>
      <span className={`text-label ${sub}`}>{project.sector}</span>
    </div>
  )
}

type Tone = { bg: string; text: string; sub: string; rule: string }

function Body({ project, p }: { project: Project; p: Tone }) {
  const t = useTranslations('proyectos.grid')
  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className={`text-label ${p.sub}`}>{t('challenge')}</span>
        <p className={`mt-2 max-w-[48ch] text-body ${p.sub}`}>{project.challenge}</p>
      </div>
      <div>
        <span className="text-label text-primary!">{t('solution')}</span>
        <p className={`mt-2 max-w-[48ch] text-body ${p.text}!`}>{project.solution}</p>
      </div>
      <div className={`border-t ${p.rule} pt-6`}>
        <span className={`text-label ${p.sub}`}>{t('result')}</span>
        <p className={`mt-2 max-w-[48ch] text-subheading ${p.text}!`}>{project.result}</p>
      </div>
    </div>
  )
}

function CaseStudy({ project, index }: { project: Project; index: number }) {
  const p      = PANEL[index % PANEL.length]
  const layout = index % 4

  // ── Layout 0 — FULL-BLEED image, content in a floating panel bottom-left ──
  if (layout === 0) {
    return (
      <article data-proyecto-card className="relative isolate min-h-svh overflow-hidden">
        <Image src={project.image} alt={project.title} fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(110deg,rgba(15,24,20,0.92)_0%,rgba(15,24,20,0.5)_45%,transparent_100%)]" />
        <Index n={index + 1} className="absolute right-8 top-8 text-white/80 md:right-14 md:top-12" />
        <div className="section-inner relative z-10 flex min-h-svh flex-col justify-end py-[clamp(3rem,7vw,6rem)]">
          <div className="max-w-2xl">
            <Meta project={project} sub="text-[#f4f1ea]/55!" />
            <h3 className="text-title mt-6 max-w-[16ch] text-[#f4f1ea]!">{project.title}</h3>
            <div className="mt-10 text-[#f4f1ea]">
              <Body project={project} p={PANEL[0]} />
            </div>
          </div>
          <span className="mt-10 w-fit bg-primary px-6 py-4 text-subheading text-white!">{project.metric}</span>
        </div>
      </article>
    )
  }

  // ── Layout 1 — OFFSET SPLIT: colored panel + image, image bleeds past edge ──
  if (layout === 1) {
    return (
      <article data-proyecto-card className="relative grid grid-cols-1 lg:grid-cols-12 lg:items-stretch">
        <div className={`flex flex-col justify-center p-8 md:p-14 lg:order-1 lg:col-span-6 lg:p-16 ${p.bg}`}>
          <div className="flex items-baseline gap-5">
            <Index n={index + 1} className="text-primary!" />
            <Meta project={project} sub={p.sub} />
          </div>
          <h3 className={`text-title mt-7 max-w-[18ch] ${p.text}!`}>{project.title}</h3>
          <div className="mt-10">
            <Body project={project} p={p} />
          </div>
        </div>
        <div className="relative min-h-[50vh] overflow-hidden lg:order-2 lg:col-span-6 lg:min-h-0">
          <Image src={project.image} alt={project.title} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          <span className="absolute bottom-0 right-0 bg-primary px-6 py-4 text-subheading text-white!">{project.metric}</span>
        </div>
      </article>
    )
  }

  // ── Layout 2 — TALL portrait image left, generous content right ──
  if (layout === 2) {
    return (
      <article data-proyecto-card className="section-inner grid grid-cols-1 items-center gap-x-16 gap-y-10 py-[clamp(4rem,9vw,8rem)] lg:grid-cols-12">
        <figure className="relative lg:col-span-5">
          <div className="relative aspect-3/4 w-full overflow-hidden">
            <Image src={project.image} alt={project.title} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <span className="absolute -bottom-5 left-6 bg-primary px-6 py-4 text-subheading text-white!">{project.metric}</span>
        </figure>
        <div className="lg:col-span-7">
          <div className="flex items-baseline gap-5">
            <Index n={index + 1} className="text-primary!" />
            <Meta project={project} sub="text-ink/45!" />
          </div>
          <h3 className="text-title mt-7 max-w-[18ch] text-ink!">{project.title}</h3>
          <div className="mt-10 text-ink">
            <Body project={project} p={{ bg: '', text: 'text-ink', sub: 'text-ink/60!', rule: 'border-ink/15' }} />
          </div>
        </div>
      </article>
    )
  }

  // ── Layout 3 — WIDE cinematic image, content in a band below ──
  return (
    <article data-proyecto-card className="relative">
      <div className="relative h-[60vh] w-full overflow-hidden">
        <Image src={project.image} alt={project.title} fill sizes="100vw" className="object-cover" />
        <Index n={index + 1} className="absolute left-8 top-8 text-white/85 md:left-14 md:top-12" />
        <span className="absolute bottom-0 left-0 bg-primary px-6 py-4 text-subheading text-white!">{project.metric}</span>
      </div>
      <div className={`${p.bg}`}>
        <div className="section-inner grid grid-cols-1 gap-x-16 gap-y-8 py-[clamp(3rem,6vw,5rem)] lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Meta project={project} sub={p.sub} />
            <h3 className={`text-title mt-6 max-w-[16ch] ${p.text}!`}>{project.title}</h3>
          </div>
          <div className="lg:col-span-7">
            <Body project={project} p={p} />
          </div>
        </div>
      </div>
    </article>
  )
}

export function ProyectosGrid({ projects }: { projects: Project[] }) {
  const t = useTranslations('proyectos.grid')

  return (
    <section className="relative isolate overflow-hidden">
      <div className="flex flex-col">
        {projects.map((p, i) => (
          <CaseStudy key={p.id} project={p} index={i} />
        ))}
      </div>

      <div className="bg-bg py-20 text-center md:py-28">
        <Button variant="filled" href="/contacto">{t('seeAll')} <span aria-hidden>↗</span></Button>
      </div>
    </section>
  )
}
