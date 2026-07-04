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
      priority: 0.92,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${BASE_URL}/boutique`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/a-propos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.72,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.78,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/delete-data`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Pages de services détaillées
  const servicePages = [
    { slug: 'design-web-ui-ux', priority: 0.85 },
    { slug: 'developpement-web', priority: 0.9 },
    { slug: 'automatisation-business', priority: 0.9 },
    { slug: 'optimisation-seo', priority: 0.9 },
    { slug: 'campagnes-publicitaires-ppc', priority: 0.8 },
    { slug: 'boutiques-shopify', priority: 0.8 },
    { slug: 'marketing-digital', priority: 0.85 },
    { slug: 'audit-ux-ui', priority: 0.75 },
    { slug: 'solutions-ecommerce-sur-mesure', priority: 0.85 },
    { slug: 'optimisation-conversion-par-ia', priority: 0.8 },
  ].map(({ slug, priority }) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority,
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

