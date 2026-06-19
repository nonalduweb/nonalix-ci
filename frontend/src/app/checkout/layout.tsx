import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finaliser la commande',
  description: 'Finalisez votre achat de packs de services digitaux ou de solutions IA en Côte d\'Ivoire.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
