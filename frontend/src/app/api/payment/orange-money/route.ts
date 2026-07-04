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

    const clientId = process.env.ORANGE_MONEY_CLIENT_ID;
    const clientSecret = process.env.ORANGE_MONEY_CLIENT_SECRET || process.env.ORANGE_MONEY_API_KEY;
    const merchantKey = process.env.ORANGE_MONEY_MERCHANT_KEY;

    const isSimulation = !clientId || !clientSecret || !merchantKey;

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

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nonalix-ci.com';
      const isProd = process.env.ORANGE_MONEY_ENV === 'production';
      
      // Étape 1 : Génération du token d'accès OAuth 2.0 Orange Developer
      const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const tokenResponse = await fetch('https://api.orange.com/oauth/v3/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Orange OAuth response error: ${tokenResponse.status} - ${errorText}`);
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Étape 2 : Initialisation du paiement Web (Web Payment)
      const webpayUrl = isProd
        ? 'https://api.orange.com/orange-money-webpay/ci/v1/webpayment'
        : 'https://api.orange.com/orange-money-webpay/dev/v1/webpayment';
      
      const currency = isProd ? 'XOF' : 'OUV';

      const payResponse = await fetch(webpayUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_key: merchantKey,
          currency: currency,
          order_id: orderId,
          amount: Math.round(amount),
          return_url: `${siteUrl}/checkout/confirmation?order=${orderId}`,
          cancel_url: `${siteUrl}/checkout?error=orange_money&orderId=${orderId}`,
          notif_url: `${siteUrl}/api/payment/webhook`,
          lang: 'fr',
          reference: 'NONALIX CI',
        }),
      });

      if (!payResponse.ok) {
        const errorText = await payResponse.text();
        throw new Error(`Orange Webpay response error: ${payResponse.status} - ${errorText}`);
      }

      const payData = await payResponse.json();
      const paymentUrl = payData.payment_url;
      const transactionId = payData.notif_token;

      // Mettre à jour la commande en base de données avec l'ID de session Orange Money (notif_token)
      await prisma.order.update({
        where: { id: orderId },
        data: {
          transactionId,
          paymentStatus: 'processing',
        },
      });

      console.log('[ORANGE MONEY - TRANSACTION INITIATED]', {
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
    } catch (omErr: any) {
      console.error('[ORANGE MONEY API CALL ERROR]', omErr);
      return NextResponse.json(
        { error: `Erreur Orange Money: ${omErr.message || 'Impossible d\'initialiser le paiement'}` },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('[ORANGE MONEY ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'initialisation du paiement' },
      { status: 500 }
    );
  }
}
