'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/constants';
import type { Product } from '@/types/product';
import CommunityPopup from '@/components/boutique/CommunityPopup';

// Unify all category colors around the premium blue brand color to avoid chaotic rainbow aesthetics
const CATEGORY_META: Record<string, { color: string; rgb: string; code: string }> = {
  'IA & ChatGPT':                 { color: '#3B82F6', rgb: '59,130,246',  code: 'AI'  },
  'E-commerce & Dropshipping':    { color: '#3B82F6', rgb: '59,130,246',  code: 'ECO' },
  'Business & Affiliation':       { color: '#3B82F6', rgb: '59,130,246',  code: 'BIZ' },
  'Marketing & Publicité':        { color: '#3B82F6', rgb: '59,130,246',  code: 'MKT' },
  'Montage & Réseaux Sociaux':    { color: '#3B82F6', rgb: '59,130,246',  code: 'VID' },
  'Développement & No-Code':      { color: '#3B82F6', rgb: '59,130,246',  code: 'DEV' },
  'Mindset & Ebooks':             { color: '#3B82F6', rgb: '59,130,246',  code: 'EKB' },
  'Langues, Finance & Dev. Perso':{ color: '#3B82F6', rgb: '59,130,246',  code: 'LFD' },
};
const DEFAULT_META = { color: '#3B82F6', rgb: '59,130,246', code: 'PRO' };

// Simplified and robust CountUp that updates correctly when target changes
function CountUp({ target, duration = 1000 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setVal(0);
      return;
    }
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return <span>{val}</span>;
}

export default function BoutiquePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [displayCategory, setDisplayCategory] = useState('Tous');
  const [displaySort, setDisplaySort] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [displaySearch, setDisplaySearch] = useState('');
  const [exiting, setExiting] = useState(false);
  const [gridKey, setGridKey] = useState(0);
  const { addItem, items } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Only use digital products
          setProducts(data.filter((p: any) => p.isDigital));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        setLoading(false);
      });
  }, []);

  // Debounce search query transitions to smooth animation
  useEffect(() => {
    const timer = setTimeout(() => {
      transition(() => setDisplaySearch(searchQuery));
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const transition = (cb: () => void) => {
    setExiting(true);
    setTimeout(() => {
      cb();
      setExiting(false);
      setGridKey((k) => k + 1);
    }, 220);
  };

  const handleCategory = (cat: string) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    transition(() => setDisplayCategory(cat));
  };

  const handleSort = (s: 'default' | 'price-asc' | 'price-desc') => {
    if (s === sortBy) return;
    setSortBy(s);
    transition(() => setDisplaySort(s));
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const handleDirectPurchase = (product: Product) => {
    addItem(product);
    router.push('/checkout');
  };

  // Categories list derived only from active digital products
  const categories = ['Tous', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products
    .filter((p) => displayCategory === 'Tous' || p.category === displayCategory)
    .filter((p) => {
      if (!displaySearch.trim()) return true;
      const q = displaySearch.toLowerCase();
      const nameMatch = p.name.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const detailsMatch = Array.isArray(p.details)
        ? p.details.some((detail: any) => String(detail).toLowerCase().includes(q))
        : false;
      return nameMatch || descMatch || detailsMatch;
    })
    .sort((a, b) => {
      if (displaySort === 'price-asc') return a.price - b.price;
      if (displaySort === 'price-desc') return b.price - a.price;
      
      // Default: sort alphabetically by category, then by id
      return a.category.localeCompare(b.category) || a.id.localeCompare(b.id);
    });

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="page-content">

      {/* ── HERO ── */}
      <section className="bq-hero">
        <div className="bq-hero-grid" aria-hidden="true" />
        <div className="bq-hero-glow-left" aria-hidden="true" />
        <div className="bq-hero-glow-right" aria-hidden="true" />
        <div className="bq-hero-scanline" aria-hidden="true" />

        <div className="container bq-hero-inner">
          <div className="bq-hero-eyebrow">
            <span className="bq-live-dot" />
            <span>FORMATION & OUTILS ACQUISITION</span>
            <span className="bq-live-tag">CATALOGUE</span>
          </div>

          <h1 className="bq-hero-title">
            Votre catalogue de<br />
            <span className="text-gradient">formation & ressources</span>
          </h1>

          <p className="bq-hero-sub">
            Développez vos compétences à votre rythme. Téléchargement immédiat · Liens sécurisés envoyés par e-mail · Paiements Mobile Money.
          </p>

          {/* Premium Search Bar */}
          <div className="bq-search-container" style={{
            maxWidth: '600px',
            margin: 'var(--space-xl) auto 0 auto',
            position: 'relative',
            zIndex: 10,
          }}>
            <div className="bq-search-wrapper" style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-lg)',
              padding: '2px 6px 2px 18px',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2.5" style={{ marginRight: '12px' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher une formation, un outil ou un module..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text)',
                  fontSize: '0.95rem',
                  padding: '12px 0',
                  outline: 'none',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Effacer la recherche"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="bq-hero-stats">
            <div className="bq-stat">
              <div className="bq-stat-num">
                <CountUp target={products.length} />
              </div>
              <div className="bq-stat-label">Packs Digitaux</div>
            </div>
            <div className="bq-stat-div" />
            <div className="bq-stat">
              <div className="bq-stat-num">
                <CountUp target={categories.length - 1} />
              </div>
              <div className="bq-stat-label">Thématiques</div>
            </div>
            <div className="bq-stat-div" />
            <div className="bq-stat">
              <div className="bq-stat-num">24h/24</div>
              <div className="bq-stat-label">Accès Immédiat</div>
            </div>
            {cartCount > 0 && (
              <>
                <div className="bq-stat-div" />
                <Link href="/panier" className="bq-cart-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  {cartCount} article{cartCount > 1 ? 's' : ''} au panier
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div className="bq-filter-bar-wrap">
        <div className="container">
          <div className="bq-filter-bar">
            <div className="bq-pills">
              {categories.map((cat) => {
                const meta = cat !== 'Tous' ? (CATEGORY_META[cat] || DEFAULT_META) : null;
                return (
                  <button
                    key={cat}
                    className={`bq-pill ${activeCategory === cat ? 'bq-pill-active' : ''}`}
                    onClick={() => handleCategory(cat)}
                  >
                    {meta && (
                      <span className="bq-pill-code" style={{ color: '#3B82F6' }}>{meta.code}</span>
                    )}
                    {cat}
                  </button>
                );
              })}
            </div>
            <div className="bq-filter-right">
              <span className="bq-count">
                <span className="bq-count-dot" />
                {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''}
              </span>
              <select
                className="bq-sort"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value as typeof sortBy)}
                aria-label="Trier par"
              >
                <option value="default">Trier par</option>
                <option value="price-asc">Prix ↑</option>
                <option value="price-desc">Prix ↓</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <section className="section" style={{ paddingTop: 'var(--space-2xl)' }}>
        <div className="container">
          <div
            key={gridKey}
            className={`bq-grid ${exiting ? 'bq-grid-exit' : ''}`}
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bq-card skeleton"
                  style={{
                    height: '320px',
                    opacity: 0.6,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                />
              ))
            ) : filteredProducts.map((product, idx) => {
              const meta = CATEGORY_META[product.category] || DEFAULT_META;
              const isAdded = addedId === product.id;

              return (
                <div
                  key={product.id}
                  className="bq-card"
                  style={{
                    '--c': '#3B82F6',
                    '--rgb': '59,130,246',
                    animationDelay: `${idx * 0.045}s`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  } as React.CSSProperties}
                >
                  <div>
                    {/* Accent left bar */}
                    <div className="bq-card-bar" />

                    {/* Ghost watermark */}
                    <div className="bq-card-watermark" aria-hidden="true">
                      {meta.code}
                    </div>

                    {/* Top row */}
                    <div className="bq-card-head">
                      <span className="bq-card-code" style={{ color: '#3B82F6' }}>
                        {meta.code}·{String(product.id).replace('prod_', '')}
                      </span>
                      <div className="bq-card-badges">
                        {product.featured && (
                          <span className="bq-badge bq-badge-top" style={{ color: 'var(--color-highlight)', background: 'rgba(226,83,54,0.1)', borderColor: 'rgba(226,83,54,0.2)' }}>TOP</span>
                        )}
                        <span className="bq-badge bq-badge-digital" style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.2)', color: '#3B82F6' }}>DIGITAL</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="bq-card-body" style={{ paddingBottom: 0 }}>
                      <Link href={`/boutique/${product.slug}`} className="bq-card-title-link">
                        <h3 className="bq-card-title">{product.name}</h3>
                      </Link>
                      <p className="bq-card-desc">{product.description}</p>

                      {/* OpenClassrooms-style Syllabus Checklist */}
                      <div className="bq-card-syllabus" style={{
                        marginTop: '12px',
                        marginBottom: '12px',
                        borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
                        paddingTop: '12px',
                      }}>
                        <span style={{
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          color: 'var(--color-text-muted)',
                          display: 'block',
                          marginBottom: '8px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          Programme détaillé :
                        </span>
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}>
                          {Array.isArray(product.details) && product.details.slice(0, 3).map((detail: any, dIdx: number) => (
                            <li key={dIdx} style={{
                              fontSize: '0.75rem',
                              color: 'var(--color-text-secondary)',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '6px',
                              lineHeight: '1.4',
                            }}>
                              <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
                              <span style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                width: '100%',
                              }} title={String(detail)}>
                                {String(detail)}
                              </span>
                            </li>
                          ))}
                          {Array.isArray(product.details) && product.details.length > 3 && (
                            <li style={{
                              fontSize: '0.725rem',
                              color: 'var(--color-accent-glow)',
                              fontWeight: 600,
                              paddingLeft: '14px',
                              fontStyle: 'italic',
                              marginTop: '2px',
                            }}>
                              + {product.details.length - 3} autres modules inclus
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Inclusions info */}
                    <div className="bq-card-inclusions" style={{
                      display: 'flex',
                      gap: '8px',
                      fontSize: '0.6875rem',
                      color: 'var(--color-text-muted)',
                      padding: '0 16px 8px 20px',
                      alignItems: 'center',
                    }}>
                      <span>Téléchargement Immédiat</span>
                      <span>•</span>
                      <span>Accès à vie</span>
                    </div>

                    {/* Footer */}
                    <div className="bq-card-foot" style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--color-border)', padding: '12px 16px 14px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div className="bq-card-price" style={{ color: 'var(--color-highlight)', fontSize: '1.15rem', fontWeight: 800 }}>
                          {formatPrice(product.price)}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontFamily: 'Courier New, monospace' }}>
                          {meta.code}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '4px' }}>
                        <button
                          className="btn btn-outline"
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            fontSize: '0.8rem',
                            minHeight: '38px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--radius-md)'
                          }}
                          onClick={() => handleAddToCart(product as Product)}
                          aria-label={`Ajouter ${product.name} au panier`}
                        >
                          {isAdded ? 'Ajouté' : '+ Panier'}
                        </button>

                        <button
                          className="btn btn-highlight"
                          style={{
                            flex: 1.2,
                            padding: '6px 10px',
                            fontSize: '0.8rem',
                            minHeight: '38px',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-md)'
                          }}
                          onClick={() => handleDirectPurchase(product as Product)}
                        >
                          Achat Direct
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
 
          {!loading && filteredProducts.length === 0 && (
            <div className="bq-empty">
              <div className="bq-empty-glyph">◎</div>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
                Aucun pack digital ne correspond à votre recherche.
              </p>
              <button className="btn btn-outline" onClick={() => { setSearchQuery(''); handleCategory('Tous'); }}>
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── COMMUNITY POPUP ── */}
      <CommunityPopup />
    </div>
  );
}
