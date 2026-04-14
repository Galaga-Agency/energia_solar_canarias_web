import type { Metadata } from "next";
import { HomeClient } from "@/components/pages/home/HomeClient";
import { generatePageMetadata } from "@/utils/seo";
import homeEs from "@/messages/es/home.json";
import homeEn from "@/messages/en/home.json";
import type { Language } from "@/config/i18n.config";

interface HomePageProps {
  params: Promise<{ locale: Language }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata(
    isEn
      ? "Solar Energy Canarias — Designing your energy independence"
      : "Energía Solar Canarias — Diseñamos tu independencia energética",
    isEn
      ? "Renewable energy solutions for businesses and homes in the Canary Islands. Free energy audit."
      : "Soluciones de energía renovable para empresas y hogares en Canarias. Auditoría energética gratuita.",
  );
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const messages = locale === "en" ? homeEn : homeEs;
  return <HomeClient messages={messages} />;
}
