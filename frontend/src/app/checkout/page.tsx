'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { formatPrice, CITIES } from '@/lib/constants';
import { fbTrack } from '@/lib/fbpixel';

type PaymentMethod = 'pawapay' | 'cash_on_delivery';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pixel Meta : arrivée sur la page de commande
  useEffect(() => {
    if (items.length > 0) {
      fbTrack('InitiateCheckout', {
        content_ids: items.map((i) => i.product.id),
        num_items: items.reduce((sum, i) => sum + i.quantity, 0),
        value: totalAmount,
        currency: 'XOF',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    paymentMethod: 'pawapay' as PaymentMethod,
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
                // Les pages de paiement PawaPay refusent l'affichage en iframe
                // (X-Frame-Options) : on redirige l'utilisateur vers la page de
                // paiement ; le returnUrl le ramène sur /checkout/confirmation,
                // qui suit le statut et vide le panier une fois le paiement validé.
                window.location.href = payData.url;
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

          <form onSubmit={handleSubmit} className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.1fr', gap: 'var(--space-xl)', alignItems: 'start' }}>
            
            {/* 1. COLONNE DE GAUCHE : VOS INFORMATIONS & PAIEMENT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
              
              {/* Card : Informations client */}
              <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                  <div className="input-group">
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
                  <div className="input-group">
                    <label className="input-label" htmlFor="phone">Téléphone *</label>
                    <input
                      id="phone"
                      type="tel"
                      className={`input ${errors.phone ? 'input-error' : ''}`}
                      placeholder="ex: 0706906930"
                      value={form.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
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

              {/* Card : Mode de paiement */}
              <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
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
                    style={{
                      border: form.paymentMethod === 'pawapay' ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                      boxShadow: form.paymentMethod === 'pawapay' ? '0 0 10px rgba(231, 173, 5, 0.15)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="payment-option-icon" style={{ background: 'rgba(231, 173, 5, 0.15)' }}>
                      <span style={{ fontSize: '1.5rem' }}>💳</span>
                    </div>
                    <div className="payment-option-details">
                      <h4 style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Paiement Mobile Money (Orange, Wave, MTN)</h4>
                      <p>Paiement sécurisé et instantané via PawaPay</p>
                    </div>
                  </div>

                  {!hasDigital && (
                    <div
                      className={`payment-option ${form.paymentMethod === 'cash_on_delivery' ? 'selected' : ''}`}
                      onClick={() => updateField('paymentMethod', 'cash_on_delivery')}
                      id="payment-cash"
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="payment-option-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                        <span style={{ fontSize: '1.5rem' }}>💵</span>
                      </div>
                      <div className="payment-option-details">
                        <h4 style={{ color: 'var(--color-success)', fontWeight: 600 }}>Paiement à la livraison</h4>
                        <p>Cash ou Mobile Money au livreur</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. COLONNE DE DROITE : RECAPITULATIF STICKY & VALIDATION */}
            <div style={{ position: 'sticky', top: 'calc(var(--header-height, 80px) + var(--space-lg))', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              
              <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-sm)' }}>
                  📦 Votre Panier
                </h3>
                
                {/* Liste des produits */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  {items.map((item) => (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', gap: 'var(--space-md)' }}>
                      <span style={{ color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                        {item.product.name} <strong style={{ color: 'var(--color-text-primary)' }}>× {item.quantity}</strong>
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderTop: '2px solid var(--color-border)',
                  paddingTop: 'var(--space-md)',
                  marginBottom: 'var(--space-xl)',
                  color: 'var(--color-text-primary)'
                }}>
                  <span>Total à payer</span>
                  <span style={{ color: 'var(--color-accent)' }}>{formatPrice(totalAmount)}</span>
                </div>

                {/* Consentement RGPD */}
                <div className="checkbox-group" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                  <input
                    type="checkbox"
                    id="checkout-consent"
                    checked={form.consent}
                    onChange={(e) => updateField('consent', e.target.checked)}
                    style={{ marginTop: '4px', cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <label htmlFor="checkout-consent" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', cursor: 'pointer', lineHeight: '1.4' }}>
                    J&apos;accepte que mes données soient traitées conformément à la Politique de Confidentialité de NONALIX CI pour la gestion de ma commande. *
                  </label>
                </div>
                {errors.consent && <span className="error-text" style={{ marginTop: '-8px', marginBottom: 'var(--space-md)', display: 'block', fontSize: '0.75rem' }}>{errors.consent}</span>}

                {/* Erreurs serveur */}
                {errors.submit && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', color: 'var(--color-error)', fontSize: '0.8125rem', marginBottom: 'var(--space-md)' }}>
                    {errors.submit}
                  </div>
                )}

                {/* Bouton de confirmation */}
                <button
                  type="submit"
                  className="btn btn-highlight btn-lg btn-full"
                  disabled={loading}
                  id="submit-order"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  {loading ? 'Traitement en cours...' : `Confirmer ma commande`}
                </button>
              </div>
            </div>

            {/* Balise de style pour forcer le passage sur 1 colonne sur tablette/mobile */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media (max-width: 991px) {
                .checkout-grid {
                  grid-template-columns: 1fr !important;
                  gap: var(--space-xl) !important;
                }
              }
            `}} />

          </form>

        </div>
      </section>
    </div>
  );
}

