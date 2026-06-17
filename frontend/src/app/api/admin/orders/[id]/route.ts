import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

/**
 * PATCH /api/admin/orders/[id]
 * Updates orderStatus and/or paymentStatus
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
    const { orderStatus, paymentStatus } = body;

    const updateData: any = {};
    if (orderStatus !== undefined) updateData.orderStatus = orderStatus;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Aucune donnée de mise à jour fournie' },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      status: 'success',
      order,
    });
  } catch (error) {
    console.error('[ORDER UPDATE ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la commande' },
      { status: 500 }
    );
  }
}
