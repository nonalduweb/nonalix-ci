'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [onboardingForm, setOnboardingForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Charger ou initialiser la session au montage
  useEffect(() => {
    let activeSession = sessionStorage.getItem('nonalix_chat_session_id');
    const onboarded = sessionStorage.getItem('nonalix_chat_onboarded') === 'true';

    if (activeSession) {
      setSessionId(activeSession);
      if (onboarded) {
        setHasOnboarded(true);
        fetchHistory(activeSession);
      } else {
        fetchHistory(activeSession);
      }
    } else {
      activeSession = `web-${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem('nonalix_chat_session_id', activeSession);
      setSessionId(activeSession);
      setHasOnboarded(false);
    }
  }, []);

  // Défilement automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const fetchHistory = async (sessId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/v1/chat/history/${sessId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
          setHasOnboarded(true);
          sessionStorage.setItem('nonalix_chat_onboarded', 'true');
        }
      }
    } catch (err) {
      console.log('Backend non disponible au chargement de l\'historique.');
      if (sessionStorage.getItem('nonalix_chat_onboarded') === 'true') {
        setHasOnboarded(true);
        setMessages([
          {
            id: 'init-msg',
            role: 'assistant',
            content: 'Bonjour ! 👋 Bienvenue chez NONALIX CI. Je suis votre assistant virtuel commercial. Comment puis-je vous aider aujourd\'hui ?',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFormErrors({});

    const errors: { name?: string; email?: string; phone?: string } = {};
    if (!onboardingForm.name.trim()) {
      errors.name = 'Le nom complet est requis.';
    }
    if (!onboardingForm.email.trim()) {
      errors.email = "L'adresse email est requise.";
    } else if (!/\S+@\S+\.\S+/.test(onboardingForm.email)) {
      errors.email = "L'adresse email n'est pas valide.";
    }
    
    // Nettoyer le téléphone (espaces, tirets, points)
    const phoneClean = onboardingForm.phone.replace(/[\s.-]/g, '');
    // Regex pour numéro de téléphone national/international valide (min 8 chiffres)
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    if (!onboardingForm.phone.trim()) {
      errors.phone = 'Le numéro de téléphone est requis.';
    } else if (!phoneRegex.test(phoneClean)) {
      errors.phone = 'Le numéro doit être au format valide (ex: +225 07 07 07 07 07 ou +33 6...).';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/v1/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'commencer',
          sessionId: sessionId,
          platform: 'web',
          leadName: onboardingForm.name.trim(),
          leadEmail: onboardingForm.email.trim(),
          leadPhone: phoneClean
        })
      });

      if (!res.ok) {
        throw new Error('Erreur de communication avec le serveur');
      }

      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        createdAt: new Date().toISOString()
      };
      
      setMessages([botMsg]);
      setHasOnboarded(true);
      sessionStorage.setItem('nonalix_chat_onboarded', 'true');

      // Déclencher la notification e-mail à contact@nonalix-ci.com
      try {
        await fetch('/api/chat-onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: onboardingForm.name.trim(),
            email: onboardingForm.email.trim(),
            phone: phoneClean
          })
        });
      } catch (mailErr) {
        console.error('Erreur d\'envoi de la notification e-mail:', mailErr);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Impossible de démarrer la discussion. Veuillez vérifier si le serveur backend est démarré.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    setErrorMsg(null);

    // Ajouter le message utilisateur localement
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/v1/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          sessionId: sessionId,
          platform: 'web'
        })
      });

      if (!res.ok) {
        throw new Error('Erreur de communication avec le serveur');
      }

      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        createdAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setErrorMsg('Impossible de contacter l\'assistant IA. Vérifiez que le serveur backend est en cours d\'exécution.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue;
    setInputValue('');
    await submitMessage(text);
  };

  const handleSuggestionClick = async (suggestionText: string) => {
    await submitMessage(suggestionText);
  };

  const getSuggestions = (text: string): string[] => {
    const t = text.toLowerCase();
    
    // 1. Contextual Sector check
    if (t.includes("secteur d'activité") || t.includes("secteur d’activité") || t.includes("votre secteur")) {
      return ['Commerce', 'Immobilier', 'Formation', 'Santé', 'Restauration', 'Services', 'E-commerce', 'Autre'];
    }
    
    // 2. Contextual Needs check
    if (t.includes("besoin principal") || t.includes("expertise") || t.includes("quel service") || t.includes("votre besoin")) {
      return ['Création Web Next.js', 'Référencement (SEO)', 'Chatbot IA sur-mesure', 'Automatisation', 'Packs de formation'];
    }

    // 3. Contextual Packs check
    if (t.includes("pack") || t.includes("formation en ligne") || t.includes("ebook")) {
      return ['Pack Révolution IA', 'Pack E-commerce', 'Bibliothèque Ebooks', 'Voir la boutique'];
    }
    
    // 4. Welcome greeting check
    if (t.includes("bienvenue chez nonalix") || t.includes("comment puis-je vous aider") || t.includes("ravi de faire votre connaissance")) {
      return ['Services Agence B2B', 'Packs de Formation', 'Demander un devis', 'Parler à un conseiller'];
    }

    // 5. Fallback list parser
    // Search for bulleted items (e.g. "- Option")
    const suggestions: string[] = [];
    const lines = text.split('\n');
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('-') || line.startsWith('*')) {
        const cleaned = line.replace(/^[-*\s]+/, '').trim();
        if (cleaned.length > 0 && cleaned.length < 40) {
          suggestions.push(cleaned);
        }
      }
    }
    if (suggestions.length >= 2) return suggestions;

    // Search for numbered items (e.g. "1. Option")
    const matches = text.match(/\d+[\.\)\-]\s*([^\d\n\.\)\-]+)/g);
    if (matches && matches.length >= 2) {
      const parsed = matches.map(m => m.replace(/^\d+[\.\)\-]\s*/, '').trim()).filter(m => m.length > 0 && m.length < 40);
      if (parsed.length >= 2) return parsed;
    }

    return [];
  };

  const renderMessageContent = (content: string) => {
    if (!content) return null;
    
    const lines = content.split('\n');
    
    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={lineIdx} style={{ height: '6px' }} />;
      }
      
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.substring(2);
        const parts = itemText.split(/(\*\*[^*]+\*\*)/g);
        return (
          <div key={lineIdx} style={{ display: 'flex', gap: '8px', margin: '4px 0 4px 12px' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>•</span>
            <span style={{ flex: 1 }}>
              {parts.map((part, idx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={idx} style={{ fontWeight: 700, color: '#ffffff' }}>{part.slice(2, -2)}</strong>;
                }
                return part;
              })}
            </span>
          </div>
        );
      }
      
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={lineIdx} style={{ margin: lineIdx === lines.length - 1 ? 0 : '0 0 8px 0', wordBreak: 'break-word' }}>
          {parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={idx} style={{ fontWeight: 700, color: '#ffffff' }}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* Bouton flottant du Chatbot (à gauche) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chat-float-btn"
        aria-label="Discuter avec notre IA"
        id="chat-ai-button"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          zIndex: 1000,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-glow))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
          transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
          animation: 'float 3s ease-in-out infinite',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      {/* Boîte de discussion */}
      {isOpen && (
        <div
          className="chat-window card animate-fade-in-up"
          style={{
            position: 'fixed',
            bottom: '5.5rem',
            left: '1.5rem',
            width: '350px',
            height: '480px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 0,
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
            background: 'rgba(22, 23, 27, 0.9)',
            backdropFilter: 'blur(16px)'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: 'var(--space-md)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--color-success)',
                  boxShadow: '0 0 8px var(--color-success)'
                }}
              />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>NONALIX AI</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Assistant Qualification</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {!hasOnboarded ? (
            <form
              onSubmit={handleOnboardingSubmit}
              style={{
                flex: 1,
                padding: 'var(--space-lg) var(--space-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 'var(--space-md)',
                overflowY: 'auto'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-xs)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-xs)', fontFamily: 'var(--font-heading)' }}>
                  Discuter avec notre IA
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                  Veuillez renseigner vos coordonnées pour démarrer la discussion.
                </p>
              </div>

              {/* Champ Nom */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Nom complet *</label>
                <input
                  type="text"
                  placeholder="ex: Kouamé Konan"
                  value={onboardingForm.name}
                  onChange={(e) => setOnboardingForm(prev => ({ ...prev, name: e.target.value }))}
                  disabled={isLoading}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255,255,255,0.03)',
                    border: formErrors.name ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'border-color var(--transition-base)'
                  }}
                />
                {formErrors.name && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-error)' }}>{formErrors.name}</span>
                )}
              </div>

              {/* Champ Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Adresse e-mail *</label>
                <input
                  type="email"
                  placeholder="ex: client@gmail.com"
                  value={onboardingForm.email}
                  onChange={(e) => setOnboardingForm(prev => ({ ...prev, email: e.target.value }))}
                  disabled={isLoading}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255,255,255,0.03)',
                    border: formErrors.email ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'border-color var(--transition-base)'
                  }}
                />
                {formErrors.email && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-error)' }}>{formErrors.email}</span>
                )}
              </div>

              {/* Champ Téléphone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Téléphone *</label>
                <input
                  type="tel"
                  placeholder="ex: +225 07 07 07 07 07 ou +33 6..."
                  value={onboardingForm.phone}
                  onChange={(e) => setOnboardingForm(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={isLoading}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255,255,255,0.03)',
                    border: formErrors.phone ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'border-color var(--transition-base)'
                  }}
                />
                {formErrors.phone && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-error)' }}>{formErrors.phone}</span>
                )}
              </div>

              {errorMsg && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--color-error)',
                    color: 'var(--color-error)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    textAlign: 'center'
                  }}
                >
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-glow))',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: 'var(--space-xs)',
                  transition: 'opacity var(--transition-base)',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Initialisation...' : 'Démarrer la discussion'}
              </button>
            </form>
          ) : (
            <>
              {/* Messages */}
              <div
                style={{
                  flex: 1,
                  padding: 'var(--space-md)',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-md)'
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: msg.role === 'user' ? 'var(--color-accent)' : 'var(--color-primary-light)',
                      color: 'var(--color-text)',
                      padding: '12px 16px',
                      borderRadius: msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      fontSize: '0.85rem',
                      lineHeight: 1.55,
                      border: msg.role === 'user' ? 'none' : '1px solid var(--color-border-light)'
                    }}
                  >
                    {renderMessageContent(msg.content)}
                  </div>
                ))}

                {/* Suggestions display if the last message is from assistant */}
                {!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', alignSelf: 'flex-start', maxWidth: '100%', padding: '2px 0 10px' }}>
                    {getSuggestions(messages[messages.length - 1].content).map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{
                          background: 'rgba(59, 130, 246, 0.08)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: '#FAFAFA',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.18)';
                          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                {isLoading && (
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      background: 'var(--color-primary-light)',
                      padding: '10px 14px',
                      borderRadius: '14px 14px 14px 2px',
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                      border: '1px solid var(--color-border-light)'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text-muted)', animation: 'blink 1.4s infinite' }} />
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text-muted)', animation: 'blink 1.4s infinite 0.2s' }} />
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text-muted)', animation: 'blink 1.4s infinite 0.4s' }} />
                  </div>
                )}

                {errorMsg && (
                  <div
                    style={{
                      alignSelf: 'center',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid var(--color-error)',
                      color: 'var(--color-error)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      width: '100%'
                    }}
                  >
                    {errorMsg}
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Form */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: 'var(--space-md)',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  gap: 'var(--space-sm)',
                  background: 'rgba(255,255,255,0.01)'
                }}
              >
                <input
                  type="text"
                  placeholder="Écrivez votre message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: '0.875rem'
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    opacity: (isLoading || !inputValue.trim()) ? 0.6 : 1
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
