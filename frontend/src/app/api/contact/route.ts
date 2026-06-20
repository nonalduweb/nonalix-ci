import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendAdminLeadNotification } from '@/lib/mailer';
import { notifyNewLead } from '@/lib/n8n-webhooks';

/**
 * POST /api/contact
 * Handles contact form submissions
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Accept name (from ServiceForm) or firstName, and company or businessName (from AuditSeoPage)
    const { name, firstName, lastName, email, phone, message, type, company, businessName } = body;
    const finalFirstName = firstName || name;
    const finalCompany = company || businessName || null;

    // Validate required fields
    if (!finalFirstName || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires (nom, email, téléphone, message)' },
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

    // Sauvegarde en base de données réelle via Prisma
    const lead = await prisma.contactLead.create({
      data: {
        firstName: finalFirstName,
        lastName: lastName || null,
        email: email,
        phone: cleanPhone,
        message,
        type: type || 'contact',
        company: finalCompany,
        status: 'new',
      },
    });

    console.log('[CONTACT LEAD SAVED]', lead);

    // Envoyer la notification email à contact@nonalix-ci.com
    await sendAdminLeadNotification({
      id: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
      type: lead.type,
      company: lead.company,
    });

    // 🔗 Notifier n8n (non-bloquant)
    notifyNewLead({
      leadId: String(lead.id),
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email || '',
      phone: lead.phone,
      message: lead.message,
      type: lead.type,
      company: lead.company,
    });

    return NextResponse.json({
      status: 'success',
      message: 'Message envoyé avec succès',
      leadId: lead.id,
    });
  } catch (error) {
    console.error('[CONTACT ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}


