import { NextResponse } from 'next/server';
import { getPublicFirebaseApp } from '@/lib/firebase/serverApp';
import ctaAlertServerService from '@/lib/features/cta-alerts/server/ctaAlertServerService';

/**
 * GET /api/cta-alert/active
 * Fetch the active CTA Alert for public display
 *
 * This is a PUBLIC endpoint - no authentication required.
 * Returns null if:
 * - No CTA Alert config exists
 * - CTA Alert is not active (isActive: false)
 * - Current date is outside the start/end date range
 */
export async function GET() {
  try {
    // Use public Firebase app (no auth required)
    const { db } = await getPublicFirebaseApp();

    if (!db) {
      console.error('Failed to initialize public Firebase app');
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    // Get active CTA Alert (returns null if not active or outside date range)
    const activeCTA = await ctaAlertServerService.getActiveCTAAlert(db);

    return NextResponse.json({
      success: true,
      data: activeCTA,
    });
  } catch (error) {
    console.error('Error fetching active CTA Alert:', error);
    // Return null on error to prevent blocking the UI
    return NextResponse.json({
      success: true,
      data: null,
    });
  }
}
