import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization — WebP/AVIF auto-conversion
  images: {
    unoptimized: true,
  },

  // Performance: compress responses
  compress: true,

  // Security headers
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';

    // Content-Security-Policy: autorise uniquement les origines tierces réellement utilisées
    // par le site (Google Analytics/Tag Manager, Pixel Meta, chat IA, carte OpenStreetMap, paiement PawaPay).
    // 'unsafe-inline' est nécessaire pour les styles inline React et le script gtag inline ;
    // 'unsafe-eval' n'est autorisé qu'en développement (HMR/webpack).
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      `connect-src 'self' https://api.nonalix-ci.com https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.facebook.com https://connect.facebook.net${isDev ? ' http://localhost:8000 http://localhost:8001 ws://localhost:*' : ''}`,
      "frame-src 'self' https://www.openstreetmap.org https://*.pawapay.io",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'identity-credentials-get=(), browsing-topics=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
      {
        source: '/(favicon-v2\\.png|images/brand/icon-v2\\.png|favicon\\.ico)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ];
  },
};

export default nextConfig;
