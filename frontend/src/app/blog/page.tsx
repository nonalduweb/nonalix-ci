import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BLOG_POSTS, BLOG_CATEGORIES, type BlogCategory } from '@/data/blog';
import { fetchApiBlogPosts } from '@/lib/blog-api';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Blog — Marketing Digital, SEO & IA en Côte d'Ivoire`,
  description: `Conseils, guides et stratégies en marketing digital, SEO, développement web et intelligence artificielle pour les entreprises de Côte d'Ivoire et d'Afrique de l'Ouest.`,
  alternates: { canonical: '/blog' },
  openGraph: {
    title: `Blog NONALIX CI — Ressources Marketing Digital & IA pour la Côte d'Ivoire`,
    description: `Guides pratiques, études de cas et stratégies digitales adaptées au marché ivoirien. SEO, e-commerce Mobile Money, chatbots WhatsApp, automatisation IA.`,
    url: '/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog NONALIX CI — Ressources Marketing Digital & IA pour la Côte d'Ivoire`,
    description: `Guides pratiques, études de cas et stratégies digitales adaptées au marché ivoirien. SEO, e-commerce Mobile Money, chatbots WhatsApp, automatisation IA.`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: `Blog ${SITE_CONFIG.name}`,
  description: "Ressources et guides marketing digital pour les entreprises de Côte d'Ivoire",
  url: 'https://nonalix-ci.com/blog',
  publisher: { '@type': 'Organization', name: SITE_CONFIG.fullName },
};

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  seo: 'var(--color-accent)',
  'developpement-web': 'var(--color-accent)',
  'marketing-digital': 'var(--color-accent)',
  'ia-automatisation': 'var(--color-accent)',
  ecommerce: 'var(--color-accent)',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export const revalidate = 3600;

export default async function BlogPage() {
  const apiPosts = await fetchApiBlogPosts();
  const apiSlugs = new Set(apiPosts.map((p) => p.slug));
  const allPosts = [
    ...apiPosts,
    ...BLOG_POSTS.filter((p) => !apiSlugs.has(p.slug)),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featured = allPosts.filter((p) => p.featured);
  const others = allPosts.filter((p) => !p.featured);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="page-content">
        {/* Hero */}
        <section className="section" style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-2xl)' }}>
          <div className="container">
            <div className="section-header">
              <span className="badge badge-accent">Blog & Ressources</span>
              <h1 style={{ marginTop: 'var(--space-md)', fontSize: '2.5rem' }}>
                Stratégies digitales pour{' '}
                <span className="text-gradient">l&apos;Afrique de l&apos;Ouest</span>
              </h1>
              <p style={{ maxWidth: '600px', margin: '0 auto' }}>
                Guides pratiques, conseils SEO, e-commerce Mobile Money, chatbots IA et marketing digital
                — tout pour accélérer la croissance de votre entreprise en Côte d&apos;Ivoire.
              </p>
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', justifyContent: 'center', marginTop: 'var(--space-xl)' }}>
              {(Object.entries(BLOG_CATEGORIES) as [BlogCategory, string][]).map(([key, label]) => (
                <span
                  key={key}
                  className="badge"
                  style={{
                    background: `${CATEGORY_COLORS[key]}18`,
                    color: CATEGORY_COLORS[key],
                    border: `1px solid ${CATEGORY_COLORS[key]}40`,
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    padding: '0.375rem 0.875rem',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Featured articles */}
        {featured.length > 0 && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container">
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 'var(--space-xl)', color: 'var(--color-text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Articles à la une
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
                {featured.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <article
                      className="card"
                      style={{
                        overflow: 'hidden',
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', margin: 'calc(var(--space-lg) * -1) calc(var(--space-lg) * -1) 0', flexShrink: 0 }}>
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))' }} />
                        <span
                          className="badge"
                          style={{
                            position: 'absolute', top: 'var(--space-md)', left: 'var(--space-md)',
                            background: `${CATEGORY_COLORS[post.category]}cc`,
                            color: '#fff', border: 'none',
                          }}
                        >
                          {post.categoryLabel}
                        </span>
                      </div>
                      <div style={{ padding: 'var(--space-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-md)', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>
                          <span>{formatDate(post.date)}</span>
                          <span>·</span>
                          <span>{post.readingTime} min de lecture</span>
                        </div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.4, marginBottom: 'var(--space-sm)', color: 'var(--color-text)', flex: 1 }}>
                          {post.title}
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
                          {post.description.substring(0, 120)}...
                        </p>
                        <span style={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 600 }}>
                          Lire l&apos;article →
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All other articles */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 'var(--space-xl)', color: 'var(--color-text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Tous les articles
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {others.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <article
                    className="card"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: 'var(--space-lg)',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                        <span
                          style={{
                            fontSize: '0.75rem', fontWeight: 600,
                            color: CATEGORY_COLORS[post.category],
                            background: `${CATEGORY_COLORS[post.category]}18`,
                            padding: '2px 8px', borderRadius: '999px',
                          }}
                        >
                          {post.categoryLabel}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {formatDate(post.date)} · {post.readingTime} min
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
                        {post.title}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        {post.description.substring(0, 100)}...
                      </p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Newsletter */}
        <section className="section" style={{ paddingBottom: 'var(--space-4xl)' }}>
          <div className="container">
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: 'var(--space-3xl)',
                background: 'linear-gradient(135deg, rgba(231,173,5,0.08) 0%, rgba(124,58,237,0.06) 100%)',
                border: '1px solid rgba(231,173,5,0.15)',
              }}
            >
              <span className="badge badge-accent" style={{ marginBottom: 'var(--space-md)' }}>
                Restez informé
              </span>
              <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)' }}>
                Recevez nos conseils directement sur WhatsApp
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
                Rejoignez +300 entrepreneurs ivoiriens qui reçoivent chaque semaine nos meilleures stratégies digitales.
              </p>
              <a
                href="https://wa.me/22502637171?text=Bonjour%20NONALIX%20CI%20!%20Je%20veux%20recevoir%20vos%20conseils%20marketing%20digital."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-highlight btn-lg"
                style={{ borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                S&apos;abonner via WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
