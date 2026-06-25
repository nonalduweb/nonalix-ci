'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { CONTACT_INFO } from '@/lib/constants';

const SUBJECTS = [
  'Automatisation IA',
  'Développement Web',
  'SEO & Référencement',
  'Google Ads',
  'Audit Gratuit',
  'Autre',
];

const TIME_SLOTS = [
  'Matin (8h–12h)',
  'Après-midi (12h–17h)',
  'Soir (17h–20h)',
];

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  phone: string;
  subject: string;
  date: string;
  slot: string;
}

const EMPTY_FORM: FormData = {
  name: '', phone: '', subject: '', date: '', slot: '',
};

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formState, setFormState] = useState<FormState>('idle');
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  const popupRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const today = new Date().toISOString().split('T')[0];

  const openPopup = useCallback(() => {
    setMounted(true);
    requestAnimationFrame(() => setOpen(true));
  }, []);

  const closePopup = useCallback(() => {
    setOpen(false);
  }, []);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePopup(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, closePopup]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus close button on open
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  const handleWhatsApp = () => {
    window.open(CONTACT_INFO.whatsappLink, '_blank', 'noopener,noreferrer');
  };

  const setField = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setFormState('submitting');
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setFormState('success');
    } catch {
      setFormState('error');
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setFormState('idle');
  };

  return (
    <>
      {/* ── Floating trigger ── */}
      <button
        className="wa-trigger"
        onClick={openPopup}
        aria-label="Ouvrir le widget WhatsApp NONALIX CI"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className="wa-trigger-ring" aria-hidden="true" />
        <svg className="wa-trigger-icon" viewBox="0 0 32 32" fill="white" aria-hidden="true">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.905 15.905 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.35 22.614c-.392 1.106-1.942 2.024-3.194 2.292-.856.182-1.974.326-5.738-1.234-4.818-1.994-7.916-6.886-8.158-7.206-.232-.32-1.942-2.586-1.942-4.932 0-2.346 1.228-3.5 1.664-3.978.392-.432 1.036-.628 1.654-.628.198 0 .376.01.536.018.478.02.716.048 1.032.796.392.934 1.35 3.28 1.468 3.52.12.24.232.554.072.874-.148.326-.278.472-.518.744-.24.272-.468.48-.708.774-.22.258-.468.534-.194 1.012.274.472 1.218 2.012 2.614 3.26 1.796 1.604 3.308 2.102 3.78 2.334.392.192.858.158 1.15-.154.368-.392.82-1.042 1.282-1.684.328-.458.742-.516 1.172-.348.436.16 2.774 1.308 3.252 1.546.478.24.794.354.912.554.116.198.116 1.152-.276 2.26z"/>
        </svg>
      </button>

      {/* ── Backdrop overlay ── */}
      {mounted && (
        <div
          className={`wa-overlay${open ? ' wa-overlay--open' : ''}`}
          onClick={closePopup}
          aria-hidden="true"
        />
      )}

      {/* ── Popup ── */}
      {mounted && (
        <div
          ref={popupRef}
          className={`wa-popup${open ? ' wa-popup--open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Contact NONALIX CI"
        >

          {/* Header */}
          <div className="wa-header">
            <div className="wa-header-info">
              <div className="wa-logo-wrap">
                <Image
                  src="/images/brand/logo.png"
                  alt="NONALIX CI"
                  fill
                  style={{ objectFit: 'contain', objectPosition: 'left center' }}
                  sizes="88px"
                />
              </div>
              <div className="wa-header-text">
                <h3 className="wa-header-title">Besoin d'un expert ?</h3>
                <p className="wa-header-sub">Spécialiste IA &amp; Automatisation</p>
              </div>
            </div>
            <button
              ref={closeRef}
              className="wa-close"
              onClick={closePopup}
              aria-label="Fermer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Scrollable body */}
          <div className="wa-body">

            {/* WhatsApp CTA */}
            <button className="wa-wa-btn" onClick={handleWhatsApp} type="button">
              <span className="wa-wa-icon-wrap" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 32 32" fill="white">
                  <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.905 15.905 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.35 22.614c-.392 1.106-1.942 2.024-3.194 2.292-.856.182-1.974.326-5.738-1.234-4.818-1.994-7.916-6.886-8.158-7.206-.232-.32-1.942-2.586-1.942-4.932 0-2.346 1.228-3.5 1.664-3.978.392-.432 1.036-.628 1.654-.628.198 0 .376.01.536.018.478.02.716.048 1.032.796.392.934 1.35 3.28 1.468 3.52.12.24.232.554.072.874-.148.326-.278.472-.518.744-.24.272-.468.48-.708.774-.22.258-.468.534-.194 1.012.274.472 1.218 2.012 2.614 3.26 1.796 1.604 3.308 2.102 3.78 2.334.392.192.858.158 1.15-.154.368-.392.82-1.042 1.282-1.684.328-.458.742-.516 1.172-.348.436.16 2.774 1.308 3.252 1.546.478.24.794.354.912.554.116.198.116 1.152-.276 2.26z"/>
                </svg>
              </span>
              <span className="wa-wa-text">
                <span className="wa-wa-label">Discuter sur WhatsApp</span>
                <span className="wa-wa-sub">Réponse en quelques minutes</span>
              </span>
              <span className="wa-wa-arrow" aria-hidden="true">↗</span>
            </button>

            {/* Separator */}
            <div className="wa-sep">
              <span className="wa-sep-line" />
              <span className="wa-sep-or">OU</span>
              <span className="wa-sep-line" />
            </div>
            <p className="wa-recall-label">Demandez un rappel gratuit</p>

            {/* Success state */}
            {formState === 'success' ? (
              <div className="wa-success">
                <div className="wa-success-emoji">✅</div>
                <h4 className="wa-success-title">Merci !</h4>
                <p className="wa-success-text">
                  Notre équipe vous contactera dans les plus brefs délais.
                </p>
                <button className="wa-success-back" onClick={resetForm} type="button">
                  Nouvelle demande
                </button>
              </div>
            ) : (

              /* Form */
              <form className="wa-form" onSubmit={handleSubmit} noValidate>

                {/* Nom */}
                <div className="wa-field">
                  <label htmlFor="wa-f-name" className="wa-label">
                    Nom <span className="wa-req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="wa-f-name"
                    type="text"
                    className="wa-input"
                    placeholder="Votre nom"
                    value={form.name}
                    onChange={setField('name')}
                    required
                    autoComplete="given-name"
                  />
                </div>

                {/* Téléphone */}
                <div className="wa-field">
                  <label htmlFor="wa-f-phone" className="wa-label">
                    Téléphone <span className="wa-req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="wa-f-phone"
                    type="tel"
                    className="wa-input"
                    placeholder="+225 07 00 00 00 00"
                    value={form.phone}
                    onChange={setField('phone')}
                    required
                    autoComplete="tel"
                  />
                </div>

                {/* Sujet */}
                <div className="wa-field">
                  <label htmlFor="wa-f-subject" className="wa-label">Sujet</label>
                  <div className="wa-select-wrap">
                    <select
                      id="wa-f-subject"
                      className="wa-input wa-select"
                      value={form.subject}
                      onChange={setField('subject')}
                    >
                      <option value="">Choisir un sujet…</option>
                      {SUBJECTS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <span className="wa-select-chevron" aria-hidden="true">▾</span>
                  </div>
                </div>

                {/* Row: Date + Créneau */}
                <div className="wa-row">
                  <div className="wa-field">
                    <label htmlFor="wa-f-date" className="wa-label">Date souhaitée</label>
                    <input
                      id="wa-f-date"
                      type="date"
                      className="wa-input"
                      min={today}
                      value={form.date}
                      onChange={setField('date')}
                    />
                  </div>
                  <div className="wa-field">
                    <label htmlFor="wa-f-slot" className="wa-label">Créneau</label>
                    <div className="wa-select-wrap">
                      <select
                        id="wa-f-slot"
                        className="wa-input wa-select"
                        value={form.slot}
                        onChange={setField('slot')}
                      >
                        <option value="">Choisir…</option>
                        {TIME_SLOTS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <span className="wa-select-chevron" aria-hidden="true">▾</span>
                    </div>
                  </div>
                </div>

                {formState === 'error' && (
                  <p className="wa-form-error" role="alert">
                    Une erreur est survenue. Réessayez ou contactez-nous directement sur WhatsApp.
                  </p>
                )}

                <button
                  type="submit"
                  className="wa-submit"
                  disabled={formState === 'submitting' || !form.name.trim() || !form.phone.trim()}
                >
                  {formState === 'submitting' ? (
                    <span className="wa-spinner" aria-label="Envoi en cours…" />
                  ) : (
                    'Demander mon rappel →'
                  )}
                </button>

                <p className="wa-disclaimer">Sans engagement · Réponse garantie sous 24h</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
