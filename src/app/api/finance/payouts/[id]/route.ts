/**
 * Payout Detail API Route
 *
 * GET /api/finance/payouts/[id] - Get specific payout details
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's brand ID (user ID is the brand ID in this system)
    const brandId = currentUser.uid;

    const { id } = await params;

    // Mock data for now - in production, query Firestore
    const payout = null;

    if (!payout) {
      return NextResponse.json(
        { error: 'Payout not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ payout });
  } catch (error) {
    console.error('Error fetching payout:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payout' },
      { status: 500 }
    );
  }
}
