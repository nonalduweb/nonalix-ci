import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

/**
 * GET /api/admin/conversations
 * Liste les conversations (WhatsApp + chat du site) avec leurs messages,
 * pour l'onglet Conversations de l'admin.
 */
export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const sessions = await prisma.chatSession.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 200,
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    const conversations = sessions.map((s) => {
      const last = s.messages[s.messages.length - 1];
      return {
        id: s.id,
        platform: s.platform,
        name: s.leadName,
        phone: s.leadPhone,
        email: s.leadEmail,
        isQualified: s.isQualified,
        updatedAt: s.updatedAt,
        messageCount: s.messages.length,
        lastMessage: last ? last.content.slice(0, 120) : '',
        messages: s.messages.map((m) => ({
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        })),
      };
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('[ADMIN CONVERSATIONS ERROR]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
