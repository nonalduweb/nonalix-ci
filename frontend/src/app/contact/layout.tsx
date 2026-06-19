import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contactez-nous — Agence Digitale à Abidjan',
  description:
    "Contactez NONALIX CI pour discuter de votre projet digital en Côte d'Ivoire. Devis gratuit sous 24h. Téléphone, email, WhatsApp ou rendez-vous à Abidjan Cocody.",
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contactez NONALIX CI — Agence Digitale Abidjan',
    description:
      "Demandez un devis gratuit pour votre projet web, e-commerce ou automatisation IA. Réponse en 24h depuis Abidjan.",
    url: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
