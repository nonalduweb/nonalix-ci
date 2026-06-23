'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Particles } from '@/components/ui/Particles';
import { NumberTicker } from '@/components/ui/NumberTicker';

export function HeroSection() {
  return (
    <section
      className="hero"
      id="hero-section"
      style={{ backgroundColor: '#050505', position: 'relative', overflow: 'hidden' }}
    >
      {/* Video Background with dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.30, /* Visible background video */
          }}
        >
          <source src="/images/products/nonalix-ci.webm" type="video/webm" />
        </video>
        {/* Dark overlay to balance visibility and readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(5, 5, 5, 0.85) 0%, rgba(5, 5, 5, 0.45) 50%, rgba(5, 5, 5, 0.85) 100%)',
          }}
        />
      </div>

      {/* Floating particles layer (subtle blue) */}
      <Particles color="rgba(59, 130, 246, 0.25)" quantity={35} speed={0.15} size={1.2} opacity={0.25} />

      {/* Hero container */}
      <div className="container hero-container" style={{ position: 'relative', zIndex: 1, padding: 'var(--space-4xl) var(--content-padding) var(--space-3xl)' }}>
        
        {/* Split Grid Layout 50/50 */}
        <div className="hero-split-grid">
          
          {/* Left Column: Title, Subtitle, CTA */}
          <div className="hero-split-left">
            {/* Top Badge */}
            <p
              className="stagger-scale-item stagger-scale-1"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-accent)',
                marginBottom: 'var(--space-md)',
                opacity: 0.95,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Automatisation IA &amp; Croissance Digitale · Abidjan
            </p>

            <h1 className="hero-giant-title stagger-scale-item stagger-scale-2">
              TRANSFORMEZ
              <br />
              VOTRE ENTREPRISE
              <br />
              EN MACHINE DE VENTE
              <br />
              AUTOMATISÉE
              <br />
              PAR L&apos;<span style={{ color: 'var(--color-accent)' }}>IA</span>
            </h1>
            
            <div className="hero-split-actions stagger-scale-item stagger-scale-4">
              <Link
                href="/contact"
                className="btn btn-highlight btn-lg"
                id="hero-cta-contact"
                style={{
                  borderRadius: '9999px',
                  padding: '0.875rem 2.25rem',
                  height: '54px',
                  fontSize: '0.975rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                }}
              >
                Automatiser ma croissance <span style={{ marginLeft: '6px' }}>↗</span>
              </Link>

              <Link
                href="/portfolio"
                className="btn btn-outline btn-lg"
                style={{
                  borderRadius: '9999px',
                  padding: '0.875rem 2.25rem',
                  height: '54px',
                  fontSize: '0.975rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                }}
              >
                Voir nos réalisations
              </Link>
            </div>
            
            {/* Clean Integrated Social Proof Rating */}
            <div
              className="stagger-scale-item stagger-scale-5"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                marginTop: 'var(--space-xs)',
              }}
            >
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#FBBC05" stroke="#FBBC05">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Noté <strong>4,9/5</strong> par plus de 107 clients
              </span>
            </div>
          </div>

          {/* Right Column: Key Statement Card */}
          <div className="hero-split-right stagger-scale-item stagger-scale-3">
            <div 
              style={{
                width: '100%',
                maxWidth: '520px',
                padding: 'var(--space-xl) var(--space-lg)',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(59, 130, 246, 0.01) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.15)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative soft glow bubble */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-20%',
                  right: '-20%',
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 75%)',
                  pointerEvents: 'none',
                }}
              />
              
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 'var(--space-md)', opacity: 0.9 }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>

              <p 
                style={{ 
                  fontSize: '1.20rem', 
                  lineHeight: '1.7', 
                  color: 'rgba(250, 250, 250, 0.95)', 
                  fontWeight: 500,
                  margin: 0,
                  fontFamily: 'var(--font-heading)'
                }}
              >
                Nous concevons des <span className="text-gradient" style={{ fontWeight: 700 }}>systèmes intelligents</span> qui génèrent des prospects, qualifient vos leads et convertissent vos visiteurs en clients <span className="text-gradient" style={{ fontWeight: 700 }}>24h/24</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Premium Stats Cards (4 Cards) */}
        <div className="hero-split-stats stagger-scale-item stagger-scale-3">
          {[
            { value: 250, prefix: '+', suffix: '%', label: 'Leads générés' },
            { value: 85, suffix: '%', label: 'Tâches automatisées' },
            { value: 24, suffix: '/7', label: 'Réponse IA continue' },
            { value: 107, suffix: '+', label: 'Clients satisfaits' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="hero-stat-card"
            >
              <span
                style={{
                  fontSize: '2.25rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                  lineHeight: 1.1,
                }}
              >
                {stat.prefix || ''}<NumberTicker value={stat.value} suffix={stat.suffix} />
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
