import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/layout/ScrollReveal';

export function PortfolioSection() {
  return (
    <section className="section" id="portfolio-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative blurred background glow */}
      <div 
        className="glow-bubble" 
        style={{ 
          position: 'absolute', 
          top: '30%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '500px', 
          height: '500px', 
          backgroundColor: 'rgba(37, 99, 235, 0.04)', 
          filter: 'blur(120px)', 
          borderRadius: 'var(--radius-full)', 
          pointerEvents: 'none', 
          zIndex: 0 
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <ScrollReveal>
          <div className="section-header">
            <span className="badge badge-accent">Preuves</span>
            <h2 style={{ marginTop: 'var(--space-md)' }}>
              Des résultats <span className="text-gradient">concrets</span>
            </h2>
            <p>
              Nous ne nous contentons pas de promettre, nous livrons des performances mesurables.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={100}>
          <div className="performance-showcase-wrapper">
            <div className="performance-showcase">
              {/* Window 1: GMB Performance 1 */}
              <div className="showcase-window showcase-window-1">
                <Image
                  src="/images/portfolio/performance-1.png"
                  alt="Rapport de performance SEO Google Business Profile"
                  width={800}
                  height={500}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  priority
                />
              </div>

              {/* Window 2: GMB Performance 2 */}
              <div className="showcase-window showcase-window-2">
                <Image
                  src="/images/portfolio/performance-2.png"
                  alt="Statistiques Google Maps & Visibilité"
                  width={600}
                  height={375}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              {/* Window 3: Dashboard IA / GMB Reviews */}
              <div className="showcase-window showcase-window-3">
                <Image
                  src="/images/portfolio/btp-solutions.png"
                  alt="Tableau de bord de gestion d'Agent IA"
                  width={550}
                  height={345}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              {/* Floating Badges */}
              <div className="showcase-badge showcase-badge-pink" style={{ top: '35%', left: '44%' }}>
                ROI Optimisé
              </div>
              <div className="showcase-badge showcase-badge-green" style={{ top: '72%', left: '60%' }}>
                Client Satisfait
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-4xl)' }}>
          <Link href="/portfolio" className="btn btn-outline btn-lg">
            Voir tout le portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
