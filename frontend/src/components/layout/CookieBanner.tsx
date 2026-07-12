'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or declined
    const consent = localStorage.getItem('nonalix-cookie-consent');
    if (!consent) {
      // Show banner with a small delay for smoother UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('nonalix-cookie-consent', 'accepted');
    setShowBanner(false);
    // Dispatch a custom event so other components (like AnalyticsTracker) know consent was given
    window.dispatchEvent(new Event('nonalix-consent-changed'));
  };

  const handleDecline = () => {
    localStorage.setItem('nonalix-cookie-consent', 'declined');
    setShowBanner(false);
    window.dispatchEvent(new Event('nonalix-consent-changed'));
  };

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--space-md)',
        left: 'var(--space-md)',
        right: 'var(--space-md)',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4), 0 0 40px rgba(231, 173, 5, 0.1)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
        animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
        <span style={{ fontSize: '1.5rem', marginTop: '-2px' }}>🍪</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
            Respect de votre vie privée
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: '1.5' }}>
            Nous utilisons des cookies pour mesurer l&apos;audience du site et enregistrer le trafic de manière anonyme afin d&apos;améliorer nos services. Vous pouvez accepter ou refuser ces cookies à tout moment. Pour en savoir plus, consultez nos{' '}
            <Link href="/mentions-legales" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
              mentions légales
            </Link>.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', alignSelf: 'stretch' }}>
        <button
          onClick={handleDecline}
          className="btn btn-outline btn-sm"
          style={{ padding: '6px 16px', fontSize: '0.8125rem' }}
        >
          Refuser
        </button>
        <button
          onClick={handleAccept}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 20px', fontSize: '0.8125rem', boxShadow: '0 0 10px rgba(231, 173, 5, 0.3)' }}
        >
          Accepter
        </button>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
