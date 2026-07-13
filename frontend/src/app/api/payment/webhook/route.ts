import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendDigitalProductsDeliveryEmail } from '@/lib/mailer';

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

    const depositId = body.depositId;
    let existingOrder = null;
    let orderId = body.orderId || body.order_id || body.data?.order_id;
    const status = body.status || body.state || body.data?.status || 'success';
    const transactionId = body.transactionId || body.transaction_id || body.data?.id || body.id;

    // 1. Essayer de trouver la commande par depositId (PawaPay)
    if (depositId) {
      existingOrder = await prisma.order.findFirst({
        where: { transactionId: depositId }
      });
      if (existingOrder) {
        orderId = existingOrder.id;
      }
    }

    // 2. Sinon, essayer par orderId classique
    if (!existingOrder && orderId) {
      existingOrder = await prisma.order.findUnique({
        where: { id: orderId }
      });
    }

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Commande introuvable pour ce webhook' },
        { status: 404 }
      );
    }

    // Détermination du statut de paiement
    let paymentStatus = 'pending';

    if (existingOrder.paymentMethod === 'pawapay') {
      // Ne JAMAIS faire confiance au corps du webhook (aucune signature vérifiable) :
      // on interroge directement l'API PawaPay pour connaître le vrai statut du dépôt.
      const apiKey = process.env.PAWAPAY_API_KEY;
      const pawaDepositId = existingOrder.transactionId;
      if (!apiKey || !pawaDepositId) {
        console.error('[WEBHOOK PAWAPAY] Vérification impossible (clé API ou depositId manquant) — statut inchangé.');
        return NextResponse.json({ error: 'Vérification PawaPay indisponible' }, { status: 503 });
      }

      const isSandbox = process.env.PAWAPAY_ENV?.toLowerCase() !== 'live';
      const verifyUrl = `${isSandbox ? 'https://api.sandbox.pawapay.io' : 'https://api.pawapay.io'}/deposits/${pawaDepositId}`;

      try {
        const verifyRes = await fetch(verifyUrl, {
          headers: { 'Authorization': `Bearer ${apiKey}` },
        });
        if (!verifyRes.ok) {
          console.error('[WEBHOOK PAWAPAY VERIFICATION FAILED]', verifyRes.status, await verifyRes.text());
          return NextResponse.json({ error: 'Échec de vérification PawaPay' }, { status: 502 });
        }
        const verifyData = await verifyRes.json();
        const deposit = Array.isArray(verifyData) ? verifyData[0] : verifyData;
        const pawaStatus = (deposit?.status || '').toUpperCase();
        console.log('[WEBHOOK PAWAPAY VERIFIED STATUS]', { depositId: pawaDepositId, pawaStatus });

        if (pawaStatus === 'COMPLETED') {
          paymentStatus = 'completed';
        } else if (pawaStatus === 'FAILED' || pawaStatus === 'REJECTED') {
          paymentStatus = 'failed';
        } else {
          paymentStatus = 'processing';
        }
      } catch (verifyErr) {
        console.error('[WEBHOOK PAWAPAY ERROR]', verifyErr);
        return NextResponse.json({ error: 'Erreur lors de la vérification PawaPay' }, { status: 500 });
      }
    } else if (existingOrder.paymentMethod === 'paydunya') {
      const token = body.token || body.transaction_id || existingOrder.transactionId;
      
      if (!token) {
        console.error('[WEBHOOK PAYDUNYA ERROR] Aucun token de transaction trouvé pour valider la commande');
        return NextResponse.json({ error: 'Token PayDunya manquant' }, { status: 400 });
      }

      // Appeler PayDunya pour confirmer le statut de la facture de manière sécurisée
      try {
        const isTestMode = (process.env.PAYDUNYA_PRIVATE_KEY || '').startsWith('test_');
        const baseUrl = isTestMode 
          ? 'https://app.paydunya.com/sandbox-api/v1' 
          : 'https://app.paydunya.com/api/v1';

        const verifyRes = await fetch(`${baseUrl}/checkout-invoice/confirm/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'PAYDUNYA-MASTER-KEY': process.env.PAYDUNYA_MASTER_KEY || '',
            'PAYDUNYA-PRIVATE-KEY': process.env.PAYDUNYA_PRIVATE_KEY || '',
            'PAYDUNYA-TOKEN': process.env.PAYDUNYA_TOKEN || '',
          },
        });

        if (!verifyRes.ok) {
          const verifyErrText = await verifyRes.text();
          console.error('[WEBHOOK PAYDUNYA VERIFICATION FAILED]', verifyErrText);
          return NextResponse.json({ error: 'Échec de vérification PayDunya' }, { status: 500 });
        }

        const verifyData = await verifyRes.json();
        console.log('[WEBHOOK PAYDUNYA VERIFICATION RESPONSE]', verifyData);

        if (verifyData.status === 'completed') {
          paymentStatus = 'completed';
        } else if (verifyData.status === 'cancelled' || verifyData.status === 'failed') {
          paymentStatus = 'failed';
        } else {
          paymentStatus = 'processing';
        }
      } catch (verifyErr) {
        console.error('[WEBHOOK PAYDUNYA ERROR]', verifyErr);
        return NextResponse.json({ error: 'Erreur lors de la vérification PayDunya' }, { status: 500 });
      }
    } else {
      // Anciens opérateurs (Orange Money direct, Wave direct) : ces webhooks n'ont
      // aucun mécanisme de vérification — on refuse de confirmer un paiement sur
      // la seule foi d'un POST non authentifié (fail-closed).
      console.warn('[WEBHOOK] Méthode de paiement non vérifiable:', existingOrder.paymentMethod, '— statut inchangé.');
      return NextResponse.json(
        { error: 'Webhook non vérifiable pour cette méthode de paiement' },
        { status: 400 }
      );
    }

    // Mise à jour de la commande en base de données avec inclusion des produits pour livraison
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus,
        transactionId: depositId || transactionId || null,
        orderStatus: paymentStatus === 'completed' ? 'confirmed' : 'new',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log('[ORDER STATUS UPDATED BY WEBHOOK]', order);

    // Envoi automatique des liens de téléchargement par e-mail si paiement complété et produit digital présent
    if (paymentStatus === 'completed' && order.email) {
      const hasDigital = order.items.some((item) => item.product.isDigital);
      if (hasDigital) {
        try {
          await sendDigitalProductsDeliveryEmail(
            {
              id: order.id,
              firstName: order.firstName,
              lastName: order.lastName,
              email: order.email,
              phone: order.phone,
              totalAmount: order.totalAmount,
            },
            order.items.map((item) => ({
              product: {
                name: item.product.name,
                isDigital: item.product.isDigital,
                downloadUrl: item.product.downloadUrl,
              },
              quantity: item.quantity,
            }))
          );
          console.log(`[WEBHOOK] Livraison par e-mail initiée pour la commande ${order.id}`);
        } catch (mailErr) {
          console.error('[WEBHOOK] Erreur lors de l\'envoi de la livraison e-mail:', mailErr);
        }
      }
    }

    return NextResponse.json({ status: 'received', orderId: order.id, paymentStatus });
  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return NextResponse.json(
      { error: 'Webhook processing error' },
      { status: 500 }
    );
  }
}
