'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { PendingMessage } from '../types';

export type ConnectionState = 'connected' | 'connecting' | 'reconnecting' | 'disconnected';

export interface UseConnectionStateReturn {
  connectionState: ConnectionState;
  isOnline: boolean;
  pendingMessages: PendingMessage[];
  queueMessage: (content: string) => string; // Returns the pending message ID
  removePendingMessage: (id: string) => void;
  flushQueue: () => Promise<PendingMessage[]>; // Returns messages to send
  clearQueue: () => void;
}

/**
 * Hook for tracking connection state and queuing messages when offline.
 *
 * Features:
 * - Tracks browser online/offline state
 * - Queues messages when offline
 * - Provides pending messages for display
 * - Auto-flushes queue when connection is restored
 */
export function useConnectionState(
  onFlush?: (messages: PendingMessage[]) => Promise<void>
): UseConnectionStateReturn {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    typeof window !== 'undefined' && navigator.onLine ? 'connected' : 'disconnected'
  );
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const onFlushRef = useRef(onFlush);

  // Keep callback ref updated
  useEffect(() => {
    onFlushRef.current = onFlush;
  }, [onFlush]);

  // Flush queue and call callback
  const flushQueue = useCallback(async (): Promise<PendingMessage[]> => {
    if (pendingMessages.length === 0) return [];

    const messagesToSend = [...pendingMessages];

    // Mark all as sending
    setPendingMessages((prev) =>
      prev.map((msg) => ({ ...msg, status: 'sending' as const }))
    );

    // Call the flush callback if provided
    if (onFlushRef.current) {
      try {
        await onFlushRef.current(messagesToSend);
        // Clear the queue on success
        setPendingMessages([]);
      } catch (error) {
        // Mark as failed if the callback throws
        setPendingMessages((prev) =>
          prev.map((msg) => ({ ...msg, status: 'failed' as const }))
        );
        console.error('Failed to flush pending messages:', error);
      }
    }

    return messagesToSend;
  }, [pendingMessages]);

  // Handle online/offline events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setConnectionState('reconnecting');

      // Attempt to flush queue after a short delay
      setTimeout(async () => {
        await flushQueue();
        setConnectionState('connected');
      }, 500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionState('disconnected');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flushQueue]);

  // Queue a message when offline
  const queueMessage = useCallback((content: string): string => {
    const id = `pending_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const pendingMessage: PendingMessage = {
      id,
      content,
      timestamp: new Date(),
      status: 'queued',
    };

    setPendingMessages((prev) => [...prev, pendingMessage]);
    return id;
  }, []);

  // Remove a pending message (e.g., after successful send or user cancellation)
  const removePendingMessage = useCallback((id: string) => {
    setPendingMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  // Clear all pending messages
  const clearQueue = useCallback(() => {
    setPendingMessages([]);
  }, []);

  return {
    connectionState,
    isOnline,
    pendingMessages,
    queueMessage,
    removePendingMessage,
    flushQueue,
    clearQueue,
  };
}
