'use client';

import { useState } from 'react';
import type { MessageReaction } from '../types';
import { AVAILABLE_REACTIONS } from '../config';

interface MessageReactionsProps {
  reactions?: MessageReaction[];
  currentUserId?: string;
  onAddReaction: (emoji: string) => void;
  onRemoveReaction: (emoji: string) => void;
  isCurrentUser: boolean;
}

interface GroupedReaction {
  emoji: string;
  count: number;
  users: string[];
  hasCurrentUser: boolean;
}

export function MessageReactions({
  reactions = [],
  currentUserId,
  onAddReaction,
  onRemoveReaction,
  isCurrentUser,
}: MessageReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);

  // Group reactions by emoji
  const groupedReactions: GroupedReaction[] = AVAILABLE_REACTIONS.map(({ emoji }) => {
    const emojiReactions = reactions.filter(r => r.emoji === emoji);
    return {
      emoji,
      count: emojiReactions.length,
      users: emojiReactions.map(r => r.userName),
      hasCurrentUser: emojiReactions.some(r => r.userId === currentUserId),
    };
  }).filter(g => g.count > 0);

  const handleReactionClick = (emoji: string, hasCurrentUser: boolean) => {
    if (hasCurrentUser) {
      onRemoveReaction(emoji);
    } else {
      onAddReaction(emoji);
    }
  };

  const handlePickerSelect = (emoji: string) => {
    const existing = groupedReactions.find(g => g.emoji === emoji);
    if (existing?.hasCurrentUser) {
      onRemoveReaction(emoji);
    } else {
      onAddReaction(emoji);
    }
    setShowPicker(false);
  };

  return (
    <div className="flex items-center gap-1 mt-1 flex-wrap" role="group" aria-label="Message reactions">
      {/* Existing reactions */}
      {groupedReactions.map(({ emoji, count, users, hasCurrentUser }) => {
        const reactionLabel = AVAILABLE_REACTIONS.find(r => r.emoji === emoji)?.label || emoji;
        const actionLabel = hasCurrentUser ? `Remove ${reactionLabel} reaction` : `Add ${reactionLabel} reaction`;
        const countLabel = count > 1 ? ` (${count} reactions)` : '';

        return (
          <button
            key={emoji}
            onClick={() => handleReactionClick(emoji, hasCurrentUser)}
            title={users.join(', ')}
            aria-label={`${actionLabel}${countLabel}`}
            aria-pressed={hasCurrentUser}
            className={`reaction-button inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-glamlink-purple focus:ring-offset-1 ${
              hasCurrentUser
                ? isCurrentUser
                  ? 'bg-white/30 text-white'
                  : 'bg-glamlink-purple/20 text-glamlink-purple'
                : isCurrentUser
                  ? 'bg-white/10 text-white/80 hover:bg-white/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span aria-hidden="true">{emoji}</span>
            {count > 1 && <span aria-hidden="true">{count}</span>}
          </button>
        );
      })}

      {/* Add reaction button */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-glamlink-purple focus:ring-offset-1 ${
            isCurrentUser
              ? 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
          }`}
          aria-label="Add reaction"
          aria-expanded={showPicker}
          aria-haspopup="true"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* Reaction picker */}
        {showPicker && (
          <>
            {/* Backdrop to close picker */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowPicker(false)}
              aria-hidden="true"
            />
            <div
              className={`absolute z-20 ${
                isCurrentUser ? 'right-0' : 'left-0'
              } bottom-full mb-1 flex gap-1 p-1.5 bg-white rounded-lg shadow-lg border border-gray-200`}
              role="menu"
              aria-label="Select reaction"
            >
              {AVAILABLE_REACTIONS.map(({ emoji, label }) => {
                const existing = groupedReactions.find(g => g.emoji === emoji);
                const actionLabel = existing?.hasCurrentUser ? `Remove ${label}` : `Add ${label}`;

                return (
                  <button
                    key={emoji}
                    onClick={() => handlePickerSelect(emoji)}
                    aria-label={actionLabel}
                    role="menuitem"
                    className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-glamlink-purple ${
                      existing?.hasCurrentUser ? 'bg-glamlink-purple/10' : ''
                    }`}
                  >
                    <span aria-hidden="true">{emoji}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
