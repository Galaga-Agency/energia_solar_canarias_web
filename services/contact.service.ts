import { API_CONFIG } from '@/config/api.config'
import { logger } from '@/utils/logger'

export interface ContactPayload {
  name:    string
  email:   string
  phone?:  string
  message: string
}

export interface ContactResult {
  success: boolean
  error?:  string
}

export async function submitContactForm(payload: ContactPayload): Promise<ContactResult> {
  try {
    const res = await fetch(`${API_CONFIG.baseUrl}/contact`, {
      method:  'POST',
      headers: API_CONFIG.headers,
      body:    JSON.stringify(payload),
      signal:  AbortSignal.timeout(API_CONFIG.timeout),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      logger.error('[contact.service] submit failed', res.status, text)
      return { success: false, error: `HTTP ${res.status}` }
    }

    return { success: true }
  } catch (err) {
    logger.error('[contact.service] submit error', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
