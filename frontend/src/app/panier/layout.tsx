import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Votre Panier — NONALIX CI',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PanierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
