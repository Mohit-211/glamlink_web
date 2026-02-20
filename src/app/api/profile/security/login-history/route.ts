import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '20');
    const statusFilter = searchParams.get('status') || 'all';

    // Get login history for user
    const loginHistoryRef = collection(db, 'users', currentUser.uid, 'loginHistory');

    let loginHistoryQuery = query(
      loginHistoryRef,
      orderBy('timestamp', 'desc'),
      limit(limitParam)
    );

    // Apply status filter if specified
    if (statusFilter !== 'all') {
      loginHistoryQuery = query(
        loginHistoryRef,
        where('status', '==', statusFilter),
        orderBy('timestamp', 'desc'),
        limit(limitParam)
      );
    }

    const loginHistorySnap = await getDocs(loginHistoryQuery);

    const loginHistory = loginHistorySnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        timestamp: data.timestamp?.toDate().toISOString(),
        status: data.status,
        ipAddress: data.ipAddress,
        location: data.location,
        deviceType: data.deviceType,
        browser: data.browser,
        failureReason: data.failureReason,
      };
    });

    return NextResponse.json({
      success: true,
      loginHistory,
    });
  } catch (error) {
    console.error('Error fetching login history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch login history' },
      { status: 500 }
    );
  }
}
