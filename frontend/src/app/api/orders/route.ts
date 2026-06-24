import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendAdminOrderNotification } from '@/lib/mailer';
import { notifyNewOrder } from '@/lib/n8n-webhooks';

/**
 * POST /api/orders
 * Creates a new order (with real PostgreSQL insertion)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, city, paymentMethod, items, totalAmount } = body;

    // Validate required fields
    if (!firstName || !lastName || !phone || !city || !paymentMethod || !items?.length) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Validate phone format (flexible)
    const cleanPhone = phone.replace(/\s/g, '');
    if (!/^\+?[0-9]{8,15}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide' },
        { status: 400 }
      );
    }

    // Generate an order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    // Ensure all ordered products exist in the database Product table & check if any is digital
    let hasDigitalInDb = false;
    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Le produit ${item.productId} n'existe pas dans le catalogue` },
          { status: 400 }
        );
      }
      if (dbProduct.isDigital) {
        hasDigitalInDb = true;
      }
    }

    if (hasDigitalInDb && !email) {
      return NextResponse.json(
        { error: 'L\'adresse e-mail est requise pour recevoir vos produits digitaux' },
        { status: 400 }
      );
    }

    // Save to database via Prisma
    const order = await prisma.order.create({
      data: {
        id: orderId,
        firstName,
        lastName,
        email: email || null,
        phone: cleanPhone,
        city,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending_delivery' : 'pending',
        orderStatus: 'new',
        items: {
          create: items.map((item: any) => ({
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            productId: item.productId,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log('[ORDER CREATED IN DB]', order);

    // Envoyer la notification email à contact@nonalix-ci.com
    await sendAdminOrderNotification({
      id: order.id,
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email,
      phone: order.phone,
      city: order.city,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });

    // 🔗 Notifier n8n (non-bloquant)
    notifyNewOrder({
      orderId: order.id,
      firstName: order.firstName,
      lastName: order.lastName,
      phone: order.phone,
      city: order.city,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });

    return NextResponse.json({
      orderId: order.id,
      status: 'success',
      paymentStatus: order.paymentStatus,
      message: 'Commande enregistrée avec succès',
    });
  } catch (error) {
    console.error('[ORDER ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders
 * Fetches order details by order ID
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de commande requis' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('[ORDER FETCH ERROR]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
