'use client';

import { useCallback, useRef, useEffect } from 'react';

interface SearchInputProps {
  /** Current search value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to show the loading indicator */
  isLoading?: boolean;
  /** Whether there are no results */
  noResults?: boolean;
  /** Total count of results */
  resultCount?: number;
  /** Total count of items being searched */
  totalCount?: number;
  /** Auto-focus the input on mount */
  autoFocus?: boolean;
  /** Additional class name */
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search conversations...',
  isLoading = false,
  noResults = false,
  resultCount,
  totalCount,
  autoFocus = false,
  className = '',
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Clear on Escape
      if (e.key === 'Escape' && value) {
        e.preventDefault();
        handleClear();
      }
    },
    [value, handleClear]
  );

  const showResults = value.trim().length > 0 && resultCount !== undefined;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {isLoading ? (
            <svg
              className="w-4 h-4 text-gray-400 animate-spin"
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

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-glamlink-purple focus:border-transparent ${
            noResults && value.trim()
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-white'
          }`}
          aria-label="Search conversations"
          aria-describedby={showResults ? 'search-results-count' : undefined}
        />

        {/* Clear Button */}
        {value && (
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

      {/* Results Count */}
      {showResults && (
        <p
          id="search-results-count"
          className={`mt-1 text-xs ${noResults ? 'text-red-600' : 'text-gray-500'}`}
          aria-live="polite"
        >
          {noResults
            ? 'No conversations found'
            : `${resultCount} of ${totalCount} conversation${totalCount !== 1 ? 's' : ''}`}
        </p>
      )}
    </div>
  );
}

/**
 * Component to highlight matching text in search results
 */
interface HighlightedTextProps {
  segments: { text: string; isMatch: boolean }[];
  highlightClassName?: string;
}

export function HighlightedText({
  segments,
  highlightClassName = 'bg-yellow-200 text-yellow-900 rounded px-0.5',
}: HighlightedTextProps) {
  return (
    <>
      {segments.map((segment, index) =>
        segment.isMatch ? (
          <mark key={index} className={highlightClassName}>
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </>
  );
}
