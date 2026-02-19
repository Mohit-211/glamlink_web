import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { COLLECTION_PATHS, isAdminEmail } from '@/lib/features/crm/profile/support-messaging/config';

// GET - Get single conversation with messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const conversationRef = doc(db, COLLECTION_PATHS.conversations, conversationId);
    const conversationDoc = await getDoc(conversationRef);

    if (!conversationDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const conversationData = conversationDoc.data();
    const isAdmin = isAdminEmail(currentUser.email || '');

    // Check authorization
    if (!isAdmin && conversationData.userId !== currentUser.uid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Fetch messages
    const messagesCollection = collection(db, COLLECTION_PATHS.messages(conversationId));
    const messagesQuery = query(messagesCollection, orderBy('timestamp', 'asc'));
    const messagesSnapshot = await getDocs(messagesQuery);

    const messages = messagesSnapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        senderId: data.senderId,
        senderEmail: data.senderEmail,
        senderName: data.senderName,
        content: data.content,
        timestamp: data.timestamp?.toDate?.()?.toISOString() || data.timestamp,
        readAt: data.readAt?.toDate?.()?.toISOString() || data.readAt,
      };
    });

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversationDoc.id,
        userId: conversationData.userId,
        userEmail: conversationData.userEmail,
        userName: conversationData.userName,
        adminId: conversationData.adminId,
        status: conversationData.status,
        subject: conversationData.subject,
        unreadByUser: conversationData.unreadByUser || 0,
        unreadByAdmin: conversationData.unreadByAdmin || 0,
        lastMessage: conversationData.lastMessage
          ? {
              content: conversationData.lastMessage.content,
              senderId: conversationData.lastMessage.senderId,
              timestamp: conversationData.lastMessage.timestamp?.toDate?.()?.toISOString() || conversationData.lastMessage.timestamp,
            }
          : null,
        createdAt: conversationData.createdAt?.toDate?.()?.toISOString() || conversationData.createdAt,
        updatedAt: conversationData.updatedAt?.toDate?.()?.toISOString() || conversationData.updatedAt,
        messages,
      },
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}

// PATCH - Update conversation (status, mark as read)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, markAsRead } = body;

    const conversationRef = doc(db, COLLECTION_PATHS.conversations, conversationId);
    const conversationDoc = await getDoc(conversationRef);

    if (!conversationDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const conversationData = conversationDoc.data();
    const isAdmin = isAdminEmail(currentUser.email || '');

    // Check authorization
    if (!isAdmin && conversationData.userId !== currentUser.uid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updates: any = {
      updatedAt: new Date(),
    };

    if (status) {
      updates.status = status;
    }

    if (markAsRead) {
      updates[isAdmin ? 'unreadByAdmin' : 'unreadByUser'] = 0;
    }

    await updateDoc(conversationRef, updates);

    return NextResponse.json({
      success: true,
      message: 'Conversation updated',
    });
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
}
