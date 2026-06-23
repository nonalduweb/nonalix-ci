'use client';

import { useEffect, useState, useRef } from 'react';

const conversation = [
  { role: 'user' as const, text: 'Bonjour, je voudrais automatiser le suivi de mes clients.' },
  {
    role: 'bot' as const,
    text: 'Bonjour ! 👋 Je comprends votre besoin. Nous pouvons mettre en place un système intelligent qui envoie automatiquement des relances personnalisées à vos clients, suit leurs interactions et vous alerte quand une opportunité se présente. Souhaitez-vous en discuter avec notre équipe ?',
  },
];

export function AIDemo() {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    // Show user message after 500ms
    const timer1 = setTimeout(() => {
      setVisibleMessages(1);
    }, 500);

    // Show typing indicator
    const timer2 = setTimeout(() => {
      setIsTyping(true);
    }, 1500);

    // Type bot message
    const timer3 = setTimeout(() => {
      setIsTyping(false);
      const fullText = conversation[1].text;
      let i = 0;
      const typeInterval = setInterval(() => {
        i++;
        setTypingText(fullText.slice(0, i));
        if (i >= fullText.length) {
          clearInterval(typeInterval);
          setVisibleMessages(2);
        }
      }, 20);
      return () => clearInterval(typeInterval);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [started]);

  return (
    <section className="section" id="ai-demo-section">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-accent">Démo interactive</span>
          <h2 style={{ marginTop: 'var(--space-md)' }}>
            Voyez notre <span className="text-gradient">IA en action</span>
          </h2>
          <p>
            Notre agent conversationnel intelligent comprend vos besoins
            et propose des solutions adaptées en temps réel.
          </p>
        </div>

        <div className="ai-demo" ref={ref}>
          <div className="ai-demo-header">
            <div className="ai-demo-dot" />
            <span className="ai-demo-title">NONALIX AI Assistant — En ligne</span>
          </div>

          <div className="ai-demo-messages">
            {visibleMessages >= 1 && (
              <div className="ai-msg ai-msg-user animate-fade-in-up">
                {conversation[0].text}
              </div>
            )}

            {isTyping && (
              <div className="typing-indicator animate-fade-in">
                <span />
                <span />
                <span />
              </div>
            )}

            {visibleMessages >= 2 ? (
              <div className="ai-msg ai-msg-bot animate-fade-in-up">
                {conversation[1].text}
              </div>
            ) : (
              typingText && !isTyping && (
                <div className="ai-msg ai-msg-bot">
                  {typingText}
                  <span style={{ animation: 'blink 1s infinite', marginLeft: '2px' }}>|</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
