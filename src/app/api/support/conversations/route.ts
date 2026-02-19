import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, orderBy, doc, setDoc } from 'firebase/firestore';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { DEFAULT_ADMIN_EMAIL, COLLECTION_PATHS, isAdminEmail } from '@/lib/features/crm/profile/support-messaging/config';

// GET - List conversations
export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const conversationsCollection = collection(db, COLLECTION_PATHS.conversations);
    const isAdmin = isAdminEmail(currentUser.email || '');

    // Build query based on user type
    const q = isAdmin
      ? query(conversationsCollection, orderBy('updatedAt', 'desc'))
      : query(
          conversationsCollection,
          where('userId', '==', currentUser.uid),
          orderBy('updatedAt', 'desc')
        );

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
    console.error('Error listing conversations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list conversations' },
      { status: 500 }
    );
  }
}

// POST - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subject, initialMessage } = body;

    if (!subject || !initialMessage) {
      return NextResponse.json(
        { success: false, error: 'Subject and initial message are required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const userName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';

    // Create conversation document
    const conversationData = {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName,
      adminId: DEFAULT_ADMIN_EMAIL,
      status: 'open',
      subject,
      unreadByUser: 0,
      unreadByAdmin: 1,
      lastMessage: {
        content: initialMessage,
        senderId: currentUser.uid,
        timestamp: now,
      },
      createdAt: now,
      updatedAt: now,
    };

    const conversationsCollection = collection(db, COLLECTION_PATHS.conversations);
    const conversationRef = await addDoc(conversationsCollection, conversationData);

    // Create initial message in subcollection
    const messageData = {
      senderId: currentUser.uid,
      senderEmail: currentUser.email,
      senderName: userName,
      content: initialMessage,
      timestamp: now,
    };

    const messagesCollection = collection(db, COLLECTION_PATHS.messages(conversationRef.id));
    await addDoc(messagesCollection, messageData);

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversationRef.id,
        ...conversationData,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        lastMessage: {
          ...conversationData.lastMessage,
          timestamp: now.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
