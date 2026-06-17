import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Veuillez renseigner votre email et votre mot de passe.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Adresse e-mail ou mot de passe incorrect.' },
        { status: 400 }
      );
    }

    if (!user.password) {
      // User registered with Google, has no password
      return NextResponse.json(
        { error: 'Ce compte utilise la connexion Google. Veuillez cliquer sur "Se connecter avec Google".' },
        { status: 400 }
      );
    }

    const isMatch = verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Adresse e-mail ou mot de passe incorrect.' },
        { status: 400 }
      );
    }

    // Create session
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('[Login API] Error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur lors de la connexion.' },
      { status: 500 }
    );
  }
}
