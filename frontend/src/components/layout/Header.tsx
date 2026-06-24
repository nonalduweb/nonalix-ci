'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { NAV_LINKS } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';

const dropdownServices = [
  { slug: 'design-web-ui-ux', title: 'Design Web & UI/UX', desc: 'Design mobile-first premium' },
  { slug: 'developpement-web', title: 'Développement Web', desc: 'Next.js ultra-rapide' },
  { slug: 'automatisation-business', title: 'Automatisez votre business', desc: 'Funnels & systèmes autonomes' },
  { slug: 'optimisation-seo', title: 'Optimisation SEO', desc: 'Référencement Côte d\'Ivoire' },
  { slug: 'campagnes-publicitaires-ppc', title: 'Campagnes PPC', desc: 'Publicité Facebook & Google' },
  { slug: 'boutiques-shopify', title: 'Boutiques Shopify', desc: 'E-commerce clé en main' },
  { slug: 'marketing-digital', title: 'Marketing Digital', desc: 'Plan d\'acquisition global' },
  { slug: 'audit-ux-ui', title: 'Audit UX/UI', desc: 'Optimisation de conversions' },
  { slug: 'solutions-ecommerce-sur-mesure', title: 'E-commerce sur Mesure', desc: 'Paiements Mobile Money' },
  { slug: 'optimisation-conversion-par-ia', title: 'Optimisation par IA', desc: 'Tests A/B automatisés' }
];

export function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  // Filter out contact link for main menu center alignment, since we have the CTA button
  const centerLinks = NAV_LINKS.filter((link) => link.href !== '/contact');

  return (
    <>
      <header className="header" id="main-header">
        <div className="header-inner">
          <Link href="/" aria-label="NONALIX CI — Accueil" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="logo-container">
              <Image
                src="/images/brand/logo.png"
                alt="NONALIX CI"
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 767px) 164px, 207px"
                priority
              />
            </div>
          </Link>

          <nav className="header-nav" aria-label="Navigation principale">
            {centerLinks.map((link) => {
              if (link.href === '/services') {
                return (
                  <div key={link.href} className="nav-item-dropdown">
                    <Link
                      href={link.href}
                      className={pathname.startsWith('/services') ? 'active' : ''}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      {link.label}
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform var(--transition-fast)' }}>
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                    <div className="dropdown-menu">
                      {dropdownServices.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/services/${service.slug}`}
                          className="dropdown-link"
                        >
                          <span className="dropdown-link-title">{service.title}</span>
                          <span className="dropdown-link-desc">{service.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href ? 'active' : ''}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="header-actions">
            <Link
              href="/contact"
              className="btn btn-highlight btn-sm"
              style={{
                borderRadius: '9999px',
                padding: '0.5rem 1.25rem',
                height: '40px',
                minHeight: '40px',
                fontSize: '0.875rem'
              }}
              id="nav-cta-contact"
            >
              Contactez-nous <span style={{ marginLeft: '4px' }}>↗</span>
            </Link>

            <button
              className="menu-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
              id="mobile-menu-toggle"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
      >
        <button
          className="mobile-nav-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Fermer le menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Top Logo */}
        <div style={{ marginBottom: 'var(--space-md)', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className="logo-container" style={{ height: '30px', width: '164px', position: 'relative' }}>
            <Image
              src="/images/brand/logo.png"
              alt="NONALIX CI"
              fill
              style={{ objectFit: 'contain' }}
              sizes="164px"
              priority
            />
          </div>
        </div>

        {/* Navigation links container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)', width: '100%' }}>
          {NAV_LINKS.map((link) => {
            if (link.href === '/services') {
              return (
                <div key={link.href} className="mobile-nav-item-group">
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`mobile-main-link ${pathname === link.href ? 'active' : ''}`}
                  >
                    {link.label}
                  </Link>
                  {/* Indented mobile sub-menu grid */}
                  <div className="mobile-submenu">
                    {dropdownServices.slice(0, 6).map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className={`mobile-submenu-link ${pathname === `/services/${service.slug}` ? 'active' : ''}`}
                      >
                        {service.title}
                      </Link>
                    ))}
                    {dropdownServices.length > 6 && (
                      <Link
                        href="/services"
                        onClick={() => setMobileOpen(false)}
                        className="mobile-submenu-link-more"
                        style={{ gridColumn: 'span 2' }}
                      >
                        Voir tous les services (10) ↗
                      </Link>
                    )}
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`mobile-main-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', width: '80%', maxWidth: '280px', marginTop: 'var(--space-md)' }}>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="btn btn-highlight"
            style={{
              borderRadius: '9999px',
              padding: '0.75rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textDecoration: 'none'
            }}
          >
            Contactez-nous <span style={{ marginLeft: '4px' }}>↗</span>
          </Link>
        </div>
      </div>

      {/* CSS local pour les icônes de connexion et responsive */}
      <style>{`
        .header-connection-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }
        .header-connection-btn:hover {
          background: rgba(37, 99, 235, 0.07);
          color: var(--color-accent-glow);
          transform: scale(1.05);
        }
        .header-connection-btn svg {
          width: 22px;
          height: 22px;
          color: currentColor;
        }
        .mobile-connection-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-full);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.9375rem;
          background: rgba(37, 99, 235, 0.08);
          border: 1.5px solid var(--color-accent);
          color: var(--color-accent-glow);
          transition: all var(--transition-base);
          text-decoration: none;
        }
        .mobile-connection-cta:hover {
          background: var(--color-accent);
          color: var(--color-primary);
        }
        .user-dropdown-container:hover .user-dropdown-menu {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) !important;
        }
        .user-logout-btn:hover {
          background-color: rgba(239, 68, 68, 0.08) !important;
        }
        .user-avatar-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 12px rgba(37, 99, 235, 0.4);
        }
        @media (max-width: 767px) {
          #nav-cta-contact {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

