import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { AIChatWidget } from "@/components/layout/AIChatWidget";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth-context";
import { SITE_CONFIG, CONTACT_INFO } from "@/lib/constants";
import ScrollProgress from "@/components/layout/ScrollProgress";
import { WelcomePopup } from "@/components/layout/WelcomePopup";
import { GridBackground } from "@/components/ui/GridBackground";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { AnalyticsTracker } from "@/components/layout/AnalyticsTracker";
import { FacebookPixel } from "@/components/layout/FacebookPixel";
import { CanonicalURL } from "@/components/layout/CanonicalURL";
import { headers, cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { getExpectedToken } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

/* ──────────────────────────────────────────
   SEO: metadataBase + metadata globale enrichie
   ────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL("https://nonalix-ci.com"),

  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: `${SITE_CONFIG.description}. Agence spécialisée en automatisation IA et paiements Mobile Money — développement web Next.js, SEO, e-commerce Orange Money & Wave, chatbots IA et automatisation pour les entreprises de Côte d'Ivoire et d'Afrique de l'Ouest.`,

  authors: [{ name: SITE_CONFIG.fullName, url: "https://nonalix-ci.com" }],
  creator: SITE_CONFIG.fullName,
  publisher: SITE_CONFIG.fullName,



  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: "https://nonalix-ci.com",
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: `Agence spécialisée en automatisation IA et paiements Mobile Money. Développement web Next.js, SEO, e-commerce Orange Money & Wave, chatbots IA et automatisation pour les entreprises de Côte d'Ivoire et d'Afrique de l'Ouest.`,
    images: [
      {
        url: "/images/hero/ai-automation-dashboard.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — Agence Digitale & IA à Abidjan, Côte d'Ivoire`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: `Agence spécialisée en automatisation IA et paiements Mobile Money. Web, SEO, e-commerce Mobile Money, chatbots IA pour les entreprises de Côte d'Ivoire et d'Afrique de l'Ouest.`,
    images: ["/images/hero/ai-automation-dashboard.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    // TODO: remplacer par votre code Google Search Console
    // Aller sur search.google.com/search-console → Ajouter propriété → nonalix-ci.com
    // → Méthode "Balise HTML" → copier uniquement le code (ex: "abc123xyz")
    // google: "VOTRE_CODE_ICI",
  },

  icons: {
    icon: [
      { url: "/images/brand/icon-v2.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-v2.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/images/brand/icon-v2.png", type: "image/png", sizes: "180x180" },
    ],
    shortcut: ["/favicon-v2.png"],
  },

  category: "technology",
};

/* ──────────────────────────────────────────
   SEO: Viewport séparé (Next.js 14+)
   ────────────────────────────────────────── */
export const viewport: Viewport = {
  themeColor: "#0F1012",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* ──────────────────────────────────────────
   JSON-LD Schema.org Structured Data
   ────────────────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://nonalix-ci.com/#organization",
      name: SITE_CONFIG.fullName,
      alternateName: "NONALIX",
      url: "https://nonalix-ci.com",
      logo: {
        "@type": "ImageObject",
        url: "https://nonalix-ci.com/images/brand/logo.png",
        width: 360,
        height: 108,
      },
      image: "https://nonalix-ci.com/images/hero/ai-automation-dashboard.jpg",
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: CONTACT_INFO.phone,
          contactType: "customer service",
          areaServed: ["CI", "SN", "ML", "BF", "GN", "TG", "BJ", "CM"],
          availableLanguage: ["French"],
          contactOption: "TollFree",
        },
        {
          "@type": "ContactPoint",
          email: CONTACT_INFO.email,
          contactType: "technical support",
          availableLanguage: ["French"],
        },
      ],
      sameAs: [
        CONTACT_INFO.whatsappLink,
        "https://www.facebook.com/nonalix.ci",
        "https://www.instagram.com/nonalix.ci",
        "https://www.linkedin.com/company/nonalix-ci",
        "https://www.tiktok.com/@nonalix.ci",
      ],
      knowsAbout: [
        "Développement web Next.js",
        "Intelligence artificielle générative",
        "Automatisation de processus métier avec n8n",
        "Marketing digital SEO",
        "E-commerce Mobile Money",
        "Chatbot WhatsApp Business",
        "Campagnes Google Ads et Facebook Ads",
        "UI/UX Design mobile-first",
        "Shopify e-commerce",
        "Orange Money API integration",
        "Wave Money API integration",
        "Agents IA conversationnels",
        "Optimisation de conversion par IA",
        "Référencement local Google Maps",
        "CRM HubSpot automatisation",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services Digitaux NONALIX CI",
        itemListElement: [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Design Web & UI/UX", "url": "https://nonalix-ci.com/services/design-web-ui-ux" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Développement Web Next.js", "url": "https://nonalix-ci.com/services/developpement-web" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatisation Business & IA", "url": "https://nonalix-ci.com/services/automatisation-business" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Optimisation SEO", "url": "https://nonalix-ci.com/services/optimisation-seo" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Campagnes Publicitaires PPC", "url": "https://nonalix-ci.com/services/campagnes-publicitaires-ppc" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Boutiques Shopify", "url": "https://nonalix-ci.com/services/boutiques-shopify" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Marketing Digital", "url": "https://nonalix-ci.com/services/marketing-digital" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Audit UX/UI", "url": "https://nonalix-ci.com/services/audit-ux-ui" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E-commerce Mobile Money", "url": "https://nonalix-ci.com/services/solutions-ecommerce-sur-mesure" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Optimisation Conversion par IA", "url": "https://nonalix-ci.com/services/optimisation-conversion-par-ia" } },
        ],
      },
    },
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": "https://nonalix-ci.com/#localbusiness",
      name: SITE_CONFIG.fullName,
      alternateName: "NONALIX",
      description: `Agence digitale spécialisée en développement web Next.js, SEO, e-commerce avec paiement Mobile Money (Orange Money, Wave, MTN), chatbots IA WhatsApp et automatisation de processus métier pour les entreprises en Côte d'Ivoire et en Afrique de l'Ouest.`,
      url: "https://nonalix-ci.com",
      telephone: CONTACT_INFO.phone,
      email: CONTACT_INFO.email,
      image: [
        "https://nonalix-ci.com/images/brand/logo.png",
        "https://nonalix-ci.com/images/hero/ai-automation-dashboard.jpg",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Cocody Angré Pétro Ivoire, près de BAOBAB microfinance, Ilot 332, lot 4172",
        addressLocality: "Abidjan",
        addressRegion: "Lagunes",
        postalCode: "00225",
        addressCountry: "CI",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 5.3600,
        longitude: -3.9700,
      },
      priceRange: "$$",
      currenciesAccepted: "XOF",
      paymentAccepted: "Orange Money, Wave, MTN Mobile Money, Virement bancaire",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "09:00",
          closes: "14:00",
        },
      ],
      areaServed: [
        { "@type": "Country", "name": "Côte d'Ivoire", "sameAs": "https://www.wikidata.org/wiki/Q1008" },
        { "@type": "Country", "name": "Sénégal", "sameAs": "https://www.wikidata.org/wiki/Q1041" },
        { "@type": "Country", "name": "Mali", "sameAs": "https://www.wikidata.org/wiki/Q912" },
        { "@type": "Country", "name": "Burkina Faso", "sameAs": "https://www.wikidata.org/wiki/Q965" },
        { "@type": "Country", "name": "Guinée", "sameAs": "https://www.wikidata.org/wiki/Q1006" },
        { "@type": "Country", "name": "Togo", "sameAs": "https://www.wikidata.org/wiki/Q945" },
        { "@type": "Country", "name": "Bénin", "sameAs": "https://www.wikidata.org/wiki/Q962" },
        { "@type": "Country", "name": "Cameroun", "sameAs": "https://www.wikidata.org/wiki/Q1009" },
        { "@type": "AdministrativeArea", "name": "Afrique de l'Ouest" },
        { "@type": "AdministrativeArea", "name": "Afrique francophone" },
      ],
      serviceArea: {
        "@type": "GeoCircle",
        geoMidpoint: { "@type": "GeoCoordinates", latitude: 5.3600, longitude: -3.9700 },
        geoRadius: "5000000",
      },
      hasMap: "https://maps.google.com/?q=Abidjan+Cocody+Angré",
      foundingDate: "2022",
      numberOfEmployees: { "@type": "QuantitativeValue", value: "5" },
      keywords: "agence digitale Abidjan, développement web Côte d'Ivoire, SEO Abidjan, e-commerce Mobile Money, chatbot IA WhatsApp, automatisation IA Afrique",
    },
    {
      "@type": "WebSite",
      "@id": "https://nonalix-ci.com/#website",
      url: "https://nonalix-ci.com",
      name: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      publisher: {
        "@id": "https://nonalix-ci.com/#organization",
      },
      inLanguage: "fr-CI",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://nonalix-ci.com/services?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Lire les en-têtes et les cookies pour la gestion de la maintenance
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";

  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin-token")?.value;
  const isAdmin = adminToken === getExpectedToken();

  // Exclure l'administration, l'API et la page de connexion
  const isExcluded = pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname === '/connexion';

  let isMaintenanceActive = false;
  if (!isExcluded && !isAdmin) {
    try {
      const config = await prisma.agentConfig.findUnique({
        where: { slug: 'system_settings' }
      });
      const variables = config?.variables as Record<string, any> || {};
      isMaintenanceActive = !!variables.maintenanceMode;
    } catch (e) {
      console.error('Error fetching maintenance settings:', e);
    }
  }

  return (
    <html lang="fr" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <head>
        {/* JSON-LD Structured Data for Google Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CanonicalURL />
      </head>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-ZFSHQ5LP91"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ZFSHQ5LP91', {
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
      <body style={{ position: 'relative' }}>
        {isMaintenanceActive ? (
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050505',
            color: '#fafafa',
            fontFamily: 'var(--font-heading)',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <GridBackground />
            <div style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center',
              background: 'rgba(10, 10, 10, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1.5rem',
              padding: '3rem 2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 40px rgba(231, 173, 5, 0.08)'
            }}>
              {/* Logo / Brand */}
              <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '2px', color: '#fafafa', marginBottom: '2.5rem' }}>
                NONALIX<span style={{ color: '#e7ad05' }}> CI</span>
              </div>

              {/* Animated Construction Indicator */}
              <div style={{
                fontSize: '4rem',
                margin: '1.5rem auto 2.5rem',
                display: 'inline-block',
                animation: 'pulse 2s infinite ease-in-out'
              }}>
                🚧
              </div>
              
              <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem', color: '#fafafa', lineHeight: 1.3 }}>
                Site en cours de maintenance
              </h1>
              
              <p style={{ color: '#a1a1aa', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                Notre plateforme est actuellement en cours de mise à jour pour vous offrir une expérience encore plus rapide, sécurisée et premium. Nous serons de retour très bientôt.
              </p>
              
              {/* WhatsApp Business Link */}
              <a
                href={`https://wa.me/${CONTACT_INFO.phone.replace(/\s/g, '')}?text=Bonjour%20NONALIX%20CI%20!%20Je%20souhaite%20échanger%20sur%20un%20projet.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#e7ad05',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  padding: '0.875rem 2rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(231, 173, 5, 0.25)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                💬 Nous contacter sur WhatsApp
              </a>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.08); }
                100% { transform: scale(1); }
              }
            `}} />
          </div>
        ) : (
          <>
            <AnnouncementBar />
            <GridBackground />
            <CartProvider>
              <AuthProvider>
                <ScrollProgress />
                <Header />
                <main className="page-transition-wrap">{children}</main>
                <Footer />
                <WhatsAppButton />
                <AIChatWidget />
                <WelcomePopup />
                <CookieBanner />
                <AnalyticsTracker />
                <FacebookPixel />
              </AuthProvider>
            </CartProvider>
          </>
        )}
      </body>
    </html>
  );
}
