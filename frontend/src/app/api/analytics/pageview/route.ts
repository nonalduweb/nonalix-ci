import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/analytics/pageview
 * Records a page view to the database
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, referrer, userAgent } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL field is required' },
        { status: 400 }
      );
    }

    // Capture IP address safely from headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
               req.headers.get('x-real-ip')?.trim() ||
               '127.0.0.1';

    // Save pageview in database
    const pageView = await prisma.pageView.create({
      data: {
        url,
        referrer: referrer || null,
        userAgent: userAgent || null,
        ip,
      },
    });

    return NextResponse.json({
      status: 'success',
      id: pageView.id,
    });
  } catch (error) {
    console.error('[PAGEVIEW SAVE ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to record pageview' },
      { status: 500 }
    );
  }
}
