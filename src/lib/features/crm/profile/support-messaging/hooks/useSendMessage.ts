'use client';

import { useState, useCallback } from 'react';

interface UseSendMessageReturn {
  sendMessage: (conversationId: string, content: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useSendMessage(): UseSendMessageReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (conversationId: string, content: string): Promise<boolean> => {
    if (!conversationId || !content.trim()) return false;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/support/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: content.trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to send message');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      console.error('Error sending message:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sendMessage,
    isLoading,
    error,
  };
}
