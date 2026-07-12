'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/constants';

export default function PanierPage() {
  const { items, totalAmount, totalItems, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="page-content">
        <div className="container section" style={{ textAlign: 'center', paddingTop: 'var(--space-4xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-lg)', color: 'var(--color-text-secondary)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)' }}>
            Votre panier est vide
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
            Découvrez nos solutions digitales et ajoutez-les à votre panier.
          </p>
          <Link href="/boutique" className="btn btn-primary btn-lg">
            Explorer la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <section className="section" style={{ paddingTop: 'var(--space-4xl)' }}>
        <div className="container">
          <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-xl)' }}>
            Votre panier
            <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: 'var(--space-sm)' }}>
              ({totalItems} {totalItems > 1 ? 'articles' : 'article'})
            </span>
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)' }}>
            {/* Cart Items */}
            <div>
              {items.map((item) => (
                <div key={item.product.id} className="cart-item">
                  <div className="cart-item-image" style={{ position: 'relative' }}>
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.product.name}</div>
                    <div className="cart-item-price">{formatPrice(item.product.price)}</div>
                    <div className="cart-quantity">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        aria-label="Diminuer la quantité"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        aria-label="Augmenter la quantité"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        style={{ marginLeft: 'auto', color: 'var(--color-error)', border: 'none', background: 'none', fontSize: '0.8125rem' }}
                        aria-label="Supprimer"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-md)' }}>
                Récapitulatif
              </h3>
              {items.map((item) => (
                <div key={item.product.id} className="order-summary-row">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
              <div className="order-summary-row order-summary-total">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div style={{ marginTop: 'var(--space-lg)' }}>
                <Link href="/checkout" className="btn btn-highlight btn-lg btn-full" id="proceed-to-checkout">
                  Passer la commande
                </Link>
              </div>
              <div style={{ marginTop: 'var(--space-md)', textAlign: 'center' }}>
                <Link href="/boutique" style={{ fontSize: '0.875rem', color: 'var(--color-accent)' }}>
                  ← Continuer les achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
