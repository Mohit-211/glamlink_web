'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { doc, collection, query, orderBy, onSnapshot, limit, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import { useAuth } from '@/lib/features/auth/useAuth';
import type { Message } from '../../types';
import { COLLECTION_PATHS, PAGINATION_CONFIG } from '../../config';
import {
  setCurrentConversation,
  setMessages,
  setMessagesLoading,
  setError,
  toSerializableConversation,
  toSerializableMessage,
} from '../../store/supportMessagingSlice';
import type { AppDispatch } from '@/store/store';

interface UseConversationRealtimeProps {
  conversationId: string;
  onOldestMessageRef: (ref: QueryDocumentSnapshot<DocumentData> | null) => void;
  onHasMoreMessages: (hasMore: boolean) => void;
}

export function useConversationRealtime({
  conversationId,
  onOldestMessageRef,
  onHasMoreMessages,
}: UseConversationRealtimeProps) {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  // Use refs for callbacks to avoid effect re-runs
  const onOldestMessageRefRef = useRef(onOldestMessageRef);
  const onHasMoreMessagesRef = useRef(onHasMoreMessages);

  // Keep refs updated
  useEffect(() => {
    onOldestMessageRefRef.current = onOldestMessageRef;
    onHasMoreMessagesRef.current = onHasMoreMessages;
  }, [onOldestMessageRef, onHasMoreMessages]);

  // Extract stable user ID
  const userId = user?.uid;

  // Helper function to map Firestore document to Message
  const mapDocToMessage = useCallback((docSnapshot: QueryDocumentSnapshot<DocumentData>): Message => {
    const data = docSnapshot.data();
    return {
      id: docSnapshot.id,
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
      attachments: data.attachments ? data.attachments.map((a: { id: string; type: string; url: string; thumbnailUrl?: string; name: string; size: number; mimeType: string; uploadedAt: { toDate?: () => Date } | string }) => ({
        id: a.id,
        type: a.type,
        url: a.url,
        thumbnailUrl: a.thumbnailUrl,
        name: a.name,
        size: a.size,
        mimeType: a.mimeType,
        uploadedAt: typeof a.uploadedAt === 'object' && a.uploadedAt?.toDate
          ? a.uploadedAt.toDate()
          : new Date(a.uploadedAt as string),
      })) : undefined,
      editedAt: data.editedAt?.toDate?.() || (data.editedAt ? new Date(data.editedAt) : undefined),
      editHistory: data.editHistory,
      isPinned: data.isPinned,
      pinnedBy: data.pinnedBy,
      pinnedAt: data.pinnedAt?.toDate?.() || (data.pinnedAt ? new Date(data.pinnedAt) : undefined),
    };
  }, []);

  useEffect(() => {
    // Use userId for stable dependency instead of user object
    if (!conversationId || !userId || !clientDb) {
      dispatch(setCurrentConversation(null));
      dispatch(setMessagesLoading(false));
      return;
    }

    dispatch(setMessagesLoading(true));
    dispatch(setError(null));
    // Use refs to avoid triggering re-runs
    onHasMoreMessagesRef.current(true);
    onOldestMessageRefRef.current(null);

    const conversationRef = doc(clientDb, COLLECTION_PATHS.conversations, conversationId);
    const messagesRef = collection(clientDb, COLLECTION_PATHS.messages(conversationId));
    const messagesQuery = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      limit(PAGINATION_CONFIG.messagesInitialLoad)
    );

    // Listen to conversation document
    const unsubConversation = onSnapshot(
      conversationRef,
      (docSnapshot) => {
        if (!docSnapshot.exists()) {
          dispatch(setError('Conversation not found'));
          dispatch(setMessagesLoading(false));
          return;
        }

        const data = docSnapshot.data();
        const convData = {
          id: docSnapshot.id,
          userId: data.userId,
          userEmail: data.userEmail,
          userName: data.userName,
          adminId: data.adminId,
          status: data.status,
          priority: data.priority || 'normal',
          subject: data.subject,
          unreadByUser: data.unreadByUser || 0,
          unreadByAdmin: data.unreadByAdmin || 0,
          lastMessage: data.lastMessage
            ? {
                content: data.lastMessage.content,
                senderId: data.lastMessage.senderId,
                timestamp: data.lastMessage.timestamp?.toDate?.() || new Date(data.lastMessage.timestamp),
              }
            : null,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
          tags: data.tags || [],
          metrics: data.metrics,
          messages: [] as Message[],
        };

        dispatch(
          setCurrentConversation({
            ...toSerializableConversation(convData),
            messages: [],
          })
        );
      },
      (err) => {
        console.error('Error listening to conversation:', err);
        dispatch(setError('Failed to load conversation'));
      }
    );

    // Listen to messages subcollection
    const unsubMessages = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const msgs: Message[] = snapshot.docs.map(mapDocToMessage).reverse();

        if (snapshot.docs.length > 0) {
          // Use ref to avoid triggering re-runs
          onOldestMessageRefRef.current(snapshot.docs[snapshot.docs.length - 1]);
        }

        // Use ref to avoid triggering re-runs
        onHasMoreMessagesRef.current(snapshot.docs.length === PAGINATION_CONFIG.messagesInitialLoad);
        dispatch(setMessages(msgs.map(toSerializableMessage)));
        dispatch(setMessagesLoading(false));
      },
      (err) => {
        console.error('Error listening to messages:', err);
        dispatch(setError('Failed to load messages'));
        dispatch(setMessagesLoading(false));
      }
    );

    return () => {
      unsubConversation();
      unsubMessages();
    };
    // Only re-run when conversationId or userId changes, not on every render
  }, [conversationId, userId, dispatch, mapDocToMessage]);

  return { mapDocToMessage };
}
