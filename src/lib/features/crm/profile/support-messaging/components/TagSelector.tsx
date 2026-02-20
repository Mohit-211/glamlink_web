'use client';

import { useState, useRef, useEffect } from 'react';
import { CONVERSATION_TAGS } from '../config';
import type { ConversationTag } from '../types';
import { TagBadge } from './TagBadge';

interface TagSelectorProps {
  selectedTags: ConversationTag[];
  onChange: (tags: ConversationTag[]) => void;
  disabled?: boolean;
}

/**
 * Multi-select dropdown for selecting conversation tags (admin only)
 */
export function TagSelector({ selectedTags, onChange, disabled }: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleTag = (tag: ConversationTag) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: ConversationTag) => {
    onChange(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Tags
        {selectedTags.length > 0 && (
          <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-white bg-glamlink-purple rounded-full">
            {selectedTags.length}
          </span>
        )}
      </button>

      {/* Selected tags display */}
      {selectedTags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {selectedTags.map((tag) => (
            <TagBadge key={tag} tag={tag} onRemove={() => handleRemoveTag(tag)} />
          ))}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 left-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
          {CONVERSATION_TAGS.map((tagOption) => {
            const isSelected = selectedTags.includes(tagOption.value);
            return (
              <button
                key={tagOption.value}
                type="button"
                onClick={() => handleToggleTag(tagOption.value)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
              >
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tagOption.color}`}>
                  {tagOption.label}
                </span>
                {isSelected && (
                  <svg className="w-4 h-4 text-glamlink-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
