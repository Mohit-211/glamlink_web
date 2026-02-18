'use client';

import { useState, useCallback, useEffect } from 'react';
import type { ChatSession, UseChatSessionReturn } from '../types';
import { STORAGE_KEYS } from '../config';

export function useChatSession(): UseChatSessionReturn {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing session on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem(STORAGE_KEYS.sessionId);
    if (savedSessionId) {
      loadSession(savedSessionId);
    }
  }, []);

  const createSession = useCallback(async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/support/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success && data.session) {
        setSession(data.session);
        localStorage.setItem(STORAGE_KEYS.sessionId, data.session.sessionId);
        return data.session.sessionId;
      } else {
        throw new Error(data.error || 'Failed to create session');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create session';
      setError(errorMessage);
      console.error('Error creating chat session:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSession = useCallback(async (sessionId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/support/sessions/${sessionId}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success && data.session) {
        // Convert timestamp strings to Date objects
        const sessionWithDates: ChatSession = {
          ...data.session,
          startedAt: new Date(data.session.startedAt),
          updatedAt: new Date(data.session.updatedAt),
          messages: data.session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        };
        setSession(sessionWithDates);
        localStorage.setItem(STORAGE_KEYS.sessionId, sessionId);
      } else {
        // Session not found, clear local storage
        localStorage.removeItem(STORAGE_KEYS.sessionId);
        setSession(null);
      }
    } catch (err) {
      console.error('Error loading chat session:', err);
      // Don't set error for missing sessions, just clear the saved ID
      localStorage.removeItem(STORAGE_KEYS.sessionId);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSession = useCallback(async (): Promise<void> => {
    const sessionId = session?.sessionId;
    if (!sessionId) {
      setSession(null);
      localStorage.removeItem(STORAGE_KEYS.sessionId);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await fetch(`/api/support/sessions/${sessionId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Error deleting chat session:', err);
    } finally {
      setSession(null);
      localStorage.removeItem(STORAGE_KEYS.sessionId);
      setIsLoading(false);
    }
  }, [session?.sessionId]);

  return {
    session,
    isLoading,
    error,
    createSession,
    loadSession,
    clearSession,
  };
}
