'use client';

import { CONVERSATION_TAGS } from '../config';
import type { ConversationTag } from '../types';

interface TagBadgeProps {
  tag: ConversationTag;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

/**
 * Display a conversation tag as a colored badge
 */
export function TagBadge({ tag, onRemove, size = 'sm' }: TagBadgeProps) {
  const tagConfig = CONVERSATION_TAGS.find((t) => t.value === tag);

  if (!tagConfig) return null;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${tagConfig.color} ${sizeClasses}`}
    >
      {tagConfig.label}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:opacity-70 transition-opacity"
          aria-label={`Remove ${tagConfig.label} tag`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

interface TagListProps {
  tags: ConversationTag[];
  onRemove?: (tag: ConversationTag) => void;
  size?: 'sm' | 'md';
}

/**
 * Display a list of conversation tags
 */
export function TagList({ tags, onRemove, size = 'sm' }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <TagBadge
          key={tag}
          tag={tag}
          size={size}
          onRemove={onRemove ? () => onRemove(tag) : undefined}
        />
      ))}
    </div>
  );
}
