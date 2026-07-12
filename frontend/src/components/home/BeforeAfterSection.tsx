'use client';

import React from 'react';
import Image from 'next/image';
import ScrollReveal from '@/components/layout/ScrollReveal';
import GlowingCard from '@/components/layout/GlowingCard';

const beforeItems = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    text: 'Vous répondez manuellement à chaque prospect',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    text: 'Vous perdez des ventes la nuit et le week-end',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
    ),
    text: 'Vous passez 3h/jour sur des tâches répétitives',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </svg>
    ),
    text: "Aucun suivi clair de vos demandes et prospects",
  },
];

const afterItems = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8" y2="16.01" />
        <line x1="16" y1="16" x2="16" y2="16.01" />
      </svg>
    ),
    text: 'Votre agent IA répond et qualifie 24h/24',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
    text: 'Vos ventes et prises de rendez-vous se font en continu',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    text: '85% de vos processus sont automatisés',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    text: 'Suivi visuel simple de vos prospects et clients prioritaires',
  },
];

export function BeforeAfterSection() {
  return (
    <section className="section" id="before-after" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(231, 173, 5, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <ScrollReveal>
          <div className="section-header" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="badge badge-accent" style={{ background: 'var(--color-ai-purple-light)', color: 'var(--color-ai-purple-glow)', borderColor: 'rgba(231, 173, 5, 0.2)' }}>
              TRANSFORMATION
            </span>
            <h2 style={{ marginTop: 'var(--space-md)' }}>
              Ce qui change avec <span className="text-gradient">NONALIX</span>
            </h2>
            <p>La différence entre gérer votre business manuellement et laisser l&apos;IA travailler pour vous.</p>
          </div>
        </ScrollReveal>

        <div className="before-after-grid">
          {/* BEFORE Column */}
          <ScrollReveal delayMs={100}>
            <GlowingCard className="ba-card-before">
              <div className="ba-header">
                <div className="ba-icon-wrapper-before">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <h3 className="ba-title-before">Avant NONALIX</h3>
              </div>

              <div className="ba-list">
                {beforeItems.map((item, i) => (
                  <ScrollReveal key={i} delayMs={150 + i * 80} threshold={0.05}>
                    <div className="ba-item-before">
                      <span className="ba-item-icon-before">{item.icon}</span>
                      <span className="ba-item-text-before">{item.text}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </GlowingCard>
          </ScrollReveal>

          {/* AFTER Column */}
          <ScrollReveal delayMs={250}>
            <GlowingCard className="ba-card-after">
              <div className="ba-header">
                <div className="ba-icon-wrapper-after">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="ba-title-after">Après NONALIX</h3>
              </div>

              <div className="ba-list">
                {afterItems.map((item, i) => (
                  <ScrollReveal key={i} delayMs={300 + i * 100} threshold={0.05}>
                    <div className="ba-item-after">
                      <span className="ba-item-icon-after">{item.icon}</span>
                      <span className="ba-item-text-after">{item.text}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </GlowingCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
