import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { AIChatWidget } from "@/components/layout/AIChatWidget";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth-context";
import { SITE_CONFIG } from "@/lib/constants";
import ScrollProgress from "@/components/layout/ScrollProgress";
import { WelcomePopup } from "@/components/layout/WelcomePopup";
import { GridBackground } from "@/components/ui/GridBackground";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { AnalyticsTracker } from "@/components/layout/AnalyticsTracker";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "marketing digital", "IA", "intelligence artificielle", "e-commerce",
    "Côte d'Ivoire", "Abidjan", "automatisation", "Mobile Money",
    "agence digitale", "NONALIX CI",
  ],
  openGraph: {
    type: "website",
    locale: "fr_CI",
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${instrumentSans.variable}`}>
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

