'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, setDoc, onSnapshot, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import { useAuth } from '@/lib/features/auth/useAuth';
import type { TypingIndicator, UseTypingIndicatorReturn } from '../types';
import { TYPING_CONFIG } from '../config';

export function useTypingIndicator(conversationId: string): UseTypingIndicatorReturn {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const writeDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingState = useRef<boolean>(false);

  // Extract stable user ID to avoid effect re-runs on user object changes
  const userId = user?.uid;

  // Listen to typing indicators for this conversation
  useEffect(() => {
    if (!conversationId || !clientDb || !userId) {
      setTypingUsers([]);
      return;
    }

    // Listen to the typing indicator document for the other party
    // We store typing status in a subcollection: support_conversations/{id}/typing/{oderId}
    const typingRef = doc(clientDb, `support_conversations/${conversationId}/typing`, 'current');

    const unsubscribe = onSnapshot(
      typingRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          // Only show typing indicator for other users, not yourself
          if (data.userId !== userId && data.isTyping) {
            // Check if typing status is still fresh (within timeout)
            const updatedAt = data.updatedAt?.toDate?.() || new Date(data.updatedAt);
            const now = new Date();
            const ageMs = now.getTime() - updatedAt.getTime();

            if (ageMs < TYPING_CONFIG.timeoutMs * 2) {
              setTypingUsers([{
                conversationId,
                userId: data.userId,
                userName: data.userName,
                isTyping: data.isTyping,
                updatedAt,
              }]);
            } else {
              setTypingUsers([]);
            }
          } else {
            setTypingUsers([]);
          }
        } else {
          setTypingUsers([]);
        }
      },
      (error) => {
        console.error('Error listening to typing indicator:', error);
        setTypingUsers([]);
      }
    );

    return () => unsubscribe();
  }, [conversationId, userId]);

  // Store user info in ref to avoid dependency on user object
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Set typing status with debouncing
  const setTyping = useCallback(
    async (isTyping: boolean) => {
      const currentUser = userRef.current;
      if (!conversationId || !clientDb || !currentUser) return;

      // Don't update if state hasn't changed
      if (lastTypingState.current === isTyping) return;
      lastTypingState.current = isTyping;

      // Clear any existing timeouts
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (writeDebounceRef.current) {
        clearTimeout(writeDebounceRef.current);
        writeDebounceRef.current = null;
      }

      const typingRef = doc(clientDb, `support_conversations/${conversationId}/typing`, 'current');

      try {
        if (isTyping) {
          // Write immediately when starting to type
          await setDoc(typingRef, {
            userId: currentUser.uid,
            userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            isTyping: true,
            updatedAt: serverTimestamp(),
          });

          // Auto-clear typing status after timeout
          typingTimeoutRef.current = setTimeout(() => {
            lastTypingState.current = false;
            deleteDoc(typingRef).catch(console.error);
          }, TYPING_CONFIG.timeoutMs);
        } else {
          // Debounce the "stopped typing" write to reduce Firestore writes
          writeDebounceRef.current = setTimeout(async () => {
            try {
              await deleteDoc(typingRef);
            } catch (error) {
              console.error('Error clearing typing indicator:', error);
            }
          }, TYPING_CONFIG.debounceMs);
        }
      } catch (error) {
        console.error('Error updating typing indicator:', error);
      }
    },
    [conversationId]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (writeDebounceRef.current) {
        clearTimeout(writeDebounceRef.current);
      }
      // Clear typing status when leaving the conversation
      if (conversationId && clientDb && userId) {
        const typingRef = doc(clientDb, `support_conversations/${conversationId}/typing`, 'current');
        deleteDoc(typingRef).catch(() => {});
      }
    };
  }, [conversationId, userId]);

  return {
    typingUsers,
    setTyping,
  };
}
