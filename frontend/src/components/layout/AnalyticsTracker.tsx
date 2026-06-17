'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackPageView = () => {
      const consent = localStorage.getItem('nonalix-cookie-consent');
      if (consent !== 'accepted') return;

      fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: pathname,
          referrer: document.referrer || null,
          userAgent: navigator.userAgent || null,
        }),
      }).catch((err) => {
        console.error('[ANALYTICS PAGEVIEW ERROR]', err);
      });
    };

    // Track on mount / pathname change
    trackPageView();

    // Listen to changes in consent status
    window.addEventListener('nonalix-consent-changed', trackPageView);
    return () => {
      window.removeEventListener('nonalix-consent-changed', trackPageView);
    };
  }, [pathname]);

  return null;
}
