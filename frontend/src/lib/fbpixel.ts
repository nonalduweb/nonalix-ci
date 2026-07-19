// Pixel Facebook (Meta) — dataset « NONALIX CI »
export const FB_PIXEL_ID = '1012114148278272';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Envoie un événement standard au Pixel Meta.
 * No-op tant que le pixel n'est pas chargé (= consentement cookies refusé ou pas encore donné).
 */
export function fbTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', event, params);
  }
}
