'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { ChatMessage, UseSupportChatReturn } from '../types';
import { STORAGE_KEYS, FALLBACK_RESPONSES } from '../config';
import {
  setSession,
  setMessages,
  addMessage,
  clearChat as clearChatAction,
  setLoading,
  setError,
  initializeSession,
  toSerializableMessage,
  fromSerializableMessage,
} from '../store/supportBotSlice';
import {
  selectSupportBotMessages,
  selectSupportBotSessionId,
  selectSupportBotIsLoading,
  selectSupportBotError,
} from '@/lib/features/store/hooks';
import type { AppDispatch } from '@/store/store';

export function useSupportChat(): UseSupportChatReturn {
  const dispatch = useDispatch<AppDispatch>();

  // Select from Redux state
  const serializedMessages = useSelector(selectSupportBotMessages);
  const sessionId = useSelector(selectSupportBotSessionId);
  const isLoading = useSelector(selectSupportBotIsLoading);
  const error = useSelector(selectSupportBotError);

  const initializingRef = useRef(false);

  // Convert serialized messages back to ChatMessage with Date objects
  const messages: ChatMessage[] = serializedMessages.map(fromSerializableMessage);

  // Initialize session on mount
  useEffect(() => {
    const initializeSessionAsync = async () => {
      if (initializingRef.current) return;
      initializingRef.current = true;

      // Check for existing session
      const savedSessionId = localStorage.getItem(STORAGE_KEYS.sessionId);

      if (savedSessionId) {
        // Try to load existing session
        try {
          const response = await fetch(`/api/support/sessions/${savedSessionId}`, {
            method: 'GET',
            credentials: 'include',
          });
          const data = await response.json();

          if (data.success && data.session) {
            const loadedMessages = data.session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }));

            dispatch(
              initializeSession({
                sessionId: savedSessionId,
                messages: loadedMessages.map(toSerializableMessage),
              })
            );
            return;
          }
        } catch (err) {
          console.error('Error loading existing session:', err);
        }
      }

      // Create new session
      try {
        const response = await fetch('/api/support/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const data = await response.json();

        if (data.success && data.session) {
          localStorage.setItem(STORAGE_KEYS.sessionId, data.session.sessionId);

          // Add greeting message
          const greetingMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: FALLBACK_RESPONSES.greeting,
            timestamp: new Date(),
          };

          dispatch(
            initializeSession({
              sessionId: data.session.sessionId,
              messages: [toSerializableMessage(greetingMessage)],
            })
          );
        }
      } catch (err) {
        console.error('Error creating session:', err);
      }
    };

    initializeSessionAsync();
  }, [dispatch]);

  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!content.trim() || !sessionId) return;

      dispatch(setLoading(true));
      dispatch(setError(null));

      // Add user message immediately for better UX
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      dispatch(addMessage(toSerializableMessage(userMessage)));

      try {
        const response = await fetch('/api/support/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            sessionId,
            message: content.trim(),
          }),
        });

        const data = await response.json();

        if (data.success && data.message) {
          const assistantMessage: ChatMessage = {
            id: data.message.id || crypto.randomUUID(),
            role: 'assistant',
            content: data.message.content,
            timestamp: new Date(data.message.timestamp || Date.now()),
          };
          dispatch(addMessage(toSerializableMessage(assistantMessage)));
        } else {
          // Add fallback error message
          const errorMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: data.error || FALLBACK_RESPONSES.error,
            timestamp: new Date(),
          };
          dispatch(addMessage(toSerializableMessage(errorMessage)));
          dispatch(setError(data.error || 'Failed to get response'));
        }
      } catch (err) {
        console.error('Error sending message:', err);
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: FALLBACK_RESPONSES.error,
          timestamp: new Date(),
        };
        dispatch(addMessage(toSerializableMessage(errorMessage)));
        dispatch(setError(err instanceof Error ? err.message : 'Failed to send message'));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [sessionId, dispatch]
  );

  const clearChat = useCallback(() => {
    if (sessionId) {
      // Delete session from server
      fetch(`/api/support/sessions/${sessionId}`, {
        method: 'DELETE',
        credentials: 'include',
      }).catch(console.error);
    }

    // Clear local storage
    localStorage.removeItem(STORAGE_KEYS.sessionId);

    // Clear Redux state
    dispatch(clearChatAction());

    // Re-initialize
    initializingRef.current = false;
    fetch('/api/support/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.session) {
          localStorage.setItem(STORAGE_KEYS.sessionId, data.session.sessionId);

          const greetingMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: FALLBACK_RESPONSES.greeting,
            timestamp: new Date(),
          };

          dispatch(
            initializeSession({
              sessionId: data.session.sessionId,
              messages: [toSerializableMessage(greetingMessage)],
            })
          );
        }
      })
      .catch(console.error);
  }, [sessionId, dispatch]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    sessionId,
  };
}
