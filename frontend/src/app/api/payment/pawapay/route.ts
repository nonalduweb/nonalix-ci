import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

/**
 * POST /api/payment/pawapay
 * Initialize a PawaPay Widget Session for unified Mobile Money payment (Orange, Wave, MTN)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, amount, phone, email, description } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Paramètres manquants (orderId ou amount)' },
        { status: 400 }
      );
    }

    const apiKey = process.env.PAWAPAY_API_KEY;
    const isSimulation = !apiKey;

    if (isSimulation) {
      const transactionId = `SIM-PP-${Date.now()}`;
      
      // En mode simulation, marquer directement la commande comme complétée
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'completed',
          transactionId,
          orderStatus: 'confirmed',
          paymentMethod: 'pawapay',
        },
      });

      console.log('[PAWAPAY - SIMULATION SAVED]', {
        orderId,
        amount,
        phone,
        transactionId,
      });

      return NextResponse.json({
        status: 'simulation',
        orderId,
        message: 'Mode simulation — Paiement PawaPay marqué comme complété en base de données.',
        transactionId,
      });
    }

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nonalix-ci.com';
      
      // Déterminer l'environnement
      const isSandbox = apiKey.startsWith('test_') || apiKey.startsWith('sandbox_') || process.env.PAWAPAY_ENV !== 'production';
      const apiUrl = isSandbox 
        ? 'https://api.sandbox.pawapay.io/v1/widget/sessions' 
        : 'https://api.pawapay.io/v1/widget/sessions';

      // Générer un depositId unique sous forme de UUID v4 pour PawaPay
      const depositId = crypto.randomUUID();

      // Nettoyer le numéro de téléphone pour PawaPay (il doit inclure l'indicatif pays +225 pour la Côte d'Ivoire par défaut s'il fait 10 chiffres)
      let formattedPhone = phone ? phone.replace(/\s/g, '') : '';
      if (formattedPhone && formattedPhone.length === 10 && !formattedPhone.startsWith('+')) {
        formattedPhone = `+225${formattedPhone}`;
      }

      console.log('[PAWAPAY - INITIATING SESSIONS]', {
        depositId,
        amount,
        formattedPhone,
        apiUrl,
      });

      const pawapayResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          depositId: depositId,
          amount: Math.round(amount).toString(),
          currency: 'XOF',
          country: 'CI',
          returnUrl: `${siteUrl}/checkout/confirmation?order=${orderId}`,
          statementDescription: `Commande ${orderId}`,
          language: 'FR',
          msisdn: formattedPhone || undefined,
          metadata: [
            {
              fieldName: 'orderId',
              fieldValue: orderId,
            }
          ],
        }),
      });

      if (!pawapayResponse.ok) {
        const errorText = await pawapayResponse.text();
        throw new Error(`PawaPay API status: ${pawapayResponse.status} - ${errorText}`);
      }

      const pawaData = await pawapayResponse.json();
      const redirectUrl = pawaData.redirectUrl;

      if (!redirectUrl) {
        throw new Error('L\'URL de redirection (redirectUrl) est manquante dans la réponse PawaPay');
      }

      // Mettre à jour la commande en base de données avec le depositId PawaPay et la méthode de paiement
      await prisma.order.update({
        where: { id: orderId },
        data: {
          transactionId: depositId,
          paymentStatus: 'processing',
          paymentMethod: 'pawapay',
        },
      });

      console.log('[PAWAPAY - TRANSACTION INITIATED]', {
        orderId,
        depositId,
        redirectUrl,
      });

      return NextResponse.json({
        status: 'pending',
        orderId,
        url: redirectUrl,
        message: 'Transaction initiée',
      });
    } catch (pawaErr: any) {
      console.error('[PAWAPAY API CALL ERROR]', pawaErr);
      return NextResponse.json(
        { error: `Erreur PawaPay API: ${pawaErr.message || 'Impossible d\'initialiser le paiement'}` },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('[PAWAPAY GLOBAL ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur interne lors de l\'initialisation du paiement' },
      { status: 500 }
    );
  }
}
