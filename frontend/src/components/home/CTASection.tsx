'use client';

import { CONTACT_INFO } from '@/lib/constants';
import { ShimmerButton } from '@/components/ui/ShimmerButton';

export function CTASection() {
  return (
    <section className="section" id="cta-section">
      <div className="container">
        <div className="cta-section">
          <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>
            Prêt à <span className="text-gradient">transformer</span> votre business ?
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto var(--space-2xl)', lineHeight: 1.7 }}>
            Discutons de votre projet. Notre équipe d&apos;experts est prête
            à vous accompagner dans votre transformation digitale.
          </p>
          <div className="hero-actions">
            <ShimmerButton as="a" href={CONTACT_INFO.whatsappLink} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ marginRight: '8px', flexShrink: 0 }}>
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.82 14.01c-.24.68-1.42 1.3-1.96 1.38-.5.08-1.14.11-1.83-.11-.42-.14-.96-.34-1.65-.67-2.92-1.37-4.82-4.3-4.97-4.5-.14-.2-1.17-1.56-1.17-2.97 0-1.42.74-2.12 1-2.41.27-.28.58-.35.78-.35.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.18-.14.3-.28.46-.14.16-.3.36-.42.48-.14.14-.29.29-.12.57.17.28.74 1.22 1.59 1.97 1.1.97 2.02 1.27 2.3 1.41.28.14.45.12.61-.07.17-.2.71-.82.9-1.1.18-.28.37-.24.62-.14.26.1 1.62.76 1.9.9.28.14.46.2.53.32.07.11.07.65-.17 1.33z"/>
              </svg>
              Discuter sur WhatsApp
            </ShimmerButton>
            <ShimmerButton as="link" href="/contact" style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
              Demander un devis
            </ShimmerButton>
          </div>
        </div>
      </div>
    </section>
  );
}
