'use client';

import { useState } from 'react';
import { CONTACT_INFO } from '@/lib/constants';
import { isValidIvorianPhone } from '@/lib/utils';

type AuditTab = 'website' | 'google';

export default function AuditSeoPage() {
  const [activeTab, setActiveTab] = useState<AuditTab>('website');
  const [form, setForm] = useState({
    url: '',
    businessName: '',
    email: '',
    phone: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    const formatted = digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
    setForm((prev) => ({ ...prev, phone: formatted }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (activeTab === 'website') {
      if (!form.url.trim()) {
        newErrors.url = "L'URL de votre site est requise";
      } else if (!/^https?:\/\/.+\..+/.test(form.url.trim()) && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(form.url.trim())) {
        newErrors.url = "Entrez une URL valide (ex: monsite.ci)";
      }
    }

    if (!form.businessName.trim()) {
      newErrors.businessName = "Le nom de l'entreprise est requis";
    }

    if (!form.email.trim()) {
      newErrors.email = "L'email est requis pour recevoir le rapport";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Entrez un email valide";
    }

    if (form.phone && !isValidIvorianPhone(form.phone)) {
      newErrors.phone = 'Numéro invalide (format: 07 XX XX XX XX)';
    }

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
          type: activeTab === 'website' ? 'audit-site-web' : 'audit-google-business',
          message: `Demande d'audit ${activeTab === 'website' ? 'Site Web' : 'Google Business'} — URL: ${form.url} — Entreprise: ${form.businessName}`,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrors({ submit: 'Erreur. Veuillez réessayer ou nous contacter sur WhatsApp.' });
      }
    } catch {
      setErrors({ submit: 'Erreur de connexion. Vérifiez votre réseau et réessayez.' });
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="page-content">
        <div className="container section" style={{ textAlign: 'center', paddingTop: 'var(--space-4xl)' }}>
          <div className="audit-success-icon">✅</div>
          <h1 className="audit-success-title">
            Votre audit est en cours !
          </h1>
          <p className="audit-success-text">
            Notre IA analyse votre {activeTab === 'website' ? 'site web' : 'fiche Google Business'} en ce moment.
            Vous recevrez votre rapport complet par email dans les prochaines minutes.
          </p>
          <div className="audit-success-actions">
            <a
              href={CONTACT_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-highlight btn-lg"
            >
              💬 Discuter avec un expert
            </a>
            <a href="/" className="btn btn-outline">
              Retour à l&apos;accueil
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* ===== HERO SECTION ===== */}
      <section className="audit-hero">
        <div className="container">
          <div className="audit-hero-grid">
            {/* Left: Text */}
            <div className="audit-hero-text">
              <span className="audit-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                OUTIL GRATUIT
              </span>

              <h1 className="audit-hero-title">
                Analysez votre visibilité{' '}
                <em>et boostez votre CA</em>
              </h1>

              <p className="audit-hero-desc">
                Découvrez instantanément ce qui freine votre croissance en Côte d&apos;Ivoire.
                Notre scanner IA analyse +50 points de contrôle SEO, Mobile et Performance en temps réel.
              </p>

              <div className="audit-hero-badges">
                <span className="audit-check-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Analyse Gratuite
                </span>
                <span className="audit-check-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Résultat Immédiat
                </span>
                <span className="audit-check-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Plan d&apos;action inclus
                </span>
              </div>
            </div>

            {/* Right: Form */}
            <div className="audit-form-card">
              <h2 className="audit-form-title">Lancer l&apos;audit</h2>

              {/* Tabs */}
              <div className="audit-tabs">
                <button
                  className={`audit-tab ${activeTab === 'website' ? 'audit-tab--active' : ''}`}
                  onClick={() => setActiveTab('website')}
                  type="button"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Site Web
                </button>
                <button
                  className={`audit-tab ${activeTab === 'google' ? 'audit-tab--active' : ''}`}
                  onClick={() => setActiveTab('google')}
                  type="button"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                  Google Business
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="audit-form">
                {activeTab === 'website' && (
                  <div className="input-group">
                    <div className="audit-input-wrap">
                      <svg className="audit-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      <input
                        id="audit-url"
                        className={`input audit-input ${errors.url ? 'input-error' : ''}`}
                        placeholder="https://votre-site.com"
                        value={form.url}
                        onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
                      />
                    </div>
                    {errors.url && <span className="error-text">{errors.url}</span>}
                  </div>
                )}

                <div className="input-group">
                  <div className="audit-input-wrap">
                    <svg className="audit-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      id="audit-business"
                      className={`input audit-input ${errors.businessName ? 'input-error' : ''}`}
                      placeholder="Nom de l'entreprise"
                      value={form.businessName}
                      onChange={(e) => setForm((prev) => ({ ...prev, businessName: e.target.value }))}
                    />
                  </div>
                  {errors.businessName && <span className="error-text">{errors.businessName}</span>}
                </div>

                <div className="audit-form-row">
                  <div className="input-group">
                    <div className="audit-input-wrap">
                      <svg className="audit-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <input
                        id="audit-email"
                        type="email"
                        className={`input audit-input ${errors.email ? 'input-error' : ''}`}
                        placeholder="Email pro"
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="input-group">
                    <div className="audit-input-wrap">
                      <svg className="audit-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <input
                        id="audit-phone"
                        type="tel"
                        className={`input audit-input ${errors.phone ? 'input-error' : ''}`}
                        placeholder="Téléphone"
                        value={form.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        inputMode="numeric"
                      />
                    </div>
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                </div>

                <div className="checkbox-group" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                  <input
                    type="checkbox"
                    id="audit-consent"
                    checked={form.consent}
                    onChange={(e) => setForm((prev) => ({ ...prev, consent: e.target.checked }))}
                    style={{ marginTop: '4px', cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <label htmlFor="audit-consent" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', cursor: 'pointer', lineHeight: '1.4' }}>
                    J&apos;accepte que mes données soient traitées conformément à la Politique de Confidentialité de NONALIX CI pour la génération de mon audit. *
                  </label>
                </div>
                {errors.consent && <span className="error-text" style={{ marginTop: '-4px', display: 'block', marginBottom: 'var(--space-sm)' }}>{errors.consent}</span>}

                {errors.submit && (
                  <div className="audit-error-box">
                    {errors.submit}
                  </div>
                )}

                <button type="submit" className="audit-submit-btn" disabled={loading} id="audit-submit">
                  {loading ? (
                    <span className="audit-submit-loading">
                      <svg className="audit-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="2" x2="12" y2="6" />
                        <line x1="12" y1="18" x2="12" y2="22" />
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                        <line x1="2" y1="12" x2="6" y2="12" />
                        <line x1="18" y1="12" x2="22" y2="12" />
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                      </svg>
                      Analyse en cours...
                    </span>
                  ) : (
                    <>
                      Analyser mon site gratuitement
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Trust signal */}
                <div className="audit-trust">
                  <div className="audit-trust-avatars">
                    <span className="audit-avatar" style={{ background: '#4285F4' }}>G</span>
                    <span className="audit-avatar" style={{ background: '#1877F2' }}>Fb</span>
                    <span className="audit-avatar" style={{ background: '#0A66C2' }}>Li</span>
                  </div>
                  <span>Déjà utilisé par +500 entreprises</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="section audit-features-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
            <span className="badge badge-accent">🔍 Analyse complète</span>
            <h2 style={{ marginTop: 'var(--space-md)', fontSize: '2rem' }}>
              Ce que notre audit <span className="text-gradient">révèle</span>
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: 'var(--space-md) auto 0' }}>
              Plus de 50 points analysés en profondeur pour identifier les opportunités de croissance de votre entreprise ivoirienne.
            </p>
          </div>

          <div className="grid grid-3 audit-features-grid">
            {/* Feature 1 */}
            <div className="card audit-feature-card">
              <div className="audit-feature-icon audit-feature-icon--blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3>SEO Technique</h3>
              <p>Balises title, meta descriptions, structure H1-H6, sitemap, robots.txt. Tout ce qui impacte votre classement sur Google.ci.</p>
            </div>

            {/* Feature 2 */}
            <div className="card audit-feature-card">
              <div className="audit-feature-icon audit-feature-icon--green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <h3>Compatibilité Mobile</h3>
              <p>En Côte d&apos;Ivoire, 85% des internautes naviguent sur mobile. On vérifie que votre site est parfaitement optimisé.</p>
            </div>

            {/* Feature 3 */}
            <div className="card audit-feature-card">
              <div className="audit-feature-icon audit-feature-icon--orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3>Vitesse de chargement</h3>
              <p>Avec la bande passante ivoirienne, chaque seconde compte. On mesure et optimise votre temps de chargement.</p>
            </div>

            {/* Feature 4 */}
            <div className="card audit-feature-card">
              <div className="audit-feature-icon audit-feature-icon--purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>Sécurité (HTTPS)</h3>
              <p>Certificat SSL, en-têtes de sécurité et protection des données. Indispensable pour gagner la confiance de vos clients.</p>
            </div>

            {/* Feature 5 */}
            <div className="card audit-feature-card">
              <div className="audit-feature-icon audit-feature-icon--pink">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <h3>Présence locale</h3>
              <p>Google Business, annuaires locaux, avis clients. Êtes-vous visible quand un Abidjanais cherche vos services ?</p>
            </div>

            {/* Feature 6 */}
            <div className="card audit-feature-card">
              <div className="audit-feature-icon audit-feature-icon--cyan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3>Plan d&apos;action</h3>
              <p>Pas juste un diagnostic : un plan concret avec des priorités claires pour améliorer votre visibilité rapidement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section audit-how-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
            <span className="badge badge-highlight">⚡ Simple et rapide</span>
            <h2 style={{ marginTop: 'var(--space-md)', fontSize: '2rem' }}>
              Comment ça marche ?
            </h2>
          </div>

          <div className="audit-steps">
            <div className="audit-step">
              <div className="audit-step-number">1</div>
              <h3>Entrez votre URL</h3>
              <p>Collez l&apos;adresse de votre site web ou le nom de votre fiche Google Business.</p>
            </div>
            <div className="audit-step-divider" />
            <div className="audit-step">
              <div className="audit-step-number">2</div>
              <h3>Notre IA analyse</h3>
              <p>En quelques secondes, notre intelligence artificielle scanne +50 critères de performance.</p>
            </div>
            <div className="audit-step-divider" />
            <div className="audit-step">
              <div className="audit-step-number">3</div>
              <h3>Recevez votre rapport</h3>
              <p>Un rapport détaillé avec un score global et des recommandations personnalisées, directement par email.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
            <span className="badge badge-accent">❓ FAQ</span>
            <h2 style={{ marginTop: 'var(--space-md)', fontSize: '2rem' }}>
              Questions fréquentes
            </h2>
          </div>

          <div className="audit-faq-list">
            <details className="audit-faq-item">
              <summary>Est-ce vraiment gratuit ?</summary>
              <p>Oui, 100% gratuit. Pas de carte bancaire, pas de Mobile Money. C&apos;est notre façon de vous montrer ce que NONALIX CI peut faire pour votre entreprise.</p>
            </details>
            <details className="audit-faq-item">
              <summary>Combien de temps faut-il pour recevoir le rapport ?</summary>
              <p>Votre rapport est généralement prêt en moins de 5 minutes. Vous le recevrez directement dans votre boîte email.</p>
            </details>
            <details className="audit-faq-item">
              <summary>Mon site n&apos;a pas de nom de domaine en .ci, ça marche quand même ?</summary>
              <p>Absolument ! Notre outil analyse tous les sites web, qu&apos;ils soient en .ci, .com, .fr ou tout autre domaine. L&apos;important c&apos;est que votre site soit accessible en ligne.</p>
            </details>
            <details className="audit-faq-item">
              <summary>Que faire après avoir reçu mon rapport ?</summary>
              <p>Vous pouvez appliquer les recommandations vous-même ou contacter notre équipe pour un accompagnement personnalisé. Un expert NONALIX CI peut vous guider pas à pas.</p>
            </details>
            <details className="audit-faq-item">
              <summary>Mon entreprise n&apos;a pas de site web, puis-je utiliser l&apos;audit Google Business ?</summary>
              <p>Oui ! Même sans site web, votre fiche Google Business est essentielle pour être trouvé par les clients à Abidjan, Bouaké, Yamoussoukro et partout en Côte d&apos;Ivoire. Notre audit analyse votre fiche et vous donne des conseils pour l&apos;optimiser.</p>
            </details>
          </div>
        </div>
      </section>

      {/* ===== CTA BOTTOM ===== */}
      <section className="section audit-cta-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)' }}>
            Prêt à dominer Google en Côte d&apos;Ivoire ?
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
            Rejoignez +500 entreprises ivoiriennes qui ont déjà optimisé leur présence en ligne avec NONALIX CI.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#audit-url" className="btn btn-primary btn-lg">
              Lancer mon audit gratuit
            </a>
            <a
              href={CONTACT_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
            >
              💬 Parler à un expert
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
