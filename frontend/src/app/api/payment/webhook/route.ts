import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/payment/webhook
 * Receives payment status notifications from Orange Money and Wave operators
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const operator = req.headers.get('x-operator') || body.operator || 'unknown';

    console.log('[PAYMENT WEBHOOK RECEIVED]', {
      operator,
      body,
      timestamp: new Date().toISOString(),
    });

    // Extraction des paramètres
    const orderId = body.orderId || body.order_id || body.data?.order_id;
    const status = body.status || body.state || body.data?.status || 'success';
    const transactionId = body.transactionId || body.transaction_id || body.data?.id || body.id;

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID de commande manquant dans la notification' },
        { status: 400 }
      );
    }

    // Détermination du statut de paiement
    let paymentStatus = 'pending';
    if (['success', 'completed', 'paid', 'approved', 'simulation'].includes(status.toLowerCase())) {
      paymentStatus = 'completed';
    } else if (['failed', 'cancelled', 'declined'].includes(status.toLowerCase())) {
      paymentStatus = 'failed';
    }

    // Mise à jour de la commande en base de données
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus,
        transactionId: transactionId || null,
        orderStatus: paymentStatus === 'completed' ? 'confirmed' : 'new',
      },
    });

    console.log('[ORDER STATUS UPDATED BY WEBHOOK]', order);

    return NextResponse.json({ status: 'received', orderId: order.id, paymentStatus });
  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return NextResponse.json(
      { error: 'Webhook processing error' },
      { status: 500 }
    );
  }
}
