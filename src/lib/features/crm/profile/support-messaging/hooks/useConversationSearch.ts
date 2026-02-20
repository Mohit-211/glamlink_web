'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Conversation } from '../types';

export interface UseConversationSearchReturn {
  /** Current search query */
  searchQuery: string;
  /** Update the search query */
  setSearchQuery: (query: string) => void;
  /** Filtered conversations based on search */
  filteredConversations: Conversation[];
  /** Whether a search is currently active */
  isSearching: boolean;
  /** Clear the search query */
  clearSearch: () => void;
  /** Whether there are any results */
  hasResults: boolean;
  /** The debounced query being applied */
  debouncedQuery: string;
}

/**
 * Hook for searching/filtering conversations client-side
 * Searches by: subject, lastMessage.content, userName, userEmail, tags
 */
export function useConversationSearch(conversations: Conversation[]): UseConversationSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter conversations based on debounced query
  const filteredConversations = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return conversations;
    }

    const query = debouncedQuery.toLowerCase().trim();
    const queryTerms = query.split(/\s+/).filter(term => term.length > 0);

    return conversations.filter((conversation) => {
      // Build searchable text from all relevant fields
      const searchableText = [
        conversation.subject,
        conversation.lastMessage?.content || '',
        conversation.userName,
        conversation.userEmail,
        ...(conversation.tags || []),
      ]
        .join(' ')
        .toLowerCase();

      // All query terms must match
      return queryTerms.every(term => searchableText.includes(term));
    });
  }, [conversations, debouncedQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const hasResults = filteredConversations.length > 0;

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filteredConversations,
    isSearching,
    clearSearch,
    hasResults,
    debouncedQuery,
  };
}

/**
 * Utility function to highlight matching text in a string
 * Returns an array of { text: string, isMatch: boolean } segments
 */
export function highlightMatches(
  text: string,
  query: string
): { text: string; isMatch: boolean }[] {
  if (!query.trim() || !text) {
    return [{ text, isMatch: false }];
  }

  const queryTerms = query.toLowerCase().trim().split(/\s+/).filter(term => term.length > 0);
  if (queryTerms.length === 0) {
    return [{ text, isMatch: false }];
  }

  // Create a pattern that matches any of the query terms
  const escapedTerms = queryTerms.map(term =>
    term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const pattern = new RegExp(`(${escapedTerms.join('|')})`, 'gi');

  const segments: { text: string; isMatch: boolean }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    // Add non-matching text before this match
    if (match.index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, match.index),
        isMatch: false,
      });
    }
    // Add matching text
    segments.push({
      text: match[0],
      isMatch: true,
    });
    lastIndex = pattern.lastIndex;
  }

  // Add remaining non-matching text
  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      isMatch: false,
    });
  }

  return segments.length > 0 ? segments : [{ text, isMatch: false }];
}
