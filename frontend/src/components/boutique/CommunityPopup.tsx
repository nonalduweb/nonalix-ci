'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'nonalix_community_popup_dismissed';
// Show the popup after 4 seconds on page load
const SHOW_DELAY_MS = 4000;
// Cooldown: 20 minutes in milliseconds
const COOLDOWN_MS = 20 * 60 * 1000;

export default function CommunityPopup() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Don't show if user already dismissed within the last 7 days
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < COOLDOWN_MS) return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }, 400);
  };

  if (!mounted || !visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Rejoindre la communauté NONALIX CI"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        width: 'min(340px, calc(100vw - 32px))',
        background: 'linear-gradient(145deg, rgba(18,18,18,0.98) 0%, rgba(10,10,10,0.99) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
        overflow: 'hidden',
        transform: animateIn ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        opacity: animateIn ? 1 : 0,
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.35s ease',
      }}
    >
      {/* Top accent bar */}
      <div style={{
        height: '3px',
        background: 'linear-gradient(90deg, #3B82F6 0%, #25D366 50%, #1DC3FF 100%)',
      }} />

      <div style={{ padding: '18px 18px 20px 18px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Icon */}
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(59,130,246,0.12)',
              border: '1px solid rgba(59,130,246,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {/* Bell / community icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{
                fontWeight: 700,
                fontSize: '0.95rem',
                color: '#FAFAFA',
                lineHeight: '1.2',
              }}>
                Rejoins la communauté !
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#71717A',
                marginTop: '2px',
              }}>
                Astuces, nouveautés & offres exclusives
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={dismiss}
            aria-label="Fermer"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              color: '#71717A',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body text */}
        <p style={{
          fontSize: '0.8rem',
          color: '#A1A1AA',
          lineHeight: '1.55',
          margin: '0 0 16px 0',
        }}>
          Accède aux <strong style={{ color: '#FAFAFA' }}>nouvelles formations</strong>, aux
          offres en avant-première et aux astuces pratiques directement dans ton téléphone.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Telegram Button */}
          <a
            href="https://t.me/la_nonalduweb"
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 14px',
              background: 'linear-gradient(135deg, rgba(0,136,204,0.18) 0%, rgba(0,136,204,0.08) 100%)',
              border: '1px solid rgba(0,136,204,0.3)',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#FAFAFA',
              fontWeight: 600,
              fontSize: '0.84rem',
              transition: 'all 0.25s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = 'linear-gradient(135deg, rgba(0,136,204,0.3) 0%, rgba(0,136,204,0.15) 100%)';
              el.style.borderColor = 'rgba(0,136,204,0.5)';
              el.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = 'linear-gradient(135deg, rgba(0,136,204,0.18) 0%, rgba(0,136,204,0.08) 100%)';
              el.style.borderColor = 'rgba(0,136,204,0.3)';
              el.style.transform = 'translateY(0)';
            }}
          >
            {/* Telegram SVG */}
            <svg width="22" height="22" viewBox="0 0 240 240" fill="none">
              <circle cx="120" cy="120" r="120" fill="#0088CC"/>
              <path d="M176.7 70.6L153.1 183.2c-1.7 7.6-6.2 9.5-12.5 5.9l-34.5-25.4-16.7 16.1c-1.8 1.8-3.4 3.4-7 3.4l2.5-35.3 64-57.8c2.8-2.5-.6-3.9-4.3-1.4L67.5 138.8 33.5 128c-7.3-2.3-7.4-7.3 1.5-10.8l134.5-51.9c6.1-2.2 11.5 1.5 9.2 10.2l.0.1z" fill="white"/>
            </svg>
            <div>
              <div>Rejoindre la chaîne Telegram</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 400, color: '#71717A', marginTop: '1px' }}>Nouveautés · Formations · Annonces</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,136,204,0.7)" strokeWidth="2.5" style={{ marginLeft: 'auto' }}>
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>

          {/* WhatsApp Button */}
          <a
            href="https://whatsapp.com/channel/0029Vb8r6UPFSAt6CMvqFw0m"
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 14px',
              background: 'linear-gradient(135deg, rgba(37,211,102,0.15) 0%, rgba(37,211,102,0.06) 100%)',
              border: '1px solid rgba(37,211,102,0.25)',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#FAFAFA',
              fontWeight: 600,
              fontSize: '0.84rem',
              transition: 'all 0.25s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = 'linear-gradient(135deg, rgba(37,211,102,0.25) 0%, rgba(37,211,102,0.12) 100%)';
              el.style.borderColor = 'rgba(37,211,102,0.4)';
              el.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = 'linear-gradient(135deg, rgba(37,211,102,0.15) 0%, rgba(37,211,102,0.06) 100%)';
              el.style.borderColor = 'rgba(37,211,102,0.25)';
              el.style.transform = 'translateY(0)';
            }}
          >
            {/* WhatsApp SVG */}
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#25D366"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M23.5 8.5A10.45 10.45 0 0 0 16 5.5a10.5 10.5 0 0 0-9.1 15.73L5.5 26.5l5.42-1.42A10.5 10.5 0 0 0 26.5 16 10.45 10.45 0 0 0 23.5 8.5zM16 24.97a8.72 8.72 0 0 1-4.44-1.22l-.32-.19-3.22.84.86-3.14-.21-.34A8.73 8.73 0 1 1 16 24.97zm4.79-6.54c-.26-.13-1.55-.77-1.79-.85-.24-.09-.42-.13-.59.13s-.68.85-.83 1.03c-.15.17-.31.2-.57.07a7.17 7.17 0 0 1-2.1-1.3 7.9 7.9 0 0 1-1.46-1.81c-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.47.13-.16.17-.26.26-.44.09-.17.04-.33-.02-.46-.07-.13-.59-1.44-.81-1.97-.21-.52-.43-.44-.59-.45h-.51a.98.98 0 0 0-.71.33 3 3 0 0 0-.94 2.23 5.2 5.2 0 0 0 1.09 2.77c.13.17 1.84 2.81 4.46 3.94.62.27 1.11.43 1.49.55.63.2 1.2.17 1.65.1.5-.08 1.55-.63 1.77-1.24.22-.61.22-1.14.15-1.24-.06-.11-.23-.17-.49-.3z" fill="white"/>
            </svg>
            <div>
              <div>Rejoindre la chaîne WhatsApp</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 400, color: '#71717A', marginTop: '1px' }}>Astuces · Offres · Questions</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(37,211,102,0.7)" strokeWidth="2.5" style={{ marginLeft: 'auto' }}>
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>
        </div>

        {/* Footer hint */}
        <div style={{
          marginTop: '12px',
          textAlign: 'center',
          fontSize: '0.68rem',
          color: '#52525B',
        }}>
          Ce message réapparaîtra dans 20 min si vous le fermez.
        </div>
      </div>
    </div>
  );
}
