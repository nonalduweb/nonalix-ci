import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';

/**
 * POST /api/chat/whatsapp-log
 * Appelé par le workflow n8n [WhatsApp] Agent Support pour archiver chaque
 * échange (message client + réponse de l'agent) dans la base, afin de le
 * rendre visible dans l'onglet Conversations de l'admin.
 *
 * Protégé par le header x-ingest-secret === ADMIN_API_SECRET (fail-closed).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.ADMIN_API_SECRET;
  if (!secret || req.headers.get('x-ingest-secret') !== secret) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { sessionId, name, userMessage, botReply, platform } = body;

    if (!sessionId || (!userMessage && !botReply)) {
      return NextResponse.json({ error: 'sessionId et au moins un message requis' }, { status: 400 });
    }

    // Crée la session si elle n'existe pas encore, sinon met à jour le nom / updatedAt
    await prisma.chatSession.upsert({
      where: { id: String(sessionId) },
      update: {
        ...(name ? { leadName: String(name).slice(0, 255) } : {}),
        ...(String(sessionId).replace(/\D/g, '') ? { leadPhone: String(sessionId).replace(/\D/g, '').slice(0, 50) } : {}),
      },
      create: {
        id: String(sessionId),
        platform: platform || 'whatsapp',
        leadName: name ? String(name).slice(0, 255) : null,
        leadPhone: String(sessionId).replace(/\D/g, '').slice(0, 50) || null,
      },
    });

    const rows: { id: string; sessionId: string; role: string; content: string }[] = [];
    if (userMessage) {
      rows.push({ id: crypto.randomUUID(), sessionId: String(sessionId), role: 'user', content: String(userMessage) });
    }
    if (botReply) {
      rows.push({ id: crypto.randomUUID(), sessionId: String(sessionId), role: 'assistant', content: String(botReply) });
    }
    if (rows.length) {
      await prisma.chatMessage.createMany({ data: rows });
    }

    return NextResponse.json({ status: 'logged', count: rows.length });
  } catch (error) {
    console.error('[WHATSAPP LOG ERROR]', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
