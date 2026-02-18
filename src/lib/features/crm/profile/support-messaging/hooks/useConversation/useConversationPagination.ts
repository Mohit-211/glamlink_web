'use client';

import { useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { collection, query, orderBy, startAfter, limit, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import type { Message, ConversationWithMessages } from '../../types';
import { COLLECTION_PATHS, PAGINATION_CONFIG } from '../../config';
import { setMessages, toSerializableMessage } from '../../store/supportMessagingSlice';
import type { AppDispatch } from '@/store/store';

interface UseConversationPaginationProps {
  conversationId: string;
  conversation: ConversationWithMessages | null;
  mapDocToMessage: (doc: QueryDocumentSnapshot<DocumentData>) => Message;
}

export function useConversationPagination({
  conversationId,
  conversation,
  mapDocToMessage,
}: UseConversationPaginationProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const oldestMessageRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

  const setOldestMessageRef = useCallback((ref: QueryDocumentSnapshot<DocumentData> | null) => {
    oldestMessageRef.current = ref;
  }, []);

  const setHasMore = useCallback((hasMore: boolean) => {
    setHasMoreMessages(hasMore);
  }, []);

  const loadMoreMessages = useCallback(async (): Promise<void> => {
    if (!oldestMessageRef.current || !hasMoreMessages || isLoadingMore || !clientDb) return;

    setIsLoadingMore(true);

    try {
      const messagesRef = collection(clientDb, COLLECTION_PATHS.messages(conversationId));
      const moreQuery = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        startAfter(oldestMessageRef.current),
        limit(PAGINATION_CONFIG.messagesPerPage)
      );

      const snapshot = await getDocs(moreQuery);
      const olderMessages: Message[] = snapshot.docs.map(mapDocToMessage).reverse();

      if (snapshot.docs.length > 0) {
        oldestMessageRef.current = snapshot.docs[snapshot.docs.length - 1];
      }

      setHasMoreMessages(snapshot.docs.length === PAGINATION_CONFIG.messagesPerPage);

      if (olderMessages.length > 0 && conversation?.messages) {
        const allMessages = [...olderMessages, ...conversation.messages];
        dispatch(setMessages(allMessages.map(toSerializableMessage)));
      }
    } catch (err) {
      console.error('Error loading more messages:', err);
      setLocalError('Failed to load more messages');
    } finally {
      setIsLoadingMore(false);
    }
  }, [conversationId, hasMoreMessages, isLoadingMore, conversation?.messages, dispatch, mapDocToMessage]);

  return {
    hasMoreMessages,
    isLoadingMore,
    loadMoreMessages,
    setOldestMessageRef,
    setHasMore,
    paginationError: localError,
  };
}
