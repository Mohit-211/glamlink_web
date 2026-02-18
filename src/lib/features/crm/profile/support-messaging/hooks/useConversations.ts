'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import { useAuth } from '@/lib/features/auth/useAuth';
import type { Conversation, UseConversationsReturn } from '../types';
import { COLLECTION_PATHS, isAdminEmail, PAGINATION_CONFIG } from '../config';
import {
  setConversations,
  setConversationsLoading,
  setError,
  toSerializableConversation,
  fromSerializableConversation,
} from '../store/supportMessagingSlice';
import { selectConversations, selectSupportMessaging } from '@/lib/features/store/hooks';
import type { AppDispatch } from '@/store/store';

export function useConversations(): UseConversationsReturn {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  // Extract stable user values to avoid callback recreation on user object changes
  const userId = user?.uid;
  const userEmail = user?.email;

  // Select from Redux state
  const serializedConversations = useSelector(selectConversations);
  const { conversationsLoading: isLoading, error } = useSelector(selectSupportMessaging);

  // Pagination state
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

  // Convert serialized conversations back to Conversation with Date objects
  const conversations: Conversation[] = serializedConversations.map(fromSerializableConversation);

  const refetch = useCallback(async () => {
    // For real-time updates, we don't need manual refetch
    // but we expose it for API consistency
    dispatch(setConversationsLoading(true));
    dispatch(setError(null));
    setHasMore(true);
    lastDocRef.current = null;
  }, [dispatch]);

  // Helper function to map document to Conversation
  const mapDocToConversation = useCallback((doc: QueryDocumentSnapshot<DocumentData>): Conversation => {
    const data = doc.data();
    return {
      id: doc.id,
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
    };
  }, []);

  useEffect(() => {
    if (!userId || !userEmail || !clientDb) {
      dispatch(setConversations([]));
      dispatch(setConversationsLoading(false));
      return;
    }

    dispatch(setConversationsLoading(true));
    dispatch(setError(null));

    const conversationsCollection = collection(clientDb, COLLECTION_PATHS.conversations);

    // Build query based on user type with pagination limit
    const isAdmin = isAdminEmail(userEmail);
    const q = isAdmin
      ? query(
          conversationsCollection,
          orderBy('updatedAt', 'desc'),
          limit(PAGINATION_CONFIG.conversationsPerPage)
        )
      : query(
          conversationsCollection,
          where('userId', '==', userId),
          orderBy('updatedAt', 'desc'),
          limit(PAGINATION_CONFIG.conversationsPerPage)
        );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const convos: Conversation[] = snapshot.docs.map(mapDocToConversation);

        // Track the last document for pagination
        if (snapshot.docs.length > 0) {
          lastDocRef.current = snapshot.docs[snapshot.docs.length - 1];
        }

        // Check if there are more results
        setHasMore(snapshot.docs.length === PAGINATION_CONFIG.conversationsPerPage);

        // Dispatch to Redux
        dispatch(setConversations(convos.map(toSerializableConversation)));
      },
      (err) => {
        console.error('Error listening to conversations:', err);
        dispatch(setError('Failed to load conversations'));
        dispatch(setConversationsLoading(false));
      }
    );

    return () => unsubscribe();
  }, [userId, userEmail, dispatch, mapDocToConversation]);

  // Load more conversations
  const loadMore = useCallback(async () => {
    if (!lastDocRef.current || !hasMore || isLoadingMore || !userId || !userEmail || !clientDb) return;

    setIsLoadingMore(true);

    try {
      const conversationsCollection = collection(clientDb, COLLECTION_PATHS.conversations);
      const isAdmin = isAdminEmail(userEmail);

      const moreQuery = isAdmin
        ? query(
            conversationsCollection,
            orderBy('updatedAt', 'desc'),
            startAfter(lastDocRef.current),
            limit(PAGINATION_CONFIG.conversationsPerPage)
          )
        : query(
            conversationsCollection,
            where('userId', '==', userId),
            orderBy('updatedAt', 'desc'),
            startAfter(lastDocRef.current),
            limit(PAGINATION_CONFIG.conversationsPerPage)
          );

      const snapshot = await getDocs(moreQuery);
      const moreConvos: Conversation[] = snapshot.docs.map(mapDocToConversation);

      if (snapshot.docs.length > 0) {
        lastDocRef.current = snapshot.docs[snapshot.docs.length - 1];
      }

      setHasMore(snapshot.docs.length === PAGINATION_CONFIG.conversationsPerPage);

      // Append to existing conversations in Redux
      const existingConvos = serializedConversations.map(fromSerializableConversation);
      const allConvos = [...existingConvos, ...moreConvos];
      dispatch(setConversations(allConvos.map(toSerializableConversation)));
    } catch (err) {
      console.error('Error loading more conversations:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, userId, userEmail, serializedConversations, dispatch, mapDocToConversation]);

  return {
    conversations,
    isLoading,
    error,
    refetch,
    hasMore,
    loadMore,
    isLoadingMore,
  };
}
