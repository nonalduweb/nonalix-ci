'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/constants';
import type { Product } from '@/types/product';

const CATEGORY_META: Record<string, { color: string; rgb: string; code: string }> = {
  'Marketing':               { color: '#E25336', rgb: '226,83,54',   code: 'MKT' },
  'Intelligence Artificielle':{ color: '#3B82F6', rgb: '59,130,246',  code: 'AI'  },
  'E-commerce':              { color: '#3B82F6', rgb: '59,130,246',  code: 'ECO' },
  'Formation':               { color: '#3B82F6', rgb: '59,130,246',  code: 'EDU' },
  'Produits Digitaux':       { color: '#E25336', rgb: '226,83,54',   code: 'DIG' },
};
const DEFAULT_META = { color: '#3B82F6', rgb: '59,130,246', code: 'PRO' };

function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const triggered = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !triggered.current) {
        triggered.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setVal(Math.round(p * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{val}</span>;
}

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [displayCategory, setDisplayCategory] = useState('Tous');
  const [displaySort, setDisplaySort] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [exiting, setExiting] = useState(false);
  const [gridKey, setGridKey] = useState(0);
  const { addItem, items } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        setLoading(false);
      });
  }, []);

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

  const categories = ['Tous', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products
    .filter((p) => displayCategory === 'Tous' || p.category === displayCategory)
    .sort((a, b) => {
      if (displaySort === 'price-asc') return a.price - b.price;
      if (displaySort === 'price-desc') return b.price - a.price;
      
      // Default: group by color (Blue first, Orange-Red second)
      const aMeta = CATEGORY_META[a.category] || DEFAULT_META;
      const bMeta = CATEGORY_META[b.category] || DEFAULT_META;
      if (aMeta.color === '#3B82F6' && bMeta.color === '#E25336') return -1;
      if (aMeta.color === '#E25336' && bMeta.color === '#3B82F6') return 1;
      return 0;
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
            <span>DIGITAL SOLUTIONS CENTER</span>
            <span className="bq-live-tag">LIVE</span>
          </div>

          <h1 className="bq-hero-title">
            L&apos;arsenal digital<br />
            <span className="text-gradient">de votre croissance</span>
          </h1>

          <p className="bq-hero-sub">
            Choisissez votre solution. Paiement Mobile Money · Livraison instantanée · Support 24/7.
          </p>

          <div className="bq-hero-stats">
            <div className="bq-stat">
              <div className="bq-stat-num">
                <CountUp target={products.length} />+
              </div>
              <div className="bq-stat-label">Solutions</div>
            </div>
            <div className="bq-stat-div" />
            <div className="bq-stat">
              <div className="bq-stat-num">
                <CountUp target={categories.length - 1} />
              </div>
              <div className="bq-stat-label">Catégories</div>
            </div>
            <div className="bq-stat-div" />
            <div className="bq-stat">
              <div className="bq-stat-num">24/7</div>
              <div className="bq-stat-label">Disponibilité</div>
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
                    style={activeCategory === cat && meta ? {
                      borderColor: meta.color,
                      color: meta.color,
                      boxShadow: `0 0 12px rgba(${meta.rgb}, 0.25)`,
                    } : undefined}
                    onClick={() => handleCategory(cat)}
                  >
                    {meta && (
                      <span className="bq-pill-code" style={{ color: meta.color }}>{meta.code}</span>
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
              const isDigital = (product as any).isDigital;
              const detailsCount = (product as any).details?.length ?? 0;

              return (
                <div
                  key={product.id}
                  className="bq-card"
                  style={{
                    '--c': meta.color,
                    '--rgb': meta.rgb,
                    animationDelay: `${idx * 0.045}s`,
                  } as React.CSSProperties}
                >
                  {/* Accent left bar */}
                  <div className="bq-card-bar" />

                  {/* Ghost watermark */}
                  <div className="bq-card-watermark" aria-hidden="true">
                    {meta.code}
                  </div>

                  {/* Top row */}
                  <div className="bq-card-head">
                    <span className="bq-card-code" style={{ color: meta.color }}>
                      {meta.code}·{String(product.id).replace('prod_', '')}
                    </span>
                    <div className="bq-card-badges">
                      {product.featured && (
                        <span className="bq-badge bq-badge-top">TOP</span>
                      )}
                      {isDigital && (
                        <span className="bq-badge bq-badge-digital">DIGITAL</span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bq-card-body">
                    <Link href={`/boutique/${product.slug}`} className="bq-card-title-link">
                      <h3 className="bq-card-title">{product.name}</h3>
                    </Link>
                    <p className="bq-card-desc">{product.description}</p>

                    {detailsCount > 0 && (
                      <div className="bq-card-modules">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="9 11 12 14 22 4"/>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                        </svg>
                        {detailsCount} modules inclus
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="bq-card-foot">
                    <div className="bq-card-price" style={{ color: meta.color }}>
                      {formatPrice(product.price)}
                    </div>
                    <button
                      className={`bq-add-btn ${isAdded ? 'bq-add-btn-done' : ''}`}
                      style={{ '--c': meta.color, '--rgb': meta.rgb } as React.CSSProperties}
                      onClick={() => handleAddToCart(product as Product)}
                      aria-label={`Ajouter ${product.name}`}
                    >
                      {isAdded ? (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Ajouté
                        </>
                      ) : (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                          </svg>
                          Ajouter
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
 
          {!loading && filteredProducts.length === 0 && (
            <div className="bq-empty">
              <div className="bq-empty-glyph">◎</div>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
                Aucun produit dans cette catégorie.
              </p>
              <button className="btn btn-outline" onClick={() => handleCategory('Tous')}>
                Voir tout
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
