import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { COLLECTION_PATHS, isAdminEmail } from '@/lib/features/crm/profile/support-messaging/config';

// GET - List all conversations for admins with optional filters
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

    // Get filter from query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const conversationsCollection = collection(db, COLLECTION_PATHS.conversations);

    let q;
    if (status && status !== 'all') {
      q = query(
        conversationsCollection,
        where('status', '==', status),
        orderBy('updatedAt', 'desc')
      );
    } else {
      q = query(conversationsCollection, orderBy('updatedAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    const conversations = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        adminId: data.adminId,
        status: data.status,
        subject: data.subject,
        unreadByUser: data.unreadByUser || 0,
        unreadByAdmin: data.unreadByAdmin || 0,
        lastMessage: data.lastMessage
          ? {
              content: data.lastMessage.content,
              senderId: data.lastMessage.senderId,
              timestamp: data.lastMessage.timestamp?.toDate?.()?.toISOString() || data.lastMessage.timestamp,
            }
          : null,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error('Error listing admin conversations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list conversations' },
      { status: 500 }
    );
  }
}
