'use client';

import { useCallback, useRef, useEffect } from 'react';
import type { SearchMode } from '../hooks/useContentSearch';

interface ContentSearchInputProps {
  /** Current search query */
  query: string;
  /** Callback when query changes */
  onQueryChange: (query: string) => void;
  /** Current search mode */
  mode: SearchMode;
  /** Callback when mode changes */
  onModeChange: (mode: SearchMode) => void;
  /** Whether search is in progress */
  isSearching: boolean;
  /** Number of results found */
  resultCount?: number;
  /** Total count of conversations */
  totalCount?: number;
  /** Error message if search failed */
  error?: string | null;
  /** Placeholder text override */
  placeholder?: string;
  /** Auto-focus the input on mount */
  autoFocus?: boolean;
}

const SEARCH_MODE_OPTIONS: { value: SearchMode; label: string; description: string }[] = [
  {
    value: 'subject',
    label: 'Subject',
    description: 'Search by subject, user, and tags',
  },
  {
    value: 'content',
    label: 'Content',
    description: 'Search message content',
  },
  {
    value: 'all',
    label: 'All',
    description: 'Search everything',
  },
];

/**
 * Enhanced search input with mode toggle for content search.
 *
 * Provides three search modes:
 * - Subject: Fast client-side search by subject, user, tags
 * - Content: Server-side search through message content
 * - All: Combined search across all fields
 *
 * @example
 * ```tsx
 * <ContentSearchInput
 *   query={searchQuery}
 *   onQueryChange={setSearchQuery}
 *   mode={searchMode}
 *   onModeChange={setSearchMode}
 *   isSearching={isSearching}
 *   resultCount={searchResults.length}
 * />
 * ```
 */
export function ContentSearchInput({
  query,
  onQueryChange,
  mode,
  onModeChange,
  isSearching,
  resultCount,
  totalCount,
  error,
  placeholder,
  autoFocus = false,
}: ContentSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleClear = useCallback(() => {
    onQueryChange('');
    inputRef.current?.focus();
  }, [onQueryChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && query) {
        e.preventDefault();
        handleClear();
      }
    },
    [query, handleClear]
  );

  // Get placeholder based on mode
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    switch (mode) {
      case 'subject':
        return 'Search by subject, user, or tags...';
      case 'content':
        return 'Search message content...';
      case 'all':
        return 'Search all conversations and messages...';
    }
  };

  const showResults = query.trim().length > 0 && resultCount !== undefined;
  const noResults = showResults && resultCount === 0;

  return (
    <div className="space-y-2">
      {/* Search Mode Tabs */}
      <div
        className="flex gap-1 p-1 bg-gray-100 rounded-lg"
        role="tablist"
        aria-label="Search mode"
      >
        {SEARCH_MODE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onModeChange(option.value)}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              mode === option.value
                ? 'bg-white text-glamlink-purple shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            role="tab"
            aria-selected={mode === option.value}
            aria-controls="search-input"
            title={option.description}
          >
            {option.label}
            {option.value === 'content' && (
              <span className="ml-1 text-xs text-gray-400" aria-hidden="true">
                (slower)
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        {/* Search Icon / Loading Spinner */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {isSearching ? (
            <svg
              className="w-4 h-4 text-glamlink-purple animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-glamlink-purple focus:border-transparent transition-colors ${
            error
              ? 'border-red-300 bg-red-50'
              : noResults
              ? 'border-yellow-300 bg-yellow-50'
              : 'border-gray-300 bg-white'
          }`}
          aria-label="Search conversations"
          aria-describedby={showResults ? 'search-results-info' : undefined}
          role="searchbox"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
            type="button"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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

      {/* Search Info / Error / Results */}
      <div id="search-results-info" aria-live="polite" className="min-h-[1.25rem]">
        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : showResults ? (
          <p className={`text-xs ${noResults ? 'text-yellow-700' : 'text-gray-500'}`}>
            {noResults ? (
              'No conversations found'
            ) : (
              <>
                {resultCount} conversation{resultCount !== 1 ? 's' : ''} found
                {totalCount !== undefined && ` of ${totalCount}`}
                {mode === 'content' && (
                  <span className="text-gray-400"> (searched message content)</span>
                )}
                {mode === 'all' && (
                  <span className="text-gray-400"> (searched all fields)</span>
                )}
              </>
            )}
          </p>
        ) : mode !== 'subject' && !query ? (
          <p className="text-xs text-gray-400">
            {mode === 'content'
              ? 'Content search queries all messages (may be slower)'
              : 'Searching subjects, users, tags, and message content'}
          </p>
        ) : null}
      </div>
    </div>
  );
}
