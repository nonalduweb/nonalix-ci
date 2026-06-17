import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/payment/wave
 * Initialize a Wave payment transaction
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

    const isSimulation = !process.env.WAVE_API_KEY;

    if (isSimulation) {
      const transactionId = `SIM-WV-${Date.now()}`;
      
      // Mettre à jour le statut de paiement en base de données pour la simulation
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'completed',
          transactionId,
          orderStatus: 'confirmed',
        },
      });

      console.log('[WAVE - SIMULATION SAVED]', {
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

    // TODO: Real Wave API integration
    // 1. Call Wave Checkout API with merchant credentials
    // 2. Get payment URL from response
    // 3. Return payment URL for redirect

    return NextResponse.json({
      status: 'pending',
      orderId,
      message: 'Transaction initiée',
    });
  } catch (error) {
    console.error('[WAVE ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'initialisation du paiement' },
      { status: 500 }
    );
  }
}
