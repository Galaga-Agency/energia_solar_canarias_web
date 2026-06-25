import { getPayload } from "payload"
import configPromise from "@payload-config"

type PayloadClient = Awaited<ReturnType<typeof getPayload>>

const globalForPayload = globalThis as typeof globalThis & {
  _payloadClient: PayloadClient | null
  _payloadPromise: Promise<PayloadClient> | null
}

if (!globalForPayload._payloadClient)  globalForPayload._payloadClient  = null
if (!globalForPayload._payloadPromise) globalForPayload._payloadPromise = null

export async function getPayloadClient(): Promise<PayloadClient> {
  if (globalForPayload._payloadClient) return globalForPayload._payloadClient

  if (!globalForPayload._payloadPromise) {
    globalForPayload._payloadPromise = getPayload({ config: configPromise })
  }

  try {
    globalForPayload._payloadClient = await globalForPayload._payloadPromise
  } catch (e) {
    globalForPayload._payloadPromise = null
    throw e
  }

  return globalForPayload._payloadClient
}
