/**
 * Export Transactions API Route
 *
 * GET /api/finance/export/transactions - Export transactions to CSV or PDF
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
    const format = searchParams.get('format') || 'csv';
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    // Mock CSV export for now
    if (format === 'csv') {
      const csv = 'Date,Payout Date,Status,Order,Type,Payment Method,Amount,Fee,Net\n';

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="transactions-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // PDF export placeholder
    return NextResponse.json(
      { error: 'PDF export not implemented yet' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error exporting transactions:', error);
    return NextResponse.json(
      { error: 'Failed to export transactions' },
      { status: 500 }
    );
  }
}
