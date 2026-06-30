import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { LegalArticle } from "@/components/pages/legal/LegalArticle"
import { generatePageMetadata } from "@/utils/seo"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params
  const t = await getTranslations("legal.cookies")
  const meta = generatePageMetadata(t("title"), t("intro"), { slug: "cookies" })
  return { ...meta, robots: { index: false, follow: false } }
}

export default function CookiesPage() {
  return <LegalArticle section="cookies" />
}
