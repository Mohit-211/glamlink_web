'use client';

import { useState, useCallback, useMemo } from 'react';
import { useConversations } from '../../hooks/useConversations';
import { useConversationSearch } from '../../hooks/useConversationSearch';
import { useContentSearch, type SearchMode } from '../../hooks/useContentSearch';
import type { ConversationStatus } from '../../types';

interface UseMessagesPageProps {
  isAdmin?: boolean;
}

export function useMessagesPage({ isAdmin = false }: UseMessagesPageProps) {
  const { conversations, isLoading, error, refetch, hasMore, loadMore, isLoadingMore } = useConversations();

  // Basic search for regular users
  const basicSearch = useConversationSearch(conversations);

  // Advanced content search for admins
  const contentSearch = useContentSearch();

  // Track whether admin is using content search mode
  const [useContentSearchMode, setUseContentSearchMode] = useState(false);

  // Determine which search to use based on admin status and mode
  const isUsingContentSearch = isAdmin && (contentSearch.searchMode === 'content' || contentSearch.searchMode === 'all');

  // Get the appropriate search values based on mode
  const searchQuery = isAdmin ? contentSearch.searchQuery : basicSearch.searchQuery;
  const setSearchQuery = isAdmin ? contentSearch.setSearchQuery : basicSearch.setSearchQuery;
  const isSearching = isAdmin
    ? contentSearch.isSearching
    : basicSearch.isSearching && basicSearch.searchQuery !== basicSearch.debouncedQuery;

  // For content search mode, use results from contentSearch; otherwise use filtered from basicSearch
  const filteredConversations = useMemo(() => {
    if (isAdmin && contentSearch.searchQuery.trim()) {
      // When admin has an active search query, use content search results
      return contentSearch.searchResults;
    }
    // Otherwise use basic client-side filtering
    return basicSearch.filteredConversations;
  }, [isAdmin, contentSearch.searchQuery, contentSearch.searchResults, basicSearch.filteredConversations]);

  const hasResults = filteredConversations.length > 0;
  const debouncedQuery = isAdmin ? contentSearch.searchQuery : basicSearch.debouncedQuery;

  const [showNewModal, setShowNewModal] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredConversations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredConversations.map((c) => c.id)));
    }
  }, [filteredConversations, selectedIds.size]);

  const handleBulkStatusUpdate = useCallback(async (status: ConversationStatus) => {
    if (selectedIds.size === 0) return;

    setBulkUpdating(true);
    try {
      const response = await fetch('/api/support/conversations/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          conversationIds: Array.from(selectedIds),
          updates: { status },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSelectedIds(new Set());
        setBulkMode(false);
        refetch();
      } else {
        console.error('Bulk update failed:', data.error);
      }
    } catch (err) {
      console.error('Bulk update error:', err);
    } finally {
      setBulkUpdating(false);
    }
  }, [selectedIds, refetch]);

  const handleExitBulkMode = useCallback(() => {
    setBulkMode(false);
    setSelectedIds(new Set());
  }, []);

  const handleCreateConversation = async (subject: string, message: string) => {
    const response = await fetch('/api/support/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ subject, initialMessage: message }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to create conversation');
    }
  };

  return {
    // Data
    conversations,
    filteredConversations,
    isLoading,
    error,
    hasMore,
    isLoadingMore,

    // Search
    searchQuery,
    setSearchQuery,
    isSearching,
    hasResults,
    debouncedQuery,

    // Content search (admin only)
    searchMode: contentSearch.searchMode,
    setSearchMode: contentSearch.setSearchMode,
    searchError: contentSearch.searchError,
    isContentSearchActive: contentSearch.isContentSearchActive,

    // Modals
    showNewModal,
    setShowNewModal,

    // Bulk mode
    bulkMode,
    setBulkMode,
    selectedIds,
    bulkUpdating,

    // Handlers
    handleToggleSelect,
    handleSelectAll,
    handleBulkStatusUpdate,
    handleExitBulkMode,
    handleCreateConversation,
    loadMore,
  };
}
