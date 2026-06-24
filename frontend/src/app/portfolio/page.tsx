'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GlowingCard from '@/components/layout/GlowingCard';
import ScrollReveal from '@/components/layout/ScrollReveal';
import { PORTFOLIO_PROJECTS, CASE_STUDIES } from '@/data/portfolio';
import { CONTACT_INFO } from '@/lib/constants';

const FILTER_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'web', label: 'Sites Web' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'ia-automation', label: 'IA & Automatisation' },
  { value: 'seo-marketing', label: 'SEO & Marketing' },
] as const;

const CASE_FILTERS = [
  { value: 'all', label: 'Tous les secteurs' },
  { value: 'immobilier', label: 'Immobilier' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'services', label: 'Services' },
  { value: 'education', label: 'Éducation' },
  { value: 'sante', label: 'Santé' },
] as const;

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [animating, setAnimating] = useState<boolean>(false);

  const [activeCaseFilter, setActiveCaseFilter] = useState<string>('all');
  const [caseAnimating, setCaseAnimating] = useState<boolean>(false);

  const handleFilterChange = (filter: string) => {
    if (filter === activeFilter) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveFilter(filter);
      setAnimating(false);
    }, 200); // Short delay for transition animation
  };

  const handleCaseFilterChange = (filter: string) => {
    if (filter === activeCaseFilter) return;
    setCaseAnimating(true);
    setTimeout(() => {
      setActiveCaseFilter(filter);
      setCaseAnimating(false);
    }, 200); // Short delay for transition animation
  };

  const filteredProjects = PORTFOLIO_PROJECTS.filter((project) => {
    if (activeFilter === 'all') return true;
    return project.category === activeFilter;
  });

  const filteredCaseStudies = CASE_STUDIES.filter((study) => {
    if (activeCaseFilter === 'all') return true;
    return study.sector === activeCaseFilter;
  });

  return (
    <div className="page-content" style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Decorative background ambient glows */}
      <div 
        className="glow-bubble glow-bubble-top" 
        style={{ 
          position: 'absolute', 
          top: '5%', 
          left: '10%', 
          width: '400px', 
          height: '400px', 
          backgroundColor: 'rgba(37, 99, 235, 0.05)', 
          filter: 'blur(100px)', 
          borderRadius: 'var(--radius-full)', 
          pointerEvents: 'none', 
          zIndex: 0 
        }}
      />
      <div 
        className="glow-bubble glow-bubble-bottom" 
        style={{ 
          position: 'absolute', 
          bottom: '15%', 
          right: '5%', 
          width: '500px', 
          height: '500px', 
          backgroundColor: 'rgba(226, 83, 54, 0.03)', 
          filter: 'blur(120px)', 
          borderRadius: 'var(--radius-full)', 
          pointerEvents: 'none', 
          zIndex: 0 
        }}
      />

      {/* Main Header / Hero Section */}
      <section className="section" style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-xl)', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-header" style={{ marginBottom: 'var(--space-2xl)' }}>
              <span className="badge badge-accent">Portfolio</span>
              <h1 style={{ marginTop: 'var(--space-md)', fontSize: '2.5rem', fontFamily: 'var(--font-heading)' }}>
                Nos <span className="text-gradient">Réalisations</span> & Études de Cas
              </h1>
              <p style={{ maxWidth: '680px', margin: 'var(--space-sm) auto 0 auto', color: 'var(--color-text-secondary)' }}>
                Découvrez comment nous aidons les entreprises ivoiriennes et internationales à accélérer leur croissance 
                grâce au développement sur mesure, au e-commerce local et aux technologies d&apos;intelligence artificielle.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* DETAILED CASE STUDIES SECTION */}
      <section className="section" style={{ padding: '0 0 var(--space-4xl) 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          {/* Top Row with Title & Proof Pills */}
          <div className="top-row" style={{ marginBottom: 'var(--space-2xl)' }}>
            <ScrollReveal>
              <div>
                <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-sm)' }}>
                  <span className="eyebrow-dot" style={{ width: '8px', height: '8px', borderRadius: 'var(--radius-full)', background: 'var(--color-accent)', boxShadow: '0 0 10px var(--color-accent)' }}></span>
                  Preuves de résultats
                </span>
                <h2 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-sm)' }}>
                  Études de cas <span className="text-gradient">réelles</span>
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '600px' }}>
                  Des entreprises comme la vôtre ont déjà transformé leur activité grâce à nos systèmes d’automatisation IA, nos agents intelligents et nos solutions de croissance digitale.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={100}>
              <div className="proof-pills">
                <div className="proof-pill">
                  <div className="proof-icon">↗</div>
                  <div>
                    <strong>Résultats mesurables</strong>
                    <small>Des améliorations chiffrées et vérifiables.</small>
                  </div>
                </div>
                <div className="proof-pill">
                  <div className="proof-icon">⏱</div>
                  <div>
                    <strong>Gain de temps</strong>
                    <small>Automatisation 24h/24, sans intervention.</small>
                  </div>
                </div>
                <div className="proof-pill">
                  <div className="proof-icon">●</div>
                  <div>
                    <strong>Croissance durable</strong>
                    <small>Plus de leads, de ventes et de clients satisfaits.</small>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Sector Filters */}
          <ScrollReveal delayMs={150}>
            <div 
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-2xl)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--color-border)',
                padding: 'var(--space-sm)',
                borderRadius: 'var(--radius-xl)',
                backdropFilter: 'blur(10px)',
                width: 'fit-content'
              }}
              className="portfolio-filter-bar"
            >
              {CASE_FILTERS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleCaseFilterChange(option.value)}
                  className={`filter-chip ${activeCaseFilter === option.value ? 'active' : ''}`}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'var(--transition-fast)',
                    border: '1px solid transparent',
                    background: activeCaseFilter === option.value ? 'var(--color-accent)' : 'transparent',
                    color: activeCaseFilter === option.value ? '#FFFFFF' : 'var(--color-text-secondary)',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Case Studies Grid */}
          <div 
            className={`case-grid ${caseAnimating ? 'fade-out-transition' : 'fade-in-transition'}`}
            style={{ transition: 'opacity 0.20s ease' }}
          >
            {filteredCaseStudies.map((study, idx) => (
              <ScrollReveal key={study.id} delayMs={idx * 50}>
                <div className={`case-card ${study.featured ? 'featured' : ''}`}>
                  <span className={`case-tag ${study.sector === 'ecommerce' ? 'purple' : ''}`}>
                    {study.sectorLabel}
                  </span>
                  
                  <div className="case-visual">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      priority={study.featured}
                    />
                  </div>

                  <h3>{study.title.split(' ')[0]} <span>{study.title.split(' ').slice(1).join(' ')}</span></h3>
                  <p>{study.description}</p>

                  <div className="metrics">
                    {study.metrics.map((metric, mIdx) => (
                      <div key={mIdx}>
                        <strong>{metric.value}</strong>
                        <small>{metric.label}</small>
                      </div>
                    ))}
                  </div>

                  <div className="solutions-title">Solutions déployées</div>
                  <ul className="solutions">
                    {study.solutions.map((sol, sIdx) => (
                      <li key={sIdx}>{sol}</li>
                    ))}
                  </ul>

                  <Link href={study.link} className="case-link">
                    Voir le projet <span>→</span>
                  </Link>
                </div>
              </ScrollReveal>
            ))}

            {filteredCaseStudies.length === 0 && (
              <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-text-secondary)', width: '100%' }}>
                <p>Aucune étude de cas trouvée pour ce secteur pour le moment.</p>
              </div>
            )}
          </div>

          {/* Global Statistics Box */}
          <ScrollReveal delayMs={200}>
            <div className="global-results">
              <div className="global-intro">
                <strong>Des résultats qui parlent d’eux-mêmes</strong>
                <span>Nous aidons les entreprises à automatiser, convertir et croître durablement grâce à l’IA.</span>
              </div>
              <div className="global-item">
                <strong>107+</strong>
                <span>Clients satisfaits dans 6 pays</span>
              </div>
              <div className="global-item">
                <strong>250+</strong>
                <span>Projets réalisés avec succès</span>
              </div>
              <div className="global-item">
                <strong>3,2M+</strong>
                <span>Leads traités par nos systèmes IA</span>
              </div>
              <div className="global-item">
                <strong>18 000+</strong>
                <span>Heures économisées par nos clients</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CATALOGUE / OTHER PROJECTS SECTION */}
      <section className="section" style={{ borderTop: '1px solid var(--color-border)', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-header" style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
              <span className="badge badge-accent">Catalogue</span>
              <h2 style={{ marginTop: 'var(--space-sm)', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>
                Notre <span className="text-gradient">Catalogue</span> de Projets
              </h2>
              <p style={{ maxWidth: '600px', margin: 'var(--space-xs) auto 0 auto', color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
                Parcourez nos réalisations par domaine d&apos;expertise et découvrez la diversité de nos solutions.
              </p>
            </div>
          </ScrollReveal>

          {/* Glassmorphic Category Filter Bar for Catalog */}
          <ScrollReveal delayMs={100}>
            <div 
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-3xl)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--color-border)',
                padding: 'var(--space-sm)',
                borderRadius: 'var(--radius-xl)',
                backdropFilter: 'blur(10px)',
                width: 'fit-content',
                margin: '0 auto var(--space-3xl) auto'
              }}
              className="portfolio-filter-bar"
            >
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  className={`filter-chip ${activeFilter === option.value ? 'active' : ''}`}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'var(--transition-fast)',
                    border: '1px solid transparent',
                    background: activeFilter === option.value ? 'var(--color-accent)' : 'transparent',
                    color: activeFilter === option.value ? '#FFFFFF' : 'var(--color-text-secondary)',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Projects Gallery Grid */}
          <div 
            className={`grid grid-3 ${animating ? 'fade-out-transition' : 'fade-in-transition'}`} 
            style={{ 
              gap: 'var(--space-xl)', 
              minHeight: '400px',
              transition: 'opacity 0.20s ease'
            }}
          >
            {filteredProjects.map((project, idx) => (
              <ScrollReveal key={project.id} delayMs={idx * 50}>
                <GlowingCard
                  className="card portfolio-card page-load-popup"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    padding: 0,
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    height: '100%',
                    animationDelay: `${idx * 0.06}s`,
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
                    className="portfolio-image-container"
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      className="hero-image"
                      priority={project.featured}
                    />

                    {/* Badge Overlay */}
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
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        zIndex: 10,
                      }}
                    >
                      {project.badge}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', flexGrow: 1 }}>
                    <span 
                      style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: 600, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em',
                        color: 'var(--color-highlight)' 
                      }}
                    >
                      {project.categoryLabel}
                    </span>

                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontWeight: 600 }}>
                      {project.title}
                    </h3>

                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, flexGrow: 1 }}>
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', marginTop: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            color: 'var(--color-text-secondary)',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.72rem',
                            fontWeight: 500,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Row case study link */}
                    <div 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        paddingTop: 'var(--space-md)',
                        marginTop: 'auto'
                      }}
                    >
                      <span 
                        style={{ 
                          color: '#4F46E5',
                          fontSize: '0.85rem', 
                          fontWeight: 600 
                        }}
                        className="case-study-link-text"
                      >
                        Étude de cas détaillée
                      </span>
                      <div 
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(79, 70, 229, 0.1)',
                          border: '1px solid rgba(79, 70, 229, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6366F1',
                          transition: 'var(--transition-fast)',
                        }}
                        className="case-study-arrow-btn"
                      >
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </GlowingCard>
              </ScrollReveal>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-4xl)', color: 'var(--color-text-secondary)' }}>
              <p>Aucun projet trouvé dans cette catégorie.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="section" style={{ position: 'relative', zIndex: 1, borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <ScrollReveal>
            <div 
              style={{
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(226, 83, 54, 0.03) 100%)',
                border: '1px solid var(--color-border)',
                padding: 'var(--space-3xl) var(--space-2xl)',
                borderRadius: 'var(--radius-2xl)',
                textAlign: 'center',
                maxWidth: '900px',
                margin: '0 auto'
              }}
            >
              <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>
                Vous avez un projet en <span className="text-gradient">Côte d&apos;Ivoire</span> ?
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto var(--space-xl) auto', fontSize: '1rem' }}>
                Que ce soit pour un site web moderne, une boutique e-commerce avec Mobile Money, ou un chatbot IA pour automatiser votre service client, notre équipe basée à Abidjan vous accompagne de A à Z.
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
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
