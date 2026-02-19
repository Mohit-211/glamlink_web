import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { COLLECTION_PATHS, isAdminEmail } from '@/lib/features/crm/profile/support-messaging/config';

// GET - Get unread count for admins
export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isAdminEmail(currentUser.email || '')) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const conversationsCollection = collection(db, COLLECTION_PATHS.conversations);
    const q = query(conversationsCollection, where('unreadByAdmin', '>', 0));
    const snapshot = await getDocs(q);

    let totalUnread = 0;
    snapshot.docs.forEach((doc) => {
      totalUnread += doc.data().unreadByAdmin || 0;
    });

    return NextResponse.json({
      success: true,
      count: totalUnread,
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch unread count' },
      { status: 500 }
    );
  }
}
