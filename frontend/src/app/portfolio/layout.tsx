import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio — Nos Réalisations Web, E-commerce & IA',
  description:
    "Découvrez les projets réalisés par NONALIX CI : sites web modernes, boutiques e-commerce avec Mobile Money, chatbots IA et stratégies SEO pour entreprises en Côte d'Ivoire.",
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: 'Portfolio NONALIX CI — Réalisations Digitales en Côte d\'Ivoire',
    description:
      "Sites web, e-commerce, automatisation IA et campagnes SEO réalisés pour des entreprises ivoiriennes. Études de cas détaillées.",
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
