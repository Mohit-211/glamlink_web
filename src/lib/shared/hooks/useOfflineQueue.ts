'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type ConnectionState = 'connected' | 'connecting' | 'reconnecting' | 'disconnected';

export interface QueueItem<T> {
  id: string;
  data: T;
  timestamp: Date;
  status: 'queued' | 'sending' | 'failed';
}

export interface OfflineQueueConfig<T> {
  /** Callback to flush queued items when online */
  onFlush: (items: QueueItem<T>[]) => Promise<void>;
  /** Optional localStorage key for persistence */
  storageKey?: string;
}

export interface UseOfflineQueueReturn<T> {
  /** Current connection state */
  connectionState: ConnectionState;
  /** Whether the browser is online */
  isOnline: boolean;
  /** Currently queued items */
  pending: QueueItem<T>[];
  /** Queue a new item (returns the item ID) */
  queue: (data: T) => string;
  /** Remove an item from the queue */
  remove: (id: string) => void;
  /** Manually flush the queue */
  flush: () => Promise<void>;
  /** Clear all items from the queue */
  clear: () => void;
}

/**
 * Generate a unique ID for queue items.
 */
function generateId(): string {
  return `queue_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Hook for managing offline action queuing.
 *
 * Features:
 * - Tracks browser online/offline state
 * - Queues items when offline
 * - Auto-flushes queue when connection is restored
 * - Optional localStorage persistence
 *
 * @example
 * ```tsx
 * function MessageSender() {
 *   const { isOnline, queue, pending, connectionState } = useOfflineQueue({
 *     onFlush: async (items) => {
 *       for (const item of items) {
 *         await sendMessage(item.data);
 *       }
 *     },
 *   });
 *
 *   const handleSend = (content: string) => {
 *     if (!isOnline) {
 *       queue({ content });
 *       return;
 *     }
 *     sendMessage({ content });
 *   };
 *
 *   return (
 *     <div>
 *       {connectionState !== 'connected' && <span>Offline ({pending.length} queued)</span>}
 *       <button onClick={() => handleSend('Hello')}>Send</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useOfflineQueue<T>({
  onFlush,
  storageKey,
}: OfflineQueueConfig<T>): UseOfflineQueueReturn<T> {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    typeof window !== 'undefined' && navigator.onLine ? 'connected' : 'disconnected'
  );
  const [pending, setPending] = useState<QueueItem<T>[]>([]);
  const onFlushRef = useRef(onFlush);

  // Keep callback ref updated
  useEffect(() => {
    onFlushRef.current = onFlush;
  }, [onFlush]);

  // Load from storage on mount
  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const items = JSON.parse(stored) as QueueItem<T>[];
        // Restore timestamps as Date objects
        const restored = items.map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setPending(restored);
      }
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  // Save to storage when pending changes
  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return;

    try {
      if (pending.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(pending));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {
      // Ignore storage errors
    }
  }, [pending, storageKey]);

  // Flush queue and call callback
  const flush = useCallback(async (): Promise<void> => {
    if (pending.length === 0) return;

    const itemsToSend = [...pending];

    // Mark all as sending
    setPending((prev) =>
      prev.map((item) => ({ ...item, status: 'sending' as const }))
    );

    // Call the flush callback if provided
    try {
      await onFlushRef.current(itemsToSend);
      // Clear the queue on success
      setPending([]);
    } catch (error) {
      // Mark as failed if the callback throws
      setPending((prev) =>
        prev.map((item) => ({ ...item, status: 'failed' as const }))
      );
      console.error('Failed to flush offline queue:', error);
    }
  }, [pending]);

  // Handle online/offline events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setConnectionState('reconnecting');

      // Attempt to flush queue after a short delay
      setTimeout(async () => {
        await flush();
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
  }, [flush]);

  // Queue a new item
  const queue = useCallback((data: T): string => {
    const id = generateId();
    const item: QueueItem<T> = {
      id,
      data,
      timestamp: new Date(),
      status: 'queued',
    };

    setPending((prev) => [...prev, item]);
    return id;
  }, []);

  // Remove an item from the queue
  const remove = useCallback((id: string) => {
    setPending((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Clear all items
  const clear = useCallback(() => {
    setPending([]);
  }, []);

  return {
    connectionState,
    isOnline,
    pending,
    queue,
    remove,
    flush,
    clear,
  };
}
