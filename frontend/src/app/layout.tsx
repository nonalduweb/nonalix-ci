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
  description: `${SITE_CONFIG.description}. Agence digitale n°1 à Abidjan — développement web Next.js, SEO, e-commerce Orange Money & Wave, chatbots IA et automatisation pour les entreprises de Côte d'Ivoire et d'Afrique de l'Ouest.`,
  keywords: [
    // ── Côte d'Ivoire — mots-clés primaires ─────────────────
    "agence digitale Abidjan",
    "agence web Abidjan",
    "agence IA Abidjan",
    "création site web Abidjan",
    "développement web Abidjan",
    "développement web Côte d'Ivoire",
    "marketing digital Abidjan",
    "marketing digital Côte d'Ivoire",
    "intelligence artificielle Côte d'Ivoire",
    "automatisation IA Abidjan",
    "SEO Côte d'Ivoire",
    "agence SEO Abidjan",
    "référencement Google Abidjan",
    "référencement local Abidjan",
    "Google My Business Côte d'Ivoire",
    "e-commerce Abidjan",
    "boutique en ligne Côte d'Ivoire",
    "chatbot WhatsApp Côte d'Ivoire",
    "audit SEO gratuit Abidjan",
    "NONALIX CI",
    // ── Afrique de l'Ouest — extension régionale ─────────────
    "agence digitale Afrique de l'Ouest",
    "marketing digital Afrique francophone",
    "création site web Afrique",
    "agence web Sénégal",
    "agence digitale Dakar",
    "développement web Dakar",
    "marketing digital Bamako",
    "agence digitale Ouagadougou",
    "agence web Lomé",
    "agence web Cotonou",
    "agence digitale Cameroun",
    "e-commerce Afrique",
    "automatisation business Afrique",
    // ── Services — mots-clés spécifiques ─────────────────────
    "intégration Orange Money site web",
    "paiement Wave boutique en ligne",
    "Mobile Money Orange Money MTN Wave",
    "chatbot IA WhatsApp Business",
    "agent IA conversationnel",
    "n8n automatisation Abidjan",
    "Next.js développement Côte d'Ivoire",
    "Shopify expert Abidjan",
    "campagne Facebook Ads Abidjan",
    "Google Ads Côte d'Ivoire",
    "devis site web Côte d'Ivoire",
  ],

  authors: [{ name: SITE_CONFIG.fullName, url: "https://nonalix-ci.com" }],
  creator: SITE_CONFIG.fullName,
  publisher: SITE_CONFIG.fullName,

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: "https://nonalix-ci.com",
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: `Agence digitale n°1 à Abidjan. Développement web Next.js, SEO, e-commerce Orange Money & Wave, chatbots IA et automatisation pour les entreprises de Côte d'Ivoire et d'Afrique de l'Ouest.`,
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
    description: `Agence digitale n°1 à Abidjan. Web, SEO, e-commerce Mobile Money, chatbots IA pour les entreprises de Côte d'Ivoire et d'Afrique de l'Ouest.`,
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
    // Ajouter vos codes de vérification Google / Bing ici
    // google: "votre-code-google",
    // yandex: "votre-code-yandex",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <head>
        {/* JSON-LD Structured Data for Google Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
          gtag('config', 'G-ZFSHQ5LP91');
        `}
      </Script>
      <body style={{ position: 'relative' }}>
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
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
