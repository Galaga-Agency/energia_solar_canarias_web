import type { Metadata } from "next";
import { SolucionesClient } from "@/components/pages/soluciones/SolucionesClient";
import { generatePageMetadata } from "@/utils/seo";
import type { Language } from "@/config/i18n.config";
import { SITE_URL, SITE_NAME } from "@/config/site";
import solucionesEs from "@/locales/es/soluciones.json";
import solucionesEn from "@/locales/en/soluciones.json";

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
    { slug: 'soluciones' },
  );
}

export default async function SolucionesPage({ params }: SolucionesPageProps) {
  const { locale } = await params;
  const isEn = locale === "en";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/soluciones/#service`,
    name: isEn ? "Solar Energy Solutions" : "Soluciones de Energía Solar",
    description: isEn
      ? "Custom photovoltaic systems, energy storage and consulting for businesses and homes in the Canary Islands."
      : "Sistemas fotovoltaicos personalizados, almacenamiento y consultoría energética para empresas y hogares en Canarias.",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Place", name: "Islas Canarias" },
    serviceType: isEn ? "Renewable Energy" : "Energía Renovable",
    url: `${SITE_URL}/soluciones`,
    brand: { "@type": "Brand", name: SITE_NAME },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SolucionesClient messages={isEn ? solucionesEn : solucionesEs} />
    </>
  );
}
