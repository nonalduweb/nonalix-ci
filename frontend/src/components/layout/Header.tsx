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
          <Link href="/" aria-label="NONALIX CI — Accueil">
            <Image
              src="/images/logo.png"
              alt="NONALIX CI"
              width={200}
              height={60}
              className="header-logo"
              priority
            />
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
            {user ? (
              <div className="user-dropdown-container" style={{ position: 'relative' }}>
                <button className="user-avatar-btn" aria-label="Mon compte" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  border: '1.5px solid var(--color-accent)',
                  color: 'var(--color-accent-glow)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  {user.firstName[0]?.toUpperCase()}{user.lastName[0]?.toUpperCase()}
                </button>
                <div className="user-dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '10px',
                  width: '240px',
                  backgroundColor: '#0c0f14',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  zIndex: 100,
                  opacity: 0,
                  visibility: 'hidden',
                  transform: 'translateY(10px)',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ padding: '4px 8px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.email}
                    </div>
                  </div>
                  <button onClick={logout} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  className="user-logout-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Se déconnecter
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/connexion" className="header-connection-btn" aria-label="Connexion" id="nav-login-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
            )}

            <Link href="/panier" className="cart-button" aria-label="Panier">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {totalItems > 0 && (
                <span className="cart-badge" aria-label={`${totalItems} articles`}>
                  {totalItems}
                </span>
              )}
            </Link>

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
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <Image
            src="/images/logo.png"
            alt="NONALIX CI"
            width={160}
            height={48}
            style={{ filter: 'none', height: 'auto', width: 'auto' }}
          />
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
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <div className="mobile-user-info" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  flexShrink: 0
                }}>
                  {user.firstName[0]?.toUpperCase()}{user.lastName[0]?.toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, textAlign: 'left' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.firstName} {user.lastName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="mobile-connection-cta"
                style={{ border: '1.5px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.08)', color: '#f87171' }}
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <Link
              href="/connexion"
              onClick={() => setMobileOpen(false)}
              className="mobile-connection-cta"
              id="mobile-login-icon"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Mon Compte / Connexion
            </Link>
          )}

          <Link
            href="/panier"
            onClick={() => setMobileOpen(false)}
            className="mobile-cart-cta"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Mon Panier {totalItems > 0 && ` (${totalItems})`}
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

