'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function ConnexionPage() {
  const router = useRouter();
  const { user, refreshSession } = useAuth();
  
  // États de l'interface
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  // Champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [activitySector, setActivitySector] = useState('');
  const [trustDevice, setTrustDevice] = useState(true);

  // États des erreurs
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    lastName?: string;
    firstName?: string;
    phone?: string;
    activitySector?: string;
    general?: string;
  }>({});

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // Capture les erreurs d'authentification Google passées en paramètre
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const errParam = params.get('error');
      if (errParam) {
        let msg = 'Une erreur est survenue lors de la connexion.';
        if (errParam === 'credentials_missing') {
          msg = 'Les identifiants Google OAuth ne sont pas configurés sur le serveur.';
        } else if (errParam === 'token_exchange_failed') {
          msg = "Échec de l'échange de jeton avec Google.";
        } else if (errParam === 'profile_fetch_failed') {
          msg = 'Impossible de récupérer votre profil Google.';
        } else if (errParam === 'no_email_provided') {
          msg = 'Google n\'a pas partagé d\'adresse e-mail pour ce compte.';
        } else if (errParam === 'internal_error') {
          msg = 'Erreur interne lors de la connexion Google.';
        }
        setErrors({ general: msg });
      }
    }
  }, []);

  // Reset des formulaires et des erreurs lors du changement de mode
  useEffect(() => {
    setErrors({});
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setLastName('');
    setFirstName('');
    setCompany('');
    setPhone('');
    setActivitySector('');
  }, [isSignUp]);

  // Handler d'authentification sociale
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider);
    setErrors({});
    setSuccessMsg(null);

    if (provider === 'google') {
      // Rediriger vers notre endpoint OAuth d'initiation
      window.location.href = '/api/auth/google';
      return;
    }

    try {
      // Simulation pour Apple (non requis en réel pour ce ticket)
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSuccessMsg(`Connexion réussie via Apple (Simulation) ! Redirection...`);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setErrors({ general: `Erreur de connexion via ${provider}.` });
      setSocialLoading(null);
    }
  };

  // Handler de validation et de soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg(null);

    const newErrors: typeof errors = {};

    // Validation commune
    if (!email.trim()) {
      newErrors.email = "L'adresse e-mail est requise.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "L'adresse e-mail n'est pas valide.";
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis.';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
    }

    // Validation spécifique à l'inscription
    if (isSignUp) {
      if (!lastName.trim()) {
        newErrors.lastName = 'Le nom de famille est requis.';
      }
      if (!firstName.trim()) {
        newErrors.firstName = 'Le prénom est requis.';
      }
      
      const cleanPhone = phone.replace(/[\s.-]/g, '');
      const phoneRegex = /^0[157]\d{8}$/;
      if (!phone.trim()) {
        newErrors.phone = 'Le numéro de téléphone est requis.';
      } else if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = "Le numéro doit être au format de Côte d'Ivoire (ex: 0707070707).";
      }

      if (!activitySector) {
        newErrors.activitySector = "Le secteur d'activité est requis.";
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const body = isSignUp 
        ? { email, password, firstName, lastName, company, phone: phone.replace(/[\s.-]/g, ''), activitySector }
        : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || 'Une erreur est survenue. Veuillez réessayer.' });
        setIsLoading(false);
        return;
      }

      // Success
      await refreshSession();

      if (isSignUp) {
        setSuccessMsg('Votre compte a été créé avec succès ! Bienvenue sur NONALIX CI.');
      } else {
        setSuccessMsg('Connexion réussie ! Redirection en cours...');
      }

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      setErrors({ general: 'Impossible de joindre le serveur de connexion. Veuillez réessayer.' });
      setIsLoading(false);
    }
  };


  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#07080a',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden'
    }}>
      {/* Panneau Gauche : Formulaire */}
      <div style={{
        flex: '1 1 45%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2rem 3rem',
        maxWidth: '100%',
        zIndex: 10,
        overflowY: 'auto'
      }} className="connexion-form-panel">
        <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
          
          {/* Logo et Accueil */}
          <div style={{ marginBottom: '2rem' }}>
            <Link href="/" style={{ display: 'inline-block', marginBottom: '1.5rem', textDecoration: 'none' }}>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                background: 'linear-gradient(to right, #3b82f6, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>NONALIX CI</span>
            </Link>
            
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '0.5rem',
              color: '#ffffff'
            }}>
              {isSignUp ? 'Créer un compte' : 'Bienvenue sur Nonalix'}
            </h1>
            
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              {isSignUp ? (
                <>Vous avez déjà un compte ? <button onClick={() => setIsSignUp(false)} style={{ background: 'none', border: 'none', color: 'var(--color-accent-glow)', cursor: 'pointer', padding: 0, textDecoration: 'underline', font: 'inherit' }}>Se connecter</button></>
              ) : (
                <>Vous n'avez pas de compte ? <button onClick={() => setIsSignUp(true)} style={{ background: 'none', border: 'none', color: 'var(--color-accent-glow)', cursor: 'pointer', padding: 0, textDecoration: 'underline', font: 'inherit' }}>Commencer gratuitement</button></>
              )}
            </p>
          </div>

          {successMsg ? (
            <div style={{
              padding: '1.5rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              color: '#10b981',
              textAlign: 'center',
              marginBottom: '2rem',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 10px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p style={{ fontWeight: 600 }}>{successMsg}</p>
            </div>
          ) : (
            <>
              {/* Connexion Sociale */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading || socialLoading !== null}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: (isLoading || socialLoading !== null) ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.2s',
                    opacity: (isLoading || socialLoading !== null) ? 0.7 : 1
                  }}
                  onMouseOver={(e) => { if (!isLoading && !socialLoading) e.currentTarget.style.opacity = '0.9'; }}
                  onMouseOut={(e) => { if (!isLoading && !socialLoading) e.currentTarget.style.opacity = '1'; }}
                >
                  {socialLoading === 'google' ? (
                    <span style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(0,0,0,0.1)',
                      borderTopColor: '#000000',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite'
                    }} />
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.472 0-6.29-2.818-6.29-6.29 0-3.472 2.818-6.29 6.29-6.29 1.583 0 3.024.588 4.135 1.554l3.08-3.08A11.95 11.95 0 0012.24 2c-6.627 0-12 5.373-12 12s5.373 12 12 12c6.264 0 11.504-4.507 11.96-10.457H12.24z"/>
                      </svg>
                      {isSignUp ? "S'inscrire avec Google" : 'Se connecter avec Google'}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('apple')}
                  disabled={isLoading || socialLoading !== null}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: (isLoading || socialLoading !== null) ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.2s',
                    opacity: (isLoading || socialLoading !== null) ? 0.7 : 1
                  }}
                  onMouseOver={(e) => { if (!isLoading && !socialLoading) e.currentTarget.style.opacity = '0.9'; }}
                  onMouseOut={(e) => { if (!isLoading && !socialLoading) e.currentTarget.style.opacity = '1'; }}
                >
                  {socialLoading === 'apple' ? (
                    <span style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(0,0,0,0.1)',
                      borderTopColor: '#000000',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite'
                    }} />
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.23.67-2.95 1.51-.63.73-1.19 1.87-1.04 2.99 1.12.09 2.27-.57 3-1.44"/>
                      </svg>
                      {isSignUp ? "S'inscrire avec Apple" : 'Se connecter avec Apple'}
                    </>
                  )}
                </button>
              </div>

              {/* Séparateur */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '1.5rem 0',
                color: '#475569',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.05em'
              }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
                <span style={{ padding: '0 10px' }}>Ou continuer avec</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
              </div>

              {/* Formulaire principal */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {isSignUp && (
                  <>
                    {/* Nom et Prénom en ligne */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Nom *</label>
                        <input
                          type="text"
                          placeholder="Nom de famille"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={isLoading}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            border: errors.lastName ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)',
                            color: '#ffffff',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                        />
                        {errors.lastName && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.lastName}</span>}
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Prénom *</label>
                        <input
                          type="text"
                          placeholder="Prénom"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={isLoading}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            border: errors.firstName ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)',
                            color: '#ffffff',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                        />
                        {errors.firstName && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.firstName}</span>}
                      </div>
                    </div>

                    {/* Entreprise */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Entreprise (Optionnel)</label>
                      <input
                        type="text"
                        placeholder="Nom de votre entreprise"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        disabled={isLoading}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#ffffff',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* Téléphone */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Téléphone *</label>
                      <input
                        type="tel"
                        placeholder="ex: 0707070707"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isLoading}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          border: errors.phone ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#ffffff',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      />
                      {errors.phone && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.phone}</span>}
                    </div>

                    {/* Secteur d'activité */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Secteur d'activité *</label>
                      <select
                        value={activitySector}
                        onChange={(e) => setActivitySector(e.target.value)}
                        disabled={isLoading}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor: '#121318',
                          border: errors.activitySector ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#ffffff',
                          fontSize: '0.875rem',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">Sélectionnez votre secteur</option>
                        <option value="ecommerce">E-commerce / Boutique</option>
                        <option value="tech">Technologie / Informatique</option>
                        <option value="marketing">Marketing / Communication</option>
                        <option value="finance">Finance / Assurances</option>
                        <option value="education">Éducation / Formation</option>
                        <option value="other">Autre secteur</option>
                      </select>
                      {errors.activitySector && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.activitySector}</span>}
                    </div>
                  </>
                )}

                {/* Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Adresse e-mail</label>
                  <input
                    type="email"
                    placeholder="adresse@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: errors.email ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                  {errors.email && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.email}</span>}
                </div>

                {/* Mot de passe */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Mot de passe</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        padding: '10px 40px 10px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: errors.password ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.password}</span>}
                </div>

                {/* Confirmation Mot de passe (Inscription seulement) */}
                {isSignUp && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Confirmer le mot de passe</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: errors.confirmPassword ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                    {errors.confirmPassword && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.confirmPassword}</span>}
                  </div>
                )}

                {/* Mot de passe oublié (Connexion seulement) */}
                {!isSignUp && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="#" style={{ fontSize: '0.8125rem', color: '#94a3b8', textDecoration: 'underline' }}>
                      Mot de passe oublié ?
                    </Link>
                  </div>
                )}

                {/* Faire confiance à cet appareil */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                  <input
                    type="checkbox"
                    id="trustDevice"
                    checked={trustDevice}
                    onChange={(e) => setTrustDevice(e.target.checked)}
                    disabled={isLoading}
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      accentColor: 'var(--color-accent)',
                      cursor: 'pointer'
                    }}
                  />
                  <label htmlFor="trustDevice" style={{ fontSize: '0.8125rem', color: '#e2e8f0', cursor: 'pointer', userSelect: 'none' }}>
                    Faire confiance à cet appareil pendant 7 jours
                  </label>
                </div>

                {errors.general && (
                  <div style={{ fontSize: '0.875rem', color: '#ef4444', textAlign: 'center', marginTop: '10px' }}>
                    {errors.general}
                  </div>
                )}

                {/* Bouton d'action principal */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-accent)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.925rem',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '15px',
                    transition: 'transform 0.1s, opacity 0.2s',
                    opacity: isLoading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {isLoading ? (
                    <span style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(0,0,0,0.1)',
                      borderTopColor: '#000000',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite'
                    }} />
                  ) : (
                    isSignUp ? 'Créer mon compte Nonalix' : 'Se connecter à Nonalix'
                  )}
                </button>

              </form>
            </>
          )}
        </div>
      </div>

      {/* Panneau Droite : Vidéo Sphère/Planète */}
      <div style={{
        flex: '1 1 55%',
        position: 'relative',
        backgroundColor: '#000000',
        display: 'block',
        overflow: 'hidden'
      }} className="connexion-video-panel">
        
        {/* Vidéo de la planète en boucle */}
        <video
          src="/images/products/planet-nonalix.webm"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0.8
          }}
        />

        {/* Overlay Dégradé Sombre pour intégrer le design */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to right, #07080a 0%, rgba(7, 8, 10, 0.4) 30%, rgba(7, 8, 10, 0) 100%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Styles CSS injectés localement pour les animations réactives */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Cacher la vidéo sur mobile */
        @media (max-width: 768px) {
          .connexion-video-panel {
            display: none !important;
          }
          .connexion-form-panel {
            flex: 1 1 100% !important;
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
