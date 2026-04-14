import type { Metadata } from "next";
import { SobreNosotrosClient } from "@/components/pages/sobre-nosotros/SobreNosotrosClient";
import { generatePageMetadata } from "@/utils/seo";
import type { Language } from "@/config/i18n.config";
import sobreNosotrosEs from "@/messages/es/sobre-nosotros.json";
import sobreNosotrosEn from "@/messages/en/sobre-nosotros.json";

interface SobreNosotrosPageProps {
  params: Promise<{ locale: Language }>;
}

export async function generateMetadata({ params }: SobreNosotrosPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata(
    isEn ? "About us — Solar Energy Canarias" : "Sobre nosotros — Energía Solar Canarias",
    isEn
      ? "20 years building a more sustainable energy model in the Canary Islands. Led by Carla Isarí Díaz Ortega."
      : "20 años construyendo un modelo energético más sostenible en Canarias. Liderado por Carla Isarí Díaz Ortega.",
  );
}

export default async function SobreNosotrosPage({ params }: SobreNosotrosPageProps) {
  const { locale } = await params;
  return <SobreNosotrosClient messages={locale === "en" ? sobreNosotrosEn : sobreNosotrosEs} />;
}
