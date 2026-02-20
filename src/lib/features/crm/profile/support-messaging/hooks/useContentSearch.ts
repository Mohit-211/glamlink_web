'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import { COLLECTION_PATHS, PAGINATION_CONFIG } from '../config';
import type { Conversation } from '../types';

export type SearchMode = 'subject' | 'content' | 'all';

interface UseContentSearchReturn {
  /** Current search mode */
  searchMode: SearchMode;
  /** Update the search mode */
  setSearchMode: (mode: SearchMode) => void;
  /** Current search query */
  searchQuery: string;
  /** Update the search query */
  setSearchQuery: (query: string) => void;
  /** Search results - conversations matching the query */
  searchResults: Conversation[];
  /** Whether a search is in progress */
  isSearching: boolean;
  /** Error message if search failed */
  searchError: string | null;
  /** Clear the search state */
  clearSearch: () => void;
  /** Whether content search mode is active (requires server query) */
  isContentSearchActive: boolean;
}

/**
 * Hook for searching conversations by subject or message content.
 *
 * - 'subject' mode: Client-side filtering by subject (fast, uses existing data)
 * - 'content' mode: Server-side search through all messages (slower, comprehensive)
 * - 'all' mode: Searches both subject and message content
 *
 * @example
 * ```tsx
 * const {
 *   searchMode,
 *   setSearchMode,
 *   searchQuery,
 *   setSearchQuery,
 *   searchResults,
 *   isSearching,
 * } = useContentSearch();
 * ```
 */
export function useContentSearch(): UseContentSearchReturn {
  const [searchMode, setSearchMode] = useState<SearchMode>('subject');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Conversation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Content search requires querying messages, which is more expensive
  const isContentSearchActive = searchMode === 'content' || searchMode === 'all';

  // Debounced search
  useEffect(() => {
    // Clear previous debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Abort any in-flight search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear results if query is empty
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    // Longer debounce for content search since it's more expensive
    const debounceMs = isContentSearchActive ? 500 : 300;

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      // Create new abort controller for this search
      abortControllerRef.current = new AbortController();

      try {
        const results = await performSearch(
          searchQuery,
          searchMode,
          abortControllerRef.current.signal
        );
        setSearchResults(results);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Search was cancelled, don't update state
          return;
        }
        console.error('Search error:', error);
        setSearchError('Search failed. Please try again.');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, searchMode, isContentSearchActive]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // When search mode changes, re-run search if there's a query
  const handleModeChange = useCallback((mode: SearchMode) => {
    setSearchMode(mode);
    // Search will re-run automatically due to dependency on searchMode
  }, []);

  return {
    searchMode,
    setSearchMode: handleModeChange,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    clearSearch,
    isContentSearchActive,
  };
}

/**
 * Perform the search based on mode
 */
async function performSearch(
  queryText: string,
  mode: SearchMode,
  signal: AbortSignal
): Promise<Conversation[]> {
  if (!clientDb) return [];

  const normalizedQuery = queryText.toLowerCase().trim();
  const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0);

  if (queryTerms.length === 0) return [];

  const results: Conversation[] = [];
  const seenIds = new Set<string>();

  // Fetch conversations
  const conversationsRef = collection(clientDb, COLLECTION_PATHS.conversations);
  const conversationsQuery = query(
    conversationsRef,
    orderBy('updatedAt', 'desc'),
    limit(100) // Limit for performance
  );

  const snapshot = await getDocs(conversationsQuery);

  // Check if search was aborted
  if (signal.aborted) {
    throw new DOMException('Search aborted', 'AbortError');
  }

  // Process conversations
  for (const doc of snapshot.docs) {
    if (signal.aborted) {
      throw new DOMException('Search aborted', 'AbortError');
    }

    const data = doc.data();
    const conversation = {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
      lastMessage: data.lastMessage ? {
        ...data.lastMessage,
        timestamp: data.lastMessage.timestamp?.toDate?.() || new Date(data.lastMessage.timestamp),
      } : null,
    } as Conversation;

    let matches = false;

    // Subject search
    if (mode === 'subject' || mode === 'all') {
      const subjectText = (conversation.subject || '').toLowerCase();
      const userText = `${conversation.userName || ''} ${conversation.userEmail || ''}`.toLowerCase();
      const tagText = (conversation.tags || []).join(' ').toLowerCase();
      const searchableText = `${subjectText} ${userText} ${tagText}`;

      if (queryTerms.every(term => searchableText.includes(term))) {
        matches = true;
      }
    }

    // Content search (searches all messages in the conversation)
    if (!matches && (mode === 'content' || mode === 'all')) {
      const messagesRef = collection(
        clientDb,
        COLLECTION_PATHS.messages(doc.id)
      );
      const messagesQuery = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        limit(PAGINATION_CONFIG.messagesPerPage)
      );

      const messagesSnapshot = await getDocs(messagesQuery);

      if (signal.aborted) {
        throw new DOMException('Search aborted', 'AbortError');
      }

      // Check if any message content matches
      const hasMatchingMessage = messagesSnapshot.docs.some((msgDoc) => {
        const content = (msgDoc.data().content || '').toLowerCase();
        return queryTerms.every(term => content.includes(term));
      });

      if (hasMatchingMessage) {
        matches = true;
      }
    }

    if (matches && !seenIds.has(doc.id)) {
      seenIds.add(doc.id);
      results.push(conversation);
    }
  }

  // Sort by updatedAt (most recent first)
  results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return results;
}
