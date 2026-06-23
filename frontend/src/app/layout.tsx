import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
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
  description: `${SITE_CONFIG.description}. Solutions de développement web, SEO, e-commerce avec Mobile Money et automatisation par IA à Abidjan, Côte d'Ivoire.`,
  keywords: [
    "marketing digital Côte d'Ivoire",
    "agence digitale Abidjan",
    "intelligence artificielle Côte d'Ivoire",
    "e-commerce Abidjan",
    "automatisation IA",
    "Mobile Money",
    "Orange Money",
    "Wave paiement",
    "SEO Côte d'Ivoire",
    "création site web Abidjan",
    "développement web Côte d'Ivoire",
    "chatbot WhatsApp",
    "NONALIX CI",
    "agence web Abidjan",
    "marketing digital Abidjan",
    "boutique en ligne Côte d'Ivoire",
    "audit SEO gratuit",
    "référencement local Abidjan",
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
    description: `${SITE_CONFIG.description}. Développement web, SEO, e-commerce et IA à Abidjan.`,
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — Agence de Marketing Digital et IA en Côte d'Ivoire`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: `${SITE_CONFIG.description}. Développement web, SEO, e-commerce et IA à Abidjan.`,
    images: ["/images/logo.png"],
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
      url: "https://nonalix-ci.com",
      logo: {
        "@type": "ImageObject",
        url: "https://nonalix-ci.com/images/logo.png",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: CONTACT_INFO.phone,
        contactType: "customer service",
        areaServed: "CI",
        availableLanguage: "French",
      },
      sameAs: [
        CONTACT_INFO.whatsappLink,
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://nonalix-ci.com/#localbusiness",
      name: SITE_CONFIG.fullName,
      description: SITE_CONFIG.description,
      url: "https://nonalix-ci.com",
      telephone: CONTACT_INFO.phone,
      email: CONTACT_INFO.email,
      image: "https://nonalix-ci.com/images/logo.png",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Cocody Angré Pétro Ivoire près de BAOBAB microfinance, Ilot :332, lot :4172",
        addressLocality: "Abidjan",
        addressRegion: "Lagunes",
        addressCountry: "CI",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 5.36,
        longitude: -3.97,
      },
      priceRange: "$$",
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
      areaServed: {
        "@type": "Country",
        name: "Côte d'Ivoire",
      },
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
      <body style={{ position: 'relative' }}>
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
