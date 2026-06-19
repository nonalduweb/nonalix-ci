import type { Metadata } from 'next';
import productsData from '@/data/products.json';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
  isDigital?: boolean;
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
      title: 'Produit non trouvé — Boutique NONALIX CI',
    };
  }

  const title = `${product.name} — Boutique NONALIX CI`;
  const description = `${product.description.slice(0, 155)}...`;

  return {
    title,
    description,
    alternates: {
      canonical: `/boutique/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/boutique/${slug}`,
      images: [
        {
          url: product.imageUrl.startsWith('/') ? product.imageUrl : `/${product.imageUrl}`,
          alt: product.name,
        },
      ],
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
