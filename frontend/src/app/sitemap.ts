import type { MetadataRoute } from 'next';
import productsData from '@/data/products.json';

const BASE_URL = 'https://nonalix-ci.com';

interface Product {
  slug: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Pages statiques principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/audit-seo`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/boutique`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/a-propos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/connexion`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Pages de services détaillées
  const servicePages = [
    'design-web-ui-ux',
    'developpement-web',
    'automatisation-business',
    'optimisation-seo',
    'campagnes-publicitaires-ppc',
    'boutiques-shopify',
    'marketing-digital',
    'audit-ux-ui',
    'solutions-ecommerce-sur-mesure',
    'optimisation-conversion-par-ia',
  ].map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Pages boutique produits détaillées
  const productPages = (productsData as Product[]).map((product) => ({
    url: `${BASE_URL}/boutique/${product.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...productPages];
}

