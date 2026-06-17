'use client';

import { useState } from 'react';
import { CONTACT_INFO } from '@/lib/constants';
import { isValidIvorianPhone } from '@/lib/utils';

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    const formatted = digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
    setForm((prev) => ({ ...prev, phone: formatted }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Le nom est requis';
    
    if (!form.email.trim()) {
      newErrors.email = "L'adresse e-mail est requise";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Format d\'adresse e-mail invalide';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!isValidIvorianPhone(form.phone)) {
      newErrors.phone = 'Numéro invalide (format: 07 XX XX XX XX)';
    }
    
    if (!form.message.trim()) newErrors.message = 'Le message est requis';
    
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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone: form.phone.replace(/\s/g, ''),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrors({ submit: 'Erreur. Veuillez réessayer.' });
      }
    } catch {
      setErrors({ submit: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-content">
        <div className="container section" style={{ textAlign: 'center', paddingTop: 'var(--space-4xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>✉️</div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)' }}>
            Message envoyé !
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
            Merci pour votre message ! Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <a
            href={CONTACT_INFO.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-highlight btn-lg"
          >
            Ou écrivez-nous sur WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <section className="section" style={{ paddingTop: 'var(--space-4xl)' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">📍 Contact</span>
            <h1 style={{ marginTop: 'var(--space-md)', fontSize: '2.25rem' }}>
              Parlons de votre <span className="text-gradient">projet</span>
            </h1>
            <p>
              Envoyez-nous un message ou passez nous voir à Abidjan.
              Nous vous répondrons dans les 24 heures.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)' }}>
            {/* Contact Form */}
            <div className="card" style={{ padding: 'var(--space-xl)' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="contact-name">Nom complet *</label>
                  <input
                    id="contact-name"
                    className={`input ${errors.firstName ? 'input-error' : ''}`}
                    placeholder="Votre nom"
                    value={form.firstName}
                    onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="contact-email">Email *</label>
                  <input
                    id="contact-email"
                    type="email"
                    className={`input ${errors.email ? 'input-error' : ''}`}
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="contact-company">Entreprise (optionnel)</label>
                  <input
                    id="contact-company"
                    className="input"
                    placeholder="Nom de votre entreprise"
                    value={form.company}
                    onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="contact-phone">Téléphone *</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    className={`input ${errors.phone ? 'input-error' : ''}`}
                    placeholder="05 66 36 03 03"
                    value={form.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    inputMode="numeric"
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="contact-message">Message *</label>
                  <textarea
                    id="contact-message"
                    className={`input ${errors.message ? 'input-error' : ''}`}
                    placeholder="Décrivez votre projet ou votre besoin..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                    style={{ resize: 'vertical', minHeight: '120px' }}
                  />
                  {errors.message && <span className="error-text">{errors.message}</span>}
                </div>

                <div className="checkbox-group" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                  <input
                    type="checkbox"
                    id="contact-consent"
                    checked={form.consent}
                    onChange={(e) => setForm((prev) => ({ ...prev, consent: e.target.checked }))}
                    style={{ marginTop: '4px', cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <label htmlFor="contact-consent" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', cursor: 'pointer', lineHeight: '1.4' }}>
                    J&apos;accepte que mes données soient traitées conformément à la Politique de Confidentialité de NONALIX CI. *
                  </label>
                </div>
                {errors.consent && <span className="error-text" style={{ marginTop: '-4px' }}>{errors.consent}</span>}

                {errors.submit && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', color: 'var(--color-error)', fontSize: '0.875rem' }}>
                    {errors.submit}
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} id="contact-submit">
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>

            {/* Contact Info + Map */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
              <div className="card" style={{ padding: 'var(--space-xl)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)', color: 'var(--color-accent-glow)' }}>
                  Nos coordonnées
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <div className="footer-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>{CONTACT_INFO.address}</span>
                  </div>
                  <div className="footer-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <a href={`tel:${CONTACT_INFO.phone}`}>{CONTACT_INFO.phoneDisplay}</a>
                  </div>
                  <div className="footer-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="map-container">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-4.05%2C5.28%2C-3.9%2C5.4&layer=mapnik&marker=5.34%2C-3.97"
                  title="Localisation NONALIX CI — Abidjan"
                  loading="lazy"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
