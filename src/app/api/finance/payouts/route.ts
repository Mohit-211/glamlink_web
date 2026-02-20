/**
 * Payouts API Route
 *
 * GET /api/finance/payouts - List all payouts for current brand
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const dateRange = searchParams.get('dateRange');
    const status = searchParams.get('status');

    // Mock data for now - in production, query Firestore
    const payouts: any[] = [];

    return NextResponse.json({
      payouts,
      total: payouts.length,
      page: 1,
    });
  } catch (error) {
    console.error('Error fetching payouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    );
  }
}
