import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Boutique — Packs Digitaux avec Paiement Orange Money & Wave",
  description: "Achetez nos packs de services digitaux en ligne à Abidjan : création de site web Next.js, SEO Côte d'Ivoire, automatisation IA, chatbot WhatsApp. Paiement sécurisé Orange Money, Wave ou MTN Mobile Money. Livraison rapide.",
  keywords: [
    "acheter pack site web Abidjan",
    "packs digitaux Orange Money",
    "services web paiement Wave",
    "boutique digitale Côte d'Ivoire",
    "pack SEO Abidjan",
    "pack marketing digital Mobile Money",
    "e-commerce services Abidjan",
  ],
  alternates: {
    canonical: '/boutique',
  },
  openGraph: {
    title: "Boutique NONALIX CI — Packs Digitaux, Paiement Orange Money & Wave",
    description: "Packs de services digitaux avec paiement Orange Money, Wave ou MTN. Création web, SEO, e-commerce et automatisation IA pour les entreprises de Côte d'Ivoire.",
    url: '/boutique',
  },
};

export default function BoutiqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
