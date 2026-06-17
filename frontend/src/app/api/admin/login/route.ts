import { NextRequest, NextResponse } from 'next/server';
import { getExpectedToken } from '@/lib/auth';

/**
 * POST /api/admin/login
 * Validates admin password and sets HttpOnly cookie
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (password === expectedPassword) {
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
