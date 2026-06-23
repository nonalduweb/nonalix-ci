import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/layout/ScrollReveal';
import GlowingCard from '@/components/layout/GlowingCard';
import { PORTFOLIO_PROJECTS } from '@/data/portfolio';

export function PortfolioSection() {
  // Select the featured projects (first 3 projects in the list)
  const featuredProjects = PORTFOLIO_PROJECTS.filter(project => project.featured);

  return (
    <section className="section" id="portfolio-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative blurred background glow */}
      <div 
        className="glow-bubble" 
        style={{ 
          position: 'absolute', 
          top: '30%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '500px', 
          height: '500px', 
          backgroundColor: 'rgba(37, 99, 235, 0.04)', 
          filter: 'blur(120px)', 
          borderRadius: 'var(--radius-full)', 
          pointerEvents: 'none', 
          zIndex: 0 
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <ScrollReveal>
          <div className="section-header">
            <span className="badge badge-accent">Études de Cas</span>
            <h2 style={{ marginTop: 'var(--space-md)' }}>
              Nos <span className="text-gradient">réalisations</span> récentes
            </h2>
            <p>
              Découvrez comment nous accompagnons concrètement les marques et les entreprises
              ivoiriennes dans leur digitalisation et l&apos;adoption de l&apos;IA.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={100}>
          <div className="grid grid-3" style={{ gap: 'var(--space-xl)', marginTop: 'var(--space-2xl)' }}>
            {featuredProjects.map((project) => (
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
                  height: '100%',
                }}
              >
                {/* Visual Container */}
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
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="hero-image"
                  />
                  
                  {/* Category Pill/Badge Overlaid on Image */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(15, 16, 18, 0.75)',
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

                {/* Text Body */}
                <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontWeight: 600 }}>
                    {project.title}
                  </h3>
                  
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, flexGrow: 1 }}>
                    {project.description}
                  </p>
                  
                  {/* Tech Tags */}
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

                  {/* Bottom Case Study CTA Link */}
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
                        color: '#4F46E5', // Indigo color matching the design
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
            ))}
          </div>
        </ScrollReveal>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
          <Link href="/portfolio" className="btn btn-outline btn-lg">
            Voir tout le portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}

