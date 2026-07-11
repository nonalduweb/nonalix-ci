import type { Metadata } from 'next';
import productsData from '@/data/products.json';

interface Product {
  slug: string;
  name: string;
  description: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = (productsData as Product[]).find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Produit non trouvé',
    };
  }

  const title = `${product.name} — Pack Digital & IA à Abidjan`;
  const socialTitle = `${title} | NONALIX CI`;
  const description = `${product.description.slice(0, 150)}... Achat immédiat en ligne avec Orange Money & Wave en Côte d'Ivoire.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/boutique/${slug}`,
    },
    openGraph: {
      title: socialTitle,
      description,
      url: `/boutique/${slug}`,
      images: [
        {
          url: '/images/hero/ai-automation-dashboard.jpg',
          width: 1200,
          height: 630,
          alt: `${product.name} — NONALIX CI`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: ['/images/hero/ai-automation-dashboard.jpg'],
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
