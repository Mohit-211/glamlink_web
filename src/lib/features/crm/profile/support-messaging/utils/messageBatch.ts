import { writeBatch, doc, collection, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import { COLLECTION_PATHS } from '../config';

export interface BatchMessageInput {
  content: string;
  senderId: string;
  senderEmail: string;
  senderName: string;
}

export interface BatchResult {
  success: boolean;
  messageIds: string[];
  error?: string;
}

/**
 * Send multiple messages in a single Firestore batch operation.
 * Maximum 500 operations per batch (Firestore limit).
 */
export async function sendMessageBatch(
  conversationId: string,
  messages: BatchMessageInput[]
): Promise<BatchResult> {
  if (!clientDb) {
    return { success: false, messageIds: [], error: 'Database not initialized' };
  }

  if (messages.length === 0) {
    return { success: true, messageIds: [] };
  }

  if (messages.length > 500) {
    return { success: false, messageIds: [], error: 'Batch size exceeds Firestore limit of 500' };
  }

  try {
    const batch = writeBatch(clientDb);
    const messagesRef = collection(clientDb, COLLECTION_PATHS.messages(conversationId));
    const messageIds: string[] = [];
    const now = Date.now();

    messages.forEach((msg, index) => {
      const messageRef = doc(messagesRef);
      messageIds.push(messageRef.id);

      batch.set(messageRef, {
        senderId: msg.senderId,
        senderEmail: msg.senderEmail,
        senderName: msg.senderName,
        content: msg.content.trim(),
        timestamp: Timestamp.fromDate(new Date(now + index)), // Ensure order
        readAt: null,
        readBy: [],
        reactions: [],
      });
    });

    // Update conversation metadata
    const conversationRef = doc(clientDb, COLLECTION_PATHS.conversations, conversationId);
    const lastMessage = messages[messages.length - 1];
    batch.update(conversationRef, {
      lastMessage: {
        content: lastMessage.content.slice(0, 100),
        senderId: lastMessage.senderId,
        timestamp: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    });

    await batch.commit();

    return { success: true, messageIds };
  } catch (error) {
    console.error('Batch message error:', error);
    return {
      success: false,
      messageIds: [],
      error: error instanceof Error ? error.message : 'Failed to send messages',
    };
  }
}
