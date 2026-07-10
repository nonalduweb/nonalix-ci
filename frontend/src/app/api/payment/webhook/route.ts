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
      const pawaStatus = (body.status || '').toUpperCase();
      if (pawaStatus === 'COMPLETED') {
        paymentStatus = 'completed';
      } else if (pawaStatus === 'FAILED' || pawaStatus === 'REJECTED') {
        paymentStatus = 'failed';
      } else {
        paymentStatus = 'processing';
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
      // Pour les autres opérateurs (Orange Money, Wave)
      if (['success', 'completed', 'paid', 'approved', 'simulation'].includes(status.toLowerCase())) {
        paymentStatus = 'completed';
      } else if (['failed', 'cancelled', 'declined'].includes(status.toLowerCase())) {
        paymentStatus = 'failed';
      }
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
