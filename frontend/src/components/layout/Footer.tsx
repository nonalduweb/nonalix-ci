import Link from 'next/link';
import Image from 'next/image';
import { CONTACT_INFO, LEGAL_INFO, NAV_LINKS, SITE_CONFIG } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Image
              src="/images/brand/logo-footer.png"
              alt="NONALIX CI"
              width={360}
              height={108}
              style={{ height: 'auto', width: 'auto', maxHeight: '108px' }}
            />
            <p>
              Systèmes d&apos;automatisation IA, agents conversationnels et stratégies de
              croissance digitale pour les entreprises en Côte d&apos;Ivoire. Nous
              construisons des machines de vente automatisées grâce à l&apos;IA.
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-links">
            <h4>Navigation</h4>
            <div className="footer-links-grid">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
              <Link href="/panier">Panier</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="footer-contact">
            <h4>Contact</h4>
            <div className="footer-contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{CONTACT_INFO.address}</span>
            </div>
            <div className="footer-contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <a href={`tel:${CONTACT_INFO.phone}`}>{CONTACT_INFO.phoneDisplay}</a>
            </div>
            <div className="footer-contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© {LEGAL_INFO.year} {SITE_CONFIG.fullName}. Tous droits réservés.</p>
          <p className="footer-legal">
            RCCM : {LEGAL_INFO.rccm} | IDU : {LEGAL_INFO.idu}
          </p>
          <p style={{ marginTop: 'var(--space-xs)', fontSize: '0.8125rem' }}>
            <Link href="/mentions-legales" style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline' }}>
              Mentions Légales & Politique de Confidentialité
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
