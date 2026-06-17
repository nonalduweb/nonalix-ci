'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Particles } from '@/components/ui/Particles';
import { AnimatedGradientText } from '@/components/ui/AnimatedGradientText';

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hero"
      id="hero-section"
      style={{ backgroundColor: '#000000', position: 'relative' }}
    >
      {/* Background Aurora Glows (GitHub style) */}
      <div className="aurora-container">
        <div className="aurora-orb aurora-blue" style={{ background: 'var(--color-accent-glow)', opacity: 0.12 }} />
        <div className="aurora-orb aurora-orange" style={{ background: 'var(--color-highlight)', opacity: 0.22, width: '450px', height: '450px' }} />
      </div>

      {/* Floating particles layer */}
      <Particles color="rgba(37, 99, 235, 0.7)" quantity={60} speed={0.4} size={1.5} opacity={0.5} />

      {/* Interactive Background Typography (NONALIX Spotlight Reveal) */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          overflow: 'hidden'
        }}
      >
        {/* Base Layer: Subtle Outlines */}
        <div className="hero-outlined-text">
          NONALIX
        </div>

        {/* Spotlight Reveal Layer */}
        <div
          className="hero-spotlight-text"
          style={{
            opacity: isHovered ? 0.75 : 0,
            clipPath: `circle(140px at ${mousePos.x}px ${mousePos.y}px)`,
          }}
        >
          NONALIX
        </div>
      </div>

      {/* Abstract Curved Wave Overlay (matching reference image curves) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.4 }}>
        <svg width="100%" height="100%" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', right: '-5%', top: '-5%', width: '75%', height: '110%' }}>
          <path d="M 100 650 Q 550 200 1000 650 T 1800 650" stroke="rgba(226, 83, 54, 0.28)" strokeWidth="3.5" fill="none" />
          <path d="M 100 700 Q 550 250 1000 700 T 1800 700" stroke="rgba(226, 83, 54, 0.16)" strokeWidth="1.5" fill="none" />
          <path d="M 100 600 Q 550 150 1000 600 T 1800 600" stroke="rgba(226, 83, 54, 0.08)" strokeWidth="6" strokeDasharray="12 16" fill="none" />
          <path d="M 200 150 C 500 650, 900 150, 1400 550" stroke="rgba(226, 83, 54, 0.22)" strokeWidth="3" fill="none" />
          <path d="M 250 170 C 550 670, 950 170, 1450 570" stroke="rgba(37, 99, 235, 0.18)" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      <div className="container hero-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-text">
          <p
            className="stagger-scale-item stagger-scale-1"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-md)',
              opacity: 0.95,
            }}
          >
            Agence de conception web et d&apos;IA basée en Côte d&apos;Ivoire
          </p>

          <h1 className="stagger-scale-item stagger-scale-2" style={{ textAlign: 'left' }}>
            Aider les entreprises à se développer grâce à la{' '}
            <AnimatedGradientText>conception web</AnimatedGradientText> et à l&apos;
            <AnimatedGradientText>automatisation par IA</AnimatedGradientText>
          </h1>

          <p className="hero-subtitle stagger-scale-item stagger-scale-3" style={{ textAlign: 'left', marginLeft: 0 }}>
            NONALIX CI conçoit des sites web d&apos;exception et de niveau international, avec des tunnels d&apos;achat optimisés et des agents conversationnels intelligents connectés à vos outils pour booster vos conversions.
          </p>

          <div
            className="hero-actions stagger-scale-item stagger-scale-4"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-xl)',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginTop: 'var(--space-md)',
              width: '100%',
            }}
          >
            <Link
              href="/contact"
              className="btn btn-highlight btn-lg"
              id="hero-cta-contact"
              style={{
                borderRadius: '9999px',
                padding: '0.875rem 2.25rem',
                boxShadow: 'var(--shadow-glow-highlight)',
                height: '54px',
                fontSize: '1rem',
              }}
            >
              Démarrez votre projet <span style={{ marginLeft: '6px' }}>↗</span>
            </Link>

            <div className="hero-rating" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              {/* Google SVG Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FBBC05" stroke="#FBBC05" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Note de <strong>4,9/5</strong> basée sur plus de 107 avis
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

