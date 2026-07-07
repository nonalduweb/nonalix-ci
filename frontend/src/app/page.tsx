import type { Metadata } from 'next';
import Image from 'next/image';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { PortfolioSection } from '@/components/home/PortfolioSection';
import { FAQSection } from '@/components/home/FAQSection';
import { Testimonials } from '@/components/home/Testimonials';
import { CTASection } from '@/components/home/CTASection';
import { StatsCounter } from '@/components/home/StatsCounter';
import { SITE_CONFIG } from '@/lib/constants';
import ScrollReveal from '@/components/layout/ScrollReveal';
import { VideoCurtain } from '@/components/home/VideoCurtain';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import IntegrationsSection from '@/components/home/IntegrationsSection';
import { MarketingManifesto } from '@/components/home/MarketingManifesto';
import { BeforeAfterSection } from '@/components/home/BeforeAfterSection';
import { GoogleReviews } from '@/components/home/GoogleReviews';

export const metadata: Metadata = {
  title: `Agence Digitale Abidjan — Web, IA, SEO & E-commerce | ${SITE_CONFIG.name}`,
  description: `Agence digitale n°1 à Abidjan, Côte d'Ivoire. Sites web Next.js ultra-rapides, SEO Google, e-commerce Orange Money & Wave, chatbots IA WhatsApp et automatisation pour booster votre business en Afrique de l'Ouest.`,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE_CONFIG.name} — Agence Digitale & IA à Abidjan, Côte d'Ivoire`,
    description: `Développement web, SEO, e-commerce Mobile Money, chatbots IA et automatisation à Abidjan. Votre business en pilote automatique 24h/24.`,
    url: '/',
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Combien de temps faut-il pour créer un site web ?", "acceptedAnswer": { "@type": "Answer", "text": "Un site vitrine est livré en 2 à 3 semaines. Une boutique e-commerce complète avec intégration Mobile Money demande 4 à 6 semaines selon la complexité." } },
    { "@type": "Question", "name": "Quels modes de paiement acceptez-vous ?", "acceptedAnswer": { "@type": "Answer", "text": "Nous acceptons Orange Money, Wave, MTN Mobile Money et le virement bancaire. Un acompte de 50 % est demandé au démarrage, le solde à la livraison." } },
    { "@type": "Question", "name": "Les paiements clients seront-ils sécurisés sur ma boutique ?", "acceptedAnswer": { "@type": "Answer", "text": "Oui. Nous intégrons les APIs officielles d'Orange Money et Wave. Vos clients paient sans quitter votre site et reçoivent une confirmation instantanée." } },
    { "@type": "Question", "name": "Proposez-vous une maintenance après la livraison ?", "acceptedAnswer": { "@type": "Answer", "text": "30 jours de support gratuit après mise en ligne. Des forfaits de maintenance mensuelle sont disponibles pour les mises à jour, sauvegardes et monitoring." } },
    { "@type": "Question", "name": "Mon site sera-t-il bien positionné sur Google en Côte d'Ivoire ?", "acceptedAnswer": { "@type": "Answer", "text": "Chaque site inclut une optimisation SEO de base. Nos forfaits SEO mensuels ciblent spécifiquement le marché ivoirien et d'Afrique de l'Ouest avec un suivi de positionnement." } },
    { "@type": "Question", "name": "Travaillez-vous avec des entreprises hors de Côte d'Ivoire ?", "acceptedAnswer": { "@type": "Answer", "text": "Oui, nous intervenons dans toute l'Afrique de l'Ouest : Sénégal, Mali, Burkina Faso, Togo, Bénin, Cameroun et au-delà pour les entreprises francophones." } },
    { "@type": "Question", "name": "Comment fonctionne l'optimisation de conversion par IA ?", "acceptedAnswer": { "@type": "Answer", "text": "Notre IA analyse le comportement de vos visiteurs, teste automatiquement plusieurs variantes de vos pages et conserve celles qui génèrent le plus de ventes, sans intervention manuelle." } },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HeroSection />

      {/* Stats immediately after hero for impressive first impression */}
      <StatsCounter />

      <div className="main-content-wrap">
        <div className="double-curtain-wrap">
          {/* Mockup visual overlapping upwards (GitHub curtain style) */}
          <div className="hero-mockup-container animate-fade-in-up">
            <div className="hero-image-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
              <Image
                src="/images/hero/ai-automation-dashboard.jpg"
                alt="Dashboard IA NONALIX CI — Automatisation & Analytics temps réel"
                width={1000}
                height={550}
                style={{ objectFit: 'cover' }}
                className="hero-image"
                priority
              />
              {/* Dark Overlay & Centered Text Statement */}
              <div 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  backgroundColor: 'rgba(0, 0, 0, 0.72)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: 'clamp(1rem, 3vw, var(--space-xl))',
                  zIndex: 10
                }}
              >
                <div style={{ maxWidth: '820px', textAlign: 'center' }}>
                  <p className="hero-image-statement">
                    Chez <span className="text-gradient" style={{ fontWeight: 700 }}>NONALIX CI</span>, nous construisons des <span className="text-gradient" style={{ fontWeight: 700 }}>systèmes d&apos;automatisation IA</span> qui génèrent des prospects, qualifient vos leads et convertissent vos visiteurs en clients — <span className="text-gradient" style={{ fontWeight: 700 }}>24h/24, sans intervention humaine</span>. Grâce à nos <span className="text-gradient" style={{ fontWeight: 700 }}>agents IA, workflows intelligents et chatbots conversationnels</span>, votre business tourne en pilote automatique.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Autoplay Video Mockup Card (Curtain 2) with Pause/Play control */}
          <VideoCurtain />
        </div>

        <div className="flow-connector" style={{ marginTop: 'var(--space-xl)' }}>
          <div className="flow-node"></div>
        </div>

        {/* NEW: Before/After transformation section */}
        <BeforeAfterSection />

        <div className="flow-connector">
          <div className="flow-node flow-node-orange"></div>
        </div>

        <WhyChooseUs />

        <div className="flow-connector">
          <div className="flow-node"></div>
        </div>

        <MarketingManifesto />

        <div className="flow-connector">
          <div className="flow-node flow-node-orange"></div>
        </div>

        <ServicesPreview />

        <div className="flow-connector">
          <div className="flow-node"></div>
        </div>

        <PortfolioSection />

        <div className="flow-connector">
          <div className="flow-node flow-node-orange"></div>
        </div>

        <IntegrationsSection />

        <div className="flow-connector">
          <div className="flow-node"></div>
        </div>

        <ScrollReveal>
          <FAQSection />
        </ScrollReveal>

        <div className="flow-connector">
          <div className="flow-node flow-node-orange"></div>
        </div>

        <ScrollReveal>
          <Testimonials />
        </ScrollReveal>

        <div className="flow-connector">
          <div className="flow-node flow-node-orange"></div>
        </div>

        <ScrollReveal>
          <GoogleReviews />
        </ScrollReveal>

        <div className="flow-connector">
          <div className="flow-node"></div>
        </div>

        <ScrollReveal>
          <CTASection />
        </ScrollReveal>
      </div>
    </>
  );
}
