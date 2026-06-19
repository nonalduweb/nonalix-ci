import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boutique — Packs Marketing Digital & IA',
  description:
    "Achetez nos packs de services digitaux en ligne : création de site web, SEO, branding, automatisation IA. Paiement sécurisé par Mobile Money (Orange Money, Wave) en Côte d'Ivoire.",
  alternates: {
    canonical: '/boutique',
  },
  openGraph: {
    title: 'Boutique NONALIX CI — Packs Marketing Digital',
    description:
      "Packs de services digitaux avec paiement Mobile Money. Création web, SEO, branding et automatisation IA pour entreprises ivoiriennes.",
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
