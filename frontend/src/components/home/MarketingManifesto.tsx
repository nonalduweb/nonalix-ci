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
              📢 CONSTAT & VISION
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
              Le marketing traditionnel est <span style={{ color: 'var(--color-highlight)', textShadow: '0 0 30px rgba(226, 83, 54, 0.25)' }}>mort</span>.
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
              Envoyer le même message à des milliers de personnes ne fonctionne plus. Aujourd&apos;hui, les clients exigence des réponses <strong>immédiates</strong>, des solutions <strong>sur-mesure</strong> et une <strong>fluidité totale</strong> dans leur parcours.
            </p>
          </ScrollReveal>
        </div>

        {/* Future of marketing intro & pillars */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Quel est l&apos;avenir du marketing ?
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 'var(--space-xs)' }}>
                Trois grandes révolutions redéfinissent complètement le secteur :
              </p>
            </div>
          </ScrollReveal>

          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
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
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(37, 99, 235, 0.02))', 
                    border: '1px solid rgba(37, 99, 235, 0.25)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--color-accent-glow)',
                    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.05)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginTop: 'var(--space-xs)' }}>
                  Data & Intelligence Artificielle
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  L&apos;intelligence artificielle permet d&apos;analyser le comportement des acheteurs à la seconde près pour leur proposer le bon produit, au bon moment, avec le bon message.
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
                  Le Commerce Conversationnel
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  Les tunnels de vente classiques cèdent la place aux messageries (WhatsApp, Messenger). Le client veut acheter, poser des questions et obtenir son service client au cours d&apos;une discussion naturelle.
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
                  L&apos;Automatisation des Processus
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  Les entreprises qui survivront sont celles qui automatiseront leurs tâches répétitives (leads, relances, commandes e-commerce) pour libérer du temps pour la stratégie et l&apos;humain.
                </p>
              </GlowingCard>
            </ScrollReveal>
          </div>
        </div>

      </div>
    </section>
  );
}
