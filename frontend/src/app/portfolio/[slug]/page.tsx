import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import GlowingCard from '@/components/layout/GlowingCard';
import portfolioDetails from '@/data/portfolioDetails';
import { PORTFOLIO_PROJECTS, CASE_STUDIES } from '@/data/portfolio';
import { CONTACT_INFO } from '@/lib/constants';

// SEO & Metadata generation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const detail = portfolioDetails[slug];

  if (!detail) {
    return { title: 'Projet non trouvé' };
  }

  const title = `${detail.heroTitle} ${detail.heroHighlight} — NONALIX CI`;
  const description = `${detail.heroDescription.slice(0, 150)}... Réalisation premium par NONALIX CI, agence digitale à Abidjan, Côte d'Ivoire.`;

  return {
    title,
    description,
    keywords: [detail.client, detail.sector, 'portfolio nonalix', 'réalisation web abidjan', 'ia cote d\'ivoire'],
    alternates: {
      canonical: `/portfolio/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/portfolio/${slug}`,
    },
  };
}

// Generate static routes at build time (SSG)
export async function generateStaticParams() {
  return Object.keys(portfolioDetails).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const detail = portfolioDetails[slug];

  if (!detail) {
    notFound();
  }

  // Gather related items (excluding current)
  const allProjects = [
    ...PORTFOLIO_PROJECTS.map(p => ({ ...p, type: 'project' })),
    ...CASE_STUDIES.map(c => ({
      id: c.id,
      title: c.title,
      category: c.sector === 'ecommerce' ? 'ecommerce' as const : 'web' as const,
      categoryLabel: c.sectorLabel,
      description: c.description,
      image: c.image,
      tags: c.solutions,
      badge: c.subtitle,
      featured: c.featured,
      link: c.link,
      type: 'case'
    }))
  ];
  
  const relatedProjects = allProjects
    .filter(p => p.link !== `/portfolio/${slug}`)
    .slice(0, 3);

  const accentColor = 'var(--color-accent)';

  return (
    <div className="page-content" style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Background ambient glow bubbles */}
      <div 
        className="glow-bubble" 
        style={{ 
          position: 'absolute', 
          top: '5%', 
          left: '5%', 
          width: '350px', 
          height: '350px', 
          backgroundColor: 'rgba(59, 130, 246, 0.04)', 
          filter: 'blur(100px)', 
          borderRadius: 'var(--radius-full)', 
          pointerEvents: 'none', 
          zIndex: 0 
        }}
      />
      <div 
        className="glow-bubble" 
        style={{ 
          position: 'absolute', 
          bottom: '20%', 
          right: '5%', 
          width: '450px', 
          height: '450px', 
          backgroundColor: 'rgba(99, 102, 241, 0.03)', 
          filter: 'blur(120px)', 
          borderRadius: 'var(--radius-full)', 
          pointerEvents: 'none', 
          zIndex: 0 
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-4xl)' }}>
        
        {/* Navigation Breadcrumb / Back button */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <Link 
            href="/portfolio" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'var(--transition-fast)'
            }}
            className="svc-detail-back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Retour au portfolio
          </Link>
        </div>

        {/* ================= HERO SECTION ================= */}
        <section style={{ marginBottom: 'var(--space-3xl)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)', alignItems: 'center' }} className="grid-2-md">
            
            {/* Left Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div>
                <span className="badge badge-accent" style={{ background: 'rgba(59, 130, 246, 0.1)', color: accentColor, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  {detail.badge}
                </span>
              </div>

              <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700, lineHeight: 1.2 }}>
                {detail.heroTitle}{' '}
                <span className="text-gradient">
                  {detail.heroHighlight}
                </span>
              </h1>

              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                {detail.heroDescription}
              </p>

              {/* Quick Specs Metadata Box */}
              <div 
                style={{ 
                  marginTop: 'var(--space-md)',
                  padding: 'var(--space-lg)',
                  background: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'var(--space-md)'
                }}
              >
                <div>
                  <small style={{ color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em' }}>Client</small>
                  <strong style={{ color: 'var(--color-text)', fontSize: '0.925rem' }}>{detail.client}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em' }}>Secteur</small>
                  <strong style={{ color: 'var(--color-text)', fontSize: '0.925rem' }}>{detail.sector}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em' }}>Durée</small>
                  <strong style={{ color: 'var(--color-text)', fontSize: '0.925rem' }}>{detail.duration}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em' }}>Statut</small>
                  <span style={{ color: 'var(--color-success)', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }}></span>
                    Déployé avec succès
                  </span>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div>
              <div 
                style={{ 
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/10',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(59, 130, 246, 0.1)'
                }}
              >
                <Image
                  src={detail.image}
                  alt={detail.client}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            </div>

          </div>
        </section>

        {/* ================= KEY PERFORMANCE METRICS ================= */}
        <section style={{ marginBottom: 'var(--space-3xl)' }}>
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: 'var(--space-lg)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--color-border)',
              padding: 'var(--space-xl)',
              borderRadius: 'var(--radius-xl)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {detail.metrics.map((metric, idx) => (
              <div 
                key={idx} 
                style={{ 
                  textAlign: 'center', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 'var(--space-xs)',
                  borderRight: idx < detail.metrics.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                }}
                className="metric-column"
              >
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: accentColor, textShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}>
                  {metric.value}
                </span>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= MAIN CONTENT SPLIT GRID ================= */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-3xl)', marginBottom: 'var(--space-4xl)' }} className="grid-3-1-md">
          
          {/* Left Column - The Case details (70%) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            
            {/* Overview / Context */}
            <div>
              <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
                Présentation du <span className="text-gradient">Projet</span>
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '1rem' }}>
                {detail.overview}
              </p>
            </div>

            {/* The Challenge */}
            <div style={{ padding: 'var(--space-xl)', background: 'rgba(239, 68, 68, 0.02)', borderLeft: '3px solid var(--color-error)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontWeight: 600, marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Le Défi Métier
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {detail.challenge}
              </p>
            </div>

            {/* The Solution */}
            <div style={{ padding: 'var(--space-xl)', background: 'rgba(16, 185, 129, 0.02)', borderLeft: '3px solid var(--color-success)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontWeight: 600, marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Notre Approche & Solution
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {detail.solution}
              </p>
            </div>

            {/* Results Bullet points */}
            <div>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-heading)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
                Résultats et <span className="text-gradient">Impact</span>
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {detail.results.map((result, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                    <div 
                      style={{ 
                        background: 'rgba(16, 185, 129, 0.1)', 
                        border: '1px solid rgba(16, 185, 129, 0.2)', 
                        color: 'var(--color-success)', 
                        padding: '4px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>{result}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Realization Process Timeline */}
            <div>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-heading)', fontWeight: 600, marginBottom: 'var(--space-xl)' }}>
                Déroulement du <span className="text-gradient">Projet</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', position: 'relative', paddingLeft: 'var(--space-xl)' }}>
                
                {/* Timeline connector bar */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '15px', 
                    bottom: '15px', 
                    left: '11px', 
                    width: '2px', 
                    background: 'rgba(255, 255, 255, 0.05)' 
                  }}
                />

                {detail.process.map((step, idx) => (
                  <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                    
                    {/* Timeline bullet */}
                    <div 
                      style={{ 
                        position: 'absolute', 
                        left: '-32px', 
                        top: '0', 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        background: 'var(--color-surface)',
                        border: `2px solid ${accentColor}`,
                        boxShadow: `0 0 10px ${accentColor}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--color-text)'
                      }}
                    >
                      {step.step}
                    </div>

                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-text)', fontWeight: 600, margin: 0 }}>
                      {step.title}
                    </h4>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Sidebar (30%) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            
            {/* Tech Stack Box */}
            <div style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-md)' }}>
                Technologies clés
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {detail.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      color: 'var(--color-text-secondary)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Solutions deployed Checklist */}
            <div style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-md)' }}>
                Livrables & Solutions
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {detail.solutions.map((sol, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    <span style={{ color: accentColor, fontWeight: 700 }}>✓</span>
                    <span>{sol}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonial widget if present */}
            {detail.testimonial && (
              <GlowingCard 
                style={{ 
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(99, 102, 241, 0.01) 100%)',
                  padding: 'var(--space-lg)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)'
                }}
              >
                {/* Quote symbol */}
                <div style={{ fontSize: '2.5rem', color: 'rgba(59, 130, 246, 0.2)', height: '24px', lineHeight: '1', fontFamily: 'Georgia, serif', marginTop: '-10px' }}>
                  “
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 'var(--space-md)', position: 'relative', zIndex: 1 }}>
                  {detail.testimonial.quote}
                </p>
                <div>
                  <strong style={{ color: 'var(--color-text)', fontSize: '0.875rem', display: 'block' }}>{detail.testimonial.author}</strong>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                    {detail.testimonial.role}, {detail.testimonial.company}
                  </span>
                </div>
              </GlowingCard>
            )}

          </div>

        </section>

        {/* ================= CALL TO ACTION SECTION ================= */}
        <section style={{ marginBottom: 'var(--space-4xl)' }}>
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, rgba(99, 102, 241, 0.02) 100%)',
              border: '1px solid var(--color-border)',
              padding: 'var(--space-3xl) var(--space-2xl)',
              borderRadius: 'var(--radius-2xl)',
              textAlign: 'center',
              maxWidth: '900px',
              margin: '0 auto'
            }}
          >
            <h2 style={{ fontSize: '1.85rem', marginBottom: 'var(--space-md)' }}>
              Vous souhaitez obtenir des <span className="text-gradient">résultats similaires</span> ?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto var(--space-xl) auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Discutons de vos besoins et voyons comment nous pouvons accélérer la croissance de votre entreprise 
              grâce au développement sur-mesure, aux passerelles de paiement locales ou à l&apos;automatisation par l&apos;IA.
            </p>
            <div 
              style={{ 
                display: 'flex', 
                gap: 'var(--space-md)', 
                justifyContent: 'center',
                flexWrap: 'wrap' 
              }}
            >
              <a 
                href={CONTACT_INFO.whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-sm)',
                  backgroundColor: 'var(--color-whatsapp)',
                  borderColor: 'var(--color-whatsapp)',
                  color: '#FFFFFF'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Discuter sur WhatsApp
              </a>
              <Link href="/contact" className="btn btn-outline btn-lg">
                Demander un devis
              </Link>
            </div>
          </div>
        </section>

        {/* ================= RELATED PROJECTS ================= */}
        {relatedProjects.length > 0 && (
          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3xl)' }}>
            <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', fontWeight: 600, marginBottom: 'var(--space-2xl)', textAlign: 'center' }}>
              Découvrir d&apos;autres <span className="text-gradient">réalisations</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
              {relatedProjects.map((project, idx) => (
                <GlowingCard
                  key={project.id}
                  className="card portfolio-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    padding: 0,
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    height: '100%'
                  }}
                >
                  {/* Image wrapper */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16/10',
                      overflow: 'hidden',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(15, 16, 18, 0.8)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--color-text)',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        zIndex: 10,
                      }}
                    >
                      {project.badge}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', flexGrow: 1 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: accentColor }}>
                      {project.categoryLabel}
                    </span>

                    <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontWeight: 600 }}>
                      {project.title}
                    </h3>

                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, flexGrow: 1 }}>
                      {project.description.substring(0, 120)}...
                    </p>

                    <Link 
                      href={project.link}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        paddingTop: 'var(--space-md)',
                        marginTop: 'auto',
                        textDecoration: 'none'
                      }}
                      className="case-study-link"
                    >
                      <span style={{ color: '#4F46E5', fontSize: '0.85rem', fontWeight: 600 }} className="case-study-link-text">
                        {project.type === 'case' ? 'Voir le cas d\'étude' : 'Voir le projet'}
                      </span>
                      <div 
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(79, 70, 229, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6366F1'
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </div>
                    </Link>
                  </div>
                </GlowingCard>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
