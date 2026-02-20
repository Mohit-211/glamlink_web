'use client';

import { useState, useCallback, useEffect } from 'react';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import type { AuditLogEntry, CreateAuditLogInput } from '../types/auditLog';
import { createAuditLog, fetchAuditLogs } from '../utils/auditLog';

export interface UseAuditLogReturn {
  /** Audit log entries */
  entries: AuditLogEntry[];
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether there are more entries to load */
  hasMore: boolean;
  /** Load more entries */
  loadMore: () => Promise<void>;
  /** Whether more entries are being loaded */
  isLoadingMore: boolean;
  /** Refresh the audit log */
  refresh: () => Promise<void>;
  /** Log a new audit entry */
  logEntry: (input: Omit<CreateAuditLogInput, 'conversationId'>) => Promise<void>;
}

const PAGE_SIZE = 20;

/**
 * Hook for managing audit logs for a conversation
 */
export function useAuditLog(conversationId: string): UseAuditLogReturn {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  // Fetch initial entries
  const fetchInitial = useCallback(async () => {
    if (!conversationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuditLogs(conversationId, PAGE_SIZE);
      setEntries(result.entries);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError('Failed to load activity log');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  // Load initial entries
  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  // Load more entries
  const loadMore = useCallback(async () => {
    if (!conversationId || !hasMore || isLoadingMore || !lastDoc) return;

    setIsLoadingMore(true);

    try {
      const result = await fetchAuditLogs(conversationId, PAGE_SIZE, lastDoc);
      setEntries((prev) => [...prev, ...result.entries]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Error loading more audit logs:', err);
      setError('Failed to load more entries');
    } finally {
      setIsLoadingMore(false);
    }
  }, [conversationId, hasMore, isLoadingMore, lastDoc]);

  // Refresh the log
  const refresh = useCallback(async () => {
    setLastDoc(null);
    await fetchInitial();
  }, [fetchInitial]);

  // Log a new entry
  const logEntry = useCallback(
    async (input: Omit<CreateAuditLogInput, 'conversationId'>) => {
      if (!conversationId) return;

      try {
        await createAuditLog({
          ...input,
          conversationId,
        });
        // Refresh to show the new entry
        await refresh();
      } catch (err) {
        console.error('Error logging audit entry:', err);
      }
    },
    [conversationId, refresh]
  );

  return {
    entries,
    isLoading,
    error,
    hasMore,
    loadMore,
    isLoadingMore,
    refresh,
    logEntry,
  };
}
