/**
 * Transactions by Payout API Route
 *
 * GET /api/finance/transactions/payout/[payoutId] - Get all transactions for a payout
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ payoutId: string }> }
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

    const { payoutId } = await params;

    // Mock data for now - in production, query Firestore
    const transactions: any[] = [];

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
