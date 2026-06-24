import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import services from '@/data/services.json';
import serviceDetails from '@/data/serviceDetails';
import { ServiceForm } from '@/components/services/ServiceForm';
import GlowingCard from '@/components/layout/GlowingCard';
import { CONTACT_INFO } from '@/lib/constants';

// Slug to ID mapping
const servicesSlugMap: Record<string, string> = {
  'design-web-ui-ux': 'svc_web_design',
  'developpement-web': 'svc_web_dev',
  'automatisation-business': 'svc_branding',
  'optimisation-seo': 'svc_seo',
  'campagnes-publicitaires-ppc': 'svc_ppc',
  'boutiques-shopify': 'svc_shopify',
  'marketing-digital': 'svc_marketing',
  'audit-ux-ui': 'svc_ux_audit',
  'solutions-ecommerce-sur-mesure': 'svc_ecommerce',
  'optimisation-conversion-par-ia': 'svc_ai_testing',
};

// Reverse mapping for dynamic paths
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

const iconMap: Record<string, React.ReactNode> = {
  design: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
      <path d="M12 6V12L16 14"/>
    </svg>
  ),
  development: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  branding: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  seo: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  ppc: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  shopify: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  marketing: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
    </svg>
  ),
  audit: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  ecommerce: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  ai: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

const serviceKeywords: Record<string, string[]> = {
  'design-web-ui-ux': ['design web Abidjan', 'UI UX Côte d\'Ivoire', 'maquette site web Abidjan', 'design mobile-first Afrique'],
  'developpement-web': ['développement web Abidjan', 'création site web Côte d\'Ivoire', 'Next.js Abidjan', 'développeur web Afrique de l\'Ouest'],
  'automatisation-business': ['automatisation IA Abidjan', 'n8n Côte d\'Ivoire', 'chatbot WhatsApp Abidjan', 'agent IA Afrique', 'automatisation processus métier'],
  'optimisation-seo': ['SEO Abidjan', 'référencement Google Côte d\'Ivoire', 'agence SEO Abidjan', 'référencement local Afrique', 'Google Maps Abidjan'],
  'campagnes-publicitaires-ppc': ['Google Ads Abidjan', 'Facebook Ads Côte d\'Ivoire', 'publicité digitale Abidjan', 'campagnes payantes Afrique'],
  'boutiques-shopify': ['Shopify Abidjan', 'e-commerce Côte d\'Ivoire', 'boutique en ligne Abidjan', 'Shopify expert Afrique'],
  'marketing-digital': ['marketing digital Abidjan', 'stratégie digitale Côte d\'Ivoire', 'plan marketing Abidjan', 'growth hacking Afrique'],
  'audit-ux-ui': ['audit UX Abidjan', 'optimisation conversion Côte d\'Ivoire', 'audit site web Abidjan'],
  'solutions-ecommerce-sur-mesure': ['e-commerce Orange Money Abidjan', 'boutique Wave Côte d\'Ivoire', 'paiement Mobile Money', 'e-commerce sur mesure Afrique'],
  'optimisation-conversion-par-ia': ['optimisation IA Abidjan', 'A/B testing Côte d\'Ivoire', 'conversion rate optimization Afrique'],
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const serviceId = servicesSlugMap[slug];
  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    return { title: 'Service non trouvé' };
  }

  const detail = serviceDetails[slug];
  const title = detail
    ? `${detail.heroTitle} ${detail.heroHighlight} à Abidjan — NONALIX CI`
    : `${service.title} à Abidjan — NONALIX CI`;
  const description = detail
    ? `${detail.heroDescription.slice(0, 145)}... Service disponible à Abidjan et dans toute l'Afrique de l'Ouest.`
    : `${service.description} Par NONALIX CI, agence digitale à Abidjan, Côte d'Ivoire — service disponible en Afrique de l'Ouest.`;

  return {
    title,
    description,
    keywords: serviceKeywords[slug] ?? [],
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/services/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(servicesSlugMap).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const serviceId = servicesSlugMap[slug];
  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    notFound();
  }

  const serviceColor = colorMap[service.icon] || 'var(--color-accent)';
  const detail = serviceDetails[slug];

  // Find other/related services
  const otherServices = services
    .filter((s) => s.id !== service.id)
    .slice(0, 3);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://nonalix-ci.com/services/${slug}#service`,
        "name": service.title,
        "description": service.description,
        "url": `https://nonalix-ci.com/services/${slug}`,
        "provider": { "@id": "https://nonalix-ci.com/#organization" },
        "areaServed": [
          { "@type": "Country", "name": "Côte d'Ivoire" },
          { "@type": "Country", "name": "Sénégal" },
          { "@type": "Country", "name": "Mali" },
          { "@type": "Country", "name": "Burkina Faso" },
          { "@type": "AdministrativeArea", "name": "Afrique de l'Ouest" },
        ],
        "audience": { "@type": "BusinessAudience", "audienceType": "Entreprises et professionnels" },
        "serviceType": service.title,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "XOF",
          "availability": "https://schema.org/InStock",
          "seller": { "@id": "https://nonalix-ci.com/#organization" },
        },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://nonalix-ci.com" },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://nonalix-ci.com/services" },
          { "@type": "ListItem", "position": 3, "name": service.title, "item": `https://nonalix-ci.com/services/${slug}` },
        ],
      },
    ],
  };

  return (
    <div className="page-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      {/* ===== HERO SECTION ===== */}
      <section className="svc-detail-hero">
        {/* Background glow */}
        <div className="svc-detail-hero-glow" style={{ background: serviceColor }} />

        <div className="container">
          {/* Breadcrumb */}
          <div className="svc-detail-breadcrumb">
            <Link href="/services" className="svc-detail-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Retour aux services
            </Link>
          </div>

          <div className="svc-detail-hero-grid">
            {/* Left: Content */}
            <div className="svc-detail-hero-content">
              {/* Icon + Badge */}
              <div className="svc-detail-hero-top">
                <div
                  className="svc-detail-icon-circle"
                  style={{ background: `${serviceColor}18`, color: serviceColor }}
                >
                  {iconMap[service.icon]}
                </div>
                {detail && (
                  <span className="audit-badge">{detail.badge}</span>
                )}
              </div>

              {/* Title */}
              <h1 className="svc-detail-title">
                {detail ? (
                  <>
                    {detail.heroTitle}{' '}
                    <em style={{ 
                      fontStyle: 'italic',
                      background: `linear-gradient(135deg, ${serviceColor}, ${serviceColor}99)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {detail.heroHighlight}
                    </em>
                  </>
                ) : (
                  service.title
                )}
              </h1>

              {/* Description */}
              <p className="svc-detail-desc">
                {detail ? detail.heroDescription : service.description}
              </p>

              {/* Stats */}
              {detail && (
                <div className="svc-detail-stats">
                  {detail.stats.map((stat, idx) => (
                    <div key={idx} className="svc-detail-stat">
                      <span className="svc-detail-stat-value" style={{ color: serviceColor }}>
                        {stat.value}
                      </span>
                      <span className="svc-detail-stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Form */}
            <div className="svc-detail-form-col">
              <ServiceForm serviceTitle={service.title} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      {detail && (
        <section className="section svc-detail-features-section">
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
              <h2 className="svc-detail-section-title">
                Ce que nous offrons
              </h2>
              <p className="svc-detail-section-desc">
                Des solutions concrètes et mesurables pour faire croître votre entreprise en Côte d&apos;Ivoire.
              </p>
            </div>

            <div className="grid grid-3 svc-detail-features-grid">
              {detail.features.map((feature, idx) => (
                <GlowingCard
                  key={idx}
                  style={{
                    padding: 'var(--space-xl)',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-md)'
                  }}
                >
                  <div
                    className="svc-feature-icon"
                    style={{ background: `${serviceColor}15`, color: serviceColor }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h3 className="svc-feature-title">{feature.title}</h3>
                  <p className="svc-feature-desc">{feature.description}</p>
                </GlowingCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PROCESS SECTION ===== */}
      {detail && (
        <section className="section svc-detail-process-section">
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
              <h2 className="svc-detail-section-title">
                Notre processus
              </h2>
              <p className="svc-detail-section-desc">
                Un accompagnement structuré, étape par étape, pour des résultats concrets.
              </p>
            </div>

            <div className="svc-detail-process-grid">
              {detail.process.map((step, idx) => (
                <div key={idx} className="svc-detail-process-step">
                  <div
                    className="svc-detail-step-number"
                    style={{ background: `linear-gradient(135deg, ${serviceColor}, ${serviceColor}88)` }}
                  >
                    {step.step}
                  </div>
                  <div className="svc-detail-step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                  {idx < detail.process.length - 1 && (
                    <div className="svc-detail-step-connector" style={{ background: `${serviceColor}40` }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== BENEFITS (from services.json) ===== */}
      <section className="section" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
            <h2 className="svc-detail-section-title">
              Les avantages concrets
            </h2>
          </div>

          <div className="svc-detail-benefits-list">
            {service.benefits.map((benefit, idx) => (
              <GlowingCard
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-lg)',
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div className="svc-benefit-check" style={{ background: `${serviceColor}20`, borderColor: `${serviceColor}40` }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={serviceColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                  {benefit}
                </p>
              </GlowingCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      {detail && (
        <section className="section svc-detail-faq-section">
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
              <h2 className="svc-detail-section-title">
                Questions fréquentes
              </h2>
            </div>

            <div className="audit-faq-list">
              {detail.faq.map((item, idx) => (
                <details key={idx} className="audit-faq-item">
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA SECTION ===== */}
      <section className="section svc-detail-cta-section" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)' }}>
            {detail ? detail.ctaTitle : `Intéressé par ${service.title} ?`}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
            {detail ? detail.ctaDescription : "Contactez-nous pour un devis gratuit et personnalisé."}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={CONTACT_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              💬 Discuter sur WhatsApp
            </a>
            <Link href="/contact" className="btn btn-outline btn-lg">
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      {/* ===== RELATED SERVICES ===== */}
      <section className="section" style={{ background: 'rgba(255, 255, 255, 0.01)', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
            Découvrir d&apos;autres expertises
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
            {otherServices.map((other) => {
              const otherColor = colorMap[other.icon] || 'var(--color-accent)';
              const otherSlug = serviceIdToSlug[other.id];
              return (
                <GlowingCard
                  key={other.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 'var(--space-lg)',
                    background: 'var(--color-surface)',
                    height: '100%',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <div
                      style={{
                        background: `${otherColor}15`,
                        color: otherColor,
                        display: 'inline-flex',
                        padding: '10px',
                        borderRadius: '50%',
                        width: 'fit-content'
                      }}
                    >
                      {iconMap[other.icon]}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', margin: 0 }}>
                      {other.title}
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                      {other.description.substring(0, 100)}...
                    </p>
                  </div>

                  <Link
                    href={`/services/${otherSlug}`}
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: 'var(--space-md)' }}
                  >
                    En savoir plus ↗
                  </Link>
                </GlowingCard>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
