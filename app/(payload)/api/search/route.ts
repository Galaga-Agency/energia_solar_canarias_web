import { NextResponse } from "next/server"
import { searchArticles } from "@/lib/search"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q      = searchParams.get("q") ?? ""
  const limit  = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 12)))
  const locale = searchParams.get("locale") === "en" ? "en" : "es"

  if (!q.trim()) return NextResponse.json([])

  try {
    const hits = await searchArticles(q, limit, locale)
    return NextResponse.json(hits)
  } catch (e) {
    console.error("[search] error:", e)
    return NextResponse.json({ error: "search failed" }, { status: 500 })
  }
}
