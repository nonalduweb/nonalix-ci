'use client';

import React, { useState } from 'react';

interface ServiceFormProps {
  serviceTitle: string;
}

export function ServiceForm({ serviceTitle }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: `Bonjour,\nJe souhaiterais obtenir plus d'informations et un devis personnalisé concernant votre service : "${serviceTitle}".`,
    consent: false,
    website: '', // Honeypot anti-bot : doit rester vide (champ masqué pour les humains)
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, consent: e.target.checked }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Le nom complet est requis";
    
    if (!formData.email.trim()) {
      errs.email = "L'adresse e-mail est requise";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Format d'adresse e-mail invalide";
    }

    if (!formData.phone.trim()) {
      errs.phone = "Le numéro de téléphone est requis";
    }

    if (!formData.consent) {
      errs.consent = "Vous devez accepter le traitement de vos données";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.name,
          email: formData.email,
          phone: formData.phone.replace(/\s/g, ''),
          company: formData.company,
          message: formData.message,
          type: 'quote_request',
          subject: `Demande de devis - ${serviceTitle}`,
          website: formData.website,
        }),
      });
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="card" style={{ border: '1px solid var(--color-success)', background: 'rgba(16, 185, 129, 0.05)', textAlign: 'center', padding: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 style={{ marginBottom: 'var(--space-sm)' }}>Demande envoyée !</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
          Merci pour votre intérêt. Un conseiller de NONALIX CI vous contactera sous 24 heures pour étudier votre projet.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', padding: 'var(--space-xl)' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-sm)', fontFamily: 'var(--font-heading)' }}>
        Demander un devis gratuit
      </h3>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-lg)' }}>
        Prenez contact avec notre équipe pour obtenir une étude personnalisée de votre projet.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {/* Honeypot anti-bot : invisible et inatteignable au clavier pour un humain */}
        <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
          <label htmlFor="service-form-website">Site web</label>
          <input
            id="service-form-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="name" className="input-label">Nom complet *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Kouassi Koffi"
            className={`input ${errors.name ? 'input-error' : ''}`}
            disabled={status === 'submitting'}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="email" className="input-label">Adresse e-mail *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ex: name@company.ci"
            className={`input ${errors.email ? 'input-error' : ''}`}
            disabled={status === 'submitting'}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="company" className="input-label">Entreprise (optionnel)</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Ex: NONALIX CI SARL"
            className="input"
            disabled={status === 'submitting'}
          />
        </div>

        <div className="input-group">
          <label htmlFor="phone" className="input-label">Téléphone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Ex: 07 00 00 00 00"
            className={`input ${errors.phone ? 'input-error' : ''}`}
            disabled={status === 'submitting'}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="message" className="input-label">Détails de votre besoin *</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="input"
            style={{ resize: 'vertical', minHeight: '100px' }}
            disabled={status === 'submitting'}
          />
        </div>

        <div className="checkbox-group" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
          <input
            type="checkbox"
            id="consent"
            checked={formData.consent}
            onChange={handleCheckboxChange}
            style={{ marginTop: '4px', cursor: 'pointer', width: '16px', height: '16px' }}
            disabled={status === 'submitting'}
          />
          <label htmlFor="consent" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', cursor: 'pointer', lineHeight: '1.4' }}>
            J&apos;accepte que mes données soient traitées conformément à la Politique de Confidentialité de NONALIX CI. *
          </label>
        </div>
        {errors.consent && <span className="error-text" style={{ marginTop: '-4px' }}>{errors.consent}</span>}

        {status === 'error' && (
          <p className="error-text" style={{ textAlign: 'center' }}>
            Une erreur est survenue lors de l&apos;envoi. Veuillez réessayer.
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer ma demande'}
        </button>
      </form>
    </div>
  );
}
