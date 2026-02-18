'use client';

import { useState, useCallback } from 'react';
import type { Message } from '../types';
import { formatMessageTime } from '@/lib/shared/utils/dateTime';
import { PIN_CONFIG } from '../config';

interface PinnedMessagesProps {
  /** List of pinned messages */
  pinnedMessages: Message[];
  /** Callback to scroll to a message */
  onJumpToMessage: (messageId: string) => void;
  /** Callback to unpin a message */
  onUnpin: (messageId: string) => void;
  /** Whether the user can manage pins */
  canManagePins?: boolean;
}

/**
 * Collapsible panel showing pinned messages at the top of a conversation.
 *
 * Features:
 * - Collapse/expand functionality
 * - Jump to original message
 * - Unpin action
 * - Pin limit indicator
 *
 * @example
 * ```tsx
 * <PinnedMessages
 *   pinnedMessages={conversation.messages.filter(m => m.isPinned)}
 *   onJumpToMessage={scrollToMessage}
 *   onUnpin={handleUnpin}
 *   canManagePins={userIsAdmin}
 * />
 * ```
 */
export function PinnedMessages({
  pinnedMessages,
  onJumpToMessage,
  onUnpin,
  canManagePins = false,
}: PinnedMessagesProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleJump = useCallback((messageId: string) => {
    onJumpToMessage(messageId);
  }, [onJumpToMessage]);

  const handleUnpin = useCallback((messageId: string) => {
    onUnpin(messageId);
  }, [onUnpin]);

  if (pinnedMessages.length === 0) {
    return null;
  }

  const isAtLimit = pinnedMessages.length >= PIN_CONFIG.maxPinsPerConversation;

  return (
    <div className="border-b border-amber-200 bg-amber-50">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between hover:bg-amber-100/50 transition-colors"
        aria-expanded={isExpanded}
        aria-controls="pinned-messages-list"
      >
        <div className="flex items-center gap-2">
          <span className="text-amber-600" aria-hidden="true">📌</span>
          <span className="text-sm font-medium text-amber-800">
            Pinned Messages ({pinnedMessages.length}/{PIN_CONFIG.maxPinsPerConversation})
          </span>
          {isAtLimit && (
            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
              Limit reached
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-amber-600 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Pinned messages list */}
      {isExpanded && (
        <div
          id="pinned-messages-list"
          className="px-4 pb-3 space-y-2"
          role="list"
          aria-label="Pinned messages"
        >
          {pinnedMessages.map((message) => (
            <div
              key={message.id}
              className="flex items-start gap-2 p-2 bg-white rounded-lg border border-amber-200 shadow-sm"
              role="listitem"
            >
              {/* Message preview */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {message.content}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {message.senderName} • {formatMessageTime(message.timestamp)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleJump(message.id)}
                  className="px-2 py-1 text-xs text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded transition-colors"
                  aria-label={`Jump to message from ${message.senderName}`}
                >
                  Jump to
                </button>
                {canManagePins && (
                  <button
                    onClick={() => handleUnpin(message.id)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                    aria-label={`Unpin message from ${message.senderName}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
