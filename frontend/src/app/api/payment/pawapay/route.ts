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

    // Le mode simulation doit être demandé EXPLICITEMENT (dev local uniquement).
    // Sans clé API et sans ce flag, on refuse le paiement (fail-closed) : une
    // variable manquante en prod ne doit jamais offrir les produits gratuitement.
    if (process.env.PAWAPAY_SIMULATION === 'true') {
      const transactionId = `SIM-PP-${Date.now()}`;

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

    if (!apiKey) {
      console.error('[PAWAPAY] PAWAPAY_API_KEY non définie — paiement refusé (fail-closed).');
      return NextResponse.json(
        { error: 'Le paiement en ligne est temporairement indisponible. Veuillez réessayer plus tard ou nous contacter.' },
        { status: 503 }
      );
    }

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nonalix-ci.com';
      
      // Déterminer l'environnement via PAWAPAY_ENV (les clés PawaPay sont des JWT et n'ont pas
      // de préfixe permettant de le déduire automatiquement). Par défaut : sandbox, pour éviter
      // d'appeler l'API de production par erreur. Mettre PAWAPAY_ENV=live pour la production.
      const isSandbox = process.env.PAWAPAY_ENV?.toLowerCase() !== 'live';
      const apiUrl = isSandbox
        ? 'https://api.sandbox.pawapay.io/v1/widget/sessions'
        : 'https://api.pawapay.io/v1/widget/sessions';

      // Générer un depositId unique sous forme de UUID v4 pour PawaPay
      const depositId = crypto.randomUUID();

      // Nettoyer le numéro de téléphone pour PawaPay : le MSISDN doit être composé
      // uniquement de chiffres (sans "+" ni espaces), préfixé par l'indicatif pays 225
      // pour la Côte d'Ivoire.
      let formattedPhone = phone ? phone.replace(/[\s+]/g, '') : '';
      if (formattedPhone && !formattedPhone.startsWith('225')) {
        formattedPhone = `225${formattedPhone}`;
      }

      console.log('[PAWAPAY - INITIATING SESSIONS]', {
        depositId,
        amount,
        formattedPhone,
        apiUrl,
      });

      let returnUrl = `${siteUrl}/checkout/confirmation?order=${orderId}`;
      if (returnUrl.includes('localhost') || returnUrl.includes('127.0.0.1')) {
        returnUrl = `https://nonalix-ci.com/checkout/confirmation?order=${orderId}`;
      }

      const pawapayResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          depositId: depositId,
          amount: Math.round(amount).toString(),
          country: 'CIV',
          returnUrl: returnUrl,
          // statementDescription doit faire 4-22 caractères alphanumériques/espaces uniquement
          statementDescription: `Commande ${orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-8)}`,
          language: 'FR',
          msisdn: formattedPhone || undefined,
          metadata: [
            {
              fieldName: 'orderId',
              fieldValue: orderId,
            },
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
