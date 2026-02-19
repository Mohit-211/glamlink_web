/**
 * Finance Summary API Route
 *
 * GET /api/finance/summary - Get financial summary for current brand
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

    // Mock data for now - in production, calculate from Firestore
    const summary = {
      toBePaid: 0,
      pendingPayouts: 0,
      thisMonth: {
        grossSales: 0,
        fees: 0,
        netSales: 0,
        transactionCount: 0,
      },
      lastPayout: null,
      nextPayout: null,
    };

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error fetching finance summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    );
  }
}
