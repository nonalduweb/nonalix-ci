'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import services from '@/data/services.json';
import ScrollReveal from '@/components/layout/ScrollReveal';
import GlowingCard from '@/components/layout/GlowingCard';

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

const colorRgbMap: Record<string, string> = {
  design: '59, 130, 246',       // blue
  development: '59, 130, 246',  // blue
  branding: '226, 83, 54',      // orange-red
  seo: '59, 130, 246',          // blue
  ppc: '226, 83, 54',           // orange-red
  shopify: '59, 130, 246',      // blue
  marketing: '226, 83, 54',     // orange-red
  audit: '59, 130, 246',        // blue
  ecommerce: '59, 130, 246',    // blue
  ai: '59, 130, 246',           // blue
};

const categoryBadges: Record<string, string> = {
  design: 'Design UI/UX',
  development: 'Tech & Vitesse',
  branding: 'IA & Funnels',
  seo: 'SEO Google',
  ppc: 'Google & Social Ads',
  shopify: 'Shopify E-commerce',
  marketing: 'Growth Marketing',
  audit: 'Audit & UX',
  ecommerce: 'Wave / OM Pay',
};

function getServiceIcon(icon: string, color: string) {
  const size = 32;
  switch (icon) {
    case 'design':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-cap" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      );
    case 'development':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <circle cx="12" cy="12" r="3" className="animate-gear" strokeDasharray="3 3" />
        </svg>
      );
    case 'branding':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-cap" aria-hidden="true">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      );
    case 'seo':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <path d="M11 8v6" className="animate-cap" />
        </svg>
      );
    case 'ppc':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case 'shopify':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-cart" aria-hidden="true">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
    case 'marketing':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-cap" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      );
    case 'audit':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
          <line x1="9" y1="9" x2="15" y2="9" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <circle cx="12" cy="12" r="4" className="animate-gear" strokeDasharray="2 2" />
        </svg>
      );
    case 'ecommerce':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-cart" aria-hidden="true">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );
    case 'ai':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-robot" aria-hidden="true">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="15" x2="8" y2="15" strokeWidth="3" />
          <line x1="16" y1="15" x2="16" y2="15" strokeWidth="3" />
        </svg>
      );
    default:
      return null;
  }
}

export function ServicesPreview() {
  const trackRef = useRef<HTMLDivElement>(null);

  const sortedServices = [...services].sort((a, b) => {
    const aColor = colorMap[a.icon] || 'var(--color-accent-glow)';
    const bColor = colorMap[b.icon] || 'var(--color-accent-glow)';
    if (aColor === 'var(--color-accent-glow)' && bColor === 'var(--color-highlight)') return -1;
    if (aColor === 'var(--color-highlight)' && bColor === 'var(--color-accent-glow)') return 1;
    return 0;
  });

  useEffect(() => {
    // Check if window is undefined (SSR safety)
    if (typeof window === 'undefined') return;



    const handleScroll = () => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const trackTop = rect.top + window.pageYOffset;
      const trackHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Scrollable range through the track
      const scrollRange = trackHeight - viewportHeight;
      if (scrollRange <= 0) return;

      const currentScroll = window.pageYOffset;
      const relativeScroll = currentScroll - trackTop;
      
      // Calculate scroll progress percentage (from 0 to 1)
      const rawProgress = relativeScroll / scrollRange;
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      // Directly apply the CSS variable on the track element for maximum performance
      track.style.setProperty('--scroll-progress', String(progress));

      // Toggle active row classes to control pointer-events (pointer-events: auto only on the active row)
      track.classList.toggle('active-row-1', progress < 0.50);
      track.classList.toggle('active-row-2', progress >= 0.50 && progress < 0.77);
      track.classList.toggle('active-row-3', progress >= 0.77);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={trackRef} className="services-scroll-track" id="services-preview-track">
      <div className="services-sticky-container">
        <section className="section services-grid-bg" id="services-preview" style={{ background: 'var(--color-surface)', padding: 0 }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', width: '100%' }}>
            
            <ScrollReveal>
              <div className="section-header" style={{ marginBottom: 'var(--space-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span className="badge badge-highlight">Nos expertises</span>
                  {/* Radar/Circular Chart Widget */}
                  <div className="circular-chart-widget" title="Indicateur d'expertises">
                    <svg width="24" height="24" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="var(--color-accent)" strokeWidth="8" strokeDasharray="250" strokeDashoffset="60" fill="none" className="circular-chart-path" />
                      <circle cx="50" cy="50" r="25" stroke="var(--color-highlight)" strokeWidth="6" strokeDasharray="180" strokeDashoffset="45" fill="none" className="circular-chart-path-inner" />
                    </svg>
                  </div>
                </div>
                <h2 style={{ marginTop: 'var(--space-sm)' }}>
                  Des solutions <span className="text-gradient">sur mesure</span> pour votre croissance
                </h2>
                <p>
                  Nous combinons marketing digital, intelligence artificielle et e-commerce
                  pour offrir des résultats concrets aux entreprises ivoiriennes.
                </p>
              </div>
            </ScrollReveal>

            {/* Relative wrapper for cards, curve drawing SVG, and profile node */}
            <div style={{ position: 'relative', width: '100%' }}>
              
              {/* Dynamic curved line container */}
              <div className="scroll-curve-container">
                <svg className="scroll-curve-svg" viewBox="0 0 100 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 50,0 C -20,80 120,150 50,200 C -20,250 120,320 50,400"
                    stroke="url(#line-glow-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="scroll-drawn-path"
                  />
                  <defs>
                    <linearGradient id="line-glow-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" />
                      <stop offset="50%" stopColor="var(--color-highlight)" />
                      <stop offset="100%" stopColor="var(--color-accent-glow)" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Floating profile node 1 */}
                <div className="scroll-profile-node-1" title="Accompagnement personnalisé">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                {/* Floating profile node 2 */}
                <div className="scroll-profile-node-2" title="Solutions e-commerce">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-3" style={{ position: 'relative', zIndex: 5, width: '100%' }}>
                {sortedServices.slice(0, 9).map((service, index) => {
                  const serviceColor = colorMap[service.icon] || 'var(--color-accent)';
                  const serviceRgb = colorRgbMap[service.icon] || '37, 99, 235';
                  const badgeLabel = categoryBadges[service.icon] || 'Expertise';
                  const rowClass = index < 3 ? 'comp-card-row1' : index < 6 ? 'comp-card-row2' : 'comp-card-row3';
                  return (
                    <div key={service.id} className="comp-card-wrapper">
                      <GlowingCard
                        className={`card composition-card ${rowClass} comp-card-${index + 1}`}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--space-sm)',
                          height: '100%',
                          '--badge-color': serviceColor,
                          '--badge-color-rgb': serviceRgb,
                        } as React.CSSProperties}
                      >

                        {/* Header: Icon & Category Badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)', zIndex: 10 }}>
                          {getServiceIcon(service.icon, serviceColor)}
                          <span className="service-category-badge">{badgeLabel}</span>
                        </div>

                        {/* Title & Status dot */}
                        <h3
                          style={{
                            fontSize: '1.15rem',
                            marginBottom: 'var(--space-xs)',
                            fontFamily: 'var(--font-heading)',
                            display: 'flex',
                            alignItems: 'center',
                            zIndex: 10,
                          }}
                        >
                          {service.title}
                          <span className="service-status-dot" />
                        </h3>

                        {/* Description */}
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, zIndex: 10 }}>
                          {service.description}
                        </p>
                      </GlowingCard>
                    </div>
                  );
                })}
              </div>

            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
              <Link href="/services" className="btn btn-outline">
                Voir le détail de nos expertises →
              </Link>
            </div>
            
          </div>
        </section>
      </div>
    </div>
  );
}

