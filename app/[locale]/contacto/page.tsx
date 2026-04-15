import type { Metadata } from "next";
import { ContactoClient } from "@/components/pages/contacto/ContactoClient";
import { generatePageMetadata } from "@/utils/seo";
import type { Language } from "@/config/i18n.config";
import { SITE_URL } from "@/config/site";
import contactoEs from "@/locales/es/contacto.json";
import contactoEn from "@/locales/en/contacto.json";

interface ContactoPageProps {
  params: Promise<{ locale: Language }>;
}

export async function generateMetadata({ params }: ContactoPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata(
    isEn ? "Contact — Solar Energy Canarias" : "Contacto — Energía Solar Canarias",
    isEn
      ? "Talk to our team in Agüimes, Las Palmas. Request your free energy audit."
      : "Habla con nuestro equipo en Agüimes, Las Palmas. Solicita tu auditoría energética gratuita.",
    { slug: 'contacto' },
  );
}

export default async function ContactoPage({ params }: ContactoPageProps) {
  const { locale } = await params;
  const isEn = locale === "en";

  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contacto/#page`,
    name: isEn ? "Contact Us" : "Contacto",
    description: isEn
      ? "Talk to our team in Agüimes, Las Palmas. Request your free energy audit."
      : "Habla con nuestro equipo en Agüimes, Las Palmas. Solicita tu auditoría energética gratuita.",
    url: `${SITE_URL}/contacto`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ContactoClient messages={isEn ? contactoEn : contactoEs} />
    </>
  );
}
