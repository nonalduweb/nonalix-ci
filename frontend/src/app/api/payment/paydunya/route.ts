import { NextResponse } from 'next/server';

/**
 * POST /api/payment/paydunya
 * @deprecated Remplacé par PawaPay
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Cette méthode de paiement directe est obsolète. Veuillez utiliser le flux unifié PawaPay.' },
    { status: 410 }
  );
}
