import { NextRequest, NextResponse } from 'next/server';
import promosServerService from '@/lib/features/promos/server/promosServerService';
import { mockPromos } from '@/lib/features/promos/mockData';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

/**
 * POST /api/promos/seed - Seed mock promos into Firebase (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    console.log('API: Seeding mock promos into Firebase...');

    // Get the request body to check DISABLE_AUTO_SEEDING flag
    const body = await request.json();
    const { DISABLE_AUTO_SEEDING } = body;

    // Check if auto-seeding is disabled
    if (DISABLE_AUTO_SEEDING) {
      console.log('API: Auto-seeding disabled, skipping seed operation');
      return NextResponse.json({
        success: false,
        error: 'Auto-seeding is disabled'
      }, { status: 400 });
    }

    // Get authenticated Firebase app
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized. Admin access required.'
      }, { status: 401 });
    }

    // Check if promos already exist
    const hasExistingPromos = await promosServerService.hasPromos(db);
    if (hasExistingPromos) {
      return NextResponse.json({
        success: false,
        error: 'Promos already exist in database. Use DELETE /api/promos/clear to clear first.'
      }, { status: 400 });
    }

    // Seed mock promos using bulk upload
    const result = await promosServerService.bulkUploadPromos(db, mockPromos);

    console.log(`API: Seeded ${result.success} promos, ${result.failed} failed`);

    if (result.success > 0) {
      return NextResponse.json({
        success: true,
        message: `Successfully seeded ${result.success} promos into Firebase.`,
        data: {
          uploaded: result.success,
          failed: result.failed,
          total: mockPromos.length
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to seed any promos into Firebase.',
        data: result
      }, { status: 500 });
    }

  } catch (error) {
    console.error('API: Error seeding promos:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to seed promos. Please try again later.'
    }, { status: 500 });
  }
}

/**
 * GET /api/promos/seed - Get seeding status
 */
export async function GET() {
  try {
    // Get authenticated Firebase app
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized. Admin access required.'
      }, { status: 401 });
    }

    // Check if promos already exist
    const hasExistingPromos = await promosServerService.hasPromos(db);

    return NextResponse.json({
      success: true,
      data: {
        hasPromos: hasExistingPromos,
        mockPromosCount: mockPromos.length,
        message: hasExistingPromos
          ? 'Database already contains promos'
          : 'Database is empty, ready for seeding'
      }
    });

  } catch (error) {
    console.error('API: Error checking seeding status:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to check seeding status.'
    }, { status: 500 });
  }
}