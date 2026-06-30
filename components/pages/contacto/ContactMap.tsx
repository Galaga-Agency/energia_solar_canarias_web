'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { CONTACT_INFO } from '@/constants/contact.constants'

// Office coordinates — C. las Mimosas, 65, 35118 Agüimes (Cuartería El Uno)
const OFFICE: [number, number] = [27.85958, -15.40419]

const MAPS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=' +
  encodeURIComponent(CONTACT_INFO.address)

export function ContactMap() {
  const t = useTranslations('contacto.section')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let map: import('leaflet').Map | null = null
    let cancelled = false

    Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]).then(([L]) => {
      if (cancelled || !ref.current || ref.current.dataset.ready) return
      ref.current.dataset.ready = 'true'

      map = L.map(ref.current, {
        center: OFFICE,
        zoom: 15,
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
      })

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', maxZoom: 20 },
      ).addTo(map)

      const icon = L.divIcon({
        className: '',
        html:
          '<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#e4572c;border:3px solid #f4f1ea;box-shadow:0 0 0 8px rgba(228,87,44,0.18)"></span>',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      })
      L.marker(OFFICE, { icon }).addTo(map)
    })

    return () => {
      cancelled = true
      map?.remove()
      if (ref.current) delete ref.current.dataset.ready
    }
  }, [])

  return (
    <section aria-label={CONTACT_INFO.address} className="relative isolate z-0">
      <div className="relative h-[clamp(20rem,40vh,30rem)] w-full overflow-hidden bg-(--color-bg) [&_.leaflet-bottom]:hidden [&_.leaflet-control-attribution]:hidden [&_.leaflet-control-container]:hidden [&_.leaflet-control]:hidden">
        {/* Leaflet map */}
        <div ref={ref} className="absolute inset-0 h-full w-full" />

        {/* Cover any stray tile attribution baked into the corners */}
        <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 z-1000 h-6 w-44 bg-(--color-bg)" />

        {/* Address + directions card */}
        <div className="absolute bottom-5 left-5 right-5 z-1000 flex flex-col gap-4 border border-ink/10 bg-[#f4f1ea]/95 p-6 shadow-[0_12px_40px_rgba(18,28,24,0.18)] backdrop-blur md:right-auto md:max-w-md md:p-7">
          <div>
            <span className="text-label font-mono text-primary! mb-2 block">Sede · Agüimes</span>
            <p className="text-body text-ink/80!">{CONTACT_INFO.address}</p>
          </div>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-2 border border-primary bg-primary px-5 py-3 text-label font-mono text-[#f4f1ea]! transition-colors hover:bg-primary-hover"
          >
            {t('directions')}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
