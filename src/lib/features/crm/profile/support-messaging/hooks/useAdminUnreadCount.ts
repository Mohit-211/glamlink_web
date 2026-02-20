'use client';

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { collection, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import { useAuth } from '@/lib/features/auth/useAuth';
import type { UseAdminUnreadCountReturn } from '../types';
import { COLLECTION_PATHS, isAdminEmail } from '../config';
import {
  setAdminUnreadCount,
  setLoading,
  setError,
} from '../store/supportMessagingSlice';
import { selectAdminUnreadCount, selectSupportMessaging } from '@/lib/features/store/hooks';
import { AppDispatch } from 'store/store';

export function useAdminUnreadCount(): UseAdminUnreadCountReturn {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  // Extract stable user values to avoid callback recreation on user object changes
  const userId = user?.uid;
  const userEmail = user?.email;

  // Select from Redux state
  const count = useSelector(selectAdminUnreadCount);
  const { isLoading, error } = useSelector(selectSupportMessaging);

  const refetch = useCallback(async () => {
    if (!userId || !userEmail || !clientDb || !isAdminEmail(userEmail)) {
      dispatch(setAdminUnreadCount(0));
      dispatch(setLoading(false));
      return;
    }

    try {
      const conversationsCollection = collection(clientDb, COLLECTION_PATHS.conversations);
      const q = query(conversationsCollection, where('unreadByAdmin', '>', 0));
      const snapshot = await getDocs(q);

      let totalUnread = 0;
      snapshot.docs.forEach((doc) => {
        totalUnread += doc.data().unreadByAdmin || 0;
      });

      dispatch(setAdminUnreadCount(totalUnread));
    } catch (err) {
      console.error('Error fetching unread count:', err);
      dispatch(setError('Failed to fetch unread count'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [userId, userEmail, dispatch]);

  useEffect(() => {
    if (!userId || !userEmail || !clientDb || !isAdminEmail(userEmail)) {
      dispatch(setAdminUnreadCount(0));
      dispatch(setLoading(false));
      return;
    }

    dispatch(setLoading(true));

    // Listen for real-time updates to unread count
    const conversationsCollection = collection(clientDb, COLLECTION_PATHS.conversations);
    const q = query(conversationsCollection, where('unreadByAdmin', '>', 0));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let totalUnread = 0;
        snapshot.docs.forEach((doc) => {
          totalUnread += doc.data().unreadByAdmin || 0;
        });
        dispatch(setAdminUnreadCount(totalUnread));
        dispatch(setLoading(false));
      },
      (err) => {
        console.error('Error listening to unread count:', err);
        dispatch(setError('Failed to load unread count'));
        dispatch(setLoading(false));
      }
    );

    return () => unsubscribe();
  }, [userId, userEmail, dispatch]);

  return {
    count,
    isLoading,
    error,
    refetch,
  };
}
