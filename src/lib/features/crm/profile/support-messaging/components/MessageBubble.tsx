'use client';

import { forwardRef, memo, useState, useCallback } from 'react';
import type { Message } from '../types';
import { formatMessageTime, formatFullDateTime } from '@/lib/shared/utils/dateTime';
import { sanitizeMessageContent } from '../utils/sanitize';
import { MessageReactions } from './MessageReactions';
import { AttachmentPreview } from './AttachmentPreview';
import { EDIT_CONFIG, PIN_CONFIG } from '../config';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  currentUserId?: string;
  onRetry?: (messageId: string) => void;
  onAddReaction?: (emoji: string) => void;
  onRemoveReaction?: (emoji: string) => void;
  onPin?: () => void;
  onUnpin?: () => void;
  onEdit?: (newContent: string) => Promise<void>;
  canPin?: boolean;
  canEdit?: boolean;
  showReadReceipt?: boolean;
  isFocused?: boolean;
}

/**
 * Comparison function for memo - only re-render when these values change
 */
function arePropsEqual(prev: MessageBubbleProps, next: MessageBubbleProps): boolean {
  return (
    prev.message.id === next.message.id &&
    prev.message.content === next.message.content &&
    prev.message.status === next.message.status &&
    prev.message.readAt === next.message.readAt &&
    prev.message.editedAt === next.message.editedAt &&
    prev.message.isPinned === next.message.isPinned &&
    prev.isCurrentUser === next.isCurrentUser &&
    prev.currentUserId === next.currentUserId &&
    prev.isFocused === next.isFocused &&
    prev.showReadReceipt === next.showReadReceipt &&
    prev.canPin === next.canPin &&
    prev.canEdit === next.canEdit &&
    // Compare reactions array length (deep comparison is expensive)
    (prev.message.reactions?.length || 0) === (next.message.reactions?.length || 0) &&
    // Compare attachments array length
    (prev.message.attachments?.length || 0) === (next.message.attachments?.length || 0)
  );
}

const MessageBubbleInner = forwardRef<HTMLDivElement, MessageBubbleProps>(function MessageBubble(
  {
    message,
    isCurrentUser,
    currentUserId,
    onRetry,
    onAddReaction,
    onRemoveReaction,
    onPin,
    onUnpin,
    onEdit,
    canPin = false,
    canEdit = false,
    showReadReceipt = true,
    isFocused = false,
  },
  ref
) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isEditSaving, setIsEditSaving] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isSending = message.status === 'sending';
  const isFailed = message.status === 'failed';
  const isRead = !!message.readAt;
  const isEdited = !!message.editedAt;
  const isPinned = !!message.isPinned;

  // Check if message is within edit window
  const canEditMessage = canEdit && !isSending && !isFailed && (() => {
    const messageAge = Date.now() - message.timestamp.getTime();
    const editCount = message.editHistory?.length || 0;
    return messageAge <= EDIT_CONFIG.allowedWindowMs && editCount < EDIT_CONFIG.maxEdits;
  })();

  // Handle edit submission
  const handleEditSubmit = useCallback(async () => {
    if (!onEdit || !editContent.trim() || editContent.trim() === message.content) {
      setIsEditing(false);
      setEditContent(message.content);
      return;
    }

    setIsEditSaving(true);
    try {
      await onEdit(editContent.trim());
      setIsEditing(false);
    } catch {
      // Error is handled by parent
    } finally {
      setIsEditSaving(false);
    }
  }, [onEdit, editContent, message.content]);

  // Handle edit cancel
  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setEditContent(message.content);
  }, [message.content]);

  // Handle edit keydown
  const handleEditKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  }, [handleEditSubmit, handleEditCancel]);

  // Build ARIA label for screen readers
  const senderLabel = isCurrentUser ? 'You' : (message.senderName || 'Support');
  const timeLabel = isSending ? 'sending' : formatFullDateTime(message.timestamp);
  const statusLabel = isFailed ? ', failed to send' : isRead && isCurrentUser ? ', read' : '';
  const editedLabel = isEdited ? ', edited' : '';
  const pinnedLabel = isPinned ? ', pinned' : '';
  const ariaLabel = `Message from ${senderLabel} at ${timeLabel}${statusLabel}${editedLabel}${pinnedLabel}`;

  return (
    <div
      ref={ref}
      className={`focusable-message flex ${isCurrentUser ? 'justify-end' : 'justify-start'} ${
        isFocused ? 'ring-2 ring-glamlink-purple ring-offset-2 rounded-lg' : ''
      } group relative`}
      role="article"
      aria-label={ariaLabel}
      tabIndex={-1}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Action buttons - shown on hover */}
      {!isSending && !isFailed && (canPin || canEditMessage) && showActions && !isEditing && (
        <div
          className={`absolute top-0 ${isCurrentUser ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'} flex items-center gap-1`}
        >
          {canEditMessage && onEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              aria-label="Edit message"
              title="Edit message"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {canPin && (
            isPinned ? (
              <button
                onClick={onUnpin}
                className="p-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-600 transition-colors"
                aria-label="Unpin message"
                title="Unpin message"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={onPin}
                className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Pin message"
                title="Pin message"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                </svg>
              </button>
            )
          )}
        </div>
      )}

      <div
        className={`message-bubble max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
          isCurrentUser
            ? isFailed
              ? 'bg-red-100 text-red-900 rounded-br-md'
              : 'bg-glamlink-purple text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        } ${isSending ? 'opacity-70' : ''} ${isPinned ? 'ring-2 ring-amber-400' : ''}`}
      >
        {/* Pinned indicator */}
        {isPinned && (
          <div className={`flex items-center gap-1 text-xs mb-1 ${isCurrentUser && !isFailed ? 'text-white/80' : 'text-amber-600'}`}>
            <span aria-hidden="true">📌</span>
            <span>Pinned</span>
          </div>
        )}

        {/* Message content - edit mode or display mode */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleEditKeyDown}
              className="w-full px-2 py-1 text-sm text-gray-900 bg-white border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-glamlink-purple"
              rows={3}
              autoFocus
              disabled={isEditSaving}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleEditSubmit}
                disabled={isEditSaving || !editContent.trim()}
                className="px-2 py-1 text-xs bg-glamlink-purple text-white rounded hover:bg-glamlink-purple-dark disabled:opacity-50 transition-colors"
              >
                {isEditSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleEditCancel}
                disabled={isEditSaving}
                className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <span className="text-xs text-gray-400">Enter to save, Esc to cancel</span>
            </div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{sanitizeMessageContent(message.content)}</p>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <AttachmentPreview attachments={message.attachments} compact />
        )}

        {/* Timestamp and status */}
        <div className={`flex items-center gap-2 mt-1 ${
          isCurrentUser && !isFailed ? 'text-white/70' : 'text-gray-400'
        }`}>
          {/* Timestamp with hover tooltip */}
          <div className="relative group/time">
            <p className="text-xs cursor-default">
              {isSending ? 'Sending...' : formatMessageTime(message.timestamp)}
            </p>

            {/* Full datetime tooltip on hover */}
            {!isSending && (
              <div className="absolute bottom-full left-0 mb-1 hidden group-hover/time:block z-10 pointer-events-none" aria-hidden="true">
                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                  {formatFullDateTime(message.timestamp)}
                </div>
              </div>
            )}
          </div>

          {/* Edited indicator */}
          {isEdited && (
            <div className="relative group/edited">
              <span className="text-xs cursor-default">(edited)</span>
              {/* Edit history tooltip on hover */}
              {message.editHistory && message.editHistory.length > 0 && (
                <div className="absolute bottom-full left-0 mb-1 hidden group-hover/edited:block z-10 pointer-events-none" aria-hidden="true">
                  <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                    Edited {message.editHistory.length} time{message.editHistory.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sending indicator */}
          {isSending && (
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}

          {/* Read receipt indicator */}
          {isCurrentUser && !isSending && !isFailed && showReadReceipt && isRead && (
            <span className="flex items-center gap-0.5 text-xs text-white/60">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Read</span>
            </span>
          )}
        </div>

        {/* Message Reactions */}
        {!isSending && !isFailed && onAddReaction && onRemoveReaction && (
          <MessageReactions
            reactions={message.reactions}
            currentUserId={currentUserId}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
            isCurrentUser={isCurrentUser}
          />
        )}

        {/* Failed message retry button */}
        {isFailed && onRetry && (
          <button
            onClick={() => onRetry(message.id)}
            className="flex items-center gap-1 mt-2 text-xs text-red-600 hover:text-red-800 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Failed to send. Tap to retry</span>
          </button>
        )}
      </div>
    </div>
  );
});

/**
 * Memoized MessageBubble component - prevents unnecessary re-renders
 * when parent component updates but message props haven't changed.
 */
export const MessageBubble = memo(MessageBubbleInner, arePropsEqual);
