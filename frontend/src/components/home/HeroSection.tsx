'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { Particles } from '@/components/ui/Particles';

const MESSAGES = [
  "Nous concevons des systèmes intelligents qui génèrent des prospects, qualifient vos leads et convertissent vos visiteurs en clients 24h/24.",
  "Nos agents conversationnels WhatsApp répondent instantanément à vos clients et automatisent 80% des demandes répétitives.",
  "Nous connectons vos outils de facturation, e-mails et CRM via n8n pour libérer vos collaborateurs des copier-coller.",
  "Optimisez votre visibilité locale sur Google Maps pour multiplier vos appels commerciaux directs à Abidjan."
];

export function HeroSection() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // A continuously-playing (even muted) background video keeps mobile browsers
  // from auto-locking the screen. It's purely decorative, so freeze it on the
  // last frame after a few loops instead of looping forever.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let stopped = false;
    const stopTimer = setTimeout(() => {
      stopped = true;
      video.pause();
    }, 15000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (stopped) return;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0 }
    );
    observer.observe(video);

    return () => {
      clearTimeout(stopTimer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = MESSAGES[currentMessageIndex];
    
    // Typewriter speeds: faster deleting, natural typing
    const typingSpeed = isDeleting ? 15 : 30;

    const handleType = () => {
      if (!isDeleting) {
        setDisplayedText(fullText.substring(0, displayedText.length + 1));
        
        if (displayedText === fullText) {
          // Pause showing full text for 10s
          timer = setTimeout(() => setIsDeleting(true), 10000);
          return;
        }
      } else {
        setDisplayedText(fullText.substring(0, displayedText.length - 1));
        
        if (displayedText === '') {
          setIsDeleting(false);
          setCurrentMessageIndex((prev) => (prev + 1) % MESSAGES.length);
          return;
        }
      }
      
      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentMessageIndex]);

  return (
    <section
      className="hero"
      id="hero-section"
      style={{ backgroundColor: '#050505', position: 'relative', overflow: 'hidden' }}
    >
      {/* Video Background with dark overlay */}
      <div
        className="hero-video-bg"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.18, /* Optimisé pour maximiser le contraste et la lisibilité */
          }}
        >
          <source src="/videos/bannier%20nonalix%20ci%20le%20roi%20du%20digital%20en%20Afrique.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay to balance visibility and readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(5, 5, 5, 0.88) 0%, rgba(5, 5, 5, 0.5) 50%, rgba(5, 5, 5, 0.88) 100%)',
          }}
        />
      </div>

      {/* Floating particles layer (subtle gold) */}
      <Particles color="rgba(231, 173, 5, 0.25)" quantity={35} speed={0.15} size={1.2} opacity={0.25} />

      {/* Hero container */}
      <div className="container hero-container" style={{ position: 'relative', zIndex: 1, padding: 'calc(var(--header-height) + var(--space-md)) var(--content-padding) var(--space-3xl)' }}>
        
        {/* Split Grid Layout 50/50 */}
        <div className="hero-split-grid">
          
          {/* Left Column: Title, Subtitle, CTA */}
          <div className="hero-split-left">
            <h1 className="hero-giant-title stagger-scale-item stagger-scale-2" style={{ textTransform: 'none', letterSpacing: '-0.02em', fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.25, marginBottom: '2.5rem' }}>
              Automatisez. Développez.{' '}
              <br className="desktop-only-br" />
              Dominez votre marché{' '}
              <br className="desktop-only-br" />
              grâce à l&apos;<span style={{ color: 'var(--color-accent)' }}>IA</span>.
            </h1>

            <div className="hero-split-actions stagger-scale-item stagger-scale-4">
              <ShimmerButton
                as="link"
                href="/contact"
                className="hero-cta-contact-shimmer"
                style={{
                  borderRadius: '9999px',
                  padding: '0.875rem 2.25rem',
                  height: '54px',
                  fontSize: '0.975rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Automatiser ma croissance <span style={{ marginLeft: '6px' }}>↗</span>
              </ShimmerButton>

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
            <div className="hero-statement-card">
              {/* Decorative soft glow bubble */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-20%',
                  right: '-20%',
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(231, 173, 5, 0.1) 0%, transparent 75%)',
                  pointerEvents: 'none',
                }}
              />
              
              <div>
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
                  {displayedText}
                  <span className="typewriter-cursor" />
                </p>
              </div>

              {/* Micro-indicateurs d'agents IA interactifs */}
              <div className="hero-indicators-container">
                <div className="hero-indicator-badge success-badge">
                  <span className="live-pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                  Agent WhatsApp Actif 24/7
                </div>
                <div className="hero-indicator-badge info-badge">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e7ad05', display: 'inline-block' }} />
                  n8n Lead Engine Connecté
                </div>
                <div className="hero-indicator-badge warning-badge">
                  📈 Qualification IA: +92%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
        .live-pulse-dot {
          animation: pulseGlow 1.5s ease-in-out infinite;
        }
        .typewriter-cursor {
          display: inline-block;
          width: 2px;
          height: 1.15em;
          background-color: var(--color-accent);
          margin-left: 4px;
          vertical-align: middle;
          animation: cursorBlink 0.8s step-end infinite;
        }
        @keyframes cursorBlink {
          from, to { background-color: transparent }
          50% { background-color: var(--color-accent) }
        }

        /* Layout & Responsiveness */
        .hero-split-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }

        .hero-statement-card {
          width: 100%;
          max-width: 520px;
          min-height: 280px;
          padding: var(--space-xl) var(--space-lg);
          background: linear-gradient(135deg, rgba(231, 173, 5, 0.06) 0%, rgba(231, 173, 5, 0.01) 100%);
          border: 1px solid rgba(231, 173, 5, 0.15);
          border-radius: var(--radius-xl);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hero-indicators-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 1.25rem;
        }

        .hero-indicator-badge {
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 99px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .success-badge {
          background: rgba(16, 185, 129, 0.08);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .info-badge {
          background: rgba(231, 173, 5, 0.08);
          color: #e7ad05;
          border: 1px solid rgba(231, 173, 5, 0.2);
        }

        .warning-badge {
          background: rgba(245, 158, 11, 0.08);
          color: #F59E0B;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        @media (max-width: 767px) {
          .desktop-only-br {
            display: none;
          }
          .hero-giant-title {
            font-size: 2.25rem !important;
            margin-bottom: 1.5rem !important;
            line-height: 1.2 !important;
          }
          .hero-split-actions {
            flex-direction: column !important;
            width: 100% !important;
            gap: 10px !important;
          }
          .hero-split-actions :global(.hero-cta-contact-shimmer),
          .hero-split-actions :global(.btn) {
            width: 100% !important;
            justify-content: center !important;
            box-sizing: border-box;
          }
          .hero-statement-card {
            padding: var(--space-md) !important;
            min-height: auto !important;
          }
          .hero-indicators-container {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 6px !important;
            margin-top: 1rem !important;
            padding-top: 1rem !important;
          }
          .hero-indicator-badge {
            width: 100% !important;
            box-sizing: border-box;
          }
        }
      `}</style>
    </section>
  );
}
