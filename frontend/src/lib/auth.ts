import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest } from 'next/server';

// Pas de mot de passe par défaut : si ADMIN_PASSWORD n'est pas défini,
// toute authentification échoue (fail-closed).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export function isAdminAuthConfigured(): boolean {
  return ADMIN_PASSWORD.length > 0;
}

/**
 * Compare deux chaînes en temps constant (évite les attaques par timing).
 */
export function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyAdminPassword(password: string): boolean {
  if (!isAdminAuthConfigured()) return false;
  return safeCompare(password, ADMIN_PASSWORD);
}

/**
 * Token de session : HMAC-SHA256 dérivé du mot de passe admin.
 * Non réversible — contrairement à un simple base64, la valeur du cookie
 * ne permet pas de retrouver le mot de passe.
 */
export function getExpectedToken(): string {
  return createHmac('sha256', ADMIN_PASSWORD)
    .update('nonalix-admin-session-v1')
    .digest('hex');
}

/**
 * Verifies if the request contains a valid admin token cookie
 */
export function verifyAdminSession(req: NextRequest): boolean {
  if (!isAdminAuthConfigured()) return false;
  const token = req.cookies.get('admin-token')?.value;
  if (!token) return false;
  return safeCompare(token, getExpectedToken());
}
