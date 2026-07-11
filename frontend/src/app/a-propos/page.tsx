import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG, LEGAL_INFO } from '@/lib/constants';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import { StatsCounter } from '@/components/home/StatsCounter';

export const metadata: Metadata = {
  title: `À Propos — Agence Digitale & IA Fondée à Abidjan, Côte d'Ivoire`,
  description: `NONALIX CI est une agence digitale ivoirienne fondée à Abidjan, Cocody. Spécialisés en développement web Next.js, automatisation IA, SEO Google et e-commerce Orange Money & Wave pour les entreprises de Côte d'Ivoire et d'Afrique de l'Ouest.`,
  keywords: [
    "agence digitale Abidjan",
    "startup tech Côte d'Ivoire",
    "agence web ivoirienne Cocody",
    "équipe développeurs Abidjan",
    "agence IA africaine",
    "NONALIX CI histoire",
    "agence digitale Afrique",
  ],
  alternates: {
    canonical: '/a-propos',
  },
  openGraph: {
    title: 'À Propos de NONALIX CI — Agence Digitale & IA à Abidjan, Côte d\'Ivoire',
    description: 'Agence technologique ivoirienne fondée à Abidjan Cocody. Développement web, IA, SEO et e-commerce Mobile Money pour les entreprises d\'Afrique de l\'Ouest.',
    url: '/a-propos',
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "url": "https://nonalix-ci.com/a-propos",
  "name": "À Propos de NONALIX CI — Agence Digitale & IA à Abidjan",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://nonalix-ci.com" },
      { "@type": "ListItem", "position": 2, "name": "À Propos", "item": "https://nonalix-ci.com/a-propos" },
    ],
  },
  "mainEntity": { "@id": "https://nonalix-ci.com/#organization" },
};

const values = [
  {
    icon: '🤖',
    title: 'Innovation continue',
    description: 'Nous intégrons les dernières avancées en Intelligence Artificielle (GPT-4, agents autonomes) pour automatiser vos tâches les plus complexes.',
  },
  {
    icon: '🌍',
    title: 'Flexibilité Globale',
    description: 'Une agence connectée aux réalités locales avec des solutions adaptées à chaque marché, y compris l\'intégration des paiements par Mobile Money et cartes bancaires.',
  },
  {
    icon: '🚀',
    title: 'Haute performance',
    description: 'Nos plateformes Next.js et FastAPI sont optimisées pour charger instantanément, même sur les réseaux mobiles 3G/4G.',
  },
  {
    icon: '🤝',
    title: 'Proximité & Support',
    description: 'Nous vous accompagnons de la phase de conception au suivi quotidien, avec un support réactif disponible sur WhatsApp.',
  },
];



export default function AProposPage() {
  return (
    <div className="page-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      {/* Hero Section */}
      <section className="section" style={{ paddingTop: 'var(--space-4xl)' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">Notre Histoire</span>
            <h1 style={{ marginTop: 'var(--space-md)', fontSize: '2.5rem', maxWidth: '780px', margin: 'var(--space-md) auto 0' }}>
              Construire les entreprises <span className="text-gradient">intelligentes</span> de demain.
            </h1>
            <p style={{ marginTop: 'var(--space-md)', maxWidth: '640px', margin: 'var(--space-md) auto 0' }}>
              Nous construisons les systèmes intelligents qui alimentent la croissance des entreprises modernes.
            </p>
          </div>
        </div>
      </section>

      {/* Presentation Grid (Story & AI visual) */}
      <section className="section" style={{ background: 'var(--color-surface)', paddingTop: 'var(--space-xl)' }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'start', gap: 'var(--space-2xl)' }}>

            {/* ── Text content ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.9375rem' }}>
                <strong style={{ color: 'var(--color-text)' }}>{SITE_CONFIG.fullName}</strong>{' '}est une entreprise technologique spécialisée dans l&apos;intelligence artificielle, l&apos;automatisation des processus et la croissance digitale.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.9375rem' }}>
                Nous accompagnons les entreprises qui souhaitent accélérer leur développement grâce à des systèmes capables de générer des prospects, automatiser les tâches répétitives, optimiser la relation client et améliorer la performance commerciale.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.9375rem' }}>
                Notre expertise réunit plusieurs domaines stratégiques : l&apos;intelligence artificielle, l&apos;automatisation des workflows, le développement web et mobile, le référencement avancé, la publicité digitale et la conception d&apos;écosystèmes numériques à forte valeur ajoutée.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.9375rem' }}>
                Au-delà des outils, nous concevons de véritables infrastructures de croissance capables de fonctionner 24h/24, de qualifier automatiquement les opportunités commerciales et d&apos;offrir une expérience client moderne, rapide et performante.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.9375rem' }}>
                Aujourd&apos;hui, NONALIX CI accompagne des entreprises en Afrique, en Europe et en Amérique du Nord dans leur transformation digitale en déployant des solutions innovantes adaptées aux exigences d&apos;un marché en constante évolution.
              </p>

              {/* Ambition statement */}
              <div style={{
                padding: 'var(--space-lg)',
                background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(59,130,246,0.04) 100%)',
                border: '1px solid rgba(37,99,235,0.2)',
                borderLeft: '3px solid var(--color-accent)',
                borderRadius: 'var(--radius-md)',
              }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>Notre ambition est claire :</p>
                <p style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, lineHeight: 1.6 }}>
                  Permettre aux entreprises de vendre plus, travailler plus intelligemment et croître plus rapidement grâce à l&apos;intelligence artificielle et à l&apos;automatisation.
                </p>
              </div>

              {/* Legal */}
              <div style={{
                padding: 'var(--space-md)',
                background: 'var(--color-primary-light)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.6,
              }}>
                <strong>Enregistrement Légal :</strong>
                <div>NONALIX CI SARL — RCCM : {LEGAL_INFO.rccm}</div>
                <div>Siège social : Abidjan, Côte d&apos;Ivoire</div>
              </div>
            </div>

            {/* ── AI Qualification Visual ── */}
            <div style={{
              position: 'sticky',
              top: '100px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
              boxShadow: '0 0 60px rgba(37,99,235,0.08), var(--shadow-lg)',
            }}>
              <img
                src="/images/about/ai-lead-qualification.svg"
                alt="Agent IA NONALIX qualifiant un prospect en temps réel — scoring BANT automatique"
                width={760}
                height={520}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                loading="eager"
              />
              <div style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                textAlign: 'center',
                borderTop: '1px solid var(--color-border)',
              }}>
                Agent IA en train de qualifier un prospect — score BANT calculé en temps réel
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ gap: 'var(--space-4xl)', alignItems: 'start' }}>

            {/* Domains */}
            <div>
              <span className="badge badge-accent" style={{ marginBottom: 'var(--space-md)', display: 'inline-block' }}>Compétences</span>
              <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-lg)' }}>
                Nos Domaines d&apos;<span className="text-gradient">Expertise</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {[
                  'Intelligence Artificielle & Agents IA',
                  'Automatisation des Processus et Workflows',
                  'Développement Web & Mobile',
                  'E-Commerce Haute Performance',
                  'Référencement SEO & Visibilité Digitale',
                  'Publicité Google Ads & Acquisition',
                  'Branding & Identité de Marque',
                  'Stratégie Digitale & Transformation Numérique',
                ].map((label, idx) => (
                  <div 
                    key={label} 
                    className="interactive-expertise-card animate-fade-in-up"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-md)',
                      padding: 'var(--space-md)',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      animationDelay: `${idx * 0.05}s`
                    }}
                  >
                    {/* Visual left indicator replacing the emoji */}
                    <div style={{
                      width: '4px',
                      height: '16px',
                      background: 'var(--color-accent)',
                      borderRadius: 'var(--radius-full)'
                    }} />
                    <span style={{ fontWeight: 500, fontSize: '0.9375rem', color: 'var(--color-text)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
              <div>
                <span className="badge badge-highlight" style={{ marginBottom: 'var(--space-md)', display: 'inline-block' }}>Philosophie</span>
                <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-lg)' }}>
                  Notre <span className="text-gradient">Engagement</span>
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.9375rem', marginBottom: 'var(--space-md)' }}>
                  Chaque solution que nous développons poursuit le même objectif :
                </p>
                <div style={{
                  padding: 'var(--space-xl)',
                  background: 'linear-gradient(135deg, rgba(226,83,54,0.06) 0%, rgba(255,120,50,0.03) 100%)',
                  border: '1px solid rgba(226,83,54,0.2)',
                  borderLeft: '3px solid var(--color-highlight)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.6 }}>
                    Transformer la technologie en résultats mesurables pour nos clients.
                  </p>
                </div>
              </div>

              {/* Values (compact) */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', marginBottom: 'var(--space-md)', color: 'var(--color-text)' }}>Nos valeurs fondamentales</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {values.map((val, idx) => (
                    <div 
                      key={val.title} 
                      className="interactive-value-card animate-fade-in-up"
                      style={{
                        display: 'flex',
                        gap: 'var(--space-md)',
                        padding: 'var(--space-md)',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        animationDelay: `${(idx + 4) * 0.05}s`
                      }}
                    >
                      {/* Left indicator line in orange/highlight */}
                      <div style={{
                        width: '3px',
                        height: '20px',
                        background: 'var(--color-highlight)',
                        borderRadius: 'var(--radius-full)',
                        marginTop: '2px',
                        flexShrink: 0
                      }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>{val.title}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{val.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <StatsCounter />

      {/* Core Values Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">Nos Valeurs</span>
            <h2 style={{ marginTop: 'var(--space-md)' }}>
              Ce en quoi nous <span className="text-gradient">croyons</span>
            </h2>
            <p>
              Nos principes guident chacune de nos réalisations et nos collaborations clients.
            </p>
          </div>

          <div className="grid grid-4">
            {values.map((val, idx) => (
              <div 
                key={val.title} 
                className="card interactive-grid-value-card animate-fade-in-up" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 'var(--space-sm)',
                  position: 'relative',
                  overflow: 'hidden',
                  animationDelay: `${idx * 0.08}s`
                }}
              >
                {/* Decorative subtle colored accent bar on top of the card */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '3px',
                  background: 'linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-glow) 100%)'
                }} />
                
                <h3 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>{val.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />



      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="cta-section">
            <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)' }}>
              Prêt à accélérer votre croissance ?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto var(--space-xl)', lineHeight: 1.7 }}>
              Discutez avec notre Agent IA en bas à gauche de votre écran, ou contactez-nous directement pour concevoir votre solution sur mesure.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary btn-lg">
                Nous Contacter
              </Link>
              <Link href="/boutique" className="btn btn-outline btn-lg">
                Explorer nos Packs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
