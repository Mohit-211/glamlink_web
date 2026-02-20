/**
 * Attribution Export API Route
 *
 * Handles exporting attribution data as CSV or PDF.
 *
 * Routes:
 * - GET /api/marketing/attribution/export - Export attribution data
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import marketingServerService from '@/lib/features/crm/marketing/server/marketingServerService';

/**
 * GET /api/marketing/attribution/export
 *
 * Export attribution data in CSV or PDF format
 *
 * Query params:
 * - brandId: string (required)
 * - startDate: string (required)
 * - endDate: string (required)
 * - attributionModel: string (optional)
 * - format: 'csv' | 'pdf' (default: 'csv')
 */
export async function GET(request: NextRequest) {
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
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const attributionModel = searchParams.get('attributionModel') || 'last_non_direct_click';
  const format = searchParams.get('format') || 'csv';

  if (!brandId || !startDate || !endDate) {
    return NextResponse.json(
      { success: false, error: 'Brand ID, start date, and end date required' },
      { status: 400 }
    );
  }

  try {
    // Fetch attribution data
    const channels = await marketingServerService.getChannelAttribution(
      db,
      brandId,
      startDate,
      endDate
    );

    if (format === 'csv') {
      const csv = generateCSV(channels || []);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="attribution-report.csv"`,
        },
      });
    } else if (format === 'pdf') {
      // PDF generation would require a library like pdfmake or jsPDF
      // For now, return a simple text representation
      return NextResponse.json(
        { success: false, error: 'PDF export not yet implemented' },
        { status: 501 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Invalid format' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in GET /api/marketing/attribution/export:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate CSV from channel attribution data
 */
function generateCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = [
    'Channel', 'Type', 'Sessions', 'Sales', 'Orders',
    'Conversion Rate', 'ROAS', 'CPA', 'CTR', 'AOV',
    'New Customer Orders', 'Returning Customer Orders'
  ];

  const rows = data.map(channel => [
    channel.channelName || '',
    channel.channelType || '',
    channel.sessions || 0,
    channel.sales || 0,
    channel.orders || 0,
    channel.conversionRate || 0,
    channel.roas || '',
    channel.cpa || '',
    channel.ctr || '',
    channel.aov || '',
    channel.newCustomerOrders || 0,
    channel.returningCustomerOrders || 0,
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
}
