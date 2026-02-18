/**
 * useLoadLayoutModal Hook
 *
 * Hook for managing Load Layout Modal state including:
 * - Fetching layouts from API
 * - Search filtering
 * - Selection handling
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { DigitalLayout } from '@/lib/pages/admin/types/digitalLayouts';

// =============================================================================
// TYPES
// =============================================================================

interface UseLoadLayoutModalParams {
  issueId: string;
  onSelectLayout: (layout: DigitalLayout) => void;
  onClose: () => void;
}

interface UseLoadLayoutModalReturn {
  layouts: DigitalLayout[];
  filteredLayouts: DigitalLayout[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  existingCategories: string[];
  isLoading: boolean;
  error: string | null;
  fetchLayouts: () => Promise<void>;
  handleSelect: (layout: DigitalLayout) => void;
}

// =============================================================================
// HOOK
// =============================================================================

export function useLoadLayoutModal({
  issueId,
  onSelectLayout,
  onClose
}: UseLoadLayoutModalParams): UseLoadLayoutModalReturn {
  const [layouts, setLayouts] = useState<DigitalLayout[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract unique categories from layouts
  const existingCategories = useMemo(() => {
    const categories = layouts
      .map(l => l.layoutCategory)
      .filter((c): c is string => !!c && c.trim() !== '');
    return [...new Set(categories)].sort();
  }, [layouts]);

  // Fetch layouts on mount
  useEffect(() => {
    fetchLayouts();
  }, [issueId]);

  const fetchLayouts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/digital-layouts?issueId=${issueId}`, {
        credentials: 'include'
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch layouts');
      }

      setLayouts(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch layouts');
      setLayouts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter layouts by category and search query
  const filteredLayouts = useMemo(() => {
    let results = layouts;

    // Category filter
    if (selectedCategory) {
      results = results.filter(l => l.layoutCategory === selectedCategory);
    }

    // Text search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((layout) => {
        const nameMatch = layout.layoutName.toLowerCase().includes(query);
        const descMatch = layout.layoutDescription?.toLowerCase().includes(query);
        return nameMatch || descMatch;
      });
    }

    return results;
  }, [layouts, selectedCategory, searchQuery]);

  // Handle layout selection
  const handleSelect = useCallback((layout: DigitalLayout) => {
    onSelectLayout(layout);
    onClose();
    // Reset filters for next open
    setSearchQuery('');
    setSelectedCategory('');
  }, [onSelectLayout, onClose]);

  return {
    layouts,
    filteredLayouts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    existingCategories,
    isLoading,
    error,
    fetchLayouts,
    handleSelect
  };
}
