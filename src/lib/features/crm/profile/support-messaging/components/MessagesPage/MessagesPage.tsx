'use client';

import { useState } from 'react';
import { NewConversationModal } from '../NewConversationModal';
import { TemplateManager } from '../TemplateManager';
import { LoadingSpinner } from '@/lib/shared/components';
import { SearchInput } from '../SearchInput';
import { ContentSearchInput } from '../ContentSearchInput';
import { MESSAGES, STATUS_OPTIONS } from '../../config';
import { useMessagesPage } from './useMessagesPage';
import { ConversationItem } from './ConversationItem';

interface MessagesPageProps {
  isAdmin?: boolean;
}

export function MessagesPage({ isAdmin = false }: MessagesPageProps) {
  const {
    conversations,
    filteredConversations,
    isLoading,
    error,
    hasMore,
    isLoadingMore,
    searchQuery,
    setSearchQuery,
    isSearching,
    hasResults,
    debouncedQuery,
    // Content search (admin only)
    searchMode,
    setSearchMode,
    searchError,
    isContentSearchActive,
    showNewModal,
    setShowNewModal,
    bulkMode,
    setBulkMode,
    selectedIds,
    bulkUpdating,
    handleToggleSelect,
    handleSelectAll,
    handleBulkStatusUpdate,
    handleExitBulkMode,
    handleCreateConversation,
    loadMore,
  } = useMessagesPage({ isAdmin });

  // Template manager modal state (admin only)
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  if (isLoading) {
    return <LoadingSpinner message="Loading conversations..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? 'Support Messages' : 'My Support Conversations'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin
              ? 'Manage customer support conversations'
              : 'Get help from our support team'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <button
                onClick={() => setShowTemplateManager(true)}
                className="px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-glamlink-purple/10 text-glamlink-purple hover:bg-glamlink-purple/20 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Manage Templates
              </button>
              {conversations.length > 0 && (
                <button
                  onClick={() => bulkMode ? handleExitBulkMode() : setBulkMode(true)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    bulkMode
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {bulkMode ? 'Cancel' : 'Bulk Actions'}
                </button>
              )}
            </>
          )}
          {!isAdmin && (
            <button
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2 bg-glamlink-purple text-white font-medium rounded-lg hover:bg-glamlink-purple-dark transition-colors"
            >
              New Conversation
            </button>
          )}
        </div>
      </div>

      {/* Search Input - Enhanced for admins with content search */}
      {conversations.length > 0 && (
        isAdmin ? (
          <ContentSearchInput
            query={searchQuery}
            onQueryChange={setSearchQuery}
            mode={searchMode}
            onModeChange={setSearchMode}
            isSearching={isSearching}
            resultCount={searchQuery.trim() ? filteredConversations.length : undefined}
            totalCount={conversations.length}
            error={searchError}
          />
        ) : (
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by subject, user, message, or tag..."
            isLoading={isSearching && searchQuery !== debouncedQuery}
            noResults={isSearching && !hasResults}
            resultCount={filteredConversations.length}
            totalCount={conversations.length}
          />
        )
      )}

      {/* Bulk Action Bar */}
      {bulkMode && selectedIds.size > 0 && (
        <div className="bg-glamlink-purple/10 border border-glamlink-purple/20 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-glamlink-purple">
              {selectedIds.size} selected
            </span>
            <button
              onClick={handleSelectAll}
              className="text-sm text-glamlink-purple hover:underline"
            >
              {selectedIds.size === filteredConversations.length ? 'Deselect all' : 'Select all'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 mr-2">Set status:</span>
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleBulkStatusUpdate(option.value)}
                disabled={bulkUpdating}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors disabled:opacity-50 ${option.color} hover:opacity-80`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversations List */}
      {conversations.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <svg
            className="w-12 h-12 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <p className="text-gray-500">
            {isAdmin ? MESSAGES.empty.adminConversations : MESSAGES.empty.userConversations}
          </p>
          {!isAdmin && (
            <button
              onClick={() => setShowNewModal(true)}
              className="mt-4 px-4 py-2 bg-glamlink-purple text-white font-medium rounded-lg hover:bg-glamlink-purple-dark transition-colors"
            >
              Start a Conversation
            </button>
          )}
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <svg
            className="w-12 h-12 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-gray-500">No conversations match your search</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 px-4 py-2 text-glamlink-purple hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isAdmin={isAdmin}
                bulkMode={bulkMode}
                isSelected={selectedIds.has(conversation.id)}
                onToggleSelect={() => handleToggleSelect(conversation.id)}
                searchQuery={debouncedQuery}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center py-2">
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="px-4 py-2 text-sm text-glamlink-purple hover:text-glamlink-purple-dark hover:underline disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-glamlink-purple focus:ring-offset-2 rounded"
                aria-label={isLoadingMore ? 'Loading more conversations' : 'Load more conversations'}
              >
                {isLoadingMore ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'Load more conversations'
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSubmit={handleCreateConversation}
      />

      {/* Template Manager Modal (admin only) */}
      {isAdmin && (
        <TemplateManager
          isOpen={showTemplateManager}
          onClose={() => setShowTemplateManager(false)}
        />
      )}
    </div>
  );
}
