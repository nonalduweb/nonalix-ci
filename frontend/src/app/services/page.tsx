import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import services from '@/data/services.json';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Nos Services — Marketing Digital, IA & E-commerce',
  description: `Découvrez les services de ${SITE_CONFIG.name} : création de site web, optimisation SEO, automatisation par IA, e-commerce avec Mobile Money et campagnes publicitaires pour les entreprises ivoiriennes à Abidjan.`,
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Services NONALIX CI — Marketing Digital & IA en Côte d\'Ivoire',
    description: 'Création web, SEO, automatisation IA, e-commerce Mobile Money et campagnes publicitaires pour entreprises ivoiriennes.',
    url: '/services',
  },
};

const iconMap: Record<string, React.ReactNode> = {
  design: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
      <path d="M12 6V12L16 14"/>
    </svg>
  ),
  development: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  branding: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  seo: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  ppc: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  shopify: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  marketing: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
    </svg>
  ),
  audit: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  ecommerce: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  ai: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4"/>
      <line x1="8" y1="16" x2="8.01" y2="16"/>
      <line x1="16" y1="16" x2="16.01" y2="16"/>
    </svg>
  ),
};

const colorMap: Record<string, string> = {
  design: 'var(--color-accent-glow)',
  development: 'var(--color-accent-glow)',
  branding: 'var(--color-highlight)',
  seo: 'var(--color-accent-glow)',
  ppc: 'var(--color-highlight)',
  shopify: 'var(--color-accent-glow)',
  marketing: 'var(--color-highlight)',
  audit: 'var(--color-accent-glow)',
  ecommerce: 'var(--color-accent-glow)',
  ai: 'var(--color-accent-glow)',
};

const serviceIdToSlug: Record<string, string> = {
  'svc_web_design': 'design-web-ui-ux',
  'svc_web_dev': 'developpement-web',
  'svc_branding': 'automatisation-business',
  'svc_seo': 'optimisation-seo',
  'svc_ppc': 'campagnes-publicitaires-ppc',
  'svc_shopify': 'boutiques-shopify',
  'svc_marketing': 'marketing-digital',
  'svc_ux_audit': 'audit-ux-ui',
  'svc_ecommerce': 'solutions-ecommerce-sur-mesure',
  'svc_ai_testing': 'optimisation-conversion-par-ia',
};

const processSteps = [
  { number: '01', title: 'Audit & Analyse', description: 'Nous analysons vos besoins, votre marché et identifions les opportunités de croissance digitale.' },
  { number: '02', title: 'Stratégie Sur Mesure', description: 'Nous concevons une stratégie personnalisée alignée sur vos objectifs business.' },
  { number: '03', title: 'Implémentation', description: 'Notre équipe déploie les solutions techniques et met en place les automatisations.' },
  { number: '04', title: 'Suivi & Optimisation', description: 'Nous mesurons les résultats et optimisons en continu pour maximiser votre ROI.' },
];

export default function ServicesPage() {
  const sortedServices = [...services].sort((a, b) => {
    const aColor = colorMap[a.icon] || 'var(--color-accent-glow)';
    const bColor = colorMap[b.icon] || 'var(--color-accent-glow)';
    if (aColor === 'var(--color-accent-glow)' && bColor === 'var(--color-highlight)') return -1;
    if (aColor === 'var(--color-highlight)' && bColor === 'var(--color-accent-glow)') return 1;
    return 0;
  });

  return (
    <div className="page-content">
      {/* Hero */}
      <section className="section" style={{ paddingTop: 'var(--space-4xl)' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">Nos Services</span>
            <h1 style={{ marginTop: 'var(--space-md)', fontSize: '2.25rem' }}>
              Des solutions <span className="text-gradient">digitales</span> adaptées à votre business
            </h1>
            <p>
              Nous accompagnons les entreprises ivoiriennes dans leur transformation digitale
              avec des solutions concrètes et mesurables.
            </p>
          </div>
        </div>
      </section>

      {/* Services détaillés */}
      <section className="section" style={{ background: 'var(--color-surface)', paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-xl)' }}>
            {sortedServices.map((service) => {
              const serviceColor = colorMap[service.icon] || 'var(--color-accent)';
              return (
                <div key={service.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <div
                      className="service-icon"
                      style={{ background: `${serviceColor}15`, display: 'inline-flex', padding: '12px', borderRadius: '50%', width: 'fit-content' }}
                    >
                      <span style={{ color: serviceColor, display: 'flex' }}>{iconMap[service.icon]}</span>
                    </div>

                    <div>
                      <h2 style={{ fontSize: '1.35rem', marginBottom: 'var(--space-sm)' }}>
                        {service.title}
                      </h2>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
                        {service.description}
                      </p>

                      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-accent-glow)', marginBottom: 'var(--space-sm)' }}>
                        Ce que vous obtenez :
                      </h3>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)' }}>
                        {service.benefits.map((benefit) => (
                          <li
                            key={benefit}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 'var(--space-xs)',
                              color: 'var(--color-text-muted)',
                              fontSize: '0.875rem',
                              lineHeight: 1.5,
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '4px' }}>
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link href={`/services/${serviceIdToSlug[service.id]}`} className="btn btn-primary" style={{ marginTop: 'var(--space-sm)' }}>
                    Découvrir l&apos;offre ↗
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* À Propos / Notre Mission */}
      <section className="section" style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-primary-light)' }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: 'var(--space-2xl)' }}>
            <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
              <Image
                src="/images/products/about-img.jpg"
                alt="Équipe NONALIX CI"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', justifyContent: 'center' }}>
              <span className="badge badge-highlight">👥 Notre Vision</span>
              <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>
                Propulser l&apos;économie ivoirienne par l&apos;innovation <span className="text-gradient">digitale</span> et l&apos;IA
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                Chez <strong>NONALIX CI</strong>, nous croyons que la technologie doit être un levier de croissance accessible à toutes les entreprises. Notre mission est de simplifier et d&apos;automatiser vos processus métier tout en renforçant votre présence en ligne.
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
                De la création de votre plateforme E-commerce intégrant les paiements locaux (Orange Money, Wave, MTN) à la conception d&apos;agents conversationnels IA intelligents pour vos canaux WhatsApp, nous concevons des solutions sur mesure adaptées aux réalités du marché ouest-africain.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', color: 'var(--color-text)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Automatisation IA</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', color: 'var(--color-text)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Paiements locaux</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', color: 'var(--color-text)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Design Premium</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', color: 'var(--color-text)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Support Réactif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-highlight">Notre processus</span>
            <h2 style={{ marginTop: 'var(--space-md)' }}>
              Comment nous <span className="text-gradient">travaillons</span>
            </h2>
            <p>
              Un processus simple et transparent, du premier contact à la livraison de résultats.
            </p>
          </div>

          <div className="process-steps">
            {processSteps.map((step) => (
              <div key={step.number} className="process-step">
                <div className="process-step-number">{step.number}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="cta-section">
            <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)' }}>
              Prêt à démarrer votre projet ?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto var(--space-xl)', lineHeight: 1.7 }}>
              Contactez-nous pour un audit gratuit de votre présence digitale
              et découvrez comment l&apos;IA peut transformer votre business.
            </p>
            <Link href="/contact" className="btn btn-highlight btn-lg">
              Demander un audit gratuit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
