'use client';

import React from 'react';
import ScrollReveal from '@/components/layout/ScrollReveal';
import GlowingCard from '@/components/layout/GlowingCard';

export function MarketingManifesto() {
  return (
    <section className="section manifesto-section" id="manifeste">
      {/* Background visual effects */}
      <div 
        className="glow-bubble" 
        style={{ 
          position: 'absolute', 
          top: '20%', 
          left: '10%', 
          width: '400px', 
          height: '400px', 
          backgroundColor: 'rgba(226, 83, 54, 0.04)', 
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
          right: '10%', 
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
        
        {/* Constat / Hook */}
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
          <ScrollReveal>
            <span className="badge badge-highlight animate-pulse" style={{ marginBottom: 'var(--space-md)' }}>
              🚀 VISION & MISSION
            </span>
          </ScrollReveal>

          <ScrollReveal delayMs={100}>
            <h2 
              style={{ 
                fontSize: 'clamp(2rem, 5vw, 3rem)', 
                fontFamily: 'var(--font-heading)', 
                fontWeight: 800, 
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: 'var(--space-lg)' 
              }}
            >
              L&apos;ère de l&apos;<span style={{ color: 'var(--color-ai-purple-glow)', textShadow: '0 0 30px rgba(124, 58, 237, 0.25)' }}>automatisation IA</span> est là.
            </h2>
          </ScrollReveal>

          <ScrollReveal delayMs={200}>
            <p 
              style={{ 
                color: 'var(--color-text-secondary)', 
                fontSize: 'clamp(1rem, 2vw, 1.15rem)', 
                lineHeight: 1.7,
                maxWidth: '720px',
                margin: '0 auto'
              }}
            >
              Les entreprises qui domineront demain sont celles qui automatisent leurs processus aujourd&apos;hui. Agents IA autonomes, workflows intelligents et commerce conversationnel — bienvenue dans le <strong>futur du business</strong>.
            </p>
          </ScrollReveal>
        </div>

        {/* Future of marketing intro & pillars */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Trois piliers de l&apos;automatisation
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 'var(--space-xs)' }}>
                Les technologies qui propulsent nos clients vers la croissance autonome :
              </p>
            </div>
          </ScrollReveal>

          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
              gap: 'var(--space-lg)',
              marginTop: 'var(--space-lg)'
            }}
          >
            {/* Pillar 1 */}
            <ScrollReveal delayMs={100}>
              <GlowingCard 
                style={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 'var(--space-md)', 
                  padding: 'var(--space-xl)',
                  background: 'rgba(22, 23, 27, 0.6)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.03)'
                }}
              >
                <div 
                  style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(124, 58, 237, 0.02))', 
                    border: '1px solid rgba(124, 58, 237, 0.25)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--color-ai-purple-glow)',
                    boxShadow: '0 8px 20px rgba(124, 58, 237, 0.05)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                    <line x1="8" y1="15" x2="8" y2="15" strokeWidth="3" />
                    <line x1="16" y1="15" x2="16" y2="15" strokeWidth="3" />
                  </svg>
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginTop: 'var(--space-xs)' }}>
                  Agents IA Autonomes
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  Vos agents IA répondent, qualifient et convertissent vos prospects sans intervention humaine. Ils apprennent et s&apos;améliorent en continu.
                </p>
              </GlowingCard>
            </ScrollReveal>

            {/* Pillar 2 */}
            <ScrollReveal delayMs={200}>
              <GlowingCard 
                style={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 'var(--space-md)', 
                  padding: 'var(--space-xl)',
                  background: 'rgba(22, 23, 27, 0.6)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.03)'
                }}
              >
                <div 
                  style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'linear-gradient(135deg, rgba(226, 83, 54, 0.15), rgba(226, 83, 54, 0.02))', 
                    border: '1px solid rgba(226, 83, 54, 0.25)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--color-highlight)',
                    boxShadow: '0 8px 20px rgba(226, 83, 54, 0.05)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginTop: 'var(--space-xs)' }}>
                  Automatisation WhatsApp & Messenger
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  Votre chatbot vend, répond et prend des rendez-vous directement sur WhatsApp et Messenger. Le client achète naturellement au cours d&apos;une conversation.
                </p>
              </GlowingCard>
            </ScrollReveal>

            {/* Pillar 3 */}
            <ScrollReveal delayMs={300}>
              <GlowingCard 
                style={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 'var(--space-md)', 
                  padding: 'var(--space-xl)',
                  background: 'rgba(22, 23, 27, 0.6)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.03)'
                }}
              >
                <div 
                  style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.02))', 
                    border: '1px solid rgba(16, 185, 129, 0.25)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--color-success)',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.05)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginTop: 'var(--space-xs)' }}>
                  Workflows n8n & Make
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  Zéro tâche manuelle, zéro erreur. Vos processus métier (leads, relances, commandes, facturation) tournent en pilote automatique grâce à nos workflows intelligents.
                </p>
              </GlowingCard>
            </ScrollReveal>
          </div>
        </div>

      </div>
    </section>
  );
}
