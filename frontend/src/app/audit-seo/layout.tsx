import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audit SEO Gratuit par IA — Analysez Votre Site Web',
  description:
    "Audit SEO gratuit propulsé par l'intelligence artificielle. Analysez votre site web ou fiche Google Business en 30 secondes. Score, recommandations et plan d'action personnalisé pour booster votre visibilité en Côte d'Ivoire.",
  alternates: {
    canonical: '/audit-seo',
  },
  openGraph: {
    title: 'Audit SEO Gratuit par IA — NONALIX CI',
    description:
      "Analysez gratuitement votre site web avec notre outil IA. +50 critères analysés, score instantané et recommandations personnalisées pour le marché ivoirien.",
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
