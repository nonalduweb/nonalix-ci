import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Audit SEO Gratuit par IA à Abidjan — Analysez Votre Site | NONALIX CI",
  description: "Audit SEO gratuit propulsé par l'IA pour les entreprises de Côte d'Ivoire et d'Afrique de l'Ouest. Analysez votre site web ou fiche Google Maps en 30 secondes. Score instantané, +50 critères et plan d'action pour dominer Google à Abidjan.",
  keywords: [
    "audit SEO gratuit Abidjan",
    "audit SEO Côte d'Ivoire",
    "analyse site web gratuit Abidjan",
    "audit Google Maps Abidjan",
    "référencement local Côte d'Ivoire",
    "outil SEO Afrique",
    "audit Google Business Abidjan",
    "score SEO site web",
  ],
  alternates: {
    canonical: '/audit-seo',
  },
  openGraph: {
    title: "Audit SEO Gratuit par IA — Boostez Votre Visibilité à Abidjan | NONALIX CI",
    description: "Analysez gratuitement votre site web ou fiche Google Maps avec notre IA. +50 critères SEO, score instantané et recommandations pour dominer Google en Côte d'Ivoire.",
    url: '/audit-seo',
  },
};

export default function AuditSeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
