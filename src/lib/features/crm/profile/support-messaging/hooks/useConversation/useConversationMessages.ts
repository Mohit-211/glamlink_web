'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/features/auth/useAuth';
import type { Message, Attachment } from '../../types';
import { sanitizeMessageContent } from '../../utils/sanitize';
import { sendMessageBatch as sendMessageBatchUtil, type BatchMessageInput } from '../../utils/messageBatch';
import { getCsrfHeaders } from '@/lib/shared/utils/security/csrf';

/**
 * Sleep for a given number of milliseconds
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay with jitter
 * @param attempt - Current retry attempt (0-indexed)
 * @param baseDelay - Base delay in milliseconds (default: 1000ms)
 * @param maxDelay - Maximum delay cap (default: 30000ms)
 * @returns Delay in milliseconds with jitter
 */
const getBackoffDelay = (attempt: number, baseDelay = 1000, maxDelay = 30000): number => {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Add jitter (±20%) to prevent thundering herd
  const jitter = delay * 0.2 * (Math.random() - 0.5);
  return Math.round(delay + jitter);
};

interface UseConversationMessagesProps {
  conversationId: string;
}

interface UseConversationMessagesReturn {
  optimisticMessages: Message[];
  sendMessage: (content: string, attachments?: Attachment[], messageId?: string) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  sendMessageBatch: (contents: string[]) => Promise<void>;
  localError: string | null;
  clearOptimisticByContent: (confirmedContents: Set<string>) => void;
}

export function useConversationMessages({
  conversationId,
}: UseConversationMessagesProps): UseConversationMessagesReturn {
  const { user } = useAuth();
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  // Extract stable user values to avoid callback recreation on user object changes
  const userId = user?.uid;
  const userEmail = user?.email;
  const userDisplayName = user?.displayName;

  const sendMessage = useCallback(async (content: string, attachments?: Attachment[], messageId?: string, maxRetries = 3): Promise<void> => {
    const sanitized = sanitizeMessageContent(content);
    if (!conversationId || !userId || !sanitized) return;

    const isRetry = !!messageId;
    const tempId = messageId || `temp_${Date.now()}`;

    if (isRetry) {
      setOptimisticMessages(prev =>
        prev.map(m => m.id === messageId ? { ...m, status: 'sending' as const } : m)
      );
    } else {
      const optimisticMessage: Message = {
        id: tempId,
        senderId: userId,
        senderEmail: userEmail || '',
        senderName: userDisplayName || userEmail?.split('@')[0] || 'User',
        content: sanitized,
        timestamp: new Date(),
        status: 'sending',
        attachments: attachments,
      };
      setOptimisticMessages(prev => [...prev, optimisticMessage]);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(`/api/support/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getCsrfHeaders(),
          },
          credentials: 'include',
          body: JSON.stringify({
            content: sanitized,
            attachments: attachments?.map(a => ({
              id: a.id,
              type: a.type,
              url: a.url,
              thumbnailUrl: a.thumbnailUrl,
              name: a.name,
              size: a.size,
              mimeType: a.mimeType,
              uploadedAt: a.uploadedAt instanceof Date ? a.uploadedAt.toISOString() : a.uploadedAt,
            })),
          }),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to send message');
        }

        // Success - clear the optimistic message immediately
        // (Don't wait for the realtime listener, as that can cause duplicate display)
        setOptimisticMessages(prev => prev.filter(m => m.id !== tempId));
        return;
      } catch (err) {
        lastError = err as Error;

        if (attempt < maxRetries) {
          const delay = getBackoffDelay(attempt);
          console.log(`Message send failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
          await sleep(delay);
        }
      }
    }

    // All retries failed - mark message as failed
    console.error('Message send failed after retries:', lastError);
    setLocalError(lastError?.message || 'Failed to send message');
    setOptimisticMessages(prev =>
      prev.map(m => m.id === tempId ? { ...m, status: 'failed' as const } : m)
    );
    throw lastError;
  }, [conversationId, userId, userEmail, userDisplayName]);

  const retryMessage = useCallback(async (messageId: string): Promise<void> => {
    const message = optimisticMessages.find(m => m.id === messageId && m.status === 'failed');
    if (!message) return;
    await sendMessage(message.content, message.attachments, messageId);
  }, [optimisticMessages, sendMessage]);

  const sendMessageBatch = useCallback(async (contents: string[]): Promise<void> => {
    if (!userId || contents.length === 0) return;

    const messages: BatchMessageInput[] = contents
      .map((content) => sanitizeMessageContent(content))
      .filter((content): content is string => !!content)
      .map((content) => ({
        content,
        senderId: userId,
        senderEmail: userEmail || '',
        senderName: userDisplayName || userEmail?.split('@')[0] || 'User',
      }));

    if (messages.length === 0) return;

    const result = await sendMessageBatchUtil(conversationId, messages);

    if (!result.success) {
      setLocalError(result.error || 'Failed to send messages');
      throw new Error(result.error);
    }
  }, [conversationId, userId, userEmail, userDisplayName]);

  const clearOptimisticByContent = useCallback((confirmedContents: Set<string>) => {
    setOptimisticMessages(prev =>
      prev.filter(msg => !confirmedContents.has(msg.content))
    );
  }, []);

  return {
    optimisticMessages,
    sendMessage,
    retryMessage,
    sendMessageBatch,
    localError,
    clearOptimisticByContent,
  };
}
