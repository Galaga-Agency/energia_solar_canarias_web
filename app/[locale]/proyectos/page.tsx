import type { Metadata } from "next";
import { ProyectosClient } from "@/components/pages/proyectos/ProyectosClient";
import { generatePageMetadata } from "@/utils/seo";
import type { Language } from "@/config/i18n.config";
import proyectosEs from "@/messages/es/proyectos.json";
import proyectosEn from "@/messages/en/proyectos.json";

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
  );
}

export default async function ProyectosPage({ params }: ProyectosPageProps) {
  const { locale } = await params;
  const messages = locale === "en" ? proyectosEn : proyectosEs;
  return <ProyectosClient projects={messages.projects} messages={messages} />;
}
