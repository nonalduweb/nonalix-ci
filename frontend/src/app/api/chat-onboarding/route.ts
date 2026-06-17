import { NextRequest, NextResponse } from 'next/server';
import { sendAdminLeadNotification } from '@/lib/mailer';

/**
 * POST /api/chat-onboarding
 * Triggers admin email notification when a lead qualifies through the AI Chatbot form
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Champs requis manquants (name, email, phone)' },
        { status: 400 }
      );
    }

    // Déclencher l'envoi d'email à contact@nonalix-ci.com via nodemailer
    await sendAdminLeadNotification({
      id: `chat-${Math.random().toString(36).substring(2, 9)}`,
      firstName: name,
      email: email,
      phone: phone,
      message: "[Qualifié via Formulaire d'accueil Chatbot]",
      type: 'chat_onboarding',
    });

    return NextResponse.json({
      status: 'success',
      message: 'Notification e-mail envoyée avec succès',
    });
  } catch (error) {
    console.error('[CHAT ONBOARDING MAIL ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur interne lors de l\'envoi de la notification' },
      { status: 500 }
    );
  }
}
