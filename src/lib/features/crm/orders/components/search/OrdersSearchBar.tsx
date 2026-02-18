/**
 * OrdersSearchBar Component
 *
 * Real-time search input with debouncing
 * Searches by: order number, customer name, customer email, product names
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface OrdersSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

/**
 * Search Icon
 */
const SearchIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

/**
 * Clear Icon (X)
 */
const XIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

/**
 * OrdersSearchBar Component
 */
export function OrdersSearchBar({
  onSearch,
  placeholder = "Search orders by number, customer, or products...",
  debounceMs = 300,
}: OrdersSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize from URL
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Debounced search effect
   */
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      onSearch(query);
      setIsSearching(false);

      // Update URL with search query
      const params = new URLSearchParams(searchParams);
      if (query.trim()) {
        params.set('query', query.trim());
      } else {
        params.delete('query');
      }

      // Update URL without page reload
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newUrl, { scroll: false });
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [query, debounceMs, onSearch, router, pathname, searchParams]);

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  /**
   * Clear search
   */
  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');

    // Remove query from URL
    const params = new URLSearchParams(searchParams);
    params.delete('query');
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(newUrl, { scroll: false });
  }, [onSearch, router, pathname, searchParams]);

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Escape to clear
    if (e.key === 'Escape' && query) {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className={`text-gray-400 ${isSearching ? 'animate-pulse' : ''}`} />
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        aria-label="Search orders"
      />

      {/* Clear Button */}
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 text-gray-400 transition-colors"
          aria-label="Clear search"
        >
          <XIcon />
        </button>
      )}

      {/* Search Tips (Hidden by default, can be shown on focus) */}
      {query && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs text-gray-600 hidden group-focus-within:block">
          <p className="font-medium mb-1">Search by:</p>
          <ul className="space-y-0.5 text-gray-500">
            <li>• Order number (e.g., #1234)</li>
            <li>• Customer name (e.g., John Doe)</li>
            <li>• Customer email (e.g., john@example.com)</li>
            <li>• Product names (e.g., Lipstick)</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default OrdersSearchBar;
