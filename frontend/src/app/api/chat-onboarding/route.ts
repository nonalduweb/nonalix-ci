import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendAdminLeadNotification } from '@/lib/mailer';
import { notifyNewLead } from '@/lib/n8n-webhooks';

/**
 * POST /api/chat-onboarding
 * Saves lead in database, sends admin email, and triggers n8n webhook notification
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Champs requis manquants (nom, email, téléphone)' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'adresse e-mail invalide' },
        { status: 400 }
      );
    }

    // Validate phone
    const cleanPhone = phone.replace(/\s/g, '');
    if (!/^0[157]\d{8}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide' },
        { status: 400 }
      );
    }

    // 1. Enregistrement en base de données réelle (ContactLead) via Prisma
    const lead = await prisma.contactLead.create({
      data: {
        firstName: name,
        lastName: 'Chat Onboarding',
        email: email,
        phone: cleanPhone,
        message: "[Qualifié via Formulaire d'accueil Chatbot]",
        type: 'chat_onboarding',
        status: 'new',
      },
    });

    console.log('[CHAT ONBOARDING LEAD SAVED]', lead);

    // 2. Déclencher l'envoi d'email à contact@nonalix-ci.com via nodemailer
    await sendAdminLeadNotification({
      id: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email || '',
      phone: lead.phone,
      message: lead.message,
      type: lead.type,
    });

    // 3. 🔗 Notifier n8n (non-bloquant)
    notifyNewLead({
      leadId: String(lead.id),
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email || '',
      phone: lead.phone,
      message: lead.message,
      type: lead.type,
    });

    return NextResponse.json({
      status: 'success',
      message: 'Lead de chat enregistré et notifié avec succès',
      leadId: lead.id,
    });
  } catch (error) {
    console.error('[CHAT ONBOARDING ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur interne lors de l\'enregistrement de la notification' },
      { status: 500 }
    );
  }
}

