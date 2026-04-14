import type { Metadata } from "next";
import { BlogClient } from "@/components/pages/blog/BlogClient";
import { generatePageMetadata } from "@/utils/seo";
import type { Language } from "@/config/i18n.config";
import blogEs from "@/messages/es/blog.json";
import blogEn from "@/messages/en/blog.json";

interface BlogPageProps {
  params: Promise<{ locale: Language }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata(
    isEn ? "Blog — Solar Energy Canarias" : "Blog — Energía Solar Canarias",
    isEn
      ? "Articles on renewable energy, Canarian regulations and energy sector trends."
      : "Artículos sobre energía renovable, normativas canarias y tendencias del sector energético.",
  );
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const messages = locale === "en" ? blogEn : blogEs;
  return <BlogClient articles={messages.articles} messages={messages} />;
}
