import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { notifyAbandonedCart } from '@/lib/n8n-webhooks';

/**
 * GET /api/cron/abandoned-carts
 * Scans MySQL for pending orders (Orange Money or Wave) created between 2 and 3 hours ago
 * and sends an abandoned cart webhook notification to n8n for each.
 * 
 * Protection: Requires a query param token to match process.env.CRON_SECRET
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const secret = process.env.CRON_SECRET || 'nonalix_cron_secret_2026';

    if (token !== secret) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const now = new Date();
    // Fenêtre : entre 2h et 3h d'inactivité
    const startOfWindow = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const endOfWindow = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    console.log(`[CRON ABANDONED CARTS] Scanning orders created between ${startOfWindow.toISOString()} and ${endOfWindow.toISOString()}`);

    const abandonedOrders = await prisma.order.findMany({
      where: {
        paymentStatus: 'pending',
        paymentMethod: {
          in: ['orange_money', 'wave'],
        },
        createdAt: {
          gte: startOfWindow,
          lte: endOfWindow,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log(`[CRON ABANDONED CARTS] Found ${abandonedOrders.length} abandoned orders.`);

    // Notification n8n pour chaque commande abandonnée
    for (const order of abandonedOrders) {
      notifyAbandonedCart({
        cartId: order.id,
        phone: order.phone,
        totalAmount: order.totalAmount,
        abandonedSince: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });
      console.log(`[CRON ABANDONED CARTS] Notified n8n for order ${order.id}`);
    }

    return NextResponse.json({
      status: 'success',
      processed: abandonedOrders.length,
      orders: abandonedOrders.map((o) => o.id),
    });
  } catch (error: any) {
    console.error('[CRON ABANDONED CARTS ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur', details: error.message },
      { status: 500 }
    );
  }
}
