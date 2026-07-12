'use client';

import { BorderBeam } from '@/components/ui/BorderBeam';

const faqs = [
  {
    question: 'Combien de temps faut-il pour créer un site web ?',
    answer:
      'Un site vitrine est livré en 2 à 3 semaines. Une boutique e-commerce complète avec intégration Mobile Money demande généralement 4 à 6 semaines. Le calendrier dépend de la complexité du projet et de la rapidité de vos retours.',
  },
  {
    question: 'Quels modes de paiement proposez-vous pour vos services ?',
    answer:
      'Nous acceptons Orange Money, Wave, MTN Mobile Money ainsi que le virement bancaire. Un acompte de 50 % est demandé au démarrage, le solde à la livraison.',
  },
  {
    question: 'Mes paiements clients seront-ils sécurisés sur ma boutique ?',
    answer:
      'Oui. Nous intégrons directement les APIs officielles d\'Orange Money et Wave, certifiées et conformes aux standards de sécurité. Vos clients paient sans quitter votre site et reçoivent une confirmation instantanée.',
  },
  {
    question: 'Proposez-vous une maintenance après la livraison ?',
    answer:
      'Nous offrons 30 jours de support gratuit après la mise en ligne. Des forfaits de maintenance mensuelle sont ensuite disponibles pour la gestion des mises à jour, des sauvegardes et du monitoring de performance.',
  },
  {
    question: 'Mon site sera-t-il bien positionné sur Google ?',
    answer:
      'Chaque site que nous livrons inclut une optimisation SEO de base (balises, vitesse, structure). Pour un référencement avancé et ciblé sur le marché ivoirien, nos forfaits SEO mensuels prennent le relais avec un suivi de positionnement.',
  },
  {
    question: 'Comment fonctionne l\'optimisation de conversion par IA ?',
    answer:
      'Notre IA analyse en continu le comportement de vos visiteurs, teste automatiquement plusieurs variantes de vos pages (textes, boutons, mises en page) et conserve celles qui génèrent le plus de ventes — sans intervention manuelle de votre part.',
  },
];

export function FAQSection() {
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-accent">FAQ</span>
          <h2 style={{ marginTop: 'var(--space-md)' }}>
            Questions <span className="text-gradient">fréquentes</span>
          </h2>
          <p>Tout ce que vous devez savoir avant de démarrer votre projet.</p>
        </div>

        <div
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
          }}
        >
          {faqs.map((faq, i) => (
            <BorderBeam key={i} colorFrom="var(--color-accent-glow)" colorTo="var(--color-highlight)" duration={5 + i * 0.7}>
            <details
              style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}
            >
              <summary
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-lg)',
                  cursor: 'pointer',
                  listStyle: 'none',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: 'var(--color-text)',
                  gap: 'var(--space-md)',
                }}
              >
                <span>{faq.question}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, color: 'var(--color-accent)' }}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <p
                style={{
                  padding: '0 var(--space-lg) var(--space-lg)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  borderTop: '1px solid var(--color-border-light)',
                  paddingTop: 'var(--space-md)',
                  marginTop: 0,
                }}
              >
                {faq.answer}
              </p>
            </details>
            </BorderBeam>
          ))}
        </div>
      </div>
    </section>
  );
}
