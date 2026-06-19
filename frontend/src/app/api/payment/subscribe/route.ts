import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-server';

/**
 * POST /api/payment/subscribe
 * Subscribes a user to the SEO Audit Premium plan (5000 FCFA/month)
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    
    // Check if user is logged in
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour souscrire à un abonnement." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { phone, paymentMethod } = body;

    // Validate parameters
    if (!phone || !paymentMethod) {
      return NextResponse.json(
        { error: 'Paramètres manquants (téléphone et mode de paiement requis)' },
        { status: 400 }
      );
    }

    if (paymentMethod !== 'wave' && paymentMethod !== 'orange_money') {
      return NextResponse.json(
        { error: 'Mode de paiement invalide (Orange Money ou Wave uniquement)' },
        { status: 400 }
      );
    }

    // Clean phone input
    const cleanPhone = phone.replace(/\s/g, '');
    if (!/^0[157]\d{8}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Format du numéro de téléphone de facturation invalide (Côte d'Ivoire requis)" },
        { status: 400 }
      );
    }

    console.log(`[SUBSCRIPTION INITIATED] User: ${user.email}, Phone: ${cleanPhone}, Method: ${paymentMethod}`);

    // Simulation of payment success
    const transactionId = `SUB-${paymentMethod.toUpperCase().slice(0, 2)}-${Date.now()}`;
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days of subscription

    // Update user in DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isSubscribed: true,
        subscriptionExpiresAt: expiresAt
      }
    });

    console.log(`[SUBSCRIPTION SUCCESS] User ${user.email} is now subscribed until ${expiresAt.toISOString()}`);

    return NextResponse.json({
      status: 'success',
      message: 'Votre abonnement Premium NONALIX SEO a été activé avec succès pour 30 jours.',
      transactionId,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('[SUBSCRIPTION ERROR]', error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'activation de votre abonnement." },
      { status: 500 }
    );
  }
}
