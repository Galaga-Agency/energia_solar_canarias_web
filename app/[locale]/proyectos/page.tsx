import type { Metadata } from "next";
import { ProyectosClient } from "@/components/pages/proyectos/ProyectosClient";
import { generatePageMetadata } from "@/utils/seo";
import type { Language } from "@/config/i18n.config";
import { SITE_URL } from "@/config/site";
import proyectosEs from "@/locales/es/proyectos.json";
import proyectosEn from "@/locales/en/proyectos.json";

interface ProyectosPageProps {
  params: Promise<{ locale: Language }>;
}

export async function generateMetadata({ params }: ProyectosPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata(
    isEn ? "Projects — Solar Energy Canarias" : "Proyectos — Energía Solar Canarias",
    isEn
      ? "Success stories of companies that have transformed their energy model with us."
      : "Casos de éxito de empresas que han transformado su modelo energético con Energía Solar Canarias.",
    { slug: 'proyectos' },
  );
}

export default async function ProyectosPage({ params }: ProyectosPageProps) {
  const { locale } = await params;
  const isEn = locale === "en";
  const messages = isEn ? proyectosEn : proyectosEs;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/proyectos/#page`,
    name: isEn ? "Our Projects" : "Nuestros Proyectos",
    description: isEn
      ? "Success stories of companies that have transformed their energy model in the Canary Islands."
      : "Casos de éxito de empresas que han transformado su modelo energético en Canarias.",
    url: `${SITE_URL}/proyectos`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProyectosClient projects={messages.projects} messages={messages} />
    </>
  );
}
