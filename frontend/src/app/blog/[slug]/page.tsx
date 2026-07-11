import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BLOG_POSTS, getBlogPost, BLOG_CATEGORIES, type BlogCategory } from '@/data/blog';
import { fetchApiBlogPost, fetchApiBlogPosts } from '@/lib/blog-api';
import { SITE_CONFIG, CONTACT_INFO } from '@/lib/constants';

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  seo: 'var(--color-accent)',
  'developpement-web': '#7C3AED',
  'marketing-digital': '#EC4899',
  'ia-automatisation': '#10B981',
  ecommerce: '#F59E0B',
};

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug) || await fetchApiBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      tags: post.tags,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug) || await fetchApiBlogPost(slug);
  if (!post) notFound();

  const allApiPosts = await fetchApiBlogPosts();
  const allPosts = [...allApiPosts, ...BLOG_POSTS.filter((p) => !allApiPosts.some((a) => a.slug === p.slug))];

  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);
  const otherPosts = relatedPosts.length < 2
    ? [...relatedPosts, ...allPosts.filter((p) => p.slug !== post.slug && p.category !== post.category)].slice(0, 2)
    : relatedPosts;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: `https://nonalix-ci.com${post.image}`,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: { '@type': 'Organization', name: SITE_CONFIG.fullName },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.fullName,
      logo: { '@type': 'ImageObject', url: 'https://nonalix-ci.com/images/brand/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://nonalix-ci.com/blog/${post.slug}` },
    keywords: post.tags.join(', '),
    inLanguage: 'fr-CI',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://nonalix-ci.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://nonalix-ci.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://nonalix-ci.com/blog/${post.slug}` },
    ],
  };

  const catColor = CATEGORY_COLORS[post.category];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="page-content">
        {/* Hero article */}
        <section style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-2xl)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>

            {/* Breadcrumb */}
            <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
              <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Accueil</Link>
              <span>/</span>
              <Link href="/blog" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Blog</Link>
              <span>/</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>{post.categoryLabel}</span>
            </nav>

            {/* Category badge */}
            <span
              className="badge"
              style={{
                background: `${catColor}18`,
                color: catColor,
                border: `1px solid ${catColor}40`,
                fontWeight: 600,
                marginBottom: 'var(--space-lg)',
                display: 'inline-block',
              }}
            >
              {post.categoryLabel}
            </span>

            {/* Title */}
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: 'var(--space-lg)', color: 'var(--color-text)' }}>
              {post.title}
            </h1>

            {/* Meta */}
            <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent), #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.75rem' }}>N</div>
                <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>NONALIX CI</span>
              </div>
              <span>·</span>
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{post.readingTime} min de lecture</span>
            </div>

            {/* Cover image */}
            <div style={{ position: 'relative', height: '360px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--space-3xl)' }}>
              <Image
                src={post.image}
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4))' }} />
            </div>
          </div>
        </section>

        {/* Article content */}
        <section style={{ paddingBottom: 'var(--space-3xl)' }}>
          <div
            className="container blog-content"
            style={{
              maxWidth: '800px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.8,
              fontSize: '1.0625rem',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </section>

        {/* Tags */}
        <section style={{ paddingBottom: 'var(--space-2xl)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-xl)' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Tags</p>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {post.tags.map((tag) => (
                  <span key={tag} className="badge" style={{ fontSize: '0.8125rem' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ paddingBottom: 'var(--space-3xl)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div
              className="card"
              style={{
                padding: 'var(--space-2xl)',
                background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(124,58,237,0.06) 100%)',
                border: '1px solid rgba(59,130,246,0.15)',
                textAlign: 'center',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>
                Besoin d&apos;un accompagnement personnalisé ?
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
                Nos experts NONALIX CI sont disponibles pour analyser votre situation et vous proposer une stratégie sur mesure adaptée au marché ivoirien.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={CONTACT_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-highlight btn-lg" style={{ borderRadius: '9999px' }}>
                  Discuter sur WhatsApp
                </a>
                <Link href="/contact" className="btn btn-outline btn-lg" style={{ borderRadius: '9999px' }}>
                  Envoyer un message
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related articles */}
        {otherPosts.length > 0 && (
          <section className="section" style={{ paddingTop: 0, paddingBottom: 'var(--space-4xl)' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
                Articles similaires
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
                {otherPosts.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} style={{ textDecoration: 'none' }}>
                    <article className="card" style={{ height: '100%', cursor: 'pointer' }}>
                      <span style={{ fontSize: '0.75rem', color: CATEGORY_COLORS[related.category], fontWeight: 600, display: 'block', marginBottom: 'var(--space-xs)' }}>
                        {related.categoryLabel}
                      </span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.4, marginBottom: 'var(--space-xs)', color: 'var(--color-text)' }}>
                        {related.title}
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{related.readingTime} min de lecture</p>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
