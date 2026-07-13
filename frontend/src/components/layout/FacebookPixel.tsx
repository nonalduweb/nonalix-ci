'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { FB_PIXEL_ID } from '@/lib/fbpixel';

/**
 * Pixel Facebook (Meta) — chargé uniquement après consentement cookies,
 * comme le tracker analytics interne (bannière « nonalix-cookie-consent »).
 * Suit aussi les changements de page (navigation SPA de Next.js).
 */
export function FacebookPixel() {
  const pathname = usePathname();
  const loadedRef = useRef(false);

  // Injection du script après consentement
  useEffect(() => {
    const loadPixel = () => {
      if (loadedRef.current) return;
      if (localStorage.getItem('nonalix-cookie-consent') !== 'accepted') return;
      loadedRef.current = true;

      /* eslint-disable */
      (function (f: any, b: Document, e: string, v: string) {
        if (f.fbq) return;
        const n: any = (f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        });
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        const t = b.createElement(e) as HTMLScriptElement;
        t.async = true;
        t.src = v;
        const s = b.getElementsByTagName(e)[0];
        s.parentNode!.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */

      window.fbq!('init', FB_PIXEL_ID);
      window.fbq!('track', 'PageView');
    };

    loadPixel();
    window.addEventListener('nonalix-consent-changed', loadPixel);
    return () => window.removeEventListener('nonalix-consent-changed', loadPixel);
  }, []);

  // PageView à chaque navigation interne (après le premier chargement)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (loadedRef.current && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}
