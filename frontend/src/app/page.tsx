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

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: `${SITE_CONFIG.description}. Découvrez nos systèmes d'automatisation IA, agents conversationnels intelligents et solutions de croissance digitale avec paiement Mobile Money (Orange Money, Wave) pour les entreprises en Côte d'Ivoire.`,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: `Systèmes d'automatisation IA, agents conversationnels, workflows intelligents et e-commerce avec Mobile Money à Abidjan. Transformez votre entreprise en machine de vente automatisée.`,
    url: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Stats immediately after hero for impressive first impression */}
      <StatsCounter />

      <div className="main-content-wrap">
        <div className="double-curtain-wrap">
          {/* Mockup visual overlapping upwards (GitHub curtain style) */}
          <div className="hero-mockup-container animate-fade-in-up">
            <div className="hero-image-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
              <Image
                src="/images/products/systemes_d_automatisation_IA.jpg"
                alt="Dashboard IA NONALIX — Automatisation & Analytics temps réel"
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
                  padding: 'var(--space-lg)',
                  zIndex: 10
                }}
              >
                <div style={{ maxWidth: '820px', textAlign: 'center' }}>
                  <p className="hero-image-statement">
                    Chez <span className="text-gradient" style={{ fontWeight: 700 }}>NONALIX</span>, nous construisons des <span className="text-gradient" style={{ fontWeight: 700 }}>systèmes d&apos;automatisation IA</span> qui génèrent des prospects, qualifient vos leads et convertissent vos visiteurs en clients — <span className="text-gradient" style={{ fontWeight: 700 }}>24h/24, sans intervention humaine</span>. Grâce à nos <span className="text-gradient" style={{ fontWeight: 700 }}>agents IA, workflows intelligents et chatbots conversationnels</span>, votre business tourne en pilote automatique.
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
          <div className="flow-node"></div>
        </div>

        <ScrollReveal>
          <CTASection />
        </ScrollReveal>
      </div>
    </>
  );
}
