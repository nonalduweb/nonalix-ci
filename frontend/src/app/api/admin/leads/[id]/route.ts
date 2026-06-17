import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

/**
 * PATCH /api/admin/leads/[id]
 * Updates lead status (new | contacted | closed)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Le champ status est requis' },
        { status: 400 }
      );
    }

    const lead = await prisma.contactLead.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      status: 'success',
      lead,
    });
  } catch (error) {
    console.error('[LEAD UPDATE ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du lead' },
      { status: 500 }
    );
  }
}
