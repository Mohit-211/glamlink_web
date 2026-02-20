/**
 * Transactions API Route
 *
 * GET /api/finance/transactions - List all transactions for current brand
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
    const type = searchParams.get('type');
    const payoutStatus = searchParams.get('payoutStatus');
    const orderId = searchParams.get('orderId');

    // Mock data for now - in production, query Firestore
    const transactions: any[] = [];

    return NextResponse.json({
      transactions,
      total: transactions.length,
      page: 1,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
