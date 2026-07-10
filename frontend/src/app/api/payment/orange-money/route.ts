import { NextResponse } from 'next/server';

/**
 * POST /api/payment/orange-money
 * @deprecated Remplacé par PawaPay
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Cette méthode de paiement directe est obsolète. Veuillez utiliser le flux unifié PawaPay.' },
    { status: 410 }
  );
}
