import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/payment/orange-money
 * Initialize an Orange Money payment transaction
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, amount, phone, description } = body;

    if (!orderId || !amount || !phone) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    const isSimulation = !process.env.ORANGE_MONEY_API_KEY;

    if (isSimulation) {
      const transactionId = `SIM-OM-${Date.now()}`;
      
      // Mettre à jour le statut de paiement en base de données pour la simulation
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'completed',
          transactionId,
          orderStatus: 'confirmed',
        },
      });

      console.log('[ORANGE MONEY - SIMULATION SAVED]', {
        orderId,
        amount,
        phone,
        transactionId,
      });

      return NextResponse.json({
        status: 'simulation',
        orderId,
        message: 'Mode simulation — Paiement marqué comme complété en base de données.',
        transactionId,
      });
    }

    // TODO: Real Orange Money API integration
    // 1. Get OAuth 2.0 access token from Orange Developer
    // 2. Call Web Payment API to initiate transaction
    // 3. Return payment URL or USSD push status

    return NextResponse.json({
      status: 'pending',
      orderId,
      message: 'Transaction initiée',
    });
  } catch (error) {
    console.error('[ORANGE MONEY ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'initialisation du paiement' },
      { status: 500 }
    );
  }
}
