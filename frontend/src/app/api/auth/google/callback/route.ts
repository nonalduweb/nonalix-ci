import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSession } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const siteUrl = req.nextUrl.origin;

  if (error) {
    console.error('[Google OAuth Callback] Error from Google:', error);
    return NextResponse.redirect(`${siteUrl}/connexion?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    console.error('[Google OAuth Callback] Missing authorization code.');
    return NextResponse.redirect(`${siteUrl}/connexion?error=code_missing`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('[Google OAuth Callback] Missing client credentials.');
    return NextResponse.redirect(`${siteUrl}/connexion?error=credentials_missing`);
  }

  try {
    const redirectUri = `${siteUrl}/api/auth/google/callback`;

    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('[Google OAuth Callback] Token exchange failed:', errorData);
      return NextResponse.redirect(`${siteUrl}/connexion?error=token_exchange_failed`);
    }

    const { access_token } = await tokenResponse.json();

    // 2. Fetch user profile info from Google
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!profileResponse.ok) {
      console.error('[Google OAuth Callback] Failed to fetch user profile info.');
      return NextResponse.redirect(`${siteUrl}/connexion?error=profile_fetch_failed`);
    }

    const profile = await profileResponse.json();
    // profile contains: sub, email, given_name, family_name, picture, email_verified
    const googleId = profile.sub;
    const email = profile.email;
    const firstName = profile.given_name || '';
    const lastName = profile.family_name || '';

    if (!email) {
      console.error('[Google OAuth Callback] No email returned by Google.');
      return NextResponse.redirect(`${siteUrl}/connexion?error=no_email_provided`);
    }

    // 3. Find or create user in PostgreSQL via Prisma
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId },
          { email }
        ]
      }
    });

    if (user) {
      // If user exists by email but doesn't have googleId linked yet
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId }
        });
      }
    } else {
      // Create new user (optional fields default to null or empty)
      user = await prisma.user.create({
        data: {
          email,
          googleId,
          firstName,
          lastName,
        }
      });
    }

    // 4. Create active session and set secure session cookie
    await createSession(user.id);

    // 5. Redirect back to homepage
    return NextResponse.redirect(`${siteUrl}/`);
  } catch (err) {
    console.error('[Google OAuth Callback] Internal exception:', err);
    return NextResponse.redirect(`${siteUrl}/connexion?error=internal_error`);
  }
}
