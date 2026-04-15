import { ImageResponse } from 'next/og'
import { SITE_URL } from '@/config/site'

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = 'image/png'

export function buildOgImage(title: string, tagline: string): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width:           '100%',
          height:          '100%',
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  'space-between',
          backgroundColor: '#1f3a34',
          padding:         '60px 72px',
          fontFamily:      'system-ui, sans-serif',
        }}
      >
        {/* Top: brand name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '6px', height: '40px', backgroundColor: '#e4572c', borderRadius: '3px' }} />
          <span style={{ color: '#f4f1ea', fontSize: '22px', letterSpacing: '0.08em', opacity: 0.7 }}>
            ENERGÍA SOLAR CANARIAS
          </span>
        </div>

        {/* Center: title + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ width: '80px', height: '4px', backgroundColor: '#e4572c', borderRadius: '2px' }} />
          <div style={{ color: '#f4f1ea', fontSize: '64px', fontWeight: 700, lineHeight: 1.1, maxWidth: '900px' }}>
            {title}
          </div>
          <div style={{ color: '#f4f1ea', fontSize: '26px', opacity: 0.65, maxWidth: '700px', lineHeight: 1.4 }}>
            {tagline}
          </div>
        </div>

        {/* Bottom: URL */}
        <div style={{ color: '#f4f1ea', fontSize: '18px', opacity: 0.4, letterSpacing: '0.05em' }}>
          {SITE_URL.replace('https://', '').replace('http://', '')}
        </div>
      </div>
    ),
    { ...ogSize },
  )
}
