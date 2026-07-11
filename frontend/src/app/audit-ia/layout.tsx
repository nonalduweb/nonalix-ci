import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Audit IA Gratuit pour Entreprise — Score d'Automatisation & ROI",
  description: "Faites auditer gratuitement votre entreprise par notre Intelligence Artificielle en 5 minutes. Obtenez votre score d'automatisation, l'estimation précise de vos pertes financières et votre plan d'action personnalisé avec NONALIX CI à Abidjan.",
  keywords: [
    "audit IA gratuit",
    "audit intelligence artificielle Côte d'Ivoire",
    "automatisation IA Abidjan",
    "ROI automatisation entreprise",
    "agent IA conversationnel",
    "workflow n8n Abidjan",
    "transformation digitale Afrique",
    "chatbot WhatsApp business",
    "gains de productivité IA",
    "Nonalix CI audit",
  ],
  alternates: {
    canonical: '/audit-ia',
  },
  openGraph: {
    title: "Audit IA Gratuit pour Entreprise — Score d'Automatisation & ROI | NONALIX CI",
    description: "Découvrez en 5 minutes comment l'Intelligence Artificielle peut automatiser vos tâches répétitives, réduire vos coûts de 75% et propulser votre croissance. Rapport et plan d'action immédiats.",
    url: '/audit-ia',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Audit IA Gratuit pour Entreprise — Score d'Automatisation & ROI | NONALIX CI",
    description: "Découvrez en 5 minutes comment l'Intelligence Artificielle peut automatiser vos tâches répétitives, réduire vos coûts de 75% et propulser votre croissance.",
  },
};

export default function AuditIaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
