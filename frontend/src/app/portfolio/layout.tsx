import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Portfolio — Réalisations Web, E-commerce & IA à Abidjan | NONALIX CI",
  description: "Découvrez les projets réalisés par NONALIX CI à Abidjan : sites web Next.js, boutiques e-commerce Orange Money & Wave, chatbots IA WhatsApp et campagnes SEO pour entreprises en Côte d'Ivoire et en Afrique de l'Ouest.",
  keywords: [
    "portfolio agence web Abidjan",
    "réalisations sites web Côte d'Ivoire",
    "projets e-commerce Abidjan",
    "exemples sites web Côte d'Ivoire",
    "études de cas SEO Abidjan",
    "références agence digitale Abidjan",
  ],
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: "Portfolio NONALIX CI — Sites Web, E-commerce & IA à Abidjan",
    description: "Sites web, boutiques e-commerce Mobile Money, chatbots IA et SEO réalisés pour des entreprises en Côte d'Ivoire et en Afrique de l'Ouest. Résultats concrets et mesurables.",
    url: '/portfolio',
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
