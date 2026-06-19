import type { Metadata } from 'next';
import Image from 'next/image';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { PortfolioSection } from '@/components/home/PortfolioSection';
import { FAQSection } from '@/components/home/FAQSection';
import { Testimonials } from '@/components/home/Testimonials';
import { CTASection } from '@/components/home/CTASection';
import { SITE_CONFIG } from '@/lib/constants';
import ScrollReveal from '@/components/layout/ScrollReveal';
import { VideoCurtain } from '@/components/home/VideoCurtain';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import IntegrationsSection from '@/components/home/IntegrationsSection';
import { MarketingManifesto } from '@/components/home/MarketingManifesto';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: `${SITE_CONFIG.description}. Découvrez nos solutions de marketing digital, d'automatisation par IA et notre boutique en ligne avec paiement Mobile Money (Orange Money, Wave) pour les entreprises en Côte d'Ivoire.`,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: `Agence de marketing digital, développement web et automatisation IA à Abidjan. E-commerce avec Mobile Money, SEO local et chatbots intelligents.`,
    url: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <div className="main-content-wrap">
        <div className="double-curtain-wrap">
          {/* Mockup visual overlapping upwards (GitHub curtain style) */}
          <div className="hero-mockup-container animate-fade-in-up">
            <div className="hero-image-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
              <Image
                src="/images/products/carousel-1.jpg"
                alt="NONALIX CI IA & E-commerce"
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
                  backgroundColor: 'rgba(0, 0, 0, 0.72)', // Assombrit l'image pour une lisibilité parfaite du texte
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: 'var(--space-lg)',
                  zIndex: 10
                }}
              >
                <div style={{ maxWidth: '820px', textAlign: 'center' }}>
                  <p className="hero-image-statement">
                    Chez <span className="text-gradient" style={{ fontWeight: 700 }}>NONALIX</span>, nous créons des <span className="text-gradient" style={{ fontWeight: 700 }}>expériences digitales performantes</span> qui renforcent votre visibilité, attirent davantage de clients et génèrent une croissance durable. Grâce à notre expertise en <span className="text-gradient" style={{ fontWeight: 700 }}>développement web, SEO et automatisation IA</span>, nous transformons vos ambitions en <span className="text-gradient" style={{ fontWeight: 700 }}>résultats mesurables</span>.
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

        <WhyChooseUs />

        <div className="flow-connector">
          <div className="flow-node flow-node-orange"></div>
        </div>

        <MarketingManifesto />

        <div className="flow-connector">
          <div className="flow-node"></div>
        </div>

        <ServicesPreview />

        <div className="flow-connector">
          <div className="flow-node flow-node-orange"></div>
        </div>

        <PortfolioSection />

        <div className="flow-connector">
          <div className="flow-node"></div>
        </div>

        <IntegrationsSection />

        <div className="flow-connector">
          <div className="flow-node flow-node-orange"></div>
        </div>

        <ScrollReveal>
          <FAQSection />
        </ScrollReveal>

        <div className="flow-connector">
          <div className="flow-node"></div>
        </div>

        <ScrollReveal>
          <Testimonials />
        </ScrollReveal>

        <div className="flow-connector">
          <div className="flow-node flow-node-orange"></div>
        </div>

        <ScrollReveal>
          <CTASection />
        </ScrollReveal>
      </div>
    </>
  );
}

