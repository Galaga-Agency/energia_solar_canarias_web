import type { Metadata } from "next";
import { SobreNosotrosClient } from "@/components/pages/sobre-nosotros/SobreNosotrosClient";
import { generatePageMetadata } from "@/utils/seo";
import type { Language } from "@/config/i18n.config";
import { SITE_URL, SITE_NAME } from "@/config/site";

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
    { slug: 'sobre-nosotros' },
  );
}

export default async function SobreNosotrosPage({ params }: SobreNosotrosPageProps) {
  const { locale } = await params;
  const isEn = locale === "en";

  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/sobre-nosotros/#page`,
    name: isEn ? "About Us" : "Sobre Nosotros",
    description: isEn
      ? "20 years building a more sustainable energy model in the Canary Islands."
      : "20 años construyendo un modelo energético más sostenible en Canarias.",
    url: `${SITE_URL}/sobre-nosotros`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: { "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SobreNosotrosClient />
    </>
  );
}
