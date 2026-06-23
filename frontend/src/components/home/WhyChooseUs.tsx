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
          backgroundColor: 'rgba(59, 130, 246, 0.03)', 
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
            <span className="badge badge-accent" style={{ background: 'var(--color-ai-purple-light)', color: 'var(--color-ai-purple-glow)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>RÉSULTATS</span>
            
            <h2 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text)', marginTop: 'var(--space-xs)' }}>
              Des systèmes qui génèrent des <span className="text-gradient">résultats</span> mesurables.
            </h2>
            
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.975rem', lineHeight: 1.7, maxWidth: '540px', marginTop: 'var(--space-xs)' }}>
              Nos clients ne payent pas pour un site web. Ils investissent dans un système d&apos;automatisation IA qui génère des leads, convertit des prospects et fait tourner leur business en continu.
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
                  <div className="orbit-node-btn" title="Agents IA">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 7v4" />
                    </svg>
                  </div>
                  <span className="orbit-node-label">Agents IA</span>
                </div>
              </div>

              {/* Node 2: Design premium */}
              <div className="orbit-node">
                <div className="orbit-node-inner">
                  <div className="orbit-node-glow"></div>
                  <div className="orbit-node-btn" title="Workflows automatisés">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <span className="orbit-node-label">Workflows automatisés</span>
                </div>
              </div>

              {/* Node 3: Accompagnement personnalisé */}
              <div className="orbit-node">
                <div className="orbit-node-inner">
                  <div className="orbit-node-glow"></div>
                  <div className="orbit-node-btn" title="Analytics temps réel">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 20V10" />
                      <path d="M12 20V4" />
                      <path d="M6 20v-6" />
                    </svg>
                  </div>
                  <span className="orbit-node-label">Analytics temps réel</span>
                </div>
              </div>

              {/* Node 4: Approche stratégique */}
              <div className="orbit-node">
                <div className="orbit-node-inner">
                  <div className="orbit-node-glow"></div>
                  <div className="orbit-node-btn" title="Intégrations natives">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </div>
                  <span className="orbit-node-label">Intégrations natives</span>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
