'use client';

import Link from 'next/link';
import { SOCIAL_LINKS } from '@/lib/constants';

const REVIEWS = [
  {
    name: 'Kouamé Assi',
    role: 'Gérant, Boutique KA Mode Abidjan',
    initials: 'KA',
    rating: 5,
    text: 'NONALIX CI a créé notre boutique en ligne avec paiement Orange Money et Wave. En 3 semaines c\'était live. Nos ventes ont triplé en 2 mois. Je recommande vivement !',
    date: 'il y a 2 semaines',
    color: '#F59E0B',
  },
  {
    name: 'Mariam Coulibaly',
    role: 'Directrice, MC Immobilier Cocody',
    initials: 'MC',
    rating: 5,
    text: 'Le chatbot WhatsApp qu\'ils ont mis en place qualifie nos prospects automatiquement. On ne manque plus aucun lead, même la nuit. Équipe très professionnelle et réactive.',
    date: 'il y a 1 mois',
    color: '#10B981',
  },
  {
    name: 'Serge Yao',
    role: 'CEO, TechPlus CI',
    initials: 'SY',
    rating: 5,
    text: 'Excellente agence ! Notre site Next.js se charge en moins de 2 secondes. Le SEO local a fait passer notre trafic Google de 200 à 1 500 visites par mois en 4 mois.',
    date: 'il y a 1 mois',
    color: '#3B82F6',
  },
  {
    name: 'Fatou Traoré',
    role: 'Fondatrice, FT Cosmétiques',
    initials: 'FT',
    rating: 5,
    text: 'Service impeccable du début à la fin. NONALIX CI a compris exactement ce dont nous avions besoin pour le marché ivoirien. Notre CA en ligne a augmenté de 180% en 3 mois.',
    date: 'il y a 2 mois',
    color: '#EC4899',
  },
  {
    name: 'Jean-Baptiste Koffi',
    role: 'DG, JBK Consulting Plateau',
    initials: 'JK',
    rating: 5,
    text: 'L\'audit SEO gratuit était déjà très complet. Après avoir souscrit à leurs services, notre fiche Google Business est passée en top 3 pour "consultant Abidjan". Merci !',
    date: 'il y a 3 mois',
    color: '#7C3AED',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[...Array(count)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FBBC05" stroke="#FBBC05" strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function GoogleReviews() {
  return (
    <section className="section" style={{ background: 'var(--color-surface)' }}>
      <div className="container">
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: 'var(--space-sm)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="badge badge-accent">Avis Google</span>
          </div>
          <h2 style={{ marginTop: 'var(--space-xs)' }}>
            Ce que disent nos <span className="text-gradient">clients</span>
          </h2>

          {/* Score global */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-md)', background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md) var(--space-xl)', marginTop: 'var(--space-lg)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>4,9</div>
              <StarRating count={5} />
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>sur 5</div>
            </div>
            <div style={{ width: '1px', height: '48px', background: 'var(--color-border)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>107+</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>avis Google</div>
            </div>
            <div style={{ width: '1px', height: '48px', background: 'var(--color-border)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10B981', lineHeight: 1 }}>98%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>recommandent</div>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-lg)',
            marginTop: 'var(--space-2xl)',
          }}
        >
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Google icon watermark */}
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                style={{ position: 'absolute', top: 'var(--space-md)', right: 'var(--space-md)', opacity: 0.06 }}
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>

              {/* Stars + date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <StarRating count={review.rating} />
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{review.date}</span>
              </div>

              {/* Review text */}
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', margin: 0, flex: 1 }}>
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `${review.color}20`,
                    border: `1.5px solid ${review.color}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: review.color,
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    flexShrink: 0,
                  }}
                >
                  {review.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>{review.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Google */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
          <Link
            href={SOCIAL_LINKS.googleReviews}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '9999px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Voir tous nos avis sur Google
          </Link>
        </div>
      </div>
    </section>
  );
}
