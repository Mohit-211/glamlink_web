/**
 * Marketing Campaign (Single) API Routes
 *
 * Handles operations on individual campaigns.
 *
 * Routes:
 * - GET /api/marketing/campaigns/[id] - Get a single campaign
 * - PUT /api/marketing/campaigns/[id] - Update a campaign
 * - DELETE /api/marketing/campaigns/[id] - Delete a campaign
 *
 * CRITICAL: In Next.js 15, params MUST be awaited (they are a Promise)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import marketingServerService from '@/lib/features/crm/marketing/server/marketingServerService';

/**
 * GET /api/marketing/campaigns/[id]
 *
 * Get a single campaign by ID
 *
 * Query params:
 * - brandId: string (required)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // MUST be Promise in Next.js 15!
) {
  // CRITICAL: MUST await params (Next.js 15 requirement)
  const { id } = await params;

  // Auth check
  const { db, currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser || !db) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Extract query params
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get('brandId');

  if (!brandId) {
    return NextResponse.json(
      { success: false, error: 'Brand ID required' },
      { status: 400 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Campaign ID required' },
      { status: 400 }
    );
  }

  try {
    const campaign = await marketingServerService.getCampaignById(db, brandId, id);

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.error('Error in GET /api/marketing/campaigns/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/marketing/campaigns/[id]
 *
 * Update a campaign
 *
 * Body:
 * - brandId: string (required)
 * - ... fields to update
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // CRITICAL: MUST await params
  const { id } = await params;

  // Auth check
  const { db, currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser || !db) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Campaign ID required' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { brandId, ...updates } = body;

    if (!brandId) {
      return NextResponse.json(
        { success: false, error: 'Brand ID required' },
        { status: 400 }
      );
    }

    // Remove id from updates to prevent overwriting
    const { id: _, ...safeUpdates } = updates;

    const success = await marketingServerService.updateCampaign(
      db,
      brandId,
      id,
      safeUpdates
    );

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id, ...safeUpdates },
    });
  } catch (error) {
    console.error('Error in PUT /api/marketing/campaigns/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/marketing/campaigns/[id]
 *
 * Delete a campaign
 *
 * Body:
 * - brandId: string (required)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // CRITICAL: MUST await params
  const { id } = await params;

  // Auth check
  const { db, currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser || !db) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Campaign ID required' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { brandId } = body;

    if (!brandId) {
      return NextResponse.json(
        { success: false, error: 'Brand ID required' },
        { status: 400 }
      );
    }

    const success = await marketingServerService.deleteCampaign(db, brandId, id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    console.error('Error in DELETE /api/marketing/campaigns/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
