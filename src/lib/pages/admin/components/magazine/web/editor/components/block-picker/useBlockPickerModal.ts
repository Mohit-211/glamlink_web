import { useState, useMemo, useCallback } from 'react';
import {
  CONTENT_COMPONENTS,
  getComponentsByCategory,
} from '../../config/content-discovery';
import type { BlockPickerItem } from '@/lib/pages/admin/components/magazine/web/types';

interface UseBlockPickerModalParams {
  onSelect: (item: BlockPickerItem) => void;
  onClose: () => void;
}

interface UseBlockPickerModalReturn {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredComponents: typeof CONTENT_COMPONENTS;
  handleSelect: (item: BlockPickerItem) => void;
}

export function useBlockPickerModal({
  onSelect,
  onClose,
}: UseBlockPickerModalParams): UseBlockPickerModalReturn {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter components based on category and search
  const filteredComponents = useMemo(() => {
    let components = selectedCategory === 'all'
      ? CONTENT_COMPONENTS
      : getComponentsByCategory(selectedCategory);

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      components = components.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.displayName.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
      );
    }

    return components;
  }, [selectedCategory, searchQuery]);

  // Handle selection
  const handleSelect = useCallback((item: BlockPickerItem) => {
    onSelect(item);
    onClose();
    // Reset filters for next open
    setSelectedCategory('all');
    setSearchQuery('');
  }, [onSelect, onClose]);

  return {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredComponents,
    handleSelect,
  };
}

export default useBlockPickerModal;
