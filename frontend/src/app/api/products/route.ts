import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/products
 * Fetches all products or a single product by slug from PostgreSQL
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const product = await prisma.product.findUnique({
        where: { slug },
      });

      if (!product) {
        return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
      }

      return NextResponse.json(product);
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('[PRODUCTS API ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
