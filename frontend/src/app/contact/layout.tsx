import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contactez-nous — Devis Gratuit Site Web & IA à Abidjan",
  description: "Contactez NONALIX CI pour un devis gratuit. Création de sites web, SEO, e-commerce Orange Money & Wave, chatbot IA WhatsApp à Abidjan, Côte d'Ivoire. Réponse sous 24h via WhatsApp ou email.",
  keywords: [
    "contact agence web Abidjan",
    "devis site web Côte d'Ivoire gratuit",
    "devis développement web Abidjan",
    "contacter agence digitale Abidjan",
    "devis SEO Abidjan",
    "devis e-commerce Côte d'Ivoire",
    "WhatsApp agence web Abidjan",
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: "Contactez NONALIX CI — Devis Gratuit à Abidjan",
    description: "Demandez votre devis gratuit pour un site web, SEO, e-commerce ou chatbot IA. Agence digitale à Abidjan, Côte d'Ivoire. Réponse rapide via WhatsApp.",
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
