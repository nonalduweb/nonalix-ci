import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion / Inscription',
  description:
    "Connectez-vous ou créez votre compte NONALIX CI pour accéder à vos audits SEO, votre espace client et vos commandes.",
  alternates: {
    canonical: '/connexion',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ConnexionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
