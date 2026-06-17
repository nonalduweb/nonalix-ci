import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SITE_CONFIG, LEGAL_INFO } from '@/lib/constants';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import { StatsCounter } from '@/components/home/StatsCounter';

export const metadata: Metadata = {
  title: 'À Propos de Nous',
  description: `Découvrez l'histoire de ${SITE_CONFIG.name}, notre mission d'automatisation par intelligence artificielle et nos solutions de marketing digital en Côte d'Ivoire.`,
};

const values = [
  {
    icon: '🤖',
    title: 'Innovation continue',
    description: 'Nous intégrons les dernières avancées en Intelligence Artificielle (GPT-4, agents autonomes) pour automatiser vos tâches les plus complexes.',
  },
  {
    icon: '🇨🇮',
    title: 'Ancrage local',
    description: 'Une agence 100% ivoirienne à Abidjan, connectée aux réalités économiques et intégrant les paiements locaux (Orange Money, Wave, MTN).',
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
      {/* Hero Section */}
      <section className="section" style={{ paddingTop: 'var(--space-4xl)' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">🏢 Notre Histoire</span>
            <h1 style={{ marginTop: 'var(--space-md)', fontSize: '2.5rem' }}>
              Qui sommes-nous chez <span className="text-gradient">{SITE_CONFIG.name}</span> ?
            </h1>
            <p>
              L&apos;agence technologique et marketing qui réinvente le digital et l&apos;automatisation
              par Intelligence Artificielle en Côte d&apos;Ivoire.
            </p>
          </div>
        </div>
      </section>

      {/* Presentation Grid (Story & About image) */}
      <section className="section" style={{ background: 'var(--color-surface)', paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <span className="badge badge-highlight">🎯 Notre Mission</span>
              <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)' }}>
                Rendre l&apos;IA accessible aux entreprises ivoiriennes
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                Fondée à Abidjan, <strong>{SITE_CONFIG.fullName}</strong> est née d&apos;un constat simple : les PME et grandes entreprises africaines ont besoin d&apos;outils technologiques modernes, rapides et adaptés à leurs réalités locales pour rester compétitives.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                Nous combinons le savoir-faire en marketing d&apos;acquisition digital et la puissance du développement web no-code ou sur mesure pour concevoir des systèmes de vente automatisés, des boutiques e-commerce haute performance et des chatbots intelligents (WhatsApp et Web).
              </p>
              <div style={{
                marginTop: 'var(--space-sm)',
                padding: 'var(--space-md)',
                background: 'var(--color-primary-light)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.6
              }}>
                <div><strong>Enregistrement Légal :</strong></div>
                <div>NONALIX CI SARL — RCCM : {LEGAL_INFO.rccm} — IDU : {LEGAL_INFO.idu}</div>
                <div>Siège social : Abidjan, Côte d&apos;Ivoire</div>
              </div>
            </div>
            
            <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
              <Image
                src="/images/products/about-img.jpg"
                alt="Bureaux de l'agence NONALIX CI"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
              />
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
            <span className="badge badge-accent">⭐ Nos Valeurs</span>
            <h2 style={{ marginTop: 'var(--space-md)' }}>
              Ce en quoi nous <span className="text-gradient">croyons</span>
            </h2>
            <p>
              Nos principes guident chacune de nos réalisations et nos collaborations clients.
            </p>
          </div>

          <div className="grid grid-4">
            {values.map((val) => (
              <div key={val.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <div style={{ fontSize: '2rem' }}>{val.icon}</div>
                <h3 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-heading)' }}>{val.title}</h3>
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
