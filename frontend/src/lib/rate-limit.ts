import { NextRequest } from 'next/server';

// Limiteur de débit en mémoire, par IP et par route. Suffisant pour un seul processus Node.js ;
// à remplacer par un store partagé (Redis/Upstash) si l'app tourne un jour sur plusieurs instances.
const hits = new Map<string, number[]>();

export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/**
 * Retourne true si la requête doit être bloquée (trop de tentatives récentes).
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) || []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > limit;
}
