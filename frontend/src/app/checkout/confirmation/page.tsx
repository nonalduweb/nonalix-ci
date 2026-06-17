'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CONTACT_INFO } from '@/lib/constants';
interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
    featured: boolean;
    isDigital: boolean;
    downloadUrl?: string | null;
    details: string[];
  };
}

interface OrderData {
  id: string;
  firstName: string;
  lastName: string;
  paymentStatus: string;
  items: OrderItem[];
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    fetch(`/api/orders?id=${orderId}`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching order:', err);
        setLoading(false);
      });
  }, [orderId]);

  // Identify digital products from order items
  const digitalItems = order
    ? order.items
        .map((item) => item.product)
        .filter((p): p is NonNullable<typeof p> => !!p && p.isDigital)
    : [];

  return (
    <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-xl)',
          fontSize: '2.5rem',
        }}
      >
        ✅
      </div>

      <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)' }}>
        Commande confirmée !
      </h1>

      <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-xl)' }}>
        Merci pour votre commande ! Nous avons bien reçu votre demande.
        {digitalItems.length > 0
          ? " Vos liens de téléchargement pour vos produits digitaux sont disponibles ci-dessous."
          : " Notre équipe va vous contacter très rapidement par téléphone pour confirmer les détails de livraison."}
      </p>

      {/* Digital Products Downloads */}
      {digitalItems.length > 0 && (
        <div
          className="card animate-fade-in-up"
          style={{
            textAlign: 'left',
            marginBottom: 'var(--space-xl)',
            background: 'var(--color-primary-light)',
            border: '2.5px solid var(--color-accent)',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent-glow)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <span>📥</span> Vos téléchargements instantanés
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-lg)' }}>
            Cliquez sur les boutons ci-dessous pour accéder directement à vos espaces de formation sécurisés (Mega / Google Drive) :
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {digitalItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="50px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)' }}>{item.name}</h4>
                    <span className="badge badge-accent" style={{ fontSize: '0.625rem', marginTop: '2px' }}>Produit Digital</span>
                  </div>
                </div>

                {item.downloadUrl && (
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm btn-full"
                    style={{ minHeight: '40px' }}
                  >
                    Ouvrir le dossier de téléchargement ({item.downloadUrl.includes('mega') ? 'Mega' : 'Google Drive'}) →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps for Physical Products */}
      {(!order || digitalItems.length === 0 || (order && order.items.length > digitalItems.length)) && (
        <div className="card" style={{ textAlign: 'left', marginBottom: 'var(--space-xl)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent-glow)' }}>
            Prochaines étapes (Produits physiques) :
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <li style={{ display: 'flex', gap: 'var(--space-sm)', color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              <span>1️⃣</span>
              <span>Notre équipe vous appelle pour confirmer votre commande</span>
            </li>
            <li style={{ display: 'flex', gap: 'var(--space-sm)', color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              <span>2️⃣</span>
              <span>Nous préparons votre commande et organisons la livraison</span>
            </li>
            <li style={{ display: 'flex', gap: 'var(--space-sm)', color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              <span>3️⃣</span>
              <span>Vous recevez votre commande à l&apos;adresse indiquée</span>
            </li>
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <a
          href={CONTACT_INFO.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-highlight btn-lg btn-full"
        >
          Suivre sur WhatsApp
        </a>
        <Link href="/boutique" className="btn btn-outline btn-lg btn-full">
          Continuer les achats
        </Link>
        <Link href="/" className="btn btn-ghost">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="page-content">
      <section className="section" style={{ paddingTop: 'var(--space-4xl)' }}>
        <Suspense fallback={
          <div className="container" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto var(--space-xl)' }} />
            <div className="skeleton" style={{ width: '200px', height: '30px', margin: '0 auto var(--space-md)' }} />
            <div className="skeleton" style={{ width: '300px', height: '20px', margin: '0 auto var(--space-lg)' }} />
          </div>
        }>
          <ConfirmationContent />
        </Suspense>
      </section>
    </div>
  );
}
