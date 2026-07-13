import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

/**
 * GET /api/admin/settings
 * Retrieves global system settings (e.g. maintenance mode)
 */
export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json(
      { error: 'Non autorisé. Veuillez vous connecter.' },
      { status: 401 }
    );
  }

  try {
    const config = await prisma.agentConfig.findUnique({
      where: { slug: 'system_settings' }
    });

    const variables = config?.variables as Record<string, any> || {};
    const maintenanceMode = !!variables.maintenanceMode;

    return NextResponse.json({ maintenanceMode });
  } catch (error) {
    console.error('[SETTINGS GET ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/settings
 * Updates global system settings (requires admin authentication)
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authentifier la session de l'administrateur
    if (!verifyAdminSession(req)) {
      return NextResponse.json(
        { error: 'Non autorisé. Veuillez vous connecter en tant qu\'administrateur.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { maintenanceMode } = body;

    if (typeof maintenanceMode !== 'boolean') {
      return NextResponse.json(
        { error: 'Paramètre maintenanceMode invalide' },
        { status: 400 }
      );
    }

    // 2. Sauvegarder la configuration via un upsert
    const config = await prisma.agentConfig.upsert({
      where: { slug: 'system_settings' },
      update: {
        variables: { maintenanceMode }
      },
      create: {
        slug: 'system_settings',
        name: 'System Settings',
        systemPrompt: 'System configuration settings (maintenance, etc)',
        firstMessage: '',
        variables: { maintenanceMode }
      }
    });

    console.log(`[SYSTEM SETTINGS UPDATED] Maintenance mode: ${maintenanceMode}`);

    return NextResponse.json({
      success: true,
      maintenanceMode
    });
  } catch (error) {
    console.error('[SETTINGS POST ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    );
  }
}
