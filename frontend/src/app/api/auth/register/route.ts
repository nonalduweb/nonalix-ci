import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, company, phone, activitySector } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !activitySector) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires (nom, prénom, téléphone, secteur d\'activité, email, mot de passe).' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'adresse e-mail invalide.' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cette adresse e-mail existe déjà.' },
        { status: 400 }
      );
    }

    // Create user with hashed password
    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        company: company || null,
        phone,
        activitySector,
      }
    });

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
    console.error('[Register API] Error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur lors de l\'inscription.' },
      { status: 500 }
    );
  }
}
