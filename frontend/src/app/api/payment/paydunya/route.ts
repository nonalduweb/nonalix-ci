import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/payment/paydunya
 * Initialize a PayDunya payment transaction
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

    const isSimulation = !process.env.PAYDUNYA_MASTER_KEY || !process.env.PAYDUNYA_PRIVATE_KEY || !process.env.PAYDUNYA_TOKEN;

    if (isSimulation) {
      const transactionId = `SIM-PD-${Date.now()}`;
      
      // Mettre à jour le statut de paiement en base de données pour la simulation
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'completed',
          transactionId,
          orderStatus: 'confirmed',
        },
      });

      console.log('[PAYDUNYA - SIMULATION SAVED]', {
        orderId,
        amount,
        phone,
        transactionId,
      });

      return NextResponse.json({
        status: 'simulation',
        orderId,
        message: 'Mode simulation — Paiement PayDunya marqué comme complété en base de données.',
        transactionId,
      });
    }

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nonalix-ci.com';

      // Récupérer la commande avec ses items depuis la base de données
      // Récupérer la commande avec ses items et le produit correspondant depuis la base de données
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        return NextResponse.json(
          { error: 'Commande introuvable' },
          { status: 404 }
        );
      }

      // Préparer la liste des articles pour la facture PayDunya
      const itemsPayload: Record<string, any> = {};
      order.items.forEach((item, index) => {
        itemsPayload[`item_${index}`] = {
          name: item.product.name,
          quantity: item.quantity,
          unit_price: Math.round(item.unitPrice),
          total_price: Math.round(item.unitPrice * item.quantity),
        };
      });

      // Si aucun item n'est présent, en ajouter un par défaut
      if (order.items.length === 0) {
        itemsPayload['item_0'] = {
          name: description || `Paiement Commande ${orderId}`,
          quantity: 1,
          unit_price: Math.round(amount),
          total_price: Math.round(amount),
        };
      }

      // Détecter dynamiquement si on utilise les clés de test (Sandbox) ou de production (Live)
      const isTestMode = (process.env.PAYDUNYA_PRIVATE_KEY || '').startsWith('test_');
      const baseUrl = isTestMode 
        ? 'https://app.paydunya.com/sandbox-api/v1' 
        : 'https://app.paydunya.com/api/v1';

      const paydunyaResponse = await fetch(`${baseUrl}/checkout-invoice/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PAYDUNYA-MASTER-KEY': process.env.PAYDUNYA_MASTER_KEY || '',
          'PAYDUNYA-PRIVATE-KEY': process.env.PAYDUNYA_PRIVATE_KEY || '',
          'PAYDUNYA-TOKEN': process.env.PAYDUNYA_TOKEN || '',
        },
        body: JSON.stringify({
          invoice: {
            total_amount: Math.round(amount),
            description: description || `Paiement Commande ${orderId}`,
            items: itemsPayload,
          },
          store: {
            name: 'NONALIX CI',
          },
          actions: {
            cancel_url: `${siteUrl}/checkout?error=paydunya&orderId=${orderId}`,
            return_url: `${siteUrl}/checkout/confirmation?order=${orderId}`,
            callback_url: `${siteUrl}/api/payment/webhook`, // webhook général
          },
        }),
      });

      if (!paydunyaResponse.ok) {
        const errorText = await paydunyaResponse.text();
        throw new Error(`PayDunya API response: ${paydunyaResponse.status} - ${errorText}`);
      }

      const paydunyaData = await paydunyaResponse.json();

      if (paydunyaData.response_code !== '00') {
        throw new Error(`PayDunya API Error: ${paydunyaData.response_text || 'Inconnue'}`);
      }

      const paymentUrl = paydunyaData.response_text; // Note: l'API renvoie le lien de paiement dans response_text s'il s'agit du format classique, ou sous .url
      const finalUrl = paydunyaData.url || paymentUrl;
      const transactionId = paydunyaData.token;

      if (!finalUrl) {
        throw new Error('URL de paiement introuvable dans la réponse de PayDunya');
      }

      // Mettre à jour la commande en base de données avec l'ID de transaction de session PayDunya
      await prisma.order.update({
        where: { id: orderId },
        data: {
          transactionId,
          paymentStatus: 'processing',
        },
      });

      console.log('[PAYDUNYA - TRANSACTION INITIATED]', {
        orderId,
        transactionId,
        finalUrl,
      });

      return NextResponse.json({
        status: 'pending',
        orderId,
        url: finalUrl,
        message: 'Transaction initiée',
      });
    } catch (paydunyaErr: any) {
      console.error('[PAYDUNYA API CALL ERROR]', paydunyaErr);
      return NextResponse.json(
        { error: `Erreur PayDunya API: ${paydunyaErr.message || 'Impossible d\'initialiser le paiement'}` },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('[PAYDUNYA ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'initialisation du paiement' },
      { status: 500 }
    );
  }
}
