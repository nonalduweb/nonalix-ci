import { NextRequest, NextResponse } from 'next/server';
import { getExpectedToken, isAdminAuthConfigured, verifyAdminPassword } from '@/lib/auth';

// Limitation des tentatives : 5 essais par IP par fenêtre de 15 minutes.
// Stockage en mémoire — suffisant pour un déploiement mono-instance.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    attempts.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

/**
 * POST /api/admin/login
 * Validates admin password and sets HttpOnly cookie
 */
export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthConfigured()) {
      console.error('[ADMIN LOGIN] ADMIN_PASSWORD non défini — connexion refusée.');
      return NextResponse.json(
        { error: 'Authentification non configurée sur le serveur.' },
        { status: 503 }
      );
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      console.warn(`[ADMIN LOGIN] Trop de tentatives depuis ${ip}`);
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { password } = body;

    if (typeof password === 'string' && verifyAdminPassword(password)) {
      attempts.delete(ip);
      const response = NextResponse.json({ success: true, message: 'Connexion réussie' });
      response.cookies.set('admin-token', getExpectedToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
      return response;
    }

    return NextResponse.json(
      { error: 'Mot de passe incorrect' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[ADMIN LOGIN ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
