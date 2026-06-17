import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.error('[Google OAuth] Client ID is not configured.');
    return NextResponse.json(
      { error: 'Le service de connexion Google n\'est pas configuré. Veuillez définir GOOGLE_CLIENT_ID dans vos variables d\'environnement.' },
      { status: 500 }
    );
  }

  // Dynamic redirect URI depending on current host (supports localhost:3000, localhost:3002, or production)
  const redirectUri = `${req.nextUrl.origin}/api/auth/google/callback`;
  
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');

  return NextResponse.redirect(googleAuthUrl.toString());
}
