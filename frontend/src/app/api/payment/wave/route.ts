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

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nonalix-ci.com';
      
      const waveResponse = await fetch('https://api.wave.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WAVE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount).toString(),
          currency: 'XOF',
          error_url: `${siteUrl}/checkout?error=wave&orderId=${orderId}`,
          success_url: `${siteUrl}/checkout/success?orderId=${orderId}`,
          client_reference: orderId,
        }),
      });

      if (!waveResponse.ok) {
        const errorText = await waveResponse.text();
        throw new Error(`Wave API response: ${waveResponse.status} - ${errorText}`);
      }

      const waveData = await waveResponse.json();
      const paymentUrl = waveData.wave_launch_url;
      const transactionId = waveData.id;

      // Mettre à jour la commande en base de données avec l'ID de transaction de session Wave
      await prisma.order.update({
        where: { id: orderId },
        data: {
          transactionId,
          paymentStatus: 'processing',
        },
      });

      console.log('[WAVE - TRANSACTION INITIATED]', {
        orderId,
        transactionId,
        paymentUrl,
      });

      return NextResponse.json({
        status: 'pending',
        orderId,
        url: paymentUrl,
        message: 'Transaction initiée',
      });
    } catch (waveErr: any) {
      console.error('[WAVE API CALL ERROR]', waveErr);
      return NextResponse.json(
        { error: `Erreur Wave API: ${waveErr.message || 'Impossible d\'initialiser le paiement'}` },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('[WAVE ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'initialisation du paiement' },
      { status: 500 }
    );
  }
}
