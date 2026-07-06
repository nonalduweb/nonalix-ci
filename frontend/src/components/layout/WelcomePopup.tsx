'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't seen it before
    const hasSeenPopup = localStorage.getItem('nonalix_popup_seen');
    if (!hasSeenPopup) {
      // Slight delay for a smoother appearance after page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('nonalix_popup_seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="welcome-popup-overlay" onClick={handleClose}>
      <div className="welcome-popup" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          className="welcome-popup-close"
          onClick={handleClose}
          aria-label="Fermer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Icon */}
        <div className="welcome-popup-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="welcome-popup-title">
          Boostez votre<br />
          <em>croissance digitale</em>
        </h2>

        {/* Subtitle */}
        <p className="welcome-popup-subtitle">
          Ne laissez pas la concurrence prendre de l&apos;avance.<br />
          Choisissez votre outil d&apos;optimisation gratuit :
        </p>

        {/* CTA Cards */}
        <div className="welcome-popup-actions">
          <Link href="/audit-ia" className="welcome-popup-card" onClick={handleClose}>
            <div className="welcome-popup-card-icon welcome-popup-card-icon--purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div className="welcome-popup-card-text">
              <strong>Audit IA Gratuit</strong>
              <span>Rapport complet gratuit par email</span>
            </div>
            <div className="welcome-popup-card-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>

          <Link href="/audit-seo" className="welcome-popup-card" onClick={handleClose}>
            <div className="welcome-popup-card-icon welcome-popup-card-icon--orange">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div className="welcome-popup-card-text">
              <strong>Audit SEO</strong>
              <span>Analysez la visibilité de votre site sur Google</span>
            </div>
            <div className="welcome-popup-card-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Dismiss link */}
        <button className="welcome-popup-dismiss" onClick={handleClose}>
          Peut-être plus tard
        </button>
      </div>
    </div>
  );
}
