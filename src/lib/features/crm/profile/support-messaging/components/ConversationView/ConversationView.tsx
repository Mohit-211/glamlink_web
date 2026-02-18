'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageBubble } from '../MessageBubble';
import { LoadingSpinner, AriaAnnouncer, ConnectionIndicator } from '@/lib/shared/components';
import { TagSelector } from '../TagSelector';
import { ResponseMetricsSummary } from '../ResponseTimeDisplay';
import { AuditLogPanel } from '../AuditLogPanel';
import { AttachmentUploader } from '../AttachmentUploader';
import { TemplateSelector } from '../TemplateSelector';
import { PinnedMessages } from '../PinnedMessages';
import { ExportMenu } from '../ExportMenu';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../config';
import { useConversationView } from './useConversationView';
import type { ConversationStatus, ConversationPriority } from '../../types';

// Import accessibility styles
import '../../styles/accessibility.css';

interface ConversationViewProps {
  conversationId: string;
  isAdmin?: boolean;
}

export function ConversationView({ conversationId, isAdmin = false }: ConversationViewProps) {
  const {
    conversation,
    isLoading,
    error,
    newMessage,
    isSending,
    messagesContainerRef,
    inputRef,
    messageRefs,
    backPath,
    currentUserId,
    userIsAdmin,
    typingIndicatorText,
    isNearLimit,
    isOverLimit,
    charsRemaining,
    isOnline,
    pendingMessages,
    isLimited,
    remainingActions,
    announcement,
    announcePriority,
    focusedIndex,
    isNavigating,
    handleInputChange,
    handleSend,
    handleKeyDown,
    handleKeyboardNav,
    handleStatusChange,
    handlePriorityChange,
    handleTagsChange,
    handleAddReaction,
    handleRemoveReaction,
    handlePinMessage,
    handleUnpinMessage,
    handleEditMessage,
    scrollToMessage,
    pinnedMessages,
    retryMessage,
    hasMoreMessages,
    loadMoreMessages,
    isLoadingMoreMessages,
    pendingAttachments,
    uploads,
    isUploading,
    handleFilesSelected,
    handleCancelUpload,
    handleRemoveAttachment,
  } = useConversationView({ conversationId, isAdmin });

  // Template selector state (admin only)
  const [showTemplates, setShowTemplates] = useState(false);

  // Handler for inserting template content
  const handleInsertTemplate = (content: string) => {
    handleInputChange({
      target: { value: newMessage + content },
    } as React.ChangeEvent<HTMLTextAreaElement>);
    inputRef.current?.focus();
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading conversation..." />;
  }

  if (error || !conversation) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error || 'Conversation not found'}</p>
        <Link
          href={backPath}
          className="text-glamlink-purple hover:underline"
        >
          Back to conversations
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_OPTIONS.find((s) => s.value === conversation.status);
  const priorityConfig = PRIORITY_OPTIONS.find((p) => p.value === (conversation.priority || 'normal'));

  return (
    <div className="support-messaging-container flex flex-col h-[calc(100vh-12rem)] max-h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Skip link for keyboard users */}
      <a
        href="#message-input"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-glamlink-purple focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to message input
      </a>

      {/* ARIA Live Region for announcements */}
      <AriaAnnouncer message={announcement} priority={announcePriority} />

      {/* Connection status indicator */}
      <ConnectionIndicator isOnline={isOnline} pendingCount={pendingMessages.length} />
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={backPath}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h2 className="font-semibold text-gray-900">{conversation.subject}</h2>
              {isAdmin ? (
                <p className="text-sm text-gray-500">
                  {conversation.userName} ({conversation.userEmail})
                </p>
              ) : (
                <p className="text-sm text-glamlink-purple font-medium">
                  GLAMLINK Support Team
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userIsAdmin ? (
              <>
                <ExportMenu conversation={conversation} />
                <TagSelector
                  selectedTags={conversation.tags || []}
                  onChange={handleTagsChange}
                />
                <select
                  value={conversation.priority || 'normal'}
                  onChange={(e) => handlePriorityChange(e.target.value as ConversationPriority)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${priorityConfig?.color || 'bg-blue-100 text-blue-800'}`}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={conversation.status}
                  onChange={(e) => handleStatusChange(e.target.value as ConversationStatus)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusConfig?.color || 'bg-gray-100 text-gray-800'}`}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig?.color || 'bg-gray-100 text-gray-800'}`}>
                {statusConfig?.label || conversation.status}
              </span>
            )}
          </div>
        </div>
        {/* Response time metrics for admin */}
        {userIsAdmin && conversation.metrics && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <ResponseMetricsSummary metrics={conversation.metrics} />
          </div>
        )}
        {/* Audit Log for admin */}
        {userIsAdmin && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <AuditLogPanel conversationId={conversationId} />
          </div>
        )}
      </div>

      {/* Pinned Messages */}
      <PinnedMessages
        pinnedMessages={pinnedMessages}
        onJumpToMessage={scrollToMessage}
        onUnpin={handleUnpinMessage}
        canManagePins={userIsAdmin}
      />

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-label="Message history"
        aria-live="polite"
        tabIndex={0}
        onKeyDown={handleKeyboardNav}
      >
        {/* Load More Button - at top to load older messages */}
        {hasMoreMessages && (
          <div className="text-center py-2 border-b border-gray-100 mb-4">
            <button
              onClick={loadMoreMessages}
              disabled={isLoadingMoreMessages}
              className="px-4 py-2 text-sm text-glamlink-purple hover:text-glamlink-purple-dark hover:bg-glamlink-purple/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-glamlink-purple focus:ring-offset-2"
              aria-label={isLoadingMoreMessages ? 'Loading older messages' : 'Load older messages'}
            >
              {isLoadingMoreMessages ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading older messages...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Load older messages
                </span>
              )}
            </button>
          </div>
        )}
        {conversation.messages.map((message, index) => {
          // Check if we should show the "New messages" divider before this message
          const prevMessage = conversation.messages[index - 1];
          const showUnreadDivider =
            conversation.lastReadAt &&
            message.timestamp > conversation.lastReadAt &&
            (!prevMessage || prevMessage.timestamp <= conversation.lastReadAt);

          return (
            <React.Fragment key={message.id}>
              {showUnreadDivider && (
                <div className="flex items-center gap-4 my-4" aria-hidden="true">
                  <div className="flex-1 h-px bg-glamlink-purple/30" />
                  <span className="text-xs text-glamlink-purple font-medium">New messages</span>
                  <div className="flex-1 h-px bg-glamlink-purple/30" />
                </div>
              )}
              <MessageBubble
                ref={(el) => {
                  if (messageRefs.current) {
                    messageRefs.current[index] = el;
                  }
                }}
                message={message}
                isCurrentUser={message.senderId === currentUserId}
                currentUserId={currentUserId}
                onRetry={retryMessage}
                onAddReaction={(emoji) => handleAddReaction(message.id, emoji)}
                onRemoveReaction={(emoji) => handleRemoveReaction(message.id, emoji)}
                onPin={() => handlePinMessage(message.id)}
                onUnpin={() => handleUnpinMessage(message.id)}
                onEdit={(newContent) => handleEditMessage(message.id, newContent)}
                canPin={userIsAdmin}
                canEdit={message.senderId === currentUserId}
                isFocused={focusedIndex === index}
              />
            </React.Fragment>
          );
        })}
        {/* Typing Indicator */}
        {typingIndicatorText && (
          <div
            className="typing-indicator flex items-center gap-2 text-sm text-gray-500 animate-pulse"
            role="status"
            aria-live="polite"
            aria-label={typingIndicatorText}
          >
            <div className="flex gap-1" aria-hidden="true">
              <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>{typingIndicatorText}</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        {/* Rate limit warning */}
        {isLimited && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg" role="alert">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Slow down!</span> You&apos;ve sent too many messages.
              Please wait a moment before sending more.
            </p>
          </div>
        )}
        {!isLimited && remainingActions <= 3 && remainingActions > 0 && (
          <div className="mb-2 text-xs text-gray-500" role="status" aria-live="polite">
            {remainingActions} message{remainingActions !== 1 ? 's' : ''} remaining in this minute
          </div>
        )}

        {/* Attachment Uploader */}
        <AttachmentUploader
          conversationId={conversationId}
          pendingAttachments={pendingAttachments}
          onFilesSelected={handleFilesSelected}
          uploads={uploads}
          onCancelUpload={handleCancelUpload}
          onRemoveAttachment={handleRemoveAttachment}
          disabled={isSending}
        />
        <div className="flex items-end gap-2 mt-2">
          {/* Template button for admins */}
          {userIsAdmin && (
            <div className="relative">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-glamlink-purple border border-gray-300 rounded-lg hover:border-glamlink-purple transition-colors focus:outline-none focus:ring-2 focus:ring-glamlink-purple focus:ring-offset-1"
                aria-label={showTemplates ? 'Close templates' : 'Insert template'}
                aria-expanded={showTemplates}
                type="button"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              {showTemplates && (
                <TemplateSelector
                  onSelect={handleInsertTemplate}
                  onClose={() => setShowTemplates(false)}
                />
              )}
            </div>
          )}
          <textarea
            id="message-input"
            ref={inputRef}
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            disabled={isSending}
            aria-label="Message input"
            aria-describedby="message-hints"
            className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-glamlink-purple focus:border-transparent disabled:bg-gray-100"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending || isOverLimit || isUploading || isLimited}
            aria-label={isSending ? 'Sending message' : isUploading ? 'Uploading files' : isLimited ? 'Rate limited - please wait' : 'Send message'}
            className="flex-shrink-0 p-2 bg-glamlink-purple text-white rounded-lg hover:bg-glamlink-purple-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-glamlink-purple focus:ring-offset-2"
          >
            {isSending ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <div id="message-hints" className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">
            Enter to send, Shift+Enter for new line. Use ↑↓ in message area to navigate messages.
          </p>
          {isNearLimit && (
            <span className={`text-xs ${isOverLimit ? 'text-red-500 font-medium' : 'text-gray-400'}`} aria-live="polite">
              {charsRemaining >= 0 ? `${charsRemaining} characters remaining` : `${Math.abs(charsRemaining)} characters over limit`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
