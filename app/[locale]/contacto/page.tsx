import type { Metadata } from "next";
import { ContactoClient } from "@/components/pages/contacto/ContactoClient";
import { generatePageMetadata } from "@/utils/seo";
import type { Language } from "@/config/i18n.config";
import contactoEs from "@/messages/es/contacto.json";
import contactoEn from "@/messages/en/contacto.json";

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
  );
}

export default async function ContactoPage({ params }: ContactoPageProps) {
  const { locale } = await params;
  return <ContactoClient messages={locale === "en" ? contactoEn : contactoEs} />;
}
