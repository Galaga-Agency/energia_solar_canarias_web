import { BetaAnalyticsDataClient } from "@google-analytics/data"
import { headers as nextHeaders } from "next/headers"
import { getPayloadClient } from "@/lib/payload"

export const dynamic = "force-dynamic"

function getClient(): BetaAnalyticsDataClient | null {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  if (!raw) return null
  return new BetaAnalyticsDataClient({ credentials: JSON.parse(raw) })
}

const RANGES: Record<string, string> = {
  "7d": "7daysAgo",
  "28d": "28daysAgo",
  "90d": "90daysAgo",
  "365d": "365daysAgo",
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function resolveDates(params: URLSearchParams): { startDate: string; endDate: string } {
  const start = params.get("start")
  const end = params.get("end")
  if (start && end && ISO_DATE.test(start) && ISO_DATE.test(end)) {
    return { startDate: start, endDate: end }
  }
  const range = params.get("range")
  return { startDate: RANGES[range ?? "28d"] ?? RANGES["28d"], endDate: "today" }
}

export async function GET(request: Request) {
  // Guard with Payload's own session — same auth as the admin panel.
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await nextHeaders() })
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { startDate, endDate } = resolveDates(new URL(request.url).searchParams)

  const client = getClient()
  const property = process.env.GA4_PROPERTY_ID
  if (!client || !property) {
    return Response.json({ error: "GA4 not configured" }, { status: 503 })
  }

  try {
    const [summary] = await client.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
    })

    const [series] = await client.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    })

    const [topPages] = await client.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 6,
    })

    const [countriesReport] = await client.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 20,
    })

    const [citiesReport] = await client.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "city" }, { name: "country" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10,
    })

    const row = summary.rows?.[0]?.metricValues
    const seconds = row?.[3]?.value ? parseFloat(row[3].value) : 0

    return Response.json({
      configured: true,
      users: row?.[0]?.value ?? "0",
      pageviews: row?.[1]?.value ?? "0",
      bounceRate: row?.[2]?.value
        ? (parseFloat(row[2].value) * 100).toFixed(1) + "%"
        : "0%",
      avgSession: seconds
        ? `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`
        : "0m 0s",
      series: (series.rows ?? []).map((r) => ({
        date: r.dimensionValues?.[0]?.value ?? "",
        value: Number(r.metricValues?.[0]?.value ?? "0"),
      })),
      topPages: (topPages.rows ?? []).map((r) => ({
        path: r.dimensionValues?.[0]?.value ?? "—",
        views: r.metricValues?.[0]?.value ?? "0",
      })),
      countries: (countriesReport.rows ?? []).map((r) => ({
        name: r.dimensionValues?.[0]?.value ?? "—",
        users: Number(r.metricValues?.[0]?.value ?? "0"),
      })),
      cities: (citiesReport.rows ?? []).map((r) => ({
        city: r.dimensionValues?.[0]?.value ?? "—",
        country: r.dimensionValues?.[1]?.value ?? "—",
        users: r.metricValues?.[0]?.value ?? "0",
      })),
    })
  } catch {
    return Response.json({ error: "GA4 request failed" }, { status: 502 })
  }
}
