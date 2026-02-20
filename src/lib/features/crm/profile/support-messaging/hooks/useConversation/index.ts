'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doc, updateDoc, writeBatch, arrayUnion } from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import { useAuth } from '@/lib/features/auth/useAuth';
import type { ConversationWithMessages, Message, UseConversationReturn } from '../../types';
import { COLLECTION_PATHS, isAdminEmail } from '../../config';
import {
  updateConversationUnread,
  fromSerializableConversationWithMessages,
} from '../../store/supportMessagingSlice';
import { selectCurrentConversation, selectSupportMessaging } from '@/lib/features/store/hooks';
import type { AppDispatch } from 'store/store';

import { useConversationRealtime } from './useConversationRealtime';
import { useConversationMessages } from './useConversationMessages';
import { useConversationActions } from './useConversationActions';
import { useConversationPagination } from './useConversationPagination';

export function useConversation(conversationId: string): UseConversationReturn {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  // Extract stable user values to avoid callback recreation on user object changes
  const userId = user?.uid;
  const userEmail = user?.email;

  const serializedConversation = useSelector(selectCurrentConversation);
  const { messagesLoading: isLoading, error } = useSelector(selectSupportMessaging);

  const [lastReadAt, setLastReadAt] = useState<Date | null>(null);

  // Convert serialized to typed
  const baseConversation: ConversationWithMessages | null = serializedConversation
    ? fromSerializableConversationWithMessages(serializedConversation)
    : null;

  // Compose child hooks - messages
  const {
    optimisticMessages,
    sendMessage,
    retryMessage,
    sendMessageBatch,
    localError: messagesError,
    clearOptimisticByContent,
  } = useConversationMessages({ conversationId });

  // Compose child hooks - pagination (needs mapDocToMessage from realtime)
  const {
    hasMoreMessages,
    isLoadingMore,
    loadMoreMessages,
    setOldestMessageRef,
    setHasMore,
    paginationError,
  } = useConversationPagination({
    conversationId,
    conversation: baseConversation,
    mapDocToMessage: (doc) => {
      // This will be replaced with the actual mapDocToMessage from realtime hook
      const data = doc.data();
      return {
        id: doc.id,
        senderId: data.senderId,
        senderEmail: data.senderEmail,
        senderName: data.senderName,
        content: data.content,
        timestamp: data.timestamp?.toDate?.() || new Date(data.timestamp),
        readAt: data.readAt?.toDate?.() || (data.readAt ? new Date(data.readAt) : undefined),
        readBy: data.readBy || [],
        reactions: (data.reactions || []).map((r: { emoji: string; userId: string; userName: string; createdAt: { toDate?: () => Date } | string }) => ({
          emoji: r.emoji,
          userId: r.userId,
          userName: r.userName,
          createdAt: typeof r.createdAt === 'object' && r.createdAt?.toDate
            ? r.createdAt.toDate()
            : new Date(r.createdAt as string),
        })),
      } as Message;
    },
  });

  // Realtime hook
  useConversationRealtime({
    conversationId,
    onOldestMessageRef: setOldestMessageRef,
    onHasMoreMessages: setHasMore,
  });

  // Actions hook
  const {
    updateStatus,
    updatePriority,
    updateTags,
    addReaction,
    removeReaction,
    pinMessage,
    unpinMessage,
    editMessage,
    actionsError,
  } = useConversationActions({
    conversationId,
    conversation: baseConversation,
  });

  // Merge optimistic messages
  const conversation: ConversationWithMessages | null = baseConversation
    ? {
        ...baseConversation,
        messages: [...baseConversation.messages, ...optimisticMessages],
        lastReadAt: lastReadAt ?? undefined,
      }
    : null;

  // Clear optimistic messages when confirmed
  useEffect(() => {
    if (optimisticMessages.length > 0 && baseConversation?.messages) {
      const confirmedIds = new Set(
        baseConversation.messages
          .filter(m => !m.id.startsWith('temp_'))
          .map(m => m.content)
      );
      clearOptimisticByContent(confirmedIds);
    }
  }, [baseConversation?.messages?.length, optimisticMessages.length, clearOptimisticByContent]);

  // Mark as read
  const markAsRead = useCallback(async (): Promise<void> => {
    if (!conversationId || !userId || !userEmail || !clientDb) return;

    const db = clientDb;
    const messages = baseConversation?.messages || [];

    if (messages.length > 0 && !lastReadAt) {
      const lastMessage = messages[messages.length - 1];
      setLastReadAt(lastMessage.timestamp);
    }

    try {
      const isAdmin = isAdminEmail(userEmail);
      const conversationRef = doc(db, COLLECTION_PATHS.conversations, conversationId);

      const unreadMessages = messages.filter(
        m => m.senderId !== userId && !m.readAt && !m.id.startsWith('temp_')
      );

      if (unreadMessages.length > 0) {
        const batch = writeBatch(db);
        const now = new Date();

        unreadMessages.forEach(msg => {
          const msgRef = doc(db, COLLECTION_PATHS.messages(conversationId), msg.id);
          batch.update(msgRef, {
            readAt: now,
            readBy: arrayUnion(userId)
          });
        });

        await batch.commit();
      }

      await updateDoc(conversationRef, {
        [isAdmin ? 'unreadByAdmin' : 'unreadByUser']: 0,
      });

      dispatch(
        updateConversationUnread({
          id: conversationId,
          ...(isAdmin ? { unreadByAdmin: 0 } : { unreadByUser: 0 }),
        })
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  }, [conversationId, userId, userEmail, dispatch, baseConversation?.messages, lastReadAt]);

  return {
    conversation,
    isLoading,
    error: error || messagesError || actionsError || paginationError,
    sendMessage,
    sendMessageBatch,
    retryMessage,
    markAsRead,
    updateStatus,
    updatePriority,
    updateTags,
    addReaction,
    removeReaction,
    pinMessage,
    unpinMessage,
    editMessage,
    hasMoreMessages,
    loadMoreMessages,
    isLoadingMore,
  };
}

// Re-export child hooks for direct use if needed
export { useConversationRealtime } from './useConversationRealtime';
export { useConversationMessages } from './useConversationMessages';
export { useConversationActions } from './useConversationActions';
export { useConversationPagination } from './useConversationPagination';
