import type { Metadata } from "next";
import { SolucionesClient } from "@/components/pages/soluciones/SolucionesClient";
import { generatePageMetadata } from "@/utils/seo";
import type { Language } from "@/config/i18n.config";
import solucionesEs from "@/messages/es/soluciones.json";
import solucionesEn from "@/messages/en/soluciones.json";

interface SolucionesPageProps {
  params: Promise<{ locale: Language }>;
}

export async function generateMetadata({ params }: SolucionesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata(
    isEn ? "Energy Solutions — Solar Energy Canarias" : "Soluciones energéticas — Energía Solar Canarias",
    isEn
      ? "Custom renewable energy systems adapted to your operations. Photovoltaic, consulting, installation."
      : "Sistemas personalizados de energía renovable adaptados a tu operativa. Fotovoltaica, consultoría, instalación.",
  );
}

export default async function SolucionesPage({ params }: SolucionesPageProps) {
  const { locale } = await params;
  return <SolucionesClient messages={locale === "en" ? solucionesEn : solucionesEs} />;
}
