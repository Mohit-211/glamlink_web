import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import ctaAlertServerService from '@/lib/features/cta-alerts/server/ctaAlertServerService';
import { validateCTAAlertConfig, CTAAlertConfig } from '@/lib/pages/admin/types/ctaAlert';

/**
 * GET /api/content-settings/cta-alert
 * Fetch CTA Alert configuration (admin only)
 */
export async function GET() {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get CTA Alert config from Firestore
    const config = await ctaAlertServerService.getCTAAlertConfig(db);

    return NextResponse.json({
      success: true,
      data: config, // Can be null if no config exists
    });
  } catch (error) {
    console.error('Error fetching CTA Alert config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CTA Alert configuration' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content-settings/cta-alert
 * Create or update CTA Alert configuration (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await request.json() as Partial<CTAAlertConfig>;

    // Validate the configuration
    const validation = validateCTAAlertConfig(config);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid configuration',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // Add metadata
    const configWithMetadata = {
      ...config,
      lastUpdatedBy: currentUser.uid,
    };

    // Save to Firestore
    const savedConfig = await ctaAlertServerService.updateCTAAlertConfig(
      db,
      configWithMetadata
    );

    if (!savedConfig) {
      return NextResponse.json(
        { error: 'Failed to save CTA Alert configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: savedConfig,
    });
  } catch (error) {
    console.error('Error saving CTA Alert config:', error);
    return NextResponse.json(
      { error: 'Failed to save CTA Alert configuration' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/content-settings/cta-alert
 * Deactivate (not delete) the CTA Alert (admin only)
 */
export async function DELETE() {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Deactivate the CTA Alert
    const success = await ctaAlertServerService.deactivateCTAAlert(db);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to deactivate CTA Alert' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'CTA Alert deactivated',
    });
  } catch (error) {
    console.error('Error deactivating CTA Alert:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate CTA Alert' },
      { status: 500 }
    );
  }
}
