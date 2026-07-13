'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CONTACT_INFO } from '@/lib/constants';
import { fbTrack } from '@/lib/fbpixel';
import { useCart } from '@/lib/cart';
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
  paymentMethod?: string;
  items: OrderItem[];
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const { clearCart } = useCart();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  // Au retour de la page de paiement PawaPay, le webhook peut mettre quelques
  // secondes à confirmer : on re-vérifie le statut toutes les 4 s (2 min max)
  // tant que le paiement est en cours.
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const fetchOrder = () => {
      fetch(`/api/orders?id=${orderId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (cancelled) return;
          setOrder(data);
          setLoading(false);

          if (data?.paymentStatus === 'completed') {
            clearCart();
            // Pixel Meta : achat confirmé (une seule fois par commande grâce au flag sessionStorage)
            const flag = `fb-purchase-${orderId}`;
            if (!sessionStorage.getItem(flag)) {
              sessionStorage.setItem(flag, '1');
              fbTrack('Purchase', {
                content_ids: data.items?.map((i: { product?: { id?: string } }) => i.product?.id).filter(Boolean),
                content_type: 'product',
                value: data.totalAmount,
                currency: 'XOF',
              });
            }
          } else if (
            data &&
            ['pending', 'processing'].includes(data.paymentStatus) &&
            attempts < 30
          ) {
            attempts += 1;
            timer = setTimeout(fetchOrder, 4000);
          }
        })
        .catch((err) => {
          console.error('Error fetching order:', err);
          if (!cancelled) setLoading(false);
        });
    };

    fetchOrder();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Identify digital products from order items
  const digitalItems = order
    ? order.items
        .map((item) => item.product)
        .filter((p): p is NonNullable<typeof p> => !!p && p.isDigital)
    : [];

  const paymentFailed = order?.paymentStatus === 'failed';
  // Paiement en ligne encore en cours de vérification (retour de PawaPay avant le webhook)
  const paymentInProgress =
    order?.paymentMethod === 'pawapay' &&
    ['pending', 'processing'].includes(order?.paymentStatus || '');

  return (
    <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: paymentFailed
            ? 'rgba(239, 68, 68, 0.15)'
            : paymentInProgress
              ? 'rgba(231, 173, 5, 0.15)'
              : 'rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-xl)',
          fontSize: '2.5rem',
        }}
      >
        {paymentFailed ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : paymentInProgress ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)' }}>
        {paymentFailed
          ? 'Paiement non abouti'
          : paymentInProgress
            ? 'Vérification du paiement…'
            : 'Commande confirmée !'}
      </h1>

      <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-xl)' }}>
        {paymentFailed
          ? 'Votre paiement n’a pas pu être finalisé. Aucun montant ne vous a été débité. Vous pouvez réessayer depuis la boutique ou nous contacter pour de l’aide.'
          : paymentInProgress
          ? 'Votre paiement est en cours de confirmation par votre opérateur Mobile Money. Cette page se mettra à jour automatiquement — cela prend généralement moins d’une minute. Si vous n’avez pas encore validé le paiement sur votre téléphone, faites-le maintenant.'
          : <>Merci pour votre commande ! Nous avons bien reçu votre demande.
        {digitalItems.length > 0
          ? (order?.paymentStatus === 'completed'
              ? " Vos liens de téléchargement pour vos produits digitaux sont disponibles ci-dessous."
              : " Vos liens de téléchargement seront disponibles dès la validation de votre paiement en ligne.")
          : " Notre équipe va vous contacter très rapidement par téléphone pour confirmer les détails de livraison."}</>}
      </p>

      {/* Digital Products Downloads */}
      {digitalItems.length > 0 && order?.paymentStatus === 'completed' && (
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
          <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
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

      {/* Pending Payment Card for Digital Products */}
      {digitalItems.length > 0 && order?.paymentStatus !== 'completed' && (
        <div
          className="card animate-fade-in-up"
          style={{
            textAlign: 'left',
            marginBottom: 'var(--space-xl)',
            background: 'rgba(245, 158, 11, 0.04)',
            border: '2px solid #f59e0b',
            boxShadow: '0 0 25px rgba(245, 158, 11, 0.1)',
            padding: 'var(--space-lg)',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-md)', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <span>⏳</span> Paiement en attente de validation
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
            Votre paiement est en cours de traitement ou n&apos;a pas encore été validé. Vos espaces de téléchargement sécurisés apparaîtront ici dès réception de la confirmation de paiement (généralement sous quelques instants).
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-outline btn-sm btn-full"
            style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#f59e0b', minHeight: '38px' }}
          >
            Actualiser le statut de paiement 🔄
          </button>
        </div>
      )}

      {/* Next Steps for Physical Products */}
      {(!order || digitalItems.length === 0 || (order && order.items.length > digitalItems.length)) && (
        <div className="card" style={{ textAlign: 'left', marginBottom: 'var(--space-xl)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent)' }}>
            Prochaines étapes (Produits physiques) :
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <li style={{ display: 'flex', gap: 'var(--space-sm)', color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-highlight)' }}>1.</span>
              <span>Notre équipe vous appelle pour confirmer votre commande</span>
            </li>
            <li style={{ display: 'flex', gap: 'var(--space-sm)', color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-highlight)' }}>2.</span>
              <span>Nous préparons votre commande et organisons la livraison</span>
            </li>
            <li style={{ display: 'flex', gap: 'var(--space-sm)', color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-highlight)' }}>3.</span>
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
