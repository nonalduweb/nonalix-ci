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
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'identity-credentials-get=(), browsing-topics=()' },
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
