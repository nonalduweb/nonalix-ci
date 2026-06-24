'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CONTACT_INFO } from '@/lib/constants';
import { isValidIvorianPhone } from '@/lib/utils';

type LimitState = 'none' | 'LIMIT_REACHED_ANON' | 'SUBSCRIPTION_REQUIRED';

type AuditTab = 'website' | 'google';

const LOADING_STEPS = [
  "Initialisation du scanner de domaine...",
  "Analyse technique des balises SEO (Title, Description, H1)...",
  "Mesure de la vitesse et de la sécurité SSL...",
  "Analyse du positionnement par l'Intelligence Artificielle...",
  "Finalisation du plan d'action personnalisé..."
];

export default function AuditSeoPage() {
  const [activeTab, setActiveTab] = useState<AuditTab>('website');
  const [form, setForm] = useState({
    url: '',
    businessName: '',
    email: '',
    phone: '',
    consent: false,
    sendWhatsApp: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  // Premium / Limit states
  const [limitState, setLimitState] = useState<LimitState>('none');
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange_money'>('wave');
  const [billingPhone, setBillingPhone] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const router = useRouter();

  // Gérer la progression de l'indicateur de chargement
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

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
    setErrors({});
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone: form.phone.replace(/\s/g, ''),
          type: activeTab === 'website' ? 'audit-site-web' : 'audit-google-business',
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setAuditResult(data.auditResult);
        setSubmitted(true);
        setLimitState('none');
      } else if (res.status === 403 && data.error === 'LIMIT_REACHED_ANON') {
        setLimitState('LIMIT_REACHED_ANON');
      } else if (res.status === 403 && data.error === 'SUBSCRIPTION_REQUIRED') {
        setLimitState('SUBSCRIPTION_REQUIRED');
        setBillingPhone(form.phone);
      } else {
        setErrors({ submit: data.error || 'Erreur lors de la génération. Veuillez réessayer.' });
      }
    } catch {
      setErrors({ submit: 'Erreur de connexion. Vérifiez votre réseau et réessayez.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle subscription payment
  const handleSubscribe = async () => {
    if (!billingPhone || !isValidIvorianPhone(billingPhone)) {
      setErrors({ subscribe: 'Entrez un numéro de téléphone ivoirien valide' });
      return;
    }
    setSubscribing(true);
    setErrors({});
    try {
      const res = await fetch('/api/payment/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: billingPhone.replace(/\s/g, ''), paymentMethod }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSubscriptionSuccess(true);
        setLimitState('none');
        // Let user try audit again after 2 seconds
        setTimeout(() => setSubscriptionSuccess(false), 3000);
      } else {
        setErrors({ subscribe: data.error || "Erreur lors de l'activation de l'abonnement" });
      }
    } catch {
      setErrors({ subscribe: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setSubscribing(false);
    }
  };

  // 1. Loading state with step-by-step progress
  if (loading) {
    return (
      <div className="page-content">
        <div className="container section" style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-4xl)' }}>
          <div className="audit-loading-box">
            <div className="audit-loading-spinner-wrap">
              <div className="audit-loading-spinner"></div>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)', color: 'var(--color-text)' }}>
              Analyse en cours...
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              Notre IA scrute votre présence digitale au regard des critères de performance de Côte d&apos;Ivoire.
            </p>

            <div className="audit-loading-steps-list">
              {LOADING_STEPS.map((stepText, idx) => {
                const isActive = idx === loadingStep;
                const isCompleted = idx < loadingStep;
                return (
                  <div 
                    key={idx} 
                    className={`audit-loading-step-item ${isActive ? 'audit-loading-step-item--active' : ''} ${isCompleted ? 'audit-loading-step-item--completed' : ''}`}
                  >
                    <span className="audit-loading-step-bullet"></span>
                    <span>{stepText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Limit state: Anonymous user already used free audit
  if (limitState === 'LIMIT_REACHED_ANON') {
    return (
      <div className="page-content">
        <div className="container section" style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-4xl)' }}>
          <div className="audit-loading-box" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-lg)', color: 'var(--color-text-secondary)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)', color: 'var(--color-text)', fontFamily: 'var(--font-space-grotesk)' }}>
              Votre audit gratuit a été utilisé
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
              En tant qu&apos;invité, vous avez droit à <strong style={{ color: 'var(--color-text)' }}>1 audit gratuit</strong>.
              Pour continuer à analyser vos sites en illimité, créez un compte gratuit et souscrivez à notre offre Premium.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', maxWidth: '360px', margin: '0 auto' }}>
              <a
                href="/connexion?redirect=/audit-seo"
                className="btn btn-primary btn-lg"
                style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                Créer un compte gratuit
              </a>
              <button
                onClick={() => router.push('/connexion?redirect=/audit-seo')}
                className="btn btn-outline"
                style={{ textAlign: 'center' }}
              >
                J&apos;ai déjà un compte — Me connecter
              </button>
            </div>
            <p style={{ marginTop: 'var(--space-lg)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              En créant un compte, vous débloquez 1 audit gratuit supplémentaire !
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. Limit state: Logged-in user needs subscription
  if (limitState === 'SUBSCRIPTION_REQUIRED') {
    return (
      <div className="page-content">
        <div className="container section" style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-4xl)' }}>
          <div className="audit-loading-box" style={{ textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
            {subscriptionSuccess ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-lg)', color: '#10B981' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)', color: '#10B981', fontFamily: 'var(--font-space-grotesk)' }}>
                  Abonnement activé !
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
                  Votre abonnement Premium est actif pour 30 jours. Vous pouvez maintenant relancer un audit.
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>⭐</div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)', color: 'var(--color-text)', fontFamily: 'var(--font-space-grotesk)' }}>
                  Passez au Premium
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: 'var(--space-xl)' }}>
                  Vous avez utilisé votre audit gratuit. Débloquez des audits <strong style={{ color: 'var(--color-text)' }}>illimités</strong> avec l&apos;abonnement Premium.
                </p>

                {/* Pricing card */}
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(226, 83, 116, 0.06) 100%)', 
                  border: '1px solid rgba(124, 58, 237, 0.2)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: 'var(--space-xl)',
                  marginBottom: 'var(--space-xl)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-text)', fontFamily: 'var(--font-space-grotesk)' }}>
                    5 000 <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>FCFA / mois</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'var(--space-md)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    <span><span style={{ color: 'var(--color-success)', fontWeight: 'bold', marginRight: '6px' }}>✓</span>Audits SEO illimités</span>
                    <span><span style={{ color: 'var(--color-success)', fontWeight: 'bold', marginRight: '6px' }}>✓</span>Analyse IA approfondie</span>
                    <span><span style={{ color: 'var(--color-success)', fontWeight: 'bold', marginRight: '6px' }}>✓</span>Rapport envoyé par email & WhatsApp</span>
                    <span><span style={{ color: 'var(--color-success)', fontWeight: 'bold', marginRight: '6px' }}>✓</span>Support prioritaire</span>
                  </div>
                </div>

                {/* Payment method selection */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Mode de paiement</label>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wave')}
                      className={`btn ${paymentMethod === 'wave' ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      🌊 Wave
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('orange_money')}
                      className={`btn ${paymentMethod === 'orange_money' ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      📱 Orange Money
                    </button>
                  </div>
                </div>

                {/* Billing phone */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Numéro de facturation</label>
                  <input
                    type="tel"
                    className="input"
                    placeholder="07 XX XX XX XX"
                    value={billingPhone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      const formatted = digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
                      setBillingPhone(formatted);
                    }}
                    inputMode="numeric"
                    style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '0.05em' }}
                  />
                </div>

                {errors.subscribe && (
                  <div className="audit-error-box" style={{ marginBottom: 'var(--space-md)' }}>
                    {errors.subscribe}
                  </div>
                )}

                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="audit-submit-btn"
                  style={{ width: '100%' }}
                >
                  {subscribing ? 'Activation en cours...' : 'Activer mon abonnement — 5 000 FCFA / mois'}
                </button>

                <p style={{ marginTop: 'var(--space-md)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  🔒 Paiement sécurisé. Annulation possible à tout moment.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 4. Success state showing the complete interactive dashboard
  if (submitted && auditResult) {
    const scoreColor = auditResult.globalScore >= 80 ? '#10b981' : auditResult.globalScore >= 50 ? '#f59e0b' : '#ef4444';
    
    // Prefilled message for direct WhatsApp contact
    const targetTarget = activeTab === 'website' ? form.url : 'Google Maps';
    const whatsappMsg = encodeURIComponent(
      `Bonjour NONALIX CI, je viens de faire l'audit de mon entreprise "${form.businessName}" (${targetTarget}) sur votre outil IA.\n\n` +
      `📈 Score Global : ${auditResult.globalScore}/100\n` +
      `📝 Résumé : ${auditResult.summary}\n\n` +
      `J'aimerais en savoir plus pour mettre en place vos recommandations.`
    );
    const customWhatsAppLink = `https://wa.me/2250706906930?text=${whatsappMsg}`;

    return (
      <div className="page-content" style={{ paddingBottom: 'var(--space-4xl)' }}>
        <div className="container section" style={{ paddingTop: 'var(--space-3xl)' }}>
          
          {/* Dashboard Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-sm)' }}>Rapport d&apos;Analyse Disponible</span>
            <h1 style={{ fontSize: '2.25rem', marginBottom: 'var(--space-xs)', fontFamily: 'var(--font-space-grotesk)' }}>
              Audit de {form.businessName}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
              Cible : <strong style={{ color: 'var(--color-text)' }}>{targetUrlDisplay(form.url)}</strong>
            </p>
          </div>

          {/* Interactive Layout */}
          <div className="audit-dashboard-grid">
            
            {/* Left Column: Score, metrics and IA summary */}
            <div className="audit-dashboard-col">
              
              {/* Score card with radial/circular gauge */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)', background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <h3 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
                  Score Global d&apos;Optimisation
                </h3>
                
                {/* Visual circle gauge */}
                <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'var(--space-md) 0' }}>
                  <svg className="audit-gauge-svg">
                    <circle className="audit-gauge-bg" cx="75" cy="75" r="65" strokeWidth="10" fill="transparent" />
                    <circle 
                      cx="75" 
                      cy="75" 
                      r="65" 
                      stroke={scoreColor} 
                      strokeWidth="10" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 65} 
                      strokeDashoffset={2 * Math.PI * 65 * (1 - auditResult.globalScore / 100)} 
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-text)', lineHeight: '1', fontFamily: 'var(--font-space-grotesk)' }}>{auditResult.globalScore}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', marginTop: '2px' }}>/ 100</span>
                  </div>
                </div>

                <p style={{ marginTop: 'var(--space-sm)', fontWeight: '500', color: 'var(--color-text)', maxWidth: '380px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {auditResult.globalScore >= 80 
                    ? 'Excellent travail ! Votre présence digitale respecte la majorité des bonnes pratiques.' 
                    : auditResult.globalScore >= 50 
                    ? 'Performance intermédiaire. Il existe plusieurs correctifs importants à appliquer rapidement.' 
                    : 'Attention ! Votre présence en ligne comporte des lacunes majeures qui nuisent à votre croissance.'}
                </p>
              </div>

              {/* Categorized Details */}
              <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-lg)', fontWeight: 700, fontFamily: 'var(--font-space-grotesk)' }}>Analyse par catégories</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {/* SEO */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Référencement local (SEO)</span>
                      <span style={{ color: 'var(--color-text)' }}>{auditResult.seoScore}/100</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${auditResult.seoScore}%`, height: '100%', background: '#7C3AED', borderRadius: '3px' }}></div>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Ergonomie Mobile</span>
                      <span style={{ color: 'var(--color-text)' }}>{auditResult.mobileScore}/100</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${auditResult.mobileScore}%`, height: '100%', background: '#10B981', borderRadius: '3px' }}></div>
                    </div>
                  </div>

                  {/* Speed */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Vitesse de chargement</span>
                      <span style={{ color: 'var(--color-text)' }}>{auditResult.speedScore}/100</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${auditResult.speedScore}%`, height: '100%', background: '#F59E0B', borderRadius: '3px' }}></div>
                    </div>
                  </div>

                  {/* Security */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Sécurité et Confiance</span>
                      <span style={{ color: 'var(--color-text)' }}>{auditResult.securityScore}/100</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${auditResult.securityScore}%`, height: '100%', background: '#EF4444', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* IA Summary */}
              <div className="card" style={{ padding: 'var(--space-xl)', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.06) 0%, rgba(226, 83, 116, 0.04) 100%)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <span className="badge badge-primary" style={{ marginBottom: 'var(--space-sm)' }}>Analyse de notre IA</span>
                <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>
                  &quot;{auditResult.summary}&quot;
                </p>
              </div>

            </div>

            {/* Right Column: Recommendations & Market Insights */}
            <div className="audit-dashboard-col">
              
              {/* Recommendations list */}
              <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-md)', fontWeight: 700, fontFamily: 'var(--font-space-grotesk)' }}>Actions prioritaires</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {auditResult.recommendations.map((rec: any, idx: number) => (
                    <div key={idx} className="audit-rec-card">
                      <div className="audit-rec-header">
                        <span className="audit-rec-title">{idx + 1}. {rec.title}</span>
                        <span className={`audit-rec-priority-badge audit-rec-priority-badge--${rec.priority}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="audit-rec-desc">
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus Marché Cible */}
              <div className="card" style={{ padding: 'var(--space-xl)', background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-xs)', fontWeight: 700, fontFamily: 'var(--font-space-grotesk)' }}>
                  Focus Marché Cible
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                  {auditResult.marketInsight}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <a
                  href={customWhatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg"
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '700', background: '#10B981', border: '1px solid #10B981', color: '#ffffff' }}
                >
                  💬 Discuter de mon plan d&apos;action sur WhatsApp
                </a>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <button 
                    onClick={() => {
                      setSubmitted(false);
                      setAuditResult(null);
                    }}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    🔄 Lancer un autre audit
                  </button>
                  <a href="/" className="btn btn-outline" style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Retour à l&apos;accueil
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }

  // Helper function to display Target URL nicely
  function targetUrlDisplay(url: string) {
    if (!url) return 'Fiche Google Business';
    return url.replace(/^https?:\/\//i, '');
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

                {/* WhatsApp Opt-in Checkbox */}
                <div className="audit-checkbox-wrap">
                  <input
                    type="checkbox"
                    id="audit-whatsapp"
                    className="audit-checkbox-input"
                    checked={form.sendWhatsApp}
                    onChange={(e) => setForm((prev) => ({ ...prev, sendWhatsApp: e.target.checked }))}
                  />
                  <label htmlFor="audit-whatsapp" className="audit-checkbox-label">
                    Je souhaite recevoir gratuitement un résumé de mes résultats par WhatsApp.
                  </label>
                </div>

                <div className="checkbox-group" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}>
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
            <span className="badge badge-accent">Analyse complète</span>
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
            <span className="badge badge-highlight">Simple et rapide</span>
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
            <span className="badge badge-accent">FAQ</span>
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
