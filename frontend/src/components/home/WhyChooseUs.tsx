'use client';

import React from 'react';
import ScrollReveal from '@/components/layout/ScrollReveal';

export default function WhyChooseUs() {
  return (
    <section className="section why-choose-us-section" id="why-choose-us">
      {/* Background radial glows */}
      <div 
        className="glow-bubble" 
        style={{ 
          position: 'absolute', 
          top: '40%', 
          right: '10%', 
          width: '450px', 
          height: '450px', 
          backgroundColor: 'rgba(37, 99, 235, 0.04)', 
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
          bottom: '10%', 
          left: '5%', 
          width: '350px', 
          height: '350px', 
          backgroundColor: 'rgba(226, 83, 54, 0.03)', 
          filter: 'blur(90px)', 
          borderRadius: 'var(--radius-full)', 
          pointerEvents: 'none', 
          zIndex: 0 
        }}
      />

      <div className="container why-choose-us-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Left Side: Copy */}
        <ScrollReveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <span className="badge badge-accent">🎯 POURQUOI NOUS</span>
            
            <h2 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text)', marginTop: 'var(--space-xs)' }}>
              Une expertise orientée <span className="text-gradient">performance</span> et <span className="text-gradient">innovation</span>.
            </h2>
            
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.975rem', lineHeight: 1.7, maxWidth: '540px', marginTop: 'var(--space-xs)' }}>
              Notre approche ne se limite pas à créer de simples outils. Nous vous aidons à construire un système digital cohérent, efficace et parfaitement adapté à vos objectifs de croissance en Côte d&apos;Ivoire et à l&apos;international.
            </p>
          </div>
        </ScrollReveal>

        {/* Right Side: Animated Orbit Ring */}
        <ScrollReveal delayMs={150}>
          <div className="orbit-wrapper">
            
            {/* Ambient background glow circle for the orbit */}
            <div 
              style={{
                position: 'absolute',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37,99,235,0.03) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            {/* Orbit Core (Center) */}
            <div className="orbit-core">
              <div className="orbit-core-glow"></div>
              <div className="orbit-core-base"></div>
              <div className="orbit-pulse-ring-1"></div>
              <div className="orbit-pulse-ring-2"></div>
            </div>

            {/* Main Rotating Ring with Nodes */}
            <div className="orbit-ring">
              
              {/* Node 1: Solutions modernes */}
              <div className="orbit-node">
                <div className="orbit-node-inner">
                  <div className="orbit-node-glow"></div>
                  <div className="orbit-node-btn" title="Solutions modernes">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  </div>
                  <span className="orbit-node-label">Solutions modernes</span>
                </div>
              </div>

              {/* Node 2: Design premium */}
              <div className="orbit-node">
                <div className="orbit-node-inner">
                  <div className="orbit-node-glow"></div>
                  <div className="orbit-node-btn" title="Design premium">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  </div>
                  <span className="orbit-node-label">Design premium</span>
                </div>
              </div>

              {/* Node 3: Accompagnement personnalisé */}
              <div className="orbit-node">
                <div className="orbit-node-inner">
                  <div className="orbit-node-glow"></div>
                  <div className="orbit-node-btn" title="Accompagnement personnalisé">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <span className="orbit-node-label">Accompagnement personnalisé</span>
                </div>
              </div>

              {/* Node 4: Approche stratégique */}
              <div className="orbit-node">
                <div className="orbit-node-inner">
                  <div className="orbit-node-glow"></div>
                  <div className="orbit-node-btn" title="Approche stratégique">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="6"/>
                      <circle cx="12" cy="12" r="2"/>
                    </svg>
                  </div>
                  <span className="orbit-node-label">Approche stratégique</span>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
