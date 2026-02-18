'use client';

import Link from 'next/link';
import { PriorityBadge } from '../PriorityBadge';
import { TagList } from '../TagBadge';
import { ResponseTimeDisplay } from '../ResponseTimeDisplay';
import { HighlightedText } from '../SearchInput';
import { highlightMatches } from '../../hooks/useConversationSearch';
import { STATUS_OPTIONS } from '../../config';
import { formatRelativeTime } from '@/lib/shared/utils/dateTime';
import type { Conversation } from '../../types';

export interface ConversationItemProps {
  conversation: Conversation;
  isAdmin: boolean;
  bulkMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  /** Search query for highlighting matches */
  searchQuery?: string;
}

export function ConversationItem({
  conversation,
  isAdmin,
  bulkMode = false,
  isSelected = false,
  onToggleSelect,
  searchQuery = '',
}: ConversationItemProps) {
  const basePath = isAdmin ? '/admin/messages' : '/profile/support';
  const unreadCount = isAdmin ? conversation.unreadByAdmin : conversation.unreadByUser;
  const statusConfig = STATUS_OPTIONS.find((s) => s.value === conversation.status);

  // Prepare highlighted segments for search matches
  const subjectSegments = searchQuery ? highlightMatches(conversation.subject, searchQuery) : null;
  const userNameSegments = searchQuery && isAdmin ? highlightMatches(conversation.userName, searchQuery) : null;
  const lastMessageSegments = searchQuery && conversation.lastMessage
    ? highlightMatches(conversation.lastMessage.content, searchQuery)
    : null;

  const handleClick = (e: React.MouseEvent) => {
    if (bulkMode && onToggleSelect) {
      e.preventDefault();
      onToggleSelect();
    }
  };

  return (
    <Link
      href={`${basePath}/${conversation.id}`}
      onClick={handleClick}
      className={`block p-4 hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-glamlink-purple/5' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox for bulk mode */}
        {bulkMode && (
          <div className="flex-shrink-0 pt-1">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isSelected
                  ? 'bg-glamlink-purple border-glamlink-purple'
                  : 'border-gray-300 hover:border-glamlink-purple'
              }`}
            >
              {isSelected && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-gray-900 truncate">
              {subjectSegments ? (
                <HighlightedText segments={subjectSegments} />
              ) : (
                conversation.subject
              )}
            </h3>
            {conversation.priority && conversation.priority !== 'normal' && (
              <PriorityBadge priority={conversation.priority} showLabel={false} />
            )}
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-glamlink-purple text-white">
                {unreadCount}
              </span>
            )}
          </div>

          {isAdmin && (
            <p className="text-sm text-gray-500 mt-0.5">
              {userNameSegments ? (
                <HighlightedText segments={userNameSegments} />
              ) : (
                conversation.userName
              )}{' '}
              ({conversation.userEmail})
            </p>
          )}

          {/* Tags display */}
          {conversation.tags && conversation.tags.length > 0 && (
            <div className="mt-1">
              <TagList tags={conversation.tags} size="sm" />
            </div>
          )}

          {conversation.lastMessage && (
            <p className="text-sm text-gray-600 mt-1 truncate">
              {lastMessageSegments ? (
                <HighlightedText segments={lastMessageSegments} />
              ) : (
                conversation.lastMessage.content
              )}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.color || 'bg-gray-100 text-gray-800'}`}
          >
            {statusConfig?.label || conversation.status}
          </span>
          <span className="text-xs text-gray-400">
            {formatRelativeTime(conversation.updatedAt)}
          </span>
          {/* Response time for admin */}
          {isAdmin && conversation.metrics?.firstResponseTimeMs && (
            <ResponseTimeDisplay metrics={conversation.metrics} showLabel={false} size="sm" />
          )}
        </div>
      </div>
    </Link>
  );
}
