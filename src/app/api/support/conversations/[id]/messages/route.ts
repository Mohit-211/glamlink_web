import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { COLLECTION_PATHS, isAdminEmail, RATE_LIMITS } from '@/lib/features/crm/profile/support-messaging/config';
import { checkRateLimit, recordRateLimitAction } from '@/lib/features/crm/profile/support-messaging/utils/rateLimit';

// GET - Get messages for a conversation
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

    // Verify conversation exists and user has access
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
      messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST - Send new message
export async function POST(
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
    const { content, attachments } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Check rate limit (admins are exempt)
    const isAdmin = isAdminEmail(currentUser.email || '');
    if (!isAdmin) {
      const withinLimit = checkRateLimit(
        currentUser.uid,
        RATE_LIMITS.messagesPerMinute,
        RATE_LIMITS.windowMs
      );

      if (!withinLimit) {
        return NextResponse.json(
          { success: false, error: 'Rate limit exceeded. Please wait before sending more messages.' },
          { status: 429 }
        );
      }
    }

    // Verify conversation exists and user has access
    const conversationRef = doc(db, COLLECTION_PATHS.conversations, conversationId);
    const conversationDoc = await getDoc(conversationRef);

    if (!conversationDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const conversationData = conversationDoc.data();

    if (!isAdmin && conversationData.userId !== currentUser.uid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const now = new Date();
    const senderName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';

    // Create message
    const messageData: Record<string, unknown> = {
      senderId: currentUser.uid,
      senderEmail: currentUser.email,
      senderName,
      content: content.trim(),
      timestamp: now,
    };

    // Add attachments if provided
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      messageData.attachments = attachments.map((a: { id: string; type: string; url: string; thumbnailUrl?: string; name: string; size: number; mimeType: string; uploadedAt: string }) => {
        const attachment: Record<string, unknown> = {
          id: a.id,
          type: a.type,
          url: a.url,
          name: a.name,
          size: a.size,
          mimeType: a.mimeType,
          uploadedAt: new Date(a.uploadedAt),
        };
        // Only add thumbnailUrl if it exists (Firestore doesn't allow undefined values)
        if (a.thumbnailUrl) {
          attachment.thumbnailUrl = a.thumbnailUrl;
        }
        return attachment;
      });
    }

    const messagesCollection = collection(db, COLLECTION_PATHS.messages(conversationId));
    const messageRef = await addDoc(messagesCollection, messageData);

    // Record rate limit action for non-admin users
    if (!isAdmin) {
      recordRateLimitAction(currentUser.uid);
    }

    // Update conversation with last message and unread count
    const unreadField = isAdmin ? 'unreadByUser' : 'unreadByAdmin';
    const currentUnread = conversationData[unreadField] || 0;

    // Calculate response time metrics for admin replies
    let metricsUpdate = {};
    if (isAdmin) {
      const currentMetrics = conversationData.metrics || { totalAdminReplies: 0 };
      const newTotalAdminReplies = currentMetrics.totalAdminReplies + 1;

      // Calculate first response time if this is the first admin reply
      if (!currentMetrics.firstResponseTimeMs) {
        const createdAt = conversationData.createdAt?.toDate?.() || new Date(conversationData.createdAt);
        const firstResponseTimeMs = now.getTime() - createdAt.getTime();
        metricsUpdate = {
          metrics: {
            ...currentMetrics,
            firstResponseTimeMs,
            totalAdminReplies: newTotalAdminReplies,
          },
        };
      } else {
        // Update average response time calculation would require tracking all response times
        // For now, just update the total admin replies count
        metricsUpdate = {
          metrics: {
            ...currentMetrics,
            totalAdminReplies: newTotalAdminReplies,
          },
        };
      }
    }

    await updateDoc(conversationRef, {
      lastMessage: {
        content: content.trim(),
        senderId: currentUser.uid,
        timestamp: now,
      },
      [unreadField]: currentUnread + 1,
      updatedAt: now,
      // Reopen conversation if admin replies to a resolved one
      ...(isAdmin && conversationData.status === 'resolved' ? { status: 'pending' } : {}),
      ...metricsUpdate,
    });

    // Prepare response with serialized attachments
    const responseMessage: Record<string, unknown> = {
      id: messageRef.id,
      senderId: messageData.senderId,
      senderEmail: messageData.senderEmail,
      senderName: messageData.senderName,
      content: messageData.content,
      timestamp: now.toISOString(),
    };

    if (messageData.attachments && Array.isArray(messageData.attachments)) {
      responseMessage.attachments = (messageData.attachments as Array<{ id: string; type: string; url: string; thumbnailUrl?: string; name: string; size: number; mimeType: string; uploadedAt: Date }>).map((a) => ({
        ...a,
        uploadedAt: a.uploadedAt instanceof Date ? a.uploadedAt.toISOString() : a.uploadedAt,
      }));
    }

    return NextResponse.json({
      success: true,
      message: responseMessage,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
