import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendAdminLeadNotification } from '@/lib/mailer';
import { notifyNewLead } from '@/lib/n8n-webhooks';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, phone, email, subject, date, slot } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nom et téléphone obligatoires' },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).replace(/\s/g, '');
    if (cleanPhone.length < 8) {
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide' },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Format d'e-mail invalide" },
        { status: 400 }
      );
    }

    const messageParts = [
      `Sujet : ${subject || 'Non précisé'}`,
      `Date souhaitée : ${date || 'Non précisée'}`,
      `Créneau : ${slot || 'Non précisé'}`,
    ];
    const message = messageParts.join('\n');

    const lead = await prisma.contactLead.create({
      data: {
        firstName: String(name).trim(),
        company: company ? String(company).trim() : null,
        phone: cleanPhone,
        email: email ? String(email).trim() : null,
        message,
        type: 'callback',
        status: 'new',
      },
    });

    await sendAdminLeadNotification({
      id: lead.id,
      firstName: lead.firstName,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
      type: lead.type,
      company: lead.company,
    });

    notifyNewLead({
      leadId: String(lead.id),
      firstName: lead.firstName,
      email: lead.email || '',
      phone: lead.phone,
      message: lead.message,
      type: lead.type,
      company: lead.company,
    });

    return NextResponse.json({ status: 'success', leadId: lead.id });
  } catch (error) {
    console.error('[CALLBACK ERROR]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
