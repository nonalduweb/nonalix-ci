import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

/**
 * GET /api/admin/stats
 * Returns database entities and traffic analytics for authenticated admins
 */
export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json(
      { error: 'Non autorisé. Veuillez vous connecter.' },
      { status: 401 }
    );
  }

  try {
    // 1. Core Metrics
    const totalOrders = await prisma.order.count();
    
    const revenueSum = await prisma.order.aggregate({
      where: {
        paymentStatus: { in: ['completed', 'processing'] },
      },
      _sum: {
        totalAmount: true,
      },
    });
    const totalRevenue = revenueSum._sum.totalAmount || 0;

    const totalLeads = await prisma.contactLead.count();
    const totalPageViews = await prisma.pageView.count();

    // 2. Fetch Lists
    const leads = await prisma.contactLead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const pageViews = await prisma.pageView.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200, // Show last 200 views
    });

    // 3. Traffic statistics grouped by URL
    const trafficStatsRaw = await prisma.pageView.groupBy({
      by: ['url'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    const trafficStats = trafficStatsRaw.map((t: any) => ({
      url: t.url,
      views: t._count.id,
    }));

    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue,
        totalLeads,
        totalPageViews,
      },
      leads,
      orders,
      pageViews,
      trafficStats,
    });
  } catch (error) {
    console.error('[ADMIN STATS API ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur lors de la récupération des données' },
      { status: 500 }
    );
  }
}
