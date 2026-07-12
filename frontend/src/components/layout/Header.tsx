'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart';
import { NAV_LINKS } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';

const serviceCategories = [
  {
    category: 'Sites & E-commerce',
    services: [
      { slug: 'developpement-web', title: 'Développement Web', desc: 'Next.js ultra-rapide', href: '/services/developpement-web' },
      { slug: 'design-web-ui-ux', title: 'Design Web & UI/UX', desc: 'Design mobile-first premium', href: '/services/design-web-ui-ux' },
      { slug: 'boutiques-shopify', title: 'Boutiques Shopify', desc: 'E-commerce clé en main', href: '/services/boutiques-shopify' },
      { slug: 'solutions-ecommerce-sur-mesure', title: 'E-commerce sur Mesure', desc: 'Paiements Mobile Money', href: '/services/solutions-ecommerce-sur-mesure' },
    ],
  },
  {
    category: 'SEO & Contenus',
    services: [
      { slug: 'optimisation-seo', title: 'Optimisation SEO', desc: 'Référencement Côte d\'Ivoire', href: '/services/optimisation-seo' },
      { slug: 'marketing-digital', title: 'Marketing Digital', desc: 'Plan d\'acquisition global', href: '/services/marketing-digital' },
    ],
  },
  {
    category: 'Publicité & Conversion',
    services: [
      { slug: 'campagnes-publicitaires-ppc', title: 'Campagnes PPC', desc: 'Publicité Facebook & Google', href: '/services/campagnes-publicitaires-ppc' },
      { slug: 'audit-ux-ui', title: 'Audit UX/UI', desc: 'Optimisation de conversions', href: '/services/audit-ux-ui' },
      { slug: 'optimisation-conversion-par-ia', title: 'Optimisation par IA', desc: 'Tests A/B automatisés', href: '/services/optimisation-conversion-par-ia' },
    ],
  },
  {
    category: 'Automatisation & IA',
    services: [
      { slug: 'automatisation-business', title: 'Automatisez votre business', desc: 'Funnels & systèmes autonomes', href: '/services/automatisation-business' },
    ],
  },
];

export function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  // Filter out /audit-ia from the main menu navigation since it's already the header's main CTA button.
  const headerLinks = NAV_LINKS.filter((link) => link.href !== '/audit-ia');

  // Ferme le méga-menu Services au clavier (Échap) en retirant le focus de l'élément actif.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const active = document.activeElement;
      if (active instanceof HTMLElement && active.closest('.nav-item-dropdown')) {
        active.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
                sizes="(max-width: 767px) 130px, 207px"
                priority
              />
            </div>
          </Link>

          <nav className="header-nav" aria-label="Navigation principale">
            {headerLinks.map((link) => {
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
                      {serviceCategories.map((cat) => (
                        <div key={cat.category} className="dropdown-category">
                          <span className="dropdown-category-title">{cat.category}</span>
                          {cat.services.map((service) => (
                            <Link
                              key={service.slug}
                              href={service.href}
                              className="dropdown-link"
                            >
                              <span className="dropdown-link-title">{service.title}</span>
                              <span className="dropdown-link-desc">{service.desc}</span>
                            </Link>
                          ))}
                        </div>
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
              href="/audit-ia"
              className="btn btn-highlight btn-sm header-contact-btn"
              style={{
                borderRadius: '9999px',
                padding: '0.5rem 1.25rem',
                height: '40px',
                minHeight: '40px',
                fontSize: '0.875rem'
              }}
              id="nav-cta-contact"
            >
              Audit IA Gratuit <span style={{ marginLeft: '4px' }}>↗</span>
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
          {headerLinks.map((link) => {
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
                  {/* Indented mobile sub-menu, regroupé par catégorie */}
                  <div className="mobile-submenu-groups">
                    {serviceCategories.map((cat) => (
                      <div key={cat.category} className="mobile-submenu">
                        <span className="mobile-submenu-category-title" style={{ gridColumn: 'span 2' }}>{cat.category}</span>
                        {cat.services.map((service) => (
                          <Link
                            key={service.slug}
                            href={service.href}
                            onClick={() => setMobileOpen(false)}
                            className={`mobile-submenu-link ${pathname === service.href ? 'active' : ''}`}
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    ))}
                    <Link
                      href="/services"
                      onClick={() => setMobileOpen(false)}
                      className="mobile-submenu-link-more"
                    >
                      Voir tous les services ↗
                    </Link>
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
            href="/audit-ia"
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
            Audit IA Gratuit <span style={{ marginLeft: '4px' }}>↗</span>
          </Link>
        </div>
      </div>

      {/* CSS local pour les icônes de connexion, le dropdown et le responsive */}
      <style>{`
        /* Fix visibility of absolute positioned dropdown */
        .header {
          overflow: visible !important;
        }

        /* Desktop Dropdown Styles */
        .nav-item-dropdown {
          position: relative;
        }
        .nav-item-dropdown:hover .dropdown-menu,
        .nav-item-dropdown:focus-within .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }
        .nav-item-dropdown:hover svg,
        .nav-item-dropdown:focus-within svg {
          transform: rotate(180deg);
        }
        .dropdown-link:focus-visible,
        .mobile-submenu-link:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          width: 580px;
          background: rgba(6, 7, 14, 0.97);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.25rem;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(231, 173, 5, 0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 100;
          margin-top: 10px;
        }
        .dropdown-link {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 8px 12px;
          border-radius: 10px;
          transition: all 0.2s ease;
          text-align: left;
        }
        .dropdown-link:hover {
          background: rgba(255, 255, 255, 0.03);
          transform: translateY(-1px);
        }
        .dropdown-link-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #ffffff;
        }
        .dropdown-link-desc {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
        }
        .dropdown-category {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .dropdown-category-title {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-accent);
          padding: 4px 12px 6px;
        }

        /* Mobile Dropdown / Submenu Styles */
        .mobile-nav-item-group {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .mobile-submenu {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          padding: 10px 14px;
          margin-top: 8px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          width: 100%;
          box-sizing: border-box;
        }
        .mobile-submenu-link {
          font-size: 0.8125rem;
          color: var(--color-text-secondary);
          padding: 6px 8px;
          border-radius: 6px;
          transition: all 0.2s ease;
          text-align: left;
        }
        .mobile-submenu-link:hover, .mobile-submenu-link.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.03);
        }
        .mobile-submenu-link-more {
          font-size: 0.8125rem;
          color: var(--color-accent);
          padding: 6px 8px;
          font-weight: 600;
          text-align: center;
          transition: color 0.2s ease;
        }
        .mobile-submenu-link-more:hover {
          color: #ffffff;
        }
        .mobile-submenu-groups {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }
        .mobile-submenu-category-title {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-accent);
          padding: 2px 8px 4px;
          text-align: left;
        }

        /* Connection Buttons & Rest */
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
          background: rgba(231, 173, 5, 0.07);
          color: var(--color-accent);
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
          background: rgba(231, 173, 5, 0.08);
          border: 1.5px solid var(--color-accent);
          color: var(--color-accent);
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
          box-shadow: 0 0 12px rgba(231, 173, 5, 0.4);
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

