'use client';

import Link from 'next/link';
import { SOCIAL_LINKS } from '@/lib/constants';

const TICKER_MESSAGE =
  '🚀 Automatisation IA  •  Développement Web  •  SEO & Référencement  •  Google Ads  •  Agents IA  •  Audit SEO & IA Gratuit      ';

export function AnnouncementBar() {
  return (
    <div className="announcement-bar" role="complementary" aria-label="Barre d'annonces NONALIX CI">

      {/* LEFT — scrolling ticker */}
      <div className="announcement-ticker-wrap">
        <div className="announcement-ticker" aria-hidden="true">
          <span>{TICKER_MESSAGE}</span>
          <span>{TICKER_MESSAGE}</span>
        </div>
      </div>

      {/* CENTER — CTA */}
      <div className="announcement-cta-wrap">
        <Link href="/audit-ia" className="announcement-cta">
          Audit gratuit <span className="announcement-cta-arrow">→</span>
        </Link>
      </div>

      {/* RIGHT — socials + reviews */}
      <div className="announcement-social-wrap">

        {/* Facebook */}
        <a
          href={SOCIAL_LINKS.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="announcement-social-icon"
          aria-label="Facebook NONALIX CI"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>

        {/* Instagram */}
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="announcement-social-icon"
          aria-label="Instagram NONALIX CI"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>

        {/* LinkedIn — desktop only */}
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="announcement-social-icon announcement-icon-desktop"
          aria-label="LinkedIn NONALIX CI"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>

        {/* Google Business — desktop only */}
        <a
          href={SOCIAL_LINKS.googleBusiness}
          target="_blank"
          rel="noopener noreferrer"
          className="announcement-social-icon announcement-icon-desktop"
          aria-label="Google Business NONALIX CI"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" fill="#4285F4" />
          </svg>
        </a>

        {/* Google reviews — desktop only */}
        <a
          href={SOCIAL_LINKS.googleReviews}
          target="_blank"
          rel="noopener noreferrer"
          className="announcement-review-btn announcement-icon-desktop"
          aria-label="Voir nos avis Google"
        >
          <span className="announcement-review-star">⭐</span>
          <span>Avis Google</span>
        </a>
      </div>
    </div>
  );
}
