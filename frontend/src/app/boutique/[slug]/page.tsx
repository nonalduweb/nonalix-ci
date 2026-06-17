'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/constants';
import type { Product } from '@/types/product';

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const slug = params?.slug as string;

  useEffect(() => {
    if (!slug) return;
    
    Promise.all([
      fetch(`/api/products?slug=${slug}`).then((res) => (res.ok ? res.json() : null)),
      fetch('/api/products').then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([currentProduct, list]) => {
        setProduct(currentProduct);
        setAllProducts(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load product details:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="page-content">
        <div className="container section" style={{ paddingTop: 'var(--space-3xl)' }}>
          <div className="skeleton" style={{ width: '150px', height: '20px', marginBottom: 'var(--space-xl)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)' }}>
            <div className="skeleton" style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-lg)' }} />
            <div>
              <div className="skeleton" style={{ width: '100px', height: '24px', marginBottom: 'var(--space-md)' }} />
              <div className="skeleton" style={{ width: '250px', height: '40px', marginBottom: 'var(--space-md)' }} />
              <div className="skeleton" style={{ width: '120px', height: '32px', marginBottom: 'var(--space-lg)' }} />
              <div className="skeleton" style={{ width: '100%', height: '80px', marginBottom: 'var(--space-lg)' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-content">
        <div className="container section" style={{ textAlign: 'center' }}>
          <h1>Produit non trouvé</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 'var(--space-lg) 0' }}>
            Ce produit n&apos;existe pas ou a été retiré.
          </p>
          <Link href="/boutique" className="btn btn-primary">
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const similarProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const emojiMap: Record<string, string> = {
    'Marketing': '📊',
    'Intelligence Artificielle': '🤖',
    'E-commerce': '🛒',
    'Formation': '🎓',
  };

  return (
    <div className="page-content">
      <section className="section" style={{ paddingTop: 'var(--space-3xl)' }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{ marginBottom: 'var(--space-xl)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            <Link href="/" style={{ color: 'var(--color-accent-glow)' }}>Accueil</Link>
            {' / '}
            <Link href="/boutique" style={{ color: 'var(--color-accent-glow)' }}>Boutique</Link>
            {' / '}
            <span>{product.name}</span>
          </nav>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)' }}>
            {/* Image */}
            <div
              style={{
                aspectRatio: '16/9',
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
              }}
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>

            {/* Details */}
            <div>
              <span className="badge badge-accent" style={{ marginBottom: 'var(--space-md)' }}>
                {product.category}
              </span>
              <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)' }}>
                {product.name}
              </h1>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-highlight)', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-lg)' }}>
                {formatPrice(product.price)}
              </div>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-lg)', fontSize: '1rem' }}>
                {product.description}
              </p>

              {product.details && product.details.length > 0 && (
                <div style={{
                  marginBottom: 'var(--space-lg)',
                  padding: 'var(--space-md) var(--space-lg)',
                  background: 'var(--color-primary-light)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-accent-glow)', marginBottom: 'var(--space-sm)', fontFamily: 'var(--font-heading)' }}>
                    📚 Contenu détaillé du pack :
                  </h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                    {product.details.map((detail, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: 'var(--space-sm)', fontSize: '0.875rem', color: 'var(--color-text-secondary)', alignItems: 'flex-start', lineHeight: 1.5 }}>
                        <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.inStock ? (
                <span className="badge badge-success" style={{ marginBottom: 'var(--space-lg)', display: 'inline-flex' }}>
                  ✓ Disponible
                </span>
              ) : (
                <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-error)', marginBottom: 'var(--space-lg)', display: 'inline-flex' }}>
                  Indisponible
                </span>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <button
                  className="btn btn-primary btn-lg btn-full"
                  onClick={() => addItem(product as Product)}
                  disabled={!product.inStock}
                  id="product-add-to-cart"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Ajouter au panier
                </button>
                <Link href="/panier" className="btn btn-outline btn-lg btn-full">
                  Voir le panier
                </Link>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div style={{ marginTop: 'var(--space-4xl)' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xl)' }}>
                Produits similaires
              </h2>
              <div className="grid grid-3">
                {similarProducts.map((sp) => (
                  <Link key={sp.id} href={`/boutique/${sp.slug}`} className="card product-card">
                    <div className="product-card-image">
                      <Image
                        src={sp.imageUrl}
                        alt={sp.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="product-card-body">
                      <h3 className="product-card-name">{sp.name}</h3>
                      <div className="product-card-price">{formatPrice(sp.price)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
