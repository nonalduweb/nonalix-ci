'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/lib/constants';
import { isValidIvorianPhone } from '@/lib/utils';

const SERVICES = [
  'Design Web & UI/UX',
  'Développement Web (Next.js / React)',
  'Automatisation Business & IA',
  'Optimisation SEO',
  'Campagnes Publicitaires (Google Ads / Meta)',
  'Boutique E-commerce + Mobile Money',
  'Chatbot WhatsApp IA',
  'Marketing Digital',
  'Audit UX/UI',
  'Autre / Je ne sais pas encore',
];

const BUDGETS = [
  'Moins de 200 000 FCFA',
  '200 000 – 500 000 FCFA',
  '500 000 – 1 000 000 FCFA',
  '1 000 000 – 3 000 000 FCFA',
  'Plus de 3 000 000 FCFA',
  'À définir ensemble',
];

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    message: '',
    consent: false,
    website: '', // Honeypot anti-bot : doit rester vide (champ masqué pour les humains)
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
      newErrors.email = "Format d'adresse e-mail invalide";
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!isValidIvorianPhone(form.phone)) {
      newErrors.phone = 'Numéro invalide (format: 07 XX XX XX XX)';
    }
    if (!form.message.trim()) newErrors.message = 'Le message est requis';
    if (!form.consent) newErrors.consent = 'Vous devez accepter le traitement de vos données';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, phone: form.phone.replace(/\s/g, '') }),
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
          <div
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(16,185,129,0.1)', border: '2px solid #10B981',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-xl)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)' }}>Message envoyé !</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
            Merci pour votre message ! Notre équipe vous répondra sous <strong>24 heures</strong>.
            Pour une réponse immédiate, contactez-nous directement sur WhatsApp.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={CONTACT_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-highlight btn-lg" style={{ borderRadius: '9999px' }}>
              Écrire sur WhatsApp
            </a>
            <Link href="/" className="btn btn-outline btn-lg" style={{ borderRadius: '9999px' }}>
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <section className="section" style={{ paddingTop: 'var(--space-4xl)' }}>
        <div className="container">

          {/* Header */}
          <div className="section-header" style={{ marginBottom: 'var(--space-3xl)' }}>
            <span className="badge badge-accent">Contact</span>
            <h1 style={{ marginTop: 'var(--space-md)', fontSize: '2.25rem' }}>
              Parlons de votre <span className="text-gradient">projet</span>
            </h1>
            <p style={{ maxWidth: '520px', margin: '0 auto' }}>
              Décrivez votre besoin et nous vous répondons sous 24h avec une proposition adaptée
              au marché ivoirien.
            </p>
          </div>

          {/* 2-column layout */}
          <div className="contact-2col-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 'var(--space-3xl)', alignItems: 'start' }}>

            {/* Left: Form */}
            <div className="card" style={{ padding: 'var(--space-2xl)' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

                {/* Honeypot anti-bot : invisible et inatteignable au clavier pour un humain */}
                <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                  <label htmlFor="contact-website">Site web</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                  />
                </div>

                {/* Row: Nom + Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                  <div className="input-group">
                    <label className="input-label" htmlFor="contact-name">Nom complet *</label>
                    <input
                      id="contact-name"
                      className={`input ${errors.firstName ? 'input-error' : ''}`}
                      placeholder="Kouamé Yao"
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
                </div>

                {/* Row: Téléphone + Entreprise */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
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
                    <label className="input-label" htmlFor="contact-company">Entreprise</label>
                    <input
                      id="contact-company"
                      className="input"
                      placeholder="Nom de votre société"
                      value={form.company}
                      onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Service souhaité */}
                <div className="input-group">
                  <label className="input-label" htmlFor="contact-service">Service souhaité</label>
                  <select
                    id="contact-service"
                    className="input"
                    value={form.service}
                    onChange={(e) => setForm((prev) => ({ ...prev, service: e.target.value }))}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">— Sélectionnez un service —</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Budget */}
                <div className="input-group">
                  <label className="input-label" htmlFor="contact-budget">Budget estimé</label>
                  <select
                    id="contact-budget"
                    className="input"
                    value={form.budget}
                    onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">— Fourchette de budget —</option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="input-group">
                  <label className="input-label" htmlFor="contact-message">Décrivez votre projet *</label>
                  <textarea
                    id="contact-message"
                    className={`input ${errors.message ? 'input-error' : ''}`}
                    placeholder="Parlez-nous de votre projet, vos objectifs, vos contraintes..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                    style={{ resize: 'vertical', minHeight: '120px' }}
                  />
                  {errors.message && <span className="error-text">{errors.message}</span>}
                </div>

                {/* Consent */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                  <input
                    type="checkbox"
                    id="contact-consent"
                    checked={form.consent}
                    onChange={(e) => setForm((prev) => ({ ...prev, consent: e.target.checked }))}
                    style={{ marginTop: '3px', cursor: 'pointer', width: '16px', height: '16px', flexShrink: 0 }}
                  />
                  <label htmlFor="contact-consent" style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', cursor: 'pointer', lineHeight: 1.5 }}>
                    J&apos;accepte que mes données soient traitées conformément à la{' '}
                    <Link href="/privacy-policy" style={{ color: 'var(--color-accent)' }}>Politique de Confidentialité</Link>{' '}
                    de NONALIX CI. *
                  </label>
                </div>
                {errors.consent && <span className="error-text" style={{ marginTop: '-8px' }}>{errors.consent}</span>}

                {errors.submit && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', color: 'var(--color-error)', fontSize: '0.875rem' }}>
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-full"
                  disabled={loading}
                  id="contact-submit"
                  style={{ borderRadius: 'var(--radius-md)', height: '52px', fontSize: '1rem', fontWeight: 700 }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                        <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                        <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : 'Envoyer ma demande →'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  🔒 Vos données sont sécurisées et ne seront jamais revendues.
                </p>
              </form>
            </div>

            {/* Right: Info + Map */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>

              {/* Quick contact */}
              <div className="card" style={{ padding: 'var(--space-xl)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-lg)', color: 'var(--color-text)' }}>
                  Réponse rapide garantie
                </h3>

                <a
                  href={CONTACT_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                    padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
                    background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                    textDecoration: 'none', marginBottom: 'var(--space-md)', transition: 'background 0.2s',
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#10B981', fontSize: '0.9rem' }}>WhatsApp — Réponse immédiate</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{CONTACT_INFO.phoneDisplay}</div>
                  </div>
                </a>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                    <div style={{ color: 'var(--color-text-muted)', marginTop: '2px', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <a href={`mailto:${CONTACT_INFO.email}`} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>{CONTACT_INFO.email}</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                    <div style={{ color: 'var(--color-text-muted)', marginTop: '2px', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>{CONTACT_INFO.address}</span>
                  </div>
                </div>

                {/* Horaires */}
                <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>Horaires d&apos;ouverture</p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    Lundi – Vendredi : 08h00 – 18h00<br />
                    Samedi : 09h00 – 14h00<br />
                    <span style={{ color: '#10B981', fontWeight: 600 }}>WhatsApp : 24h/24</span>
                  </p>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="card" style={{ padding: 'var(--space-xl)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-md)', color: 'var(--color-text)' }}>
                  Suivez-nous
                </h3>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                  {[
                    { href: SOCIAL_LINKS.facebook, label: 'Facebook', color: '#1877F2' },
                    { href: SOCIAL_LINKS.instagram, label: 'Instagram', color: '#E4405F' },
                    { href: SOCIAL_LINKS.linkedin, label: 'LinkedIn', color: '#0A66C2' },
                    { href: SOCIAL_LINKS.tiktok, label: 'TikTok', color: '#000000' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ fontSize: '0.8125rem', padding: '0.375rem 0.875rem', borderRadius: '9999px', borderColor: `${s.color}40`, color: s.color }}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="map-container" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '220px' }}>
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-4.05%2C5.28%2C-3.9%2C5.4&layer=mapnik&marker=5.34%2C-3.97"
                  title="Localisation NONALIX CI — Abidjan Cocody Angré"
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
