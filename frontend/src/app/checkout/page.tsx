'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { formatPrice, CITIES } from '@/lib/constants';
import { isValidIvorianPhone } from '@/lib/utils';

type PaymentMethod = 'orange_money' | 'wave' | 'cash_on_delivery';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    paymentMethod: '' as PaymentMethod | '',
    consent: false,
  });

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

  // Phone mask: XX XX XX XX XX
  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    const formatted = digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
    updateField('phone', formatted);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!form.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!form.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!isValidIvorianPhone(form.phone)) {
      newErrors.phone = 'Numéro invalide (format: 07 XX XX XX XX)';
    }
    if (!form.city) newErrors.city = 'La ville de livraison est requise';
    if (!form.paymentMethod) newErrors.paymentMethod = 'Choisissez un mode de paiement';
    if (!form.consent) {
      newErrors.consent = 'Vous devez accepter le traitement de vos données';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

        // If Mobile Money, initialize payment transaction
        if (form.paymentMethod === 'orange_money' || form.paymentMethod === 'wave') {
          const paymentEndpoint = form.paymentMethod === 'orange_money' 
            ? '/api/payment/orange-money' 
            : '/api/payment/wave';

          try {
            await fetch(paymentEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                amount: totalAmount,
                phone: form.phone.replace(/\s/g, ''),
                description: `Paiement commande ${orderId}`,
              }),
            });
          } catch (payErr) {
            console.error('Failed to initialize mobile money payment:', payErr);
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
                <label className="input-label" htmlFor="phone">Téléphone *</label>
                <input
                  id="phone"
                  type="tel"
                  className={`input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="07 06 90 69 30"
                  value={form.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  inputMode="numeric"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

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

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div
                  className={`payment-option ${form.paymentMethod === 'orange_money' ? 'selected' : ''}`}
                  onClick={() => updateField('paymentMethod', 'orange_money')}
                  id="payment-orange-money"
                >
                  <div className="payment-option-icon" style={{ background: 'rgba(255, 102, 0, 0.15)' }}>
                    <span style={{ fontSize: '1.5rem' }}>📱</span>
                  </div>
                  <div className="payment-option-details">
                    <h4 style={{ color: 'var(--color-orange-money)' }}>Orange Money</h4>
                    <p>Paiement sécurisé via Orange Money</p>
                  </div>
                </div>

                <div
                  className={`payment-option ${form.paymentMethod === 'wave' ? 'selected' : ''}`}
                  onClick={() => updateField('paymentMethod', 'wave')}
                  id="payment-wave"
                >
                  <div className="payment-option-icon" style={{ background: 'rgba(29, 195, 255, 0.15)' }}>
                    <span style={{ fontSize: '1.5rem' }}>🌊</span>
                  </div>
                  <div className="payment-option-details">
                    <h4 style={{ color: 'var(--color-wave)' }}>Wave</h4>
                    <p>Paiement rapide via Wave</p>
                  </div>
                </div>

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
        </div>
      </section>
    </div>
  );
}
