import { NextRequest, NextResponse } from 'next/server';
import promosListingService from '@/lib/features/promos/server/promosListingService';
import promosServerService from '@/lib/features/promos/server/promosServerService';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/promos/[id] - Get a single promo by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    console.log(`API: Fetching promo with ID: ${id}`);

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Promo ID is required'
      }, { status: 400 });
    }

    const promo = await promosListingService.getPromoById(id);

    if (!promo) {
      return NextResponse.json({
        success: false,
        error: 'Promo not found'
      }, { status: 404 });
    }

    console.log(`API: Found promo: ${promo.title}`);

    return NextResponse.json({
      success: true,
      data: promo
    });

  } catch (error) {
    console.error('API: Error fetching promo:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch promo. Please try again later.'
    }, { status: 500 });
  }
}

/**
 * PUT /api/promos/[id] - Update a promo (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    console.log(`API: Updating promo with ID: ${id}`);

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Promo ID is required'
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

    // Parse request body
    const body = await request.json();

    // First check if promo exists
    const existingPromo = await promosListingService.getPromoById(id);
    if (!existingPromo) {
      return NextResponse.json({
        success: false,
        error: 'Promo not found'
      }, { status: 404 });
    }

    // Create updated promo object
    const updatedPromo = {
      ...existingPromo,
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    // Update in Firebase using the server service
    const success = await promosServerService.updatePromo(db, id, updatedPromo);

    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update promo in database.'
      }, { status: 500 });
    }

    console.log('API: Updated promo in Firebase:', id);

    return NextResponse.json({
      success: true,
      data: updatedPromo,
      message: 'Promo updated successfully'
    });

  } catch (error) {
    console.error('API: Error updating promo:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to update promo. Please try again later.'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/promos/[id] - Delete a promo (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    console.log(`API: Deleting promo with ID: ${id}`);

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Promo ID is required'
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

    // First check if promo exists
    const existingPromo = await promosListingService.getPromoById(id);
    if (!existingPromo) {
      return NextResponse.json({
        success: false,
        error: 'Promo not found'
      }, { status: 404 });
    }

    // Delete from Firebase using the server service
    const success = await promosServerService.deletePromo(db, id);

    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete promo from database.'
      }, { status: 500 });
    }

    console.log('API: Deleted promo from Firebase:', existingPromo.title);

    return NextResponse.json({
      success: true,
      message: 'Promo deleted successfully'
    });

  } catch (error) {
    console.error('API: Error deleting promo:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to delete promo. Please try again later.'
    }, { status: 500 });
  }
}