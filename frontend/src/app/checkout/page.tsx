'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { formatPrice, CITIES } from '@/lib/constants';

type PaymentMethod = 'pawapay' | 'cash_on_delivery';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentModal, setPaymentModal] = useState<{ orderId: string; url: string } | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    paymentMethod: '' as PaymentMethod | '',
    consent: false,
  });

  const hasDigital = items.some((item) => item.product.isDigital);

  useEffect(() => {
    if (hasDigital) {
      setForm((prev) => ({ ...prev, city: 'En ligne (Livraison par E-mail)' }));
    }
  }, [hasDigital]);

  if (items.length === 0) {
    return (
      <div className="page-content">
        <div className="container section" style={{ textAlign: 'center', paddingTop: 'var(--space-4xl)' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)' }}>Votre panier est vide</h1>
          <Link href="/boutique" className="btn btn-primary">Retour à la boutique</Link>
        </div>
      </div>
    );
  }

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhoneChange = (value: string) => {
    // Allow digits, spaces, and leading +
    const clean = value.replace(/[^\d+\s]/g, '');
    updateField('phone', clean);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!form.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    
    if (hasDigital) {
      if (!form.email.trim()) {
        newErrors.email = 'L\'adresse e-mail est requise pour recevoir vos produits';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        newErrors.email = 'Adresse e-mail invalide';
      }
    } else {
      if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        newErrors.email = 'Adresse e-mail invalide';
      }
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else {
      const cleanedPhone = form.phone.replace(/\s/g, '');
      if (!/^\+?[0-9]{8,15}$/.test(cleanedPhone)) {
        newErrors.phone = 'Numéro de téléphone invalide';
      }
    }

    if (!form.city) newErrors.city = 'La ville de livraison est requise';
    if (!form.paymentMethod) newErrors.paymentMethod = 'Choisissez un mode de paiement';
    if (!form.consent) {
      newErrors.consent = 'Vous devez accepter le traitement de vos données';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const startPaymentPolling = (orderId: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders?id=${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.paymentStatus === 'completed' || data.paymentStatus === 'failed') {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setPaymentModal(null);
            clearCart();
            router.push(`/checkout/confirmation?order=${orderId}`);
          }
        }
      } catch (err) {
        console.error('Erreur lors de la vérification du statut de paiement:', err);
      }
    }, 3000);
  };

  const cancelPaymentModal = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setPaymentModal(null);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const orderData = {
        ...form,
        phone: form.phone.replace(/\s/g, ''),
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
        totalAmount,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const data = await res.json();
        const orderId = data.orderId;

        // If Mobile Money (PawaPay), initialize payment transaction
        if (form.paymentMethod === 'pawapay') {
          const paymentEndpoint = '/api/payment/pawapay';

          try {
            const payRes = await fetch(paymentEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                amount: totalAmount,
                phone: form.phone.replace(/\s/g, ''),
                description: `Paiement commande ${orderId}`,
              }),
            });

            if (payRes.ok) {
              const payData = await payRes.json();
              if (payData.url) {
                // Garder l'utilisateur sur le site : paiement affiché dans un iframe modal.
                // Le panier n'est vidé qu'à la confirmation du paiement (voir startPaymentPolling) :
                // le vider ici déclencherait le garde "panier vide" et ferait disparaître le modal.
                setPaymentModal({ orderId, url: payData.url });
                startPaymentPolling(orderId);
                return;
              } else if (payData.status === 'simulation') {
                // Simulation mode
                clearCart();
                router.push(`/checkout/confirmation?order=${orderId}`);
                return;
              } else {
                setErrors({ submit: "Erreur : L'URL de paiement est manquante." });
                setLoading(false);
                return;
              }
            } else {
              const errData = await payRes.json();
              setErrors({ submit: errData.error || "Échec de l'initialisation du paiement." });
              setLoading(false);
              return;
            }
          } catch (payErr) {
            console.error('Failed to initialize payment:', payErr);
            setErrors({ submit: "Erreur réseau lors de l'initialisation du paiement. Veuillez réessayer." });
            setLoading(false);
            return;
          }
        }

        clearCart();
        router.push(`/checkout/confirmation?order=${orderId}`);
      } else {
        setErrors({ submit: 'Erreur lors de la commande. Veuillez réessayer.' });
      }
    } catch {
      setErrors({ submit: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <section className="section" style={{ paddingTop: 'var(--space-4xl)' }}>
        <div className="container">
          <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-xl)' }}>
            Finaliser la commande
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)' }}>
            {/* Customer Info */}
            <div className="card" style={{ padding: 'var(--space-xl)' }}>
              <h2 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)' }}>
                📋 Vos informations
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="firstName">Prénom *</label>
                  <input
                    id="firstName"
                    className={`input ${errors.firstName ? 'input-error' : ''}`}
                    placeholder="Votre prénom"
                    value={form.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="lastName">Nom *</label>
                  <input
                    id="lastName"
                    className={`input ${errors.lastName ? 'input-error' : ''}`}
                    placeholder="Votre nom"
                    value={form.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                  />
                  {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>
              </div>

              <div className="input-group" style={{ marginTop: 'var(--space-md)' }}>
                <label className="input-label" htmlFor="email">E-mail *</label>
                <input
                  id="email"
                  type="email"
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  placeholder="votre.email@exemple.com"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {hasDigital && (
                <div style={{
                  marginTop: 'var(--space-md)',
                  padding: 'var(--space-sm) var(--space-md)',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-success)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span>📧</span>
                  <span>Les liens de téléchargement de vos packs digitaux seront envoyés à cette adresse dès confirmation du paiement.</span>
                </div>
              )}

              <div className="input-group" style={{ marginTop: 'var(--space-md)' }}>
                <label className="input-label" htmlFor="phone">Téléphone *</label>
                <input
                  id="phone"
                  type="tel"
                  className={`input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="+225 07 06 90 69 30"
                  value={form.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              {!hasDigital ? (
                <div className="input-group" style={{ marginTop: 'var(--space-md)' }}>
                  <label className="input-label" htmlFor="city">Ville / Commune de livraison *</label>
                  <select
                    id="city"
                    className={`input ${errors.city ? 'input-error' : ''}`}
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">Sélectionner votre ville</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
              ) : (
                <div className="input-group" style={{ marginTop: 'var(--space-md)' }}>
                  <label className="input-label" htmlFor="city">Mode de livraison *</label>
                  <input
                    id="city"
                    className="input"
                    value="En ligne (Livraison par E-mail)"
                    disabled
                    style={{ opacity: 0.8, cursor: 'not-allowed', background: 'rgba(255,255,255,0.02)' }}
                  />
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="card" style={{ padding: 'var(--space-xl)' }}>
              <h2 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)' }}>
                💳 Mode de paiement
              </h2>
              {errors.paymentMethod && (
                <span className="error-text" style={{ marginBottom: 'var(--space-md)', display: 'block' }}>
                  {errors.paymentMethod}
                </span>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <div
                  className={`payment-option ${form.paymentMethod === 'pawapay' ? 'selected' : ''}`}
                  onClick={() => updateField('paymentMethod', 'pawapay')}
                  id="payment-pawapay"
                >
                  <div className="payment-option-icon" style={{ background: 'rgba(109, 40, 217, 0.15)' }}>
                    <span style={{ fontSize: '1.5rem' }}>💳</span>
                  </div>
                  <div className="payment-option-details">
                    <h4 style={{ color: '#6d28d9' }}>Paiement Mobile Money (Orange, Wave, MTN)</h4>
                    <p>Paiement sécurisé et instantané via PawaPay</p>
                  </div>
                </div>

                {!hasDigital && (
                  <div
                    className={`payment-option ${form.paymentMethod === 'cash_on_delivery' ? 'selected' : ''}`}
                    onClick={() => updateField('paymentMethod', 'cash_on_delivery')}
                    id="payment-cash"
                  >
                    <div className="payment-option-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                      <span style={{ fontSize: '1.5rem' }}>💵</span>
                    </div>
                    <div className="payment-option-details">
                      <h4 style={{ color: 'var(--color-success)' }}>Paiement à la livraison</h4>
                      <p>Cash ou Mobile Money au livreur</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-md)' }}>
                📦 Récapitulatif
              </h3>
              {items.map((item) => (
                <div key={item.product.id} className="order-summary-row">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
              <div className="order-summary-row order-summary-total">
                <span>Total à payer</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <div className="checkbox-group" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
              <input
                type="checkbox"
                id="checkout-consent"
                checked={form.consent}
                onChange={(e) => updateField('consent', e.target.checked)}
                style={{ marginTop: '4px', cursor: 'pointer', width: '16px', height: '16px' }}
              />
              <label htmlFor="checkout-consent" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', cursor: 'pointer', lineHeight: '1.4' }}>
                J&apos;accepte que mes données soient traitées conformément à la Politique de Confidentialité de NONALIX CI pour la gestion de ma commande. *
              </label>
            </div>
            {errors.consent && <span className="error-text" style={{ marginTop: '-4px', display: 'block' }}>{errors.consent}</span>}

            {errors.submit && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', color: 'var(--color-error)', fontSize: '0.875rem' }}>
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-highlight btn-lg btn-full"
              disabled={loading}
              id="submit-order"
            >
              {loading ? 'Traitement en cours...' : `Confirmer ma commande — ${formatPrice(totalAmount)}`}
            </button>
          </form>

          {paymentModal && typeof document !== 'undefined' && createPortal(
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.75)',
                zIndex: 10001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-lg)',
              }}
            >
              <div
                className="card"
                style={{
                  width: '100%',
                  maxWidth: '480px',
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>💳 Paiement Mobile Money</h3>
                  <button
                    type="button"
                    onClick={cancelPaymentModal}
                    className="btn btn-ghost btn-sm"
                    aria-label="Fermer"
                    style={{ padding: '4px 10px' }}
                  >
                    ✕
                  </button>
                </div>
                <iframe
                  src={paymentModal.url}
                  title="Paiement PawaPay"
                  style={{ width: '100%', height: '640px', border: 'none', background: '#fff' }}
                />
              </div>
            </div>,
            document.body
          )}
        </div>
      </section>
    </div>
  );
}

